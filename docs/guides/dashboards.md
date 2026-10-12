---
title: Dashboards
sidebar_label: Dashboards
---

# Dashboards

Reporting dashboards (v2 manager API) and their user access. Available as `mgr.dashboards` /
`mgr.Dashboards` / `mgr.dashboards`.

## CRUD (auto-paginated list)

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
for await (const d of mgr.dashboards.list()) console.log(d.id, d.name);
const all = await mgr.dashboards.listAll();
const created = await mgr.dashboards.create({ /* DashboardCreateBody */ });
await mgr.dashboards.update(created.item.id, { /* DashboardUpdateBody */ });
await mgr.dashboards.delete(created.item.id);
```

</TabItem>
<TabItem value="go" label="Go">

```go
for d, err := range mgr.Dashboards.List(ctx, managerapi.ListDashboardsParams{}) {
    if err != nil { log.Fatal(err) }
    fmt.Println(d.Id, d.Name)
}
created, _ := mgr.Dashboards.Create(ctx, managerapi.DashboardCreateBody{})
_, _ = mgr.Dashboards.Update(ctx, created.Item.Id.String(), managerapi.DashboardUpdateBody{})
_ = mgr.Dashboards.Delete(ctx, created.Item.Id.String())
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
for d in mgr.dashboards.list_all().await? {
    println!("{} {}", d.id, d.name);
}
let created = mgr.dashboards.create(/* DashboardCreateBody */).await?;
mgr.dashboards.update(&created.item.id.to_string(), /* DashboardUpdateBody */).await?;
mgr.dashboards.delete(&created.item.id.to_string()).await?;
```

</TabItem>
</Tabs>

## Dashboard users

Grant or revoke a user's access to a dashboard (add by email, remove by user id).

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
const users = await mgr.dashboards.listUsers(dashboardId);
await mgr.dashboards.addUser(dashboardId, "user@example.com");
await mgr.dashboards.removeUser(dashboardId, userId);
```

</TabItem>
<TabItem value="go" label="Go">

```go
users, _ := mgr.Dashboards.ListUsers(ctx, dashboardID)
_, _ = mgr.Dashboards.AddUser(ctx, dashboardID, "user@example.com")
_, _ = mgr.Dashboards.RemoveUser(ctx, dashboardID, userID)
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
let users = mgr.dashboards.list_users(&dashboard_id).await?;
mgr.dashboards.add_user(&dashboard_id, "user@example.com").await?;
mgr.dashboards.remove_user(&dashboard_id, &user_id).await?;
```

</TabItem>
</Tabs>

## Reference

- [REST API reference](pathname:///manager-sdk/reference/manager/)
