---
title: Dialer
sidebar_label: Dialer
---

# Dialer

The outbound dialer (v2 manager API) — runtime info/flush, the dialer simple-call report, and dialer
**behaviours** (reusable dialer configurations). Available as `mgr.dialer` / `mgr.Dialer` /
`mgr.dialer`, with a nested `behaviours` sub-resource.

## Info, flush & report

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
const info = await mgr.dialer.info();
await mgr.dialer.flush({ all: true });            // or { id: campaignId }
const calls = await mgr.dialer.simpleReportingAll();
```

</TabItem>
<TabItem value="go" label="Go">

```go
info, _ := mgr.Dialer.Info(ctx)
all := true
_, _ = mgr.Dialer.Flush(ctx, nil, &all)
calls, _ := mgr.Dialer.SimpleReportingAll(ctx, managerapi.ListDialerSimpleReportingCallsParams{})
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
let info = mgr.dialer.info().await?;
mgr.dialer.flush(None, Some(true)).await?;        // or flush(Some(&campaign_id), None)
let calls = mgr.dialer.simple_reporting().await?;
```

</TabItem>
</Tabs>

## Behaviours

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
for await (const b of mgr.dialer.behaviours.list()) console.log(b.name);
const created = await mgr.dialer.behaviours.create({ /* DialerBehaviourWriteBody */ });
await mgr.dialer.behaviours.update(created.item.id, { /* ... */ });
await mgr.dialer.behaviours.delete(created.item.id);
```

</TabItem>
<TabItem value="go" label="Go">

```go
for b, err := range mgr.Dialer.Behaviours.List(ctx, managerapi.ListDialerBehavioursParams{}) {
    if err != nil { log.Fatal(err) }
    fmt.Println(b.Name)
}
created, _ := mgr.Dialer.Behaviours.Create(ctx, managerapi.DialerBehaviourWriteBody{})
_, _ = mgr.Dialer.Behaviours.Update(ctx, created.Item.Id.String(), managerapi.DialerBehaviourWriteBody{})
_ = mgr.Dialer.Behaviours.Delete(ctx, created.Item.Id.String())
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
for b in mgr.dialer.behaviours.list_all().await? {
    println!("{}", b.name);
}
let created = mgr.dialer.behaviours.create(/* DialerBehaviourWriteBody */).await?;
mgr.dialer.behaviours.update(&created.item.id.to_string(), /* DialerBehaviourWriteBody */).await?;
mgr.dialer.behaviours.delete(&created.item.id.to_string()).await?;
```

</TabItem>
</Tabs>

## Reference

- [REST API reference](pathname:///manager-sdk/reference/manager/)
