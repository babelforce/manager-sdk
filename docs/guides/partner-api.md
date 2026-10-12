---
title: Partner API
sidebar_label: Partner API
---

# Partner API

A **partner** is a platform that manages babelforce accounts for its own customers — a reseller, or a
product that embeds babelforce for the organisations it serves. The partner API lets such a platform
create an account per organisation and operate inside each of them **server to server**, with one set
of credentials.

:::info Availability
Partner accounts are enabled by babelforce per account, and the partner API is being rolled out.
Ask babelforce support whether it is enabled for your account before you build on it.
:::

## Concepts

| Term | Meaning |
|------|---------|
| **Partner account** | Your own babelforce account, switched into partner mode by babelforce. It holds sub-accounts. |
| **Sub-account** | A full babelforce account for one organisation you manage, created by you under your partner account. It has no owner user of its own. |
| **orgKey** | *Your* key for that organisation (for example the id it has in your system). 1–255 characters, unique across all accounts, never equal to an account id. You name a sub-account by its orgKey or by its account id. |
| **OAuth application** | A client id and secret of your partner account. Created by an owner or manager of the account, or by a service token; its tokens act as a **manager** of the account. |
| **Service token** | An access token your server gets from the `client_credentials` grant with the application's credentials. It acts in the partner account, carries the scope `account:manage`, and has no refresh token. |

Roles of people carry down: a user who holds a role on the partner account holds the same role in
each of its direct sub-accounts. A new sub-account starts with the account features its partner has
enabled. Only **direct** sub-accounts are reachable — never a sub-account of a sub-account, and never
another partner's.

## 1. Create the application your server uses

An owner or manager of the partner account creates an OAuth application once, for example from a
setup script authenticated as that person. The answer carries the **client secret once**: store it in
your secret store right away, no later read returns it.

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
const admin = await ManagerClient.connect({ auth: { kind: "bearer", token: ownerAccessToken } });

const app = await admin.oauthApplications.create({
  name: "partner-backend",
  label: "Partner backend",
  redirect_uri: "https://partner.example.com/oauth/callback",
  service_token_ttl_seconds: 3600,
});
// app.client_id and app.client_secret — the secret is shown only now.

const apps = await admin.oauthApplications.list();               // never carries a secret
const fresh = await admin.oauthApplications.resetSecret(app.uuid); // owner only; old secret stops working
```

</TabItem>
<TabItem value="go" label="Go">

```go
admin, _ := manager.Connect(ctx, manager.Options{Auth: manager.Bearer(ownerAccessToken)})

ttl := 3600
app, err := admin.OAuthApplications.Create(ctx, authapi.OAuthApplicationCreateRequest{
    Name:                   "partner-backend",
    Label:                  "Partner backend",
    RedirectUri:            "https://partner.example.com/oauth/callback",
    ServiceTokenTtlSeconds: &ttl,
})
// app.ClientId and app.ClientSecret — the secret is shown only now.

apps, _ := admin.OAuthApplications.List(ctx)                  // never carries a secret
fresh, _ := admin.OAuthApplications.ResetSecret(ctx, app.Uuid) // owner only; old secret stops working
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
use babelforce_manager_sdk::gen::auth::models::OAuthApplicationCreateRequest;
use babelforce_manager_sdk::{Auth, ManagerClient};

let admin = ManagerClient::connect(Auth::Bearer { token: owner_access_token }).await?;

let mut request = OAuthApplicationCreateRequest::new(
    "partner-backend".into(),
    "Partner backend".into(),
    "https://partner.example.com/oauth/callback".into(),
);
request.service_token_ttl_seconds = Some(3600);
let app = admin.oauth_applications.create(request).await?;
// app.client_id and app.client_secret — the secret is shown only now.

let apps = admin.oauth_applications.list().await?; // never carries a secret
let fresh = admin.oauth_applications.reset_secret(&app.uuid).await?; // owner only
```

</TabItem>
</Tabs>

| Operation | Who may call | Notes |
|-----------|--------------|-------|
| `list`, `get` | any user of the account | No secret in the answer. Another account's application answers 404. |
| `create` | OWNER, MANAGER, or a service token | `redirect_uri` is required even if you only use `client_credentials`. `service_token_ttl_seconds` (default 3600) is the service token lifetime and its maximum. `scope` (default `account:manage`) narrows what the new application holds; a service token cannot grant more than it holds itself (`403 scope_exceeds_creator`). |
| `update`, `delete` | OWNER, MANAGER, or a service token | Deleting ends every token of the application. |
| `resetSecret` | OWNER, or a service token | The old secret stops working at once. No token resets the secret of its own application (`403 own_application`). |
| `revokeTokens` | OWNER | Ends every token of the application in the account, exchanged tokens included. |

A service token administers the applications of the account it acts in, so a partner's server can
create an application inside a sub-account through [`forSubAccount`](#with-the-org-header) — for
example to hand that organisation credentials of its own. Each application answers `createdBy`: the
application or the user that created it (`null` for older applications).

Application ids are hyphenated uuids; pass them exactly as the API returned them.

## 2. Connect as the partner

Your server connects with the application's credentials. The SDK fetches a service token, applies it
to every request and fetches a new one shortly before it expires.

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
const partner = await ManagerClient.connect({
  auth: { kind: "clientCredentials", clientId, clientSecret },
});
```

</TabItem>
<TabItem value="go" label="Go">

```go
partner, err := manager.Connect(ctx, manager.Options{
    Auth: manager.ClientCredentials(clientID, clientSecret),
})
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
let partner = ManagerClient::connect(Auth::ClientCredentials { client_id, client_secret }).await?;
```

</TabItem>
</Tabs>

## 3. Manage sub-accounts

`accounts.create` is **safe to retry**: sending the same `orgKey` with the same `name` again answers
the existing sub-account with `created: false` and creates nothing. Create, list and get need the
partner's service token; a person's token is refused.

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
const { uuid, created } = await partner.accounts.create({ name: "Example Org", orgKey: "org-42" });

const all = await partner.accounts.list();          // every direct sub-account, oldest first
const one = await partner.accounts.get("org-42");   // or undefined
```

</TabItem>
<TabItem value="go" label="Go">

```go
res, err := partner.Accounts.Create(ctx, managerapi.CreateSubAccountRequest{
    Name:   "Example Org",
    OrgKey: "org-42",
})
// res.UUID, res.Created

all, _ := partner.Accounts.List(ctx, nil)       // every direct sub-account, oldest first
one, _ := partner.Accounts.Get(ctx, "org-42")   // or nil
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
use babelforce_manager_sdk::gen::manager::models::CreateSubAccountRequest;

let res = partner
    .accounts
    .create(CreateSubAccountRequest::new("Example Org".into(), "org-42".into()))
    .await?;
// res.uuid, res.created

let all = partner.accounts.list(None).await?;      // every direct sub-account, oldest first
let one = partner.accounts.get("org-42").await?;   // Option
```

</TabItem>
</Tabs>

A refused request raises the SDK's API error (`ManagerApiError` / `*manager.APIError` /
`ManagerError::Api`); the response body's `error` field names the reason:

| Status | `error` | Cause |
|--------|---------|-------|
| 400 | `invalid_request` | `orgKey` empty, only whitespace, longer than 255 characters, or not a string. |
| 400 | `invalid_name` | The name is not 3 to 100 characters. |
| 403 | `insufficient_scope` | The token is not a service token of the partner account. |
| 403 | `not_a_partner_account` | The account is not a partner account (or is itself a sub-account). |
| 409 | `org_key_taken` | Another sub-account carries this orgKey. Under your account the body names it in `uuid`; elsewhere no account is named. |
| 409 | `org_key_is_account_id` | The orgKey equals an existing account id. |
| 409 | `name_taken` | Another account already has this name. |

## 4. Act in a sub-account

There are two ways to make calls inside a sub-account. Both need a service token that holds
`account:manage`, and both reach direct sub-accounts only.

| | Org header | Token exchange |
|-|------------|----------------|
| How | Every request carries `X-Babelforce-Org-Id` with the sub-account's orgKey or account id. | The service token is exchanged (RFC 8693) for a token of one sub-account. |
| Token | One service token for the partner and all sub-accounts. | One token per sub-account; it works in that sub-account only and takes no header. |
| Use it when | Your server works across many sub-accounts. | You hand a token to a component that must not reach other accounts. |
| SDK | `forSubAccount(orgKey)` or the `orgId` option | the `tokenExchange` auth mode, or `tokenExchangeGrant` |

### With the org header

`forSubAccount` returns a client for one sub-account that shares the partner client's credentials,
token and retry settings. The partner client itself is unchanged. The header is honoured for service
tokens only: sent with any other credential, the API answers `400 invalid_request`.

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
const org42 = partner.forSubAccount("org-42");
for await (const agent of org42.agents.list()) console.log(agent.email);

// Or a client bound to one sub-account from the start:
const only42 = await ManagerClient.connect({
  auth: { kind: "clientCredentials", clientId, clientSecret },
  orgId: "org-42",
});
```

</TabItem>
<TabItem value="go" label="Go">

```go
org42, err := partner.ForSubAccount("org-42")
agents, _ := org42.Agents.ListAll(ctx, manager.ListAgentsQuery{})

// Or a client bound to one sub-account from the start:
only42, _ := manager.Connect(ctx, manager.Options{
    Auth:  manager.ClientCredentials(clientID, clientSecret),
    OrgID: "org-42",
})
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
let org42 = partner.for_sub_account("org-42").await?;
let agents = org42.agents.list_all().await?;

// Or a client bound to one sub-account from the start:
let only42 = ManagerClient::builder(Auth::ClientCredentials { client_id, client_secret })
    .org_id("org-42")
    .connect()
    .await?;
```

</TabItem>
</Tabs>

### With a token exchange

The `tokenExchange` auth mode gets a service token, exchanges it for a token of the sub-account named
by `audience` (its orgKey or account id), and repeats both before the exchanged token expires. `scope` optionally
narrows the exchanged token. The exchanged token never outlives the service token it came from, has
no refresh token, and cannot be exchanged again.

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
const org42 = await ManagerClient.connect({
  auth: { kind: "tokenExchange", clientId, clientSecret, audience: "org-42" },
});

// Or by hand, to pass the token on:
const service = await clientCredentialsGrant({ baseUrl, clientId, clientSecret });
const exchanged = await tokenExchangeGrant({
  baseUrl, clientId, clientSecret, subjectToken: service.access_token, audience: "org-42",
});
```

</TabItem>
<TabItem value="go" label="Go">

```go
org42, err := manager.Connect(ctx, manager.Options{
    Auth: manager.TokenExchange(clientID, clientSecret, "org-42", ""),
})

// Or by hand, to pass the token on:
service, _ := manager.ClientCredentialsGrant(ctx, nil, baseURL, clientID, clientSecret)
exchanged, _ := manager.TokenExchangeGrant(ctx, nil, baseURL, manager.TokenExchangeRequest{
    ClientID:     clientID,
    ClientSecret: clientSecret,
    SubjectToken: service.AccessToken,
    Audience:     "org-42",
})
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
let org42 = ManagerClient::connect(Auth::TokenExchange {
    client_id,
    client_secret,
    audience: "org-42".into(),
    scope: None,
})
.await?;
```

</TabItem>
</Tabs>

The token endpoint refuses an exchange with `400 invalid_target` when the audience is no direct
sub-account of the application's account, with `400 invalid_request` (`error_description:
account_disabled`) when the sub-account is disabled, and with `401 invalid_client` when the client
credentials are wrong.

## People and their accounts

A person's token acts in one account at a time. `me.accounts()` lists every account the person may
switch into, each with the roles that apply there: accounts where they hold a role, the account they
own, and the direct sub-accounts of a partner account where they hold a role. To switch, refresh the
token with the target account's id; the refreshed token acts there.

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
const accounts = await mgr.me.accounts(); // [{ id, name, roles: ["manager"] }, …]

const switched = await refreshTokenGrant({
  baseUrl, refreshToken, clientId, accountId: accounts[1].id,
});
```

</TabItem>
<TabItem value="go" label="Go">

```go
accounts, _ := mgr.Me.Accounts(ctx) // each with Id, Name, Roles

switched, _ := manager.RefreshTokenGrantForAccount(ctx, nil, baseURL, refreshToken, clientID, "", accounts[1].Id.String())
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
let accounts = mgr.me.accounts().await?; // each with id, name, roles

let switched = mgr.auth.token("refresh_token", TokenRequest {
    refresh_token: Some(refresh_token),
    client_id: Some(client_id),
    account_id: Some(accounts[1].id.to_string()),
    ..Default::default()
}).await?;
```

</TabItem>
</Tabs>

## Refresh tokens

Refresh tokens rotate. Every refresh answers a **new access token and a new refresh token**, and both
previous tokens stop working at once. Presenting a refresh token that was already used counts as
theft: the API revokes that sign-in's tokens, and its next refresh answers 401. So:

- Keep one current refresh token per sign-in and replace it after every refresh.
- Never refresh the same token from two processes. Inside one client the SDK does this for you: it
  refreshes once for all concurrent requests and keeps the rotated token.
- Service tokens and exchanged tokens have no refresh token; the SDK simply gets a new one.

### Opt-in lifetimes

The limits are opt-in, per account, with the `auth/refresh-token` setting. While a field is unset,
nothing changes: a refresh has no idle check (the token cleanup still deletes a token whose access
token expired more than 14 days ago without a refresh), no absolute lifetime, and a reuse grace of 0,
so every reuse revokes. The values below are recommendations, not defaults: nothing applies them
unless the account sets them.

| Field | Range | Recommended | Effect |
|-------|-------|-------------|--------|
| `idleLifetimeSeconds` | 43200–7776000 (12 h–90 d) | 1209600 (14 d) | A refresh token not used for this long is refused. |
| `absoluteLifetimeSeconds` | 86400–15552000 (1–180 d), not below idle | 2592000 (30 d) | A sign-in older than this is refused, however often it was refreshed. |
| `reuseGraceSeconds` | 0–60 | 10 | A refresh token presented again within this many seconds of its rotation is taken as a retry of a lost answer and gets a new pair instead of revoking. |

A refused refresh answers 401; the user signs in again.

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
await mgr.settings.auth.refreshToken.update({
  idleLifetimeSeconds: 1209600,
  absoluteLifetimeSeconds: 2592000,
  reuseGraceSeconds: 10,
});
```

</TabItem>
<TabItem value="go" label="Go">

```go
idle, absolute, grace := 1209600, 2592000, 10
_, err := mgr.Settings.Auth.RefreshToken.Update(ctx, managerapi.SettingsAuthRefreshTokenRequestData{
    IdleLifetimeSeconds:     &idle,
    AbsoluteLifetimeSeconds: &absolute,
    ReuseGraceSeconds:       &grace,
})
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
let current = mgr.settings.auth_refresh_token().await?;
mgr.settings.set_auth_refresh_token(/* SettingsAuthRefreshTokenRequest */).await?;
```

</TabItem>
</Tabs>
