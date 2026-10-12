---
title: Routing & automation
sidebar_label: Routing & automation
---

# Routing & automation

Routing rules, workflow triggers, and global automations (event triggers) — the v2 manager
configuration surface for "when X, route/do Y". Available as `mgr.routing`, `mgr.triggers`, and
`mgr.automations` (with `mgr.Routing` / `mgr.Triggers` / `mgr.Automations` in Go and the same
snake_case names in Rust).

## Routing rules

`mgr.routing` / `mgr.Routing` / `mgr.routing` — `/api/v2/routings`.

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
for await (const r of mgr.routing.list()) console.log(r.id);
const created = await mgr.routing.create({ /* RestCreateRoutingBody */ });
await mgr.routing.update(created.item.id, { /* RestUpdateRoutingBody */ });
await mgr.routing.delete(created.item.id);
```

</TabItem>
<TabItem value="go" label="Go">

```go
for r, err := range mgr.Routing.List(ctx, managerapi.ListRoutingsParams{}) { /* ... */ }
created, _ := mgr.Routing.Create(ctx, managerapi.RestCreateRouting{})
_, _ = mgr.Routing.Update(ctx, created.Item.Id.String(), managerapi.RestUpdateRouting{})
_ = mgr.Routing.Delete(ctx, created.Item.Id.String())
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
for r in mgr.routing.list_all().await? {
    println!("{}", r.id);
}
let created = mgr.routing.create(/* RestCreateRouting */).await?;
mgr.routing.update(&created.item.id.to_string(), /* RestUpdateRouting */).await?;
mgr.routing.delete(&created.item.id.to_string()).await?;
```

</TabItem>
</Tabs>

## Triggers

`mgr.triggers` / `mgr.Triggers` / `mgr.triggers` — `/api/v2/triggers`. CRUD plus `clone` and `test`.

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
const created = await mgr.triggers.create({ /* RestCreateTriggerBody */ });
const copy = await mgr.triggers.clone(created.item.id);
const result = await mgr.triggers.test({ /* TestTriggersRequest */ }); // testMode defaults to true
```

</TabItem>
<TabItem value="go" label="Go">

```go
created, _ := mgr.Triggers.Create(ctx, managerapi.RestCreateTrigger{})
copy, _ := mgr.Triggers.Clone(ctx, created.Item.Id.String())
result, _ := mgr.Triggers.Test(ctx, managerapi.TestTriggersRequest{}, true) // testMode
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
let created = mgr.triggers.create(/* RestCreateTrigger */).await?;
let copy = mgr.triggers.clone(&created.item.id.to_string()).await?;
let result = mgr.triggers.test(/* TestTriggersRequest */, true).await?; // test_mode
```

</TabItem>
</Tabs>

## Global automations

`mgr.automations` / `mgr.Automations` / `mgr.automations` — event triggers at `/api/v2/events/triggers`.

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
for await (const a of mgr.automations.list()) console.log(a.id);
const created = await mgr.automations.create({ /* RestCreateGlobalAutomationBody */ });
await mgr.automations.delete(created.item.id);
```

</TabItem>
<TabItem value="go" label="Go">

```go
for a, err := range mgr.Automations.List(ctx, managerapi.ListGlobalAutomationsParams{}) { /* ... */ }
created, _ := mgr.Automations.Create(ctx, managerapi.RestCreateGlobalAutomation{})
_ = mgr.Automations.Delete(ctx, created.Item.Id.String())
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
for a in mgr.automations.list_all().await? {
    println!("{}", a.id);
}
let created = mgr.automations.create(/* RestCreateGlobalAutomation */).await?;
mgr.automations.delete(&created.item.id.to_string()).await?;
```

</TabItem>
</Tabs>

## Trigger metadata, conditions & bulk actions

Triggers also expose the expression/operator catalogs, per-trigger conditions and uses, bulk
actions, and (for event triggers / automations) clone, dispatch, and bulk update/delete. Queues
expose their attached triggers.

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
const expressions = await mgr.triggers.expressions();
const operators = await mgr.triggers.operators();
const conditions = await mgr.triggers.conditions(triggerId);
await mgr.triggers.setConditions(triggerId, { /* TriggerConditionsRequest */ });
const uses = await mgr.triggers.uses(triggerId);
await mgr.triggers.bulkAction("enable", [id1, id2]);

const cloned = await mgr.automations.clone(eventTriggerId);
await mgr.automations.dispatch(eventTriggerId, { simulateCall: true });
await mgr.automations.bulkDelete([id1, id2]);

const queueTriggers = await mgr.queues.listTriggers(queueId);
```

</TabItem>
<TabItem value="go" label="Go">

```go
expressions, _ := mgr.Triggers.Expressions(ctx)
operators, _ := mgr.Triggers.Operators(ctx)
conditions, _ := mgr.Triggers.Conditions(ctx, triggerID)
_, _ = mgr.Triggers.SetConditions(ctx, triggerID, managerapi.TriggerConditionsRequest{})
uses, _ := mgr.Triggers.Uses(ctx, triggerID)
_, _ = mgr.Triggers.BulkAction(ctx, "enable", []string{id1, id2})

cloned, _ := mgr.Automations.Clone(ctx, eventTriggerID)
_, _ = mgr.Automations.Dispatch(ctx, eventTriggerID, nil, nil)
_, _ = mgr.Automations.BulkDelete(ctx, []string{id1, id2})
qts, _ := mgr.Queues.ListTriggers(ctx, queueID)
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
let expressions = mgr.triggers.expressions().await?;
let operators = mgr.triggers.operators().await?;
let conditions = mgr.triggers.conditions(&trigger_id).await?;
mgr.triggers.set_conditions(&trigger_id, /* TriggerConditionsRequest */).await?;
let uses = mgr.triggers.uses(&trigger_id).await?;
mgr.triggers.bulk_action("enable", vec![id1.clone(), id2.clone()]).await?;

let cloned = mgr.automations.clone(&event_trigger_id).await?;
mgr.automations.dispatch(&event_trigger_id, None, None, std::collections::HashMap::new()).await?;
mgr.automations.bulk_delete(vec![id1.clone(), id2.clone()]).await?;
let queue_triggers = mgr.queues.list_triggers(&queue_id).await?;
```

</TabItem>
</Tabs>

## Reference

- [REST API reference](pathname:///manager-sdk/reference/manager/)
