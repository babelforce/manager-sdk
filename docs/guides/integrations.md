---
title: Integrations
sidebar_label: Integrations
---

# Integrations

Manage third-party integrations (v2 manager API) — CRUD, the provider catalog, OAuth token
management, action associations and dispatch, the raw API proxy, and bulk operations. Available as
`mgr.integrations` / `mgr.Integrations` / `mgr.integrations`.

## CRUD

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
for await (const integ of mgr.integrations.list()) console.log(integ.id);
const created = await mgr.integrations.create({ /* IntegrationCreateRequest */ });
await mgr.integrations.update(created.item.id, { /* IntegrationUpdateRequest */ });
await mgr.integrations.delete(created.item.id);
```

</TabItem>
<TabItem value="go" label="Go">

```go
for integ, err := range mgr.Integrations.List(ctx, managerapi.ListIntegrationsParams{}) { /* ... */ }
created, _ := mgr.Integrations.Create(ctx, managerapi.IntegrationCreateRequest{})
_, _ = mgr.Integrations.Update(ctx, created.Item.Id.String(), managerapi.IntegrationUpdateRequest{})
_ = mgr.Integrations.Delete(ctx, created.Item.Id.String())
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
for integ in mgr.integrations.list_all().await? {
    println!("{}", integ.id);
}
let created = mgr.integrations.create(/* IntegrationCreateRequest */).await?;
mgr.integrations.update(&created.item.id.to_string(), /* IntegrationUpdateRequest */).await?;
mgr.integrations.delete(&created.item.id.to_string()).await?;
```

</TabItem>
</Tabs>

## Available providers & provider helpers

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
const available = await mgr.integrations.available();
const logo = await mgr.integrations.providerLogo("salesforce", "64");
const vars = await mgr.integrations.providerSessionVariables("salesforce");
```

</TabItem>
<TabItem value="go" label="Go">

```go
available, _ := mgr.Integrations.Available(ctx)
logo, _ := mgr.Integrations.ProviderLogo(ctx, managerapi.IntegrationProvider("salesforce"), "64")
vars, _ := mgr.Integrations.ProviderSessionVariables(ctx, "salesforce")
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
use babelforce_manager_sdk::gen::manager::models::IntegrationProvider;

let available = mgr.integrations.available().await?;
let logo = mgr.integrations.provider_logo(IntegrationProvider::Salesforce, "64").await?;
let vars = mgr.integrations.provider_session_variables("salesforce").await?;
```

</TabItem>
</Tabs>

## Action associations

Associate (or remove) an integration action with an object.

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
await mgr.integrations.addAssociation(integrationId, associationId, actionName);
await mgr.integrations.removeAssociation(integrationId, associationId, actionName);
```

</TabItem>
<TabItem value="go" label="Go">

```go
_, _ = mgr.Integrations.AddAssociation(ctx, integrationID, associationID, actionName)
_, _ = mgr.Integrations.RemoveAssociation(ctx, integrationID, associationID, actionName)
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
mgr.integrations.add_association(&integration_id, &association_id, &action_name).await?;
mgr.integrations.remove_association(&integration_id, &association_id, &action_name).await?;
```

</TabItem>
</Tabs>

## Dispatch & action variables

Dispatch a provider action, or inspect the variables a single action exposes.

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
const result = await mgr.integrations.dispatchAction(integrationId, "refresh", { /* request */ });
const vars = await mgr.integrations.actionVariables("salesforce", "refresh");
```

</TabItem>
<TabItem value="go" label="Go">

```go
result, _ := mgr.Integrations.DispatchAction(ctx, integrationID, "refresh", managerapi.IntegrationDispatchActionRequest{})
vars, _ := mgr.Integrations.ActionVariables(ctx, managerapi.IntegrationProvider("salesforce"), "refresh")
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
use babelforce_manager_sdk::gen::manager::models::{IntegrationDispatchActionRequest, IntegrationProvider};

let result = mgr.integrations.dispatch_action(&integration_id, "refresh", IntegrationDispatchActionRequest::new()).await?;
let vars = mgr.integrations.action_variables(IntegrationProvider::Salesforce, "refresh").await?;
```

</TabItem>
</Tabs>

## Providers, tokens, templates & proxy

Beyond CRUD, the resource also exposes the provider catalog, OAuth token management, type actions,
the raw API proxy, templates, clone/authorize, and bulk update/delete.

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
const providers = await mgr.integrations.providers();
const cloned = await mgr.integrations.clone(integrationId);
await mgr.integrations.authorize(integrationId, { /* … */ });

const tokens = await mgr.integrations.listTokens(integrationId);
await mgr.integrations.refreshToken(integrationId, tokenId);
await mgr.integrations.deleteToken(integrationId, tokenId);

const actions = await mgr.integrations.typeActions("salesforce");
await mgr.integrations.dispatchTypeAction("salesforce", integrationId, "refresh", { /* … */ });
const res = await mgr.integrations.apiProxyGet(integrationId, "/some/upstream/path");

await mgr.integrations.bulkDelete([id1, id2]);
```

</TabItem>
<TabItem value="go" label="Go">

```go
providers, _ := mgr.Integrations.Providers(ctx)
cloned, _ := mgr.Integrations.Clone(ctx, integrationID)
_, _ = mgr.Integrations.Authorize(ctx, integrationID, map[string]any{})

tokens, _ := mgr.Integrations.ListTokens(ctx, integrationID)
_, _ = mgr.Integrations.RefreshToken(ctx, integrationID, tokenID)
_, _ = mgr.Integrations.DeleteToken(ctx, integrationID, tokenID)

actions, _ := mgr.Integrations.TypeActions(ctx, "salesforce")
_, _ = mgr.Integrations.DispatchTypeAction(ctx, "salesforce", integrationID, "refresh", map[string]any{})
res, _ := mgr.Integrations.APIProxyGet(ctx, integrationID, "/some/upstream/path")

_, _ = mgr.Integrations.BulkDelete(ctx, []string{id1, id2})
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
use std::collections::HashMap;

let providers = mgr.integrations.providers().await?;
let cloned = mgr.integrations.clone(&integration_id).await?;
mgr.integrations.authorize(&integration_id, HashMap::new()).await?;

let tokens = mgr.integrations.list_tokens(&integration_id).await?;
mgr.integrations.refresh_token(&integration_id, &token_id).await?;
mgr.integrations.delete_token(&integration_id, &token_id).await?;

let actions = mgr.integrations.type_actions("salesforce").await?;
mgr.integrations.dispatch_type_action("salesforce", &integration_id, "refresh", HashMap::new()).await?;
mgr.integrations.api_proxy_get(&integration_id, "/some/upstream/path").await?;

mgr.integrations.bulk_delete(vec![id1.clone(), id2.clone()]).await?;
```

</TabItem>
</Tabs>

## Action catalog & execution

Browse the global action catalog, inspect a provider action's parameters, execute an action by
type/name, or dispatch an integration action via a GET request (e.g. from a call flow).

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
const actions = await mgr.integrations.listActions("salesforce");
const params = await mgr.integrations.listActionParams("salesforce", "refresh");
await mgr.integrations.executeAction("salesforce", "refresh", { /* params */ });
const res = await mgr.integrations.dispatchActionGet(integrationId, "refresh", { callId });
```

</TabItem>
<TabItem value="go" label="Go">

```go
actions, _ := mgr.Integrations.ListActions(ctx, managerapi.ListActionsParams{})
params, _ := mgr.Integrations.ListActionParams(ctx, "salesforce", "refresh")
_, _ = mgr.Integrations.ExecuteAction(ctx, "salesforce", "refresh", map[string]any{})
res, _ := mgr.Integrations.DispatchActionGet(ctx, integrationID, "refresh", managerapi.DispatchActionGetParams{})
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
let actions = mgr.integrations.list_actions(Some("salesforce")).await?;
let params = mgr.integrations.list_action_params("salesforce", "refresh").await?;
mgr.integrations.execute_action("salesforce", "refresh", None).await?;
let res = mgr.integrations.dispatch_action_get(&integration_id, "refresh", None, None).await?;
```

</TabItem>
</Tabs>

## Reference

- [REST API reference](pathname:///manager-sdk/reference/manager/)
