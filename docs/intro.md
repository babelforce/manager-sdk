---
slug: /
title: babelforce manager SDK
sidebar_label: Overview
sidebar_position: 1
---

# babelforce manager SDK

First-class, intuitive clients for the babelforce **manager APIs** — auth, user & agent
management, call reporting, metrics, and task automations — in **TypeScript**, **Go**, and **Rust**.

One client, configured once, exposes resource namespaces over the API. Authentication, paging,
and error handling are taken care of for you. The three SDKs stay at
[full parity](/coverage) — every manager operation is wrapped identically in TypeScript, Go,
and Rust.

## Install

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```bash
npm install @babelforce/manager-sdk
```

</TabItem>
<TabItem value="go" label="Go">

```bash
go get github.com/babelforce/manager-sdk-go
```

</TabItem>
<TabItem value="rust" label="Rust">

```bash
cargo add babelforce-manager-sdk
```

</TabItem>
</Tabs>

## A first call

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
import { ManagerClient } from "@babelforce/manager-sdk";

const mgr = await ManagerClient.connect({
  auth: { kind: "clientCredentials", clientId, clientSecret },
});

for await (const user of mgr.users.list()) {
  console.log(user.email);
}
```

</TabItem>
<TabItem value="go" label="Go">

```go
mgr, _ := manager.Connect(ctx, manager.Options{
    Auth: manager.ClientCredentials(clientID, clientSecret),
})

for user, err := range mgr.Users.List(ctx, manager.ListUsersQuery{}) {
    if err != nil { log.Fatal(err) }
    fmt.Println(user.Email)
}
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
use babelforce_manager_sdk::{Auth, ManagerClient};

let mgr = ManagerClient::connect(Auth::ClientCredentials {
    client_id, client_secret,
}).await?;

for user in mgr.users.list_all().await? {
    println!("{}", user.email);
}
```

</TabItem>
</Tabs>

## What's inside

- **One host, two API versions.** Everything lives on a single host — `https://services.babelforce.com`
  by default; the SDK hides the `/api/v2` vs `/api/v3` split. Point at another host with a `baseUrl`
  override.
- **Auth, configured once** — OAuth2 client credentials or password grant, or a bearer token you
  already hold; tokens are refreshed transparently in TypeScript and Go.
- **Typed errors** — non-2xx responses raise a single typed error with status, code, and body.
- **Auto-pagination** — list endpoints page for you.
- **Automatic retries** — transient failures (429/502/503/504, network blips) are retried with
  exponential backoff, honouring `Retry-After`. On by default; configurable per client.

## Next steps

- [TypeScript — getting started](/typescript/getting-started)
- [Go — getting started](/go/getting-started)
- [Rust — getting started](/rust/getting-started)
- [Authentication](/guides/authentication)
- [REST API reference](pathname:///manager-sdk/reference/manager/)
