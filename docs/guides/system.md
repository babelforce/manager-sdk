---
title: System & reference
sidebar_label: System & reference
---

# System & reference

Health checks, server metadata, and reference catalogs that aren't tied to a single domain.
Available as `mgr.system` / `mgr.System` / `mgr.system`.

## Health & server info

`echo` and `ping` are lightweight liveness checks; `apiStatus` reports API health; `serverTime`
returns the server clock; `pushToken` returns the current push token.

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
await mgr.system.echo();
await mgr.system.ping();
const status = await mgr.system.apiStatus();
const time = await mgr.system.serverTime();
const token = await mgr.system.pushToken();
```

</TabItem>
<TabItem value="go" label="Go">

```go
_, _ = mgr.System.Echo(ctx)
_, _ = mgr.System.Ping(ctx)
status, _ := mgr.System.ApiStatus(ctx)
time, _ := mgr.System.ServerTime(ctx)
token, _ := mgr.System.PushToken(ctx)
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
mgr.system.echo().await?;
mgr.system.ping().await?;
let status = mgr.system.api_status().await?;
let time = mgr.system.server_time().await?;
let token = mgr.system.push_token().await?;
```

</TabItem>
</Tabs>

## Reference catalogs

Look up timezones (optionally filtered), the tag catalog (all or by category), or export
configuration templates of a given type.

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
const zones = await mgr.system.timezones({ q: "Europe" });
const tags = await mgr.system.tags();
const queueTags = await mgr.system.tagsByCategory("queue");
const templates = await mgr.system.exportTemplates("applications");
```

</TabItem>
<TabItem value="go" label="Go">

```go
zones, _ := mgr.System.Timezones(ctx, managerapi.ListTimezonesParams{})
tags, _ := mgr.System.Tags(ctx)
queueTags, _ := mgr.System.TagsByCategory(ctx, "queue")
templates, _ := mgr.System.ExportTemplates(ctx, "applications")
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
let zones = mgr.system.timezones(Some("Europe"), None).await?;
let tags = mgr.system.tags().await?;
let queue_tags = mgr.system.tags_by_category("queue").await?;
let templates = mgr.system.export_templates("applications").await?;
```

</TabItem>
</Tabs>

## Reference

- [REST API reference](pathname:///manager-sdk/reference/manager/)
