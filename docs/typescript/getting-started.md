---
title: TypeScript — getting started
sidebar_label: Getting started
---

# TypeScript — getting started

## Install

```bash
npm install @babelforce/manager-sdk
```

The package is ESM and ships with TypeScript types. Node 18+ (for global `fetch`).

## Connect

```ts
import { ManagerClient } from "@babelforce/manager-sdk";

const mgr = await ManagerClient.connect({
  auth: { kind: "clientCredentials", clientId, clientSecret },
  // baseUrl defaults to https://services.babelforce.com
});
```

See [Authentication](/guides/authentication) for all auth modes — Authorization Code + PKCE,
client-credentials, bearer, and password-grant — and for pointing the SDK at a different `baseUrl`.

## List users (auto-paginated)

`list()` returns an async iterator that pages for you:

```ts
for await (const user of mgr.users.list()) {
  console.log(user.id, user.email, user.enabled);
}

// or collect everything:
const all = await mgr.users.listAll();
```

## Create / enable / disable / delete

```ts
const created = await mgr.users.create({
  email: "new.user@acme.com",
  roles: [],
});

await mgr.users.enable(["new.user@acme.com"]);
await mgr.users.disable(["new.user@acme.com"]);
await mgr.users.delete(["new.user@acme.com"]);
```

## Error handling

Any non-2xx response throws a `ManagerApiError` carrying the status, API error code, and body:

```ts
import { ManagerApiError } from "@babelforce/manager-sdk";

try {
  await mgr.users.create({ email: "dup@acme.com", roles: [] });
} catch (err) {
  if (err instanceof ManagerApiError) {
    console.error(err.status, err.code, err.message);
  }
}
```

## Custom base URL & fetch

```ts
const mgr = await ManagerClient.connect({
  baseUrl: "https://acme.babelforce.com", // per-customer host override
  auth: { kind: "bearer", token },
  fetch: myInstrumentedFetch, // proxies, retries, tracing
});
```

## Reference

- [REST API reference](pathname:///manager-sdk/reference/manager/)
