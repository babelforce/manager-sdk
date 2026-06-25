---
title: Call reporting
sidebar_label: Call reporting
---

# Call reporting

Query call reports (v2 manager API). Available as `mgr.calls.reporting` (TypeScript) /
`mgr.Calls.Reporting` (Go) / `mgr.calls.reporting` (Rust). Three reports, all auto-paginated:

- **Detailed** — `list` — rich per-call records (`Call`).
- **Simple** — `simple` — condensed records across all report types (`ReportingCall`).
- **Inbound simple** — `inboundSimple` — the inbound-only variant of the simple report.

## Detailed report (auto-paginated)

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
for await (const call of mgr.calls.reporting.list({ "time.start": 1700000000, "time.end": 1700600000 })) {
  console.log(call.id);
}
const all = await mgr.calls.reporting.listAll({ agentId: "…" });
```

</TabItem>
<TabItem value="go" label="Go">

```go
for call, err := range mgr.Calls.Reporting.List(ctx, managerapi.ListReportingCallsParams{}) {
    if err != nil { log.Fatal(err) }
    fmt.Println(call.Id)
}
all, _ := mgr.Calls.Reporting.ListAll(ctx, managerapi.ListReportingCallsParams{})
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
for call in mgr.calls.reporting.list_all().await? {
    println!("{}", call.id);
}
```

</TabItem>
</Tabs>

## Simple report

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
// All report types:
const simple = await mgr.calls.reporting.simpleAll({ queueName: "support" });
```

</TabItem>
<TabItem value="go" label="Go">

```go
simple, _ := mgr.Calls.Reporting.SimpleAll(ctx, managerapi.ListAllSimpleReportingCallsParams{})
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
let simple = mgr.calls.reporting.simple_all().await?;
```

</TabItem>
</Tabs>

### Inbound-only simple report

A dedicated inbound variant of the simple report (auto-paginated).

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
const inbound = await mgr.calls.reporting.inboundSimpleAll();
```

</TabItem>
<TabItem value="go" label="Go">

```go
inbound, _ := mgr.Calls.Reporting.InboundSimpleAll(ctx, managerapi.ListInboundSimpleReportingCallsParams{})
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
let inbound = mgr.calls.reporting.inbound_simple_all().await?;
```

</TabItem>
</Tabs>

## Filtering

The reporting endpoints expose a large filter set (time ranges, numbers, agent, queue, state,
duration buckets, …). Rather than re-declaring every field, the SDK accepts the generated filter
surface directly:

- **TypeScript** — the query object is the generated query type (e.g. `time.start`, `agentId`,
  `filters.*` variants) minus the `page` / `max` paging controls; pass `pageSize` for the page
  size. The auto-paginator drives `page`.
- **Go** — pass the generated `managerapi.List*Params` struct (every filter is an optional pointer
  field). Leave `Page` unset — it is managed by the iterator.
- **Rust** — the `*_all()` collectors auto-paginate the full report; per-field filters land with the
  typed-query follow-up.

## Reference

- [REST API reference](pathname:///manager-sdk/reference/manager/)
