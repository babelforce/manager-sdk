---
title: Events, logs & expressions
sidebar_label: Events, logs & expressions
---

# Events, logs & expressions

Event definitions and custom events, request/live logs, and the expression catalog + evaluator.
Available as `mgr.events`, `mgr.logs`, and `mgr.expressions`. Integration action dispatch and
single-action variables live on `mgr.integrations`.

## Events

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
const events = await mgr.events.list();
const custom = await mgr.events.createCustom({ /* CustomEventRequest */ });
await mgr.events.deleteCustom(custom.item.id);
```

</TabItem>
<TabItem value="go" label="Go">

```go
events, _ := mgr.Events.List(ctx)
custom, _ := mgr.Events.CreateCustom(ctx, managerapi.CustomEventRequest{})
_ = mgr.Events.DeleteCustom(ctx, custom.Item.Id.String())
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
let events = mgr.events.list().await?;
let custom = mgr.events.create_custom(/* CustomEventRequest */).await?;
mgr.events.delete_custom(&custom.item.id.to_string()).await?;
```

</TabItem>
</Tabs>

## Logs

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
for await (const entry of mgr.logs.audit()) console.log(entry); // request audit log, auto-paged
const live = await mgr.logs.live();
```

</TabItem>
<TabItem value="go" label="Go">

```go
for entry, err := range mgr.Logs.Audit(ctx, managerapi.ListAuditLogsParams{}) { /* ... */ }
live, _ := mgr.Logs.Live(ctx)
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
let audit = mgr.logs.audit_all().await?; // request audit log, auto-paged
let live = mgr.logs.live().await?;
```

</TabItem>
</Tabs>

### Live logging & custom log entries

Toggle live logging on or off, or write a custom log entry.

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
await mgr.logs.enableLive();
await mgr.logs.disableLive();
await mgr.logs.write({ /* WriteLogRequest */ });
```

</TabItem>
<TabItem value="go" label="Go">

```go
_, _ = mgr.Logs.EnableLive(ctx)
_, _ = mgr.Logs.DisableLive(ctx)
_, _ = mgr.Logs.Write(ctx, managerapi.WriteLogRequest{})
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
mgr.logs.enable_live().await?;
mgr.logs.disable_live().await?;
mgr.logs.write(/* WriteLogRequest */).await?;
```

</TabItem>
</Tabs>

## Expressions

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
const available = await mgr.expressions.list();
const result = await mgr.expressions.evaluate({ /* EvaluateExpression */ });
```

</TabItem>
<TabItem value="go" label="Go">

```go
available, _ := mgr.Expressions.List(ctx)
result, _ := mgr.Expressions.Evaluate(ctx, managerapi.EvaluateExpression{}, false)
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
let available = mgr.expressions.list().await?;
let result = mgr.expressions.evaluate(/* EvaluateExpression */, false).await?; // is_async = false
```

</TabItem>
</Tabs>

## Integration action dispatch

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
await mgr.integrations.dispatchAction(integrationId, action, { /* IntegrationDispatchActionRequest */ });
const vars = await mgr.integrations.actionVariables("salesforce", actionName);
```

</TabItem>
<TabItem value="go" label="Go">

```go
_, _ = mgr.Integrations.DispatchAction(ctx, integrationID, action, managerapi.IntegrationDispatchActionRequest{})
vars, _ := mgr.Integrations.ActionVariables(ctx, managerapi.IntegrationProvider("salesforce"), actionName)
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
use babelforce_manager_sdk::gen::manager::models::{IntegrationDispatchActionRequest, IntegrationProvider};

mgr.integrations.dispatch_action(&integration_id, &action, IntegrationDispatchActionRequest::new()).await?;
let vars = mgr.integrations.action_variables(IntegrationProvider::Salesforce, &action_name).await?;
```

</TabItem>
</Tabs>

## Reference

- [REST API reference](pathname:///manager-sdk/reference/manager/)
