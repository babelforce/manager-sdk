---
title: Queues & selections
sidebar_label: Queues & selections
---

# Queues & selections

Manage call queues and their **selections** (the rules that pick which agents/groups/tags a queue
routes to). Available as `mgr.queues` / `mgr.Queues` / `mgr.queues`, with a nested `selections`
sub-resource.

## Queues

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
for await (const queue of mgr.queues.list()) console.log(queue.id);
const created = await mgr.queues.create({ /* RestCreateQueueBody */ });
const queue = await mgr.queues.get(created.item.id);
await mgr.queues.update(queue.item.id, { /* RestUpdateQueueBody */ });
await mgr.queues.delete(queue.item.id);
```

</TabItem>
<TabItem value="go" label="Go">

```go
for queue, err := range mgr.Queues.List(ctx, managerapi.ListQueuesParams{}) {
    if err != nil { log.Fatal(err) }
    fmt.Println(queue.Id)
}
created, _ := mgr.Queues.Create(ctx, managerapi.RestCreateQueue{})
queue, _ := mgr.Queues.Get(ctx, created.Item.Id.String())
_, _ = mgr.Queues.Update(ctx, queue.Item.Id.String(), managerapi.RestUpdateQueue{})
_ = mgr.Queues.Delete(ctx, queue.Item.Id.String())
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
for queue in mgr.queues.list_all().await? {
    println!("{}", queue.id);
}
let created = mgr.queues.create(/* RestCreateQueue */).await?;
let queue = mgr.queues.get(&created.item.id.to_string()).await?;
mgr.queues.update(&queue.item.id.to_string(), /* RestUpdateQueue */).await?;
mgr.queues.delete(&queue.item.id.to_string()).await?;
```

</TabItem>
</Tabs>

## Selections

Selections live under `queues.selections` / `Queues.Selections` / `queues.selections` and are
addressed by queue id. Each selection has agent, group, and tag membership.

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
const sel = mgr.queues.selections;
for await (const s of sel.list(queueId)) console.log(s.id);
const created = await sel.create(queueId, { /* RestCreateQueueSelectionBody */ });

await sel.addAgent(queueId, created.item.id, agentId);
await sel.removeAgent(queueId, created.item.id, agentId);
await sel.addGroup(queueId, created.item.id, groupId);
await sel.addTag(queueId, created.item.id, tagId);

// Resolve the agents a queue currently selects:
const selected = await sel.selectAgents(queueId);
```

</TabItem>
<TabItem value="go" label="Go">

```go
sel := mgr.Queues.Selections
for s, err := range sel.List(ctx, queueID, managerapi.ListQueueSelectionsParams{}) {
    if err != nil { log.Fatal(err) }
    fmt.Println(s.Id)
}
created, _ := sel.Create(ctx, queueID, managerapi.RestCreateQueueSelection{})

_, _ = sel.AddAgent(ctx, queueID, created.Item.Id.String(), agentID)
_, _ = sel.RemoveAgent(ctx, queueID, created.Item.Id.String(), agentID)
_, _ = sel.AddGroup(ctx, queueID, created.Item.Id.String(), groupID)
_, _ = sel.AddTag(ctx, queueID, created.Item.Id.String(), tagID)

selected, _ := sel.SelectAgents(ctx, queueID)
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
let sel = &mgr.queues.selections;
for s in sel.list_all(&queue_id).await? {
    println!("{}", s.id);
}
let created = sel.create(&queue_id, /* RestCreateQueueSelection */).await?;
let sid = created.item.id.to_string();

sel.add_agent(&queue_id, &sid, &agent_id).await?;
sel.remove_agent(&queue_id, &sid, &agent_id).await?;
sel.add_group(&queue_id, &sid, &group_id).await?;
sel.add_tag(&queue_id, &sid, &tag_id).await?;

// Resolve the agents a queue currently selects:
let selected = sel.select_agents(&queue_id).await?;
```

</TabItem>
</Tabs>

## Bulk update & global selections

Update several queues at once, list the global queue-selection catalog, or set the priority order of
a queue's selections.

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
await mgr.queues.bulkUpdate({ /* QueueBulkUpdateRequest */ });
const globals = await mgr.queues.globalSelections();
await mgr.queues.selections.setPriority(queueId, [{ /* QueueSelectionPriorityItem */ }]);
```

</TabItem>
<TabItem value="go" label="Go">

```go
_, _ = mgr.Queues.BulkUpdate(ctx, managerapi.QueueBulkUpdateRequest{})
globals, _ := mgr.Queues.GlobalSelections(ctx)
_, _ = mgr.Queues.Selections.SetPriority(ctx, queueID, []managerapi.QueueSelectionPriorityItem{})
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
mgr.queues.bulk_update(/* QueueBulkUpdateRequest */).await?;
let globals = mgr.queues.global_selections().await?;
mgr.queues.selections.set_priority(&queue_id, vec![/* QueueSelectionPriorityItem */]).await?;
```

</TabItem>
</Tabs>

## Reference

- [REST API reference](pathname:///manager-sdk/reference/manager/)
