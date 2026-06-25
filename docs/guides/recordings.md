---
title: Recordings
sidebar_label: Recordings
---

# Recordings

Call recordings (v2 manager API) — list, start, manage, flag, and bulk actions. Available as
`mgr.recordings` / `mgr.Recordings` / `mgr.recordings`.

## CRUD & start

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
for await (const r of mgr.recordings.list()) console.log(r.id);
const started = await mgr.recordings.start({ /* RecordingStartRequest */ });
const got = await mgr.recordings.get(recordingId);
await mgr.recordings.update(recordingId, { /* RecordingUpdateBody */ });
await mgr.recordings.delete(recordingId);
await mgr.recordings.bulkAction("delete", [id1, id2]);
```

</TabItem>
<TabItem value="go" label="Go">

```go
for r, err := range mgr.Recordings.List(ctx, managerapi.ListRecordingsParams{}) {
    if err != nil { log.Fatal(err) }
    fmt.Println(r.Id)
}
started, _ := mgr.Recordings.Start(ctx, managerapi.RecordingStartRequest{})
got, _ := mgr.Recordings.Get(ctx, recordingID)
_, _ = mgr.Recordings.Update(ctx, recordingID, managerapi.RecordingUpdateBody{})
_ = mgr.Recordings.Delete(ctx, recordingID)
_, _ = mgr.Recordings.BulkAction(ctx, "delete", []string{id1, id2})
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
for r in mgr.recordings.list_all().await? {
    println!("{}", r.id);
}
let started = mgr.recordings.start(/* RecordingStartRequest */).await?;
let got = mgr.recordings.get(&recording_id).await?;
mgr.recordings.update(&recording_id, /* RecordingUpdateBody */).await?;
mgr.recordings.delete(&recording_id).await?;
mgr.recordings.bulk_action("delete", vec![id1.clone(), id2.clone()]).await?;
```

</TabItem>
</Tabs>

## Flags

Flag a recording for review and inspect/toggle/clear that flag.

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
await mgr.recordings.flag(recordingId);
const { item } = await mgr.recordings.getFlag(recordingId);
await mgr.recordings.toggleFlag(recordingId);
await mgr.recordings.unflag(recordingId);
```

</TabItem>
<TabItem value="go" label="Go">

```go
_, _ = mgr.Recordings.Flag(ctx, recordingID)
_, _ = mgr.Recordings.GetFlag(ctx, recordingID)
_, _ = mgr.Recordings.ToggleFlag(ctx, recordingID)
_, _ = mgr.Recordings.Unflag(ctx, recordingID)
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
mgr.recordings.flag(&recording_id).await?;
let flag = mgr.recordings.get_flag(&recording_id).await?;
mgr.recordings.toggle_flag(&recording_id).await?;
mgr.recordings.unflag(&recording_id).await?;
```

</TabItem>
</Tabs>

## Reference

- [REST API reference](pathname:///manager-sdk/reference/manager/)
