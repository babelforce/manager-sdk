---
title: Metrics
sidebar_label: Metrics
---

# Metrics

Read metric values and definitions, and trigger pushes/resets (v2 manager API). Available as
`mgr.metrics` / `mgr.Metrics` / `mgr.metrics`.

## List metric ids

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
const ids = await mgr.metrics.listIds();
```

</TabItem>
<TabItem value="go" label="Go">

```go
ids, err := mgr.Metrics.ListIds(ctx)
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
let ids = mgr.metrics.list_ids().await?;
```

</TabItem>
</Tabs>

## Get a metric value and definition

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
const value = await mgr.metrics.get("calls.active");
const definition = await mgr.metrics.describe("calls.active");
```

</TabItem>
<TabItem value="go" label="Go">

```go
value, _ := mgr.Metrics.Get(ctx, "calls.active")
definition, _ := mgr.Metrics.Describe(ctx, "calls.active")
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
let value = mgr.metrics.get("calls.active").await?;
let definition = mgr.metrics.describe("calls.active").await?;
```

</TabItem>
</Tabs>

## All metric definitions

List the full catalog of metric definitions.

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
const defs = await mgr.metrics.definitions();
```

</TabItem>
<TabItem value="go" label="Go">

```go
defs, _ := mgr.Metrics.Definitions(ctx)
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
let defs = mgr.metrics.definitions().await?;
```

</TabItem>
</Tabs>

## Reference

- [REST API reference](pathname:///manager-sdk/reference/manager/)
