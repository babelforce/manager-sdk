---
title: Agents
sidebar_label: Agents
---

# Agents

Manage agents and agent groups (v2 manager API) — CRUD, presence and status, lifecycle controls,
CSV import/export, activity logs, and bulk actions. Available as `mgr.agents` (TypeScript) /
`mgr.Agents` (Go) / `mgr.agents` (Rust), with a nested `groups` sub-resource.

## List agents (auto-paginated)

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
for await (const agent of mgr.agents.list({ enabled: true })) {
  console.log(agent.id, agent.name);
}
const all = await mgr.agents.listAll({ q: "support" });
```

</TabItem>
<TabItem value="go" label="Go">

```go
for agent, err := range mgr.Agents.List(ctx, manager.ListAgentsQuery{}) {
    if err != nil { log.Fatal(err) }
    fmt.Println(agent.Id, agent.Name)
}
all, _ := mgr.Agents.ListAll(ctx, manager.ListAgentsQuery{})
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
for agent in mgr.agents.list_all().await? {
    println!("{} {}", agent.id, agent.name);
}
```

</TabItem>
</Tabs>

Filters: free-text `q`, `enabled`, `name`, `number`, `sourceId`, `state` (line status), `source`,
and `groupIds`. (Rust's `list_all` collects every page; per-field filters land with the typed-query
follow-up.)

## Create, get, update, delete

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
const created = await mgr.agents.create({ /* RestCreateAgentBody */ });
const agent = await mgr.agents.get(created.item.id);
await mgr.agents.update(agent.item.id, { /* RestUpdateAgentBody */ });
await mgr.agents.delete(agent.item.id);
```

</TabItem>
<TabItem value="go" label="Go">

```go
created, _ := mgr.Agents.Create(ctx, managerapi.RestCreateAgent{ /* … */ })
agent, _ := mgr.Agents.Get(ctx, created.Item.Id.String())
_, _ = mgr.Agents.Update(ctx, agent.Item.Id.String(), managerapi.RestUpdateAgent{ /* … */ })
_ = mgr.Agents.Delete(ctx, agent.Item.Id.String())
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
let created = mgr.agents.create(/* RestCreateAgent */).await?;
let agent = mgr.agents.get(&created.item.id.to_string()).await?;
mgr.agents.update(&agent.item.id.to_string(), /* RestUpdateAgent */).await?;
mgr.agents.delete(&agent.item.id.to_string()).await?;
```

</TabItem>
</Tabs>

## Update status

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
const status = await mgr.agents.updateStatus(agentId, { enabled: true });
console.log(status.line_status, status.display_status);
```

</TabItem>
<TabItem value="go" label="Go">

```go
status, _ := mgr.Agents.UpdateStatus(ctx, agentID, managerapi.UpdateAgentStatusRequest{Enabled: &enabled})
fmt.Println(status.LineStatus, status.DisplayStatus)
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
let status = mgr.agents.update_status(&agent_id, /* UpdateAgentStatusRequest */).await?;
println!("{:?} {:?}", status.line_status, status.display_status);
```

</TabItem>
</Tabs>

## Presence, status & lifecycle

Manage the workspace's named **agent presences** (custom away/availability states), inspect an
agent's aggregate status and the list of available statuses, and drive an agent's lifecycle
(enable / disable / force-hangup the active call).

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
const presences = await mgr.agents.presences();
const p = await mgr.agents.createPresence({ /* AgentPresenceWriteBody */ });
await mgr.agents.updatePresence(p.item.name, { /* … */ });
await mgr.agents.getPresence(p.item.name);
await mgr.agents.deletePresence(p.item.name);

const statuses = await mgr.agents.availableStatuses();
const status = await mgr.agents.getStatus(agentId);

await mgr.agents.enable(agentId);
await mgr.agents.disable(agentId);
await mgr.agents.hangupCall(agentId);
```

</TabItem>
<TabItem value="go" label="Go">

```go
presences, _ := mgr.Agents.Presences(ctx)
p, _ := mgr.Agents.CreatePresence(ctx, managerapi.AgentPresenceWriteBody{})
_, _ = mgr.Agents.UpdatePresence(ctx, p.Item.Name, managerapi.AgentPresenceWriteBody{})
_, _ = mgr.Agents.GetPresence(ctx, p.Item.Name)
_, _ = mgr.Agents.DeletePresence(ctx, p.Item.Name)

statuses, _ := mgr.Agents.AvailableStatuses(ctx)
status, _ := mgr.Agents.GetStatus(ctx, agentID)

_, _ = mgr.Agents.Enable(ctx, agentID)
_, _ = mgr.Agents.Disable(ctx, agentID)
_, _ = mgr.Agents.HangupCall(ctx, agentID)
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
let presences = mgr.agents.presences().await?;
let p = mgr.agents.create_presence(/* AgentPresenceWriteBody */).await?;
mgr.agents.update_presence(&p.item.name, /* … */).await?;
mgr.agents.get_presence(&p.item.name).await?;
mgr.agents.delete_presence(&p.item.name).await?;

let statuses = mgr.agents.available_statuses().await?;
let status = mgr.agents.get_status(&agent_id).await?;

mgr.agents.enable(&agent_id).await?;
mgr.agents.disable(&agent_id).await?;
mgr.agents.hangup_call(&agent_id).await?;
```

</TabItem>
</Tabs>

## Agent groups

Agent groups live under `agents.groups` / `Agents.Groups` / `agents.groups`.

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
for await (const group of mgr.agents.groups.list()) console.log(group.name);
const group = await mgr.agents.groups.create({ /* RestCreateAgentGroupBody */ });
await mgr.agents.groups.addAgent(group.item.id, agentId);
await mgr.agents.groups.delete(group.item.id);
```

</TabItem>
<TabItem value="go" label="Go">

```go
for group, err := range mgr.Agents.Groups.List(ctx, 0) {
    if err != nil { log.Fatal(err) }
    fmt.Println(group.Name)
}
group, _ := mgr.Agents.Groups.Create(ctx, managerapi.RestCreateAgentGroup{ /* … */ })
_, _ = mgr.Agents.Groups.AddAgent(ctx, group.Item.Id.String(), agentID)
_ = mgr.Agents.Groups.Delete(ctx, group.Item.Id.String())
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
for group in mgr.agents.groups.list_all().await? {
    println!("{}", group.name);
}
let group = mgr.agents.groups.create(/* RestCreateAgentGroup */).await?;
mgr.agents.groups.add_agent(&group.item.id.to_string(), &agent_id).await?;
mgr.agents.groups.delete(&group.item.id.to_string()).await?;
```

</TabItem>
</Tabs>

## Provisioning, logs & bulk actions

Bulk enable/disable/delete agents, CSV import/export (with a validate-only dry run and an async
import job), per-agent and global activity logs, push notifications, password updates, and group
membership management.

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
await mgr.agents.bulkAction("enable", { ids: [id1, id2] });
const csv = await mgr.agents.export("csv");
const check = await mgr.agents.validateImport(csvFile);   // dry run
const res = await mgr.agents.import({ file: csvFile, format: "csv", createOnly: true });
const job = await mgr.agents.getImportJob(jobId);

for await (const entry of mgr.agents.logs(agentId, { from, to })) console.log(entry.id);
for await (const entry of mgr.agents.allLogs()) console.log(entry.id);

await mgr.agents.push({ /* AgentPushRequest */ });
await mgr.agents.updatePassword(agentId, { /* AgentPasswordUpdateRequest */ });

for await (const a of mgr.agents.groups.listAgents(groupId)) console.log(a.id);
await mgr.agents.groups.removeAgent(groupId, agentId);
await mgr.agents.groups.bulkDelete([groupId1, groupId2]);
```

</TabItem>
<TabItem value="go" label="Go">

```go
_, _ = mgr.Agents.BulkAction(ctx, "enable", managerapi.AgentBulkRequest{Ids: ids})
csv, _ := mgr.Agents.Export(ctx, "csv") // []byte
_, _ = mgr.Agents.ValidateImport(ctx, "text/csv", file)
_, _ = mgr.Agents.Import(ctx, "text/csv", file, &managerapi.ImportAgentsParams{Format: "csv"})
job, _ := mgr.Agents.GetImportJob(ctx, jobID)

for entry, err := range mgr.Agents.Logs(ctx, agentID, managerapi.ListAgentLogsParams{}) { /* ... */ }
for entry, err := range mgr.Agents.AllLogs(ctx, managerapi.ListAllAgentLogsParams{}) { /* ... */ }

_, _ = mgr.Agents.Push(ctx, managerapi.AgentPushRequest{})
_, _ = mgr.Agents.UpdatePassword(ctx, agentID, managerapi.AgentPasswordUpdateRequest{})

for a, err := range mgr.Agents.Groups.ListAgents(ctx, groupID, managerapi.ListAgentsInGroupParams{}) { /* ... */ }
_, _ = mgr.Agents.Groups.RemoveAgent(ctx, groupID, agentID)
_, _ = mgr.Agents.Groups.BulkDelete(ctx, []string{groupID1, groupID2})
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
use std::path::PathBuf;

mgr.agents.bulk_action("enable", /* AgentBulkRequest */).await?;
let csv = mgr.agents.export("csv").await?; // String
mgr.agents.validate_import(PathBuf::from("agents.csv")).await?;
mgr.agents.import_agents("csv", PathBuf::from("agents.csv"), None, Some(true), None, None).await?;
let job = mgr.agents.get_import_job(&job_id).await?;

for entry in mgr.agents.logs(&agent_id, None, None).await? { println!("{}", entry.id); }
for entry in mgr.agents.all_logs().await? { println!("{}", entry.id); }

mgr.agents.push(/* AgentPushRequest */).await?;
mgr.agents.update_password(&agent_id, /* AgentPasswordUpdateRequest */).await?;

for a in mgr.agents.groups.list_agents(&group_id).await? { println!("{}", a.id); }
mgr.agents.groups.remove_agent(&group_id, &agent_id).await?;
mgr.agents.groups.bulk_delete(vec![group_id1.clone(), group_id2.clone()]).await?;
```

</TabItem>
</Tabs>

## Reference

- [REST API reference](pathname:///manager-sdk/reference/manager/)
