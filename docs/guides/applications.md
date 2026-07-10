---
title: Applications (IVR)
sidebar_label: Applications (IVR)
---

# Applications (IVR)

Manage IVR applications and their actions (v2 manager API). Available as `mgr.applications` /
`mgr.Applications` / `mgr.applications`, with a nested per-application local-automations
sub-resource (`actions` in TypeScript/Go, `local_automations` in Rust).

## List applications (auto-paginated)

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
for await (const app of mgr.applications.list()) {
  console.log(app.module);
}
const all = await mgr.applications.listAll();
```

</TabItem>
<TabItem value="go" label="Go">

```go
for app, err := range mgr.Applications.List(ctx, manager.ListApplicationsQuery{}) {
    if err != nil { log.Fatal(err) }
    v, _ := manager.ApplicationViewOf(app)
    fmt.Println(v.Id, v.Name, v.Module)
}
all, _ := mgr.Applications.ListAll(ctx, manager.ListApplicationsQuery{})
```

In Go, `managerapi.Application` is a `oneOf` union (a distinct shape per module). Use
`manager.ApplicationViewOf(app)` to read the shared fields.

</TabItem>
<TabItem value="rust" label="Rust">

```rust
for app in mgr.applications.list_all().await? {
    match app.as_typed() {
        // Known module → the typed `models::Application` (an enum tagged by `module`):
        Some(typed) => println!("{typed:?}"),
        // Unrecognized module types surface as `Unknown` instead of failing the whole list:
        None => println!("unknown module: {}", app.module()),
    }
}
```

In Rust, each item is an `ApplicationItem`: `Typed(models::Application)` for modules the SDK knows
(`Application` is a `#[serde(tag = "module")]` enum — match on the variant to read module-specific
fields), or `Unknown { module, raw }` for module types it doesn't recognize — an unknown module
never fails listing. Use `.as_typed()` / `.module()` to inspect an item.

</TabItem>
</Tabs>

## Create, get, update, delete

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
const created = await mgr.applications.create({ name: "Main IVR", module: "simpleMenu" /* … */ });
const app = await mgr.applications.get(created.item.id);
await mgr.applications.update(app.item.id, { /* ApplicationUpdateBody */ });
await mgr.applications.delete(app.item.id);

// bulk delete:
await mgr.applications.deleteMany(["id-1", "id-2"]);
```

</TabItem>
<TabItem value="go" label="Go">

```go
created, _ := mgr.Applications.Create(ctx, managerapi.ApplicationCreateBody{ /* name, module, … */ })
_, _ = mgr.Applications.Get(ctx, "app-id")
_, _ = mgr.Applications.Update(ctx, "app-id", managerapi.ApplicationUpdateBody{ /* … */ })
_ = mgr.Applications.Delete(ctx, "app-id")

// bulk delete:
_, _ = mgr.Applications.DeleteMany(ctx, []string{"id-1", "id-2"})
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
let created = mgr.applications.create(/* ApplicationCreateBody */).await?;
let app = mgr.applications.get("app-id").await?;
if let Some(typed) = app.as_typed() {
    // known module → the typed `models::Application`
    println!("{typed:?}");
}
mgr.applications.update("app-id", /* ApplicationUpdateBody */).await?;
mgr.applications.delete("app-id").await?;

// bulk delete:
mgr.applications.delete_many(vec!["id-1".into(), "id-2".into()]).await?;
```

The typed `create` / `get` / `update` (and `clone` below) work with `ApplicationItem` — see the
listing note above. The untyped escape hatches `create_raw` / `update_raw` / `clone_raw`
(`serde_json::Value` in/out) remain available when you need the payload exactly as served.

</TabItem>
</Tabs>

## Modules and dispatch

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
const modules = await mgr.applications.listModules();
await mgr.applications.dispatch(appId, "onEnter", true /* async */);
```

</TabItem>
<TabItem value="go" label="Go">

```go
modules, _ := mgr.Applications.ListModules(ctx)
_, _ = mgr.Applications.Dispatch(ctx, appID, "onEnter", true, nil)
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
let modules = mgr.applications.list_modules().await?;
mgr.applications.dispatch(&app_id, "onEnter", true, /* LocalAutomationDispatch */).await?;
```

</TabItem>
</Tabs>

## Actions (local automations)

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
for await (const action of mgr.applications.actions.list(appId)) console.log(action);
const action = await mgr.applications.actions.create(appId, { /* RestCreateLocalAutomationBody */ });
await mgr.applications.actions.update(appId, action.item.id, { /* … */ });
await mgr.applications.actions.delete(appId, action.item.id);
```

</TabItem>
<TabItem value="go" label="Go">

```go
for action, err := range mgr.Applications.Actions.List(ctx, appID, 0) {
    if err != nil { log.Fatal(err) }
    fmt.Printf("%+v\n", action)
}
created, _ := mgr.Applications.Actions.Create(ctx, appID, managerapi.RestCreateLocalAutomation{})
_, _ = mgr.Applications.Actions.Update(ctx, appID, created.Item.Id.String(), managerapi.RestUpdateLocalAutomation{})
_ = mgr.Applications.Actions.Delete(ctx, appID, created.Item.Id.String())
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
for action in mgr.applications.local_automations.list_all(&app_id).await? {
    println!("{action:?}");
}
let created = mgr.applications.local_automations.create(&app_id, /* RestCreateLocalAutomation */).await?;
mgr.applications.local_automations.update(&app_id, &created.item.id.to_string(), /* RestUpdateLocalAutomation */).await?;
mgr.applications.local_automations.delete(&app_id, &created.item.id.to_string()).await?;
```

</TabItem>
</Tabs>

To list local automations across **all** applications (not scoped to one app), use
`allLocalAutomations` (auto-paginated):

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
for await (const a of mgr.applications.allLocalAutomations()) console.log(a.id);
```

</TabItem>
<TabItem value="go" label="Go">

```go
for a, err := range mgr.Applications.AllLocalAutomations(ctx, managerapi.ListAllLocalAutomationsParams{}) { /* ... */ }
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
for a in mgr.applications.all_local_automations().await? {
    println!("{a:?}");
}
```

</TabItem>
</Tabs>

## Clone, bulk update & diagnostics

Clone an application, bulk-update several at once, or inspect the available action catalog and
recent application errors.

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
const copy = await mgr.applications.clone(appId);
await mgr.applications.bulkUpdate({ /* BulkUpdateApplicationsRequest */ });
const actions = await mgr.applications.listActions();
const errors = await mgr.applications.listErrors();
```

</TabItem>
<TabItem value="go" label="Go">

```go
copy, _ := mgr.Applications.Clone(ctx, appID)
_, _ = mgr.Applications.BulkUpdate(ctx, managerapi.BulkUpdateApplicationsRequest{})
actions, _ := mgr.Applications.ListActions(ctx)
errs, _ := mgr.Applications.ListErrors(ctx)
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
let copy = mgr.applications.clone(&app_id).await?; // typed — an `ApplicationItem` (`clone_raw` for the raw payload)
mgr.applications.bulk_update(/* BulkUpdateApplicationsRequest */).await?;
let actions = mgr.applications.list_app_actions().await?;
let errors = mgr.applications.list_errors().await?;
```

</TabItem>
</Tabs>

## Reference

- [REST API reference](pathname:///manager-sdk/reference/manager/)
