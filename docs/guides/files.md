---
title: Files
sidebar_label: Files
---

# Files

Stored files (v2 manager API) — recordings, prompts, backups, and other stored objects — with
listing, fetching, downloading, and (bulk) deletion. Available as `mgr.files` / `mgr.Files` /
`mgr.files`.

## List & fetch

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
for await (const f of mgr.files.list()) console.log(f.id, f.filename);
const all = await mgr.files.listAll();
const recordings = await mgr.files.recordings();
const byType = await mgr.files.listByType("recording");
const { item } = await mgr.files.get(fileId);
const bytes = await mgr.files.download(fileId);
```

</TabItem>
<TabItem value="go" label="Go">

```go
for f, err := range mgr.Files.List(ctx, managerapi.ListFilesParams{}) {
    if err != nil { log.Fatal(err) }
    fmt.Println(f.Id, f.Filename)
}
recordings, _ := mgr.Files.Recordings(ctx)
byType, _ := mgr.Files.ListByType(ctx, "recording")
got, _ := mgr.Files.Get(ctx, fileID)
bytes, _ := mgr.Files.Download(ctx, fileID)
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
use babelforce_manager_sdk::gen::manager::models::StorageType;

for f in mgr.files.list_all().await? {
    println!("{} {}", f.id, f.filename);
}
let recordings = mgr.files.recordings().await?;
let by_type = mgr.files.list_by_type(StorageType::Recording).await?;
let got = mgr.files.get(&file_id).await?;
let bytes = mgr.files.download(&file_id).await?; // triggers the download
```

</TabItem>
</Tabs>

Convenience listers `backups()`, `recordings()`, `prompts()`, and `listByType(type)` return the
files of a single category.

## Delete & bulk

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
await mgr.files.delete(fileId);
await mgr.files.bulkDelete([id1, id2]);
const zip = await mgr.files.bulkDownload([id1, id2]);      // GET, ids in the query
const zip2 = await mgr.files.bulkDownloadPost([id1, id2]); // POST, ids in the body
```

</TabItem>
<TabItem value="go" label="Go">

```go
_, _ = mgr.Files.Delete(ctx, fileID)
_, _ = mgr.Files.BulkDelete(ctx, []string{id1, id2})
zip, _ := mgr.Files.BulkDownload(ctx, []string{id1, id2})
zip2, _ := mgr.Files.BulkDownloadPost(ctx, []string{id1, id2})
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
mgr.files.delete(&file_id).await?;
mgr.files.bulk_delete(vec![id1.clone(), id2.clone()]).await?;
let zip = mgr.files.bulk_download(vec![id1.clone(), id2.clone()]).await?;      // GET, ids in the query
let zip2 = mgr.files.bulk_download_post(vec![id1, id2]).await?;                // POST, ids in the body
```

</TabItem>
</Tabs>

## Reference

- [REST API reference](pathname:///manager-sdk/reference/manager/)
