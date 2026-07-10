---
title: Authentication
sidebar_label: Authentication
---

# Authentication

The SDK authenticates every request with an OAuth 2.0 bearer token. You choose **how** that token is
obtained when you create the client (or bring one yourself via the
[OAuth 2.0 endpoints](#oauth-20-endpoints)). Configure auth **once**; the SDK applies it — and, where
the flow allows, refreshes it — for every request.

## Choosing a flow

| Flow | Use it for | Client secret | SDK config |
|------|-----------|---------------|------------|
| [Authorization Code + PKCE](#authorization-code--pkce) | Interactive apps acting **as a user** — SPAs, CLIs, mobile/desktop | No | `refreshToken` (or `bearer`) |
| [Client credentials](#client-credentials) | Confidential **server-to-server** machine access | Yes | `clientCredentials` |
| [Password grant](#password-grant-legacy) | First-party scripts / quick dev | No | `password` |
| [Bearer token](#bearer-token) | A token you already hold | — | `bearer` |

If your software acts on behalf of a human who logs in, use **Authorization Code + PKCE**. For an
unattended backend, **client credentials** is the long-term answer (see the availability note below);
until it ships, a **password grant** is the simplest first-party option.

## Authorization Code + PKCE {#authorization-code--pkce}

The modern, secure flow for public clients (RFC 7636) — no client secret is ever stored. The user
authenticates with babelforce and approves your app; you then exchange the returned `code` (bound to
a one-time PKCE verifier) for an access token and a rotating refresh token. The SDK ships helpers for
each step (`pkceChallenge` / `GeneratePKCE`, `buildAuthorizeUrl` / `BuildAuthorizeURL`, and the
authorization-code exchange).

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
// 1. Generate a PKCE verifier/challenge and send the user to the consent page.
const { codeVerifier, codeChallenge } = await pkceChallenge();
const consentUrl = buildAuthorizeUrl({
  baseUrl: "https://services.babelforce.com",
  clientId: "your-public-client-id",
  redirectUri: "https://app.example.com/callback",
  scope: "*",
  codeChallenge,
  state: "csrf-token",
});
// Redirect the user to `consentUrl`; they return to redirectUri?code=…&state=…

// 2. Exchange the code (with the same codeVerifier) for tokens.
const tokens = await authorizationCodeGrant({
  baseUrl: "https://services.babelforce.com",
  code: "code-from-the-redirect",
  redirectUri: "https://app.example.com/callback",
  clientId: "your-public-client-id",
  codeVerifier,
});

// 3a. Long-lived client — the access token refreshes transparently (refresh tokens rotate):
const mgr = await ManagerClient.connect({
  auth: { kind: "refreshToken", refreshToken: tokens.refresh_token!, clientId: "your-public-client-id" },
});
// 3b. …or a one-shot client straight from the access token:
// const mgr = await ManagerClient.connect({ auth: { kind: "bearer", token: tokens.access_token } });
```

</TabItem>
<TabItem value="go" label="Go">

```go
// 1. Generate a PKCE verifier/challenge and send the user to the consent page.
pkce, _ := manager.GeneratePKCE()
consentURL := manager.BuildAuthorizeURL(manager.AuthorizeURLParams{
    BaseURL:       "https://services.babelforce.com",
    ClientID:      "your-public-client-id",
    RedirectURI:   "https://app.example.com/callback",
    Scope:         "*",
    CodeChallenge: pkce.CodeChallenge,
    State:         "csrf-token",
})
_ = consentURL // redirect the user here; they return to RedirectURI?code=…&state=…

// 2. Exchange the code (public client → empty secret) for tokens.
tokens, _ := manager.AuthorizationCodeGrant(ctx, nil,
    "https://services.babelforce.com",
    "code-from-the-redirect",
    "https://app.example.com/callback",
    "your-public-client-id",
    pkce.CodeVerifier,
    "",
)

// 3. Long-lived client — the access token refreshes transparently (refresh tokens rotate):
mgr, _ := manager.Connect(ctx, manager.Options{
    Auth: manager.RefreshToken(tokens.RefreshToken, "your-public-client-id"),
})
// Confidential clients send their secret with each exchange:
// Auth: manager.RefreshTokenWithSecret(tokens.RefreshToken, clientID, clientSecret)
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
// 1. Generate a PKCE verifier/challenge and send the user to the consent page.
let pkce = pkce_challenge();
let consent_url = build_authorize_url(
    "https://services.babelforce.com",
    "your-public-client-id",
    "https://app.example.com/callback",
    "*",
    &pkce.code_challenge,
    Some("csrf-token"),
    None,
);
// Redirect the user to `consent_url`; they return to the redirect URI with a code.

// 2. Exchange the code via the OAuth token endpoint.
let mgr = ManagerClient::connect(Auth::Bearer { token: String::new() }).await?;
let tokens = mgr.auth.token("authorization_code", TokenRequest {
    code: Some("code-from-the-redirect".into()),
    redirect_uri: Some("https://app.example.com/callback".into()),
    code_verifier: Some(pkce.code_verifier),
    client_id: Some("your-public-client-id".into()),
    ..Default::default()
}).await?;

// 3a. Long-lived client — the access token refreshes transparently (refresh tokens rotate):
let mgr = ManagerClient::connect(Auth::RefreshToken {
    refresh_token: tokens.refresh_token.expect("PKCE exchange returns a refresh token"),
    client_id: "your-public-client-id".into(),
    client_secret: None, // Some(secret) for refresh tokens issued to a confidential client
}).await?;
// 3b. …or a one-shot client straight from the access token (a static bearer never refreshes):
// let mgr = ManagerClient::connect(Auth::Bearer { token: tokens.access_token }).await?;
```

:::note
Rust refreshes the token automatically ~30 seconds before it expires for the `password`,
`clientCredentials`, and `refreshToken` flows (single-flight — concurrent requests share one
refresh, and rotating refresh tokens are tracked for you); a static `Auth::Bearer` token is never
refreshed. Token fetches go through the client's retry policy. To manage tokens yourself, the raw
`mgr.auth.token("refresh_token", …)` escape hatch remains — see
[OAuth 2.0 endpoints](#oauth-20-endpoints).
:::

</TabItem>
</Tabs>

## Client credentials {#client-credentials}

An OAuth2 `client_credentials` grant for confidential, server-to-server access: the SDK exchanges
your `clientId` / `clientSecret` for a bearer token at `/oauth/token` and applies it to every
request. The token is refreshed transparently before it expires in all three languages.

:::warning Limited availability
Issuing `client_id` / `client_secret` pairs (via OAuth2 *applications*) is currently in **security
review** and not yet generally available. Until it ships, prefer **Authorization Code + PKCE** for
user-facing apps, or the **password grant** for first-party scripts. Treat any client secret as
highly sensitive — never commit it or expose it to a browser/mobile client.
:::

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
const mgr = await ManagerClient.connect({
  auth: { kind: "clientCredentials", clientId, clientSecret },
});
```

</TabItem>
<TabItem value="go" label="Go">

```go
mgr, _ := manager.Connect(ctx, manager.Options{
    Auth: manager.ClientCredentials(clientID, clientSecret),
})
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
let mgr = ManagerClient::connect(Auth::ClientCredentials {
    client_id, client_secret,
}).await?;
```

</TabItem>
</Tabs>

## Password grant (legacy) {#password-grant-legacy}

A first-party grant kept for interactive/dev use — it sends a username/password to `/oauth/token`
with the public `manager` client id (no secret). Prefer PKCE or client credentials for new
integrations. The token refreshes transparently in all three languages.

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
const mgr = await ManagerClient.connect({ auth: { kind: "password", user, pass } });
```

</TabItem>
<TabItem value="go" label="Go">

```go
mgr, _ := manager.Connect(ctx, manager.Options{ Auth: manager.Password(user, pass) })
// Or against a custom OAuth2 application instead of the default "manager" client id:
// mgr, _ := manager.Connect(ctx, manager.Options{ Auth: manager.PasswordWithClientID(user, pass, clientID) })
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
let mgr = ManagerClient::connect(Auth::Password { user, pass, client_id: None }).await?;
// Or against a custom OAuth2 application instead of the default "manager" client id:
// let mgr = ManagerClient::connect(Auth::Password { user, pass, client_id: Some(client_id) }).await?;
```

</TabItem>
</Tabs>

## Bearer token {#bearer-token}

If you already hold a valid access token — for example from the PKCE exchange above, or one minted
elsewhere — pass it directly:

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
const mgr = await ManagerClient.connect({ auth: { kind: "bearer", token } });
```

</TabItem>
<TabItem value="go" label="Go">

```go
mgr, _ := manager.Connect(ctx, manager.Options{ Auth: manager.Bearer(token) })
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
let mgr = ManagerClient::connect(Auth::Bearer { token }).await?;
```

</TabItem>
</Tabs>

## OAuth 2.0 endpoints {#oauth-20-endpoints}

The raw OAuth 2.0 endpoints — `/oauth/authorize`, `/oauth/token`, `/oauth/revoke` — are exposed as
`mgr.auth` / `mgr.Auth` for when you manage tokens yourself. They authenticate via credentials
carried in the request itself (per RFC 6749 / 7009), independent of the client's configured auth.

### Token endpoint

Exchange a grant (`authorization_code`, `refresh_token`, `password`, or `client_credentials`) for an
access token.

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
const tokens = await mgr.auth.token({
  grant_type: "client_credentials",
  client_id: "…",
  client_secret: "…",
  scope: "…",
});
console.log(tokens.access_token, tokens.expires_in);
```

</TabItem>
<TabItem value="go" label="Go">

```go
clientID, clientSecret := "…", "…"
tokens, _ := mgr.Auth.Token(ctx, authapi.OAuthTokenRequest{
    GrantType:    "client_credentials",
    ClientId:     &clientID,
    ClientSecret: &clientSecret,
})
fmt.Println(tokens.AccessToken)
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
let tokens = mgr.auth.token("client_credentials", TokenRequest {
    client_id: Some("…".into()),
    client_secret: Some("…".into()),
    scope: Some("…".into()),
    ..Default::default()
}).await?;
println!("{} {:?}", tokens.access_token, tokens.expires_in);
```

</TabItem>
</Tabs>

### Authorize & revoke

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
// Authorization-code consent/redirect (for PKCE, prefer buildAuthorizeUrl above):
await mgr.auth.authorize({
  response_type: "code",
  client_id: "…",
  redirect_uri: "https://app.example.com/callback",
  scope: "…",
});

// Revoke an access or refresh token (RFC 7009):
await mgr.auth.revoke({ token: "…" });
```

</TabItem>
<TabItem value="go" label="Go">

```go
_, _ = mgr.Auth.Authorize(ctx, authapi.AuthorizeParams{
    ResponseType: "code",
    ClientId:     "…",
    RedirectUri:  "https://app.example.com/callback",
    Scope:        "…",
})

_ = mgr.Auth.Revoke(ctx, authapi.OAuthRevokeRequest{Token: "…"})
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
mgr.auth.authorize("code", "…", "https://app.example.com/callback", "…", None, None, None).await?;

mgr.auth.revoke("…", None, None, None).await?;
```

</TabItem>
</Tabs>

## Grant failures {#grant-failures}

A failed grant — wrong credentials, an expired or already-used refresh token, an unavailable token
endpoint — surfaces as the SDK's typed API error, whether the SDK fetched the token transparently or
you called a grant helper yourself: `ManagerApiError` (`status`, `code`, `body`) in TypeScript,
`*manager.APIError` (`Status`, `Code`, `Message`, `Body`; `errors.As` compatible) in Go, and
`ManagerError::Api { status, code, .. }` in Rust. Branch on the structured `status`/`code` fields
rather than parsing the error message.

## Base URL

The SDK talks to `https://services.babelforce.com` by default. Set `baseUrl` (TypeScript) /
`BaseURL` (Go) — or the builder's `.base_url()` (Rust) — to target a per-customer or non-production
host:

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
const mgr = await ManagerClient.connect({
  baseUrl: "https://acme.babelforce.com",
  auth: { kind: "clientCredentials", clientId, clientSecret },
});
```

</TabItem>
<TabItem value="go" label="Go">

```go
mgr, _ := manager.Connect(ctx, manager.Options{
    BaseURL: "https://acme.babelforce.com",
    Auth:    manager.ClientCredentials(clientID, clientSecret),
})
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
let mgr = ManagerClient::builder(Auth::ClientCredentials { client_id, client_secret })
    .base_url("https://acme.babelforce.com")
    .connect()
    .await?;
```

</TabItem>
</Tabs>

## Reference

- [OAuth 2.0 REST API reference](pathname:///manager-sdk/reference/auth/)
