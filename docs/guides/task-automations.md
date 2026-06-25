---
title: Task automations
sidebar_label: Task automations
---

# Task automations

Create and manage tasks (v3 task-automation API), recurring schedules, scripts, secrets, selection
config, and task metrics. Available as `mgr.tasks` / `mgr.Tasks` / `mgr.tasks`. (In Rust, schedules
are a top-level `mgr.schedules`
namespace rather than `tasks.schedules`, since the task-schedule API is a separate spec.)

## Create a task

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
const task = await mgr.tasks.create({ /* SubmitTaskBody */ });
const task2 = await mgr.tasks.createFromTemplate("callback", { /* overrides */ });
```

</TabItem>
<TabItem value="go" label="Go">

```go
task, err := mgr.Tasks.Create(ctx, taskautomation.SubmitTask{ /* … */ })
task2, err := mgr.Tasks.CreateFromTemplate(ctx, "callback", map[string]any{ /* overrides */ })
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
let task = mgr.tasks.create(/* SubmitTask */).await?;
let task2 = mgr.tasks.create_from_template("callback", serde_json::json!({ /* variables */ })).await?;
```

</TabItem>
</Tabs>

## List tasks

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
for await (const task of mgr.tasks.list({ filter: "state==active" })) {
  console.log(task.id);
}
const all = await mgr.tasks.listAll();
```

</TabItem>
<TabItem value="go" label="Go">

```go
for task, err := range mgr.Tasks.List(ctx, manager.ListTasksQuery{}) {
    if err != nil { log.Fatal(err) }
    fmt.Println(task.Id)
}
all, _ := mgr.Tasks.ListAll(ctx, manager.ListTasksQuery{})
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
let tasks = mgr.tasks.list(Some("state==active")).await?;
for task in tasks.records.unwrap_or_default() {
    println!("{:?}", task.id);
}
```

</TabItem>
</Tabs>

## Get, update, interrupt

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
const task = await mgr.tasks.get(taskId);
await mgr.tasks.update(taskId, { /* UpdateTaskBody */ });
await mgr.tasks.interrupt(taskId, "Canceled"); // Canceled | Completed | Failed
```

</TabItem>
<TabItem value="go" label="Go">

```go
task, _ := mgr.Tasks.Get(ctx, taskID)
_, _ = mgr.Tasks.Update(ctx, taskID, updated)
_ = mgr.Tasks.Interrupt(ctx, taskID, manager.InterruptCancel, action)
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
use babelforce_manager_sdk::gen::task_automation::models::InterruptionTargetStates;

let task = mgr.tasks.get(&task_id).await?;
mgr.tasks.update(&task_id, /* Task */).await?;
mgr.tasks.interrupt(&task_id, InterruptionTargetStates::Canceled, None).await?;
```

</TabItem>
</Tabs>

## Schedules

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
const schedules = await mgr.tasks.schedules.list();
await mgr.tasks.schedules.create({ /* SubmitTaskScheduleBody */ });
await mgr.tasks.schedules.get("nightly-report");
await mgr.tasks.schedules.delete("nightly-report");
```

</TabItem>
<TabItem value="go" label="Go">

```go
list, _ := mgr.Tasks.Schedules.List(ctx)
_ = mgr.Tasks.Schedules.Create(ctx, schedule)
sched, _ := mgr.Tasks.Schedules.Get(ctx, "nightly-report")
_ = mgr.Tasks.Schedules.Delete(ctx, "nightly-report")
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
let schedules = mgr.schedules.list().await?;
mgr.schedules.create(/* SubmitTaskSchedule */).await?;
let sched = mgr.schedules.get("nightly-report").await?;
mgr.schedules.delete("nightly-report").await?;
```

</TabItem>
</Tabs>

## Scripts, secrets & selection config

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
await mgr.tasks.scripts.list("javascript");
await mgr.tasks.scripts.submit("javascript", { /* SubmitScript */ });

await mgr.tasks.secrets.listPrefixes();
await mgr.tasks.secrets.create("my-prefix", { token: "…" });

const cfg = await mgr.tasks.selectionConfig.read();
await mgr.tasks.selectionConfig.update({ /* SelectionConfigurationRequest */ });
```

</TabItem>
<TabItem value="go" label="Go">

```go
_, _ = mgr.Tasks.Scripts.List(ctx, taskautomationapi.ScriptType("javascript"))
_, _ = mgr.Tasks.Scripts.Submit(ctx, taskautomationapi.ScriptType("javascript"), taskautomationapi.Script{})

_, _ = mgr.Tasks.Secrets.ListPrefixes(ctx)
_ = mgr.Tasks.Secrets.Create(ctx, "my-prefix", taskautomationapi.CreateSecretsJSONRequestBody{"token": "…"})

cfg, _ := mgr.Tasks.SelectionConfig.Read(ctx)
_, _ = mgr.Tasks.SelectionConfig.Update(ctx, taskautomationapi.UpdateSelectionConfigurationJSONRequestBody{})
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
use std::collections::HashMap;
use babelforce_manager_sdk::gen::task_automation::models::ScriptType;

mgr.tasks.scripts.list(ScriptType::Js).await?;
mgr.tasks.scripts.submit(ScriptType::Js, /* Script */).await?;

mgr.tasks.secrets.list_prefixes().await?;
mgr.tasks.secrets.create("my-prefix", HashMap::from([("token".into(), "…".into())])).await?;

let cfg = mgr.tasks.selection_config.read().await?;
mgr.tasks.selection_config.update(/* AccountSelectionConfiguration */).await?;
```

</TabItem>
</Tabs>

## Metrics, usage, logs & agent actions

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
const journal = await mgr.tasks.metrics.taskJournal(taskId);
const usage = await mgr.tasks.usage();
const logs = await mgr.tasks.logs();

await mgr.tasks.agentAction(taskId, "Accept", { /* ManualAction */ });
await mgr.tasks.setAgentLock("unlock");
await mgr.tasks.testAction({ /* TestActionRequest */ });
```

</TabItem>
<TabItem value="go" label="Go">

```go
journal, _ := mgr.Tasks.Metrics.TaskJournal(ctx, taskID)
usage, _ := mgr.Tasks.Usage(ctx)
logs, _ := mgr.Tasks.Logs(ctx)

_, _ = mgr.Tasks.AgentAction(ctx, taskID, taskautomationapi.AgentActions("Accept"), taskautomationapi.ManualActionRequest{})
_, _ = mgr.Tasks.SetAgentLock(ctx, taskautomationapi.AgentLocking("unlock"))
_, _ = mgr.Tasks.TestAction(ctx, taskautomationapi.TestAction{})
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
let journal = mgr.tasks.metrics.task_journal(&task_id).await?;
let usage = mgr.tasks.usage().await?;
let logs = mgr.tasks.logs().await?;

mgr.tasks.agent_action(&task_id, /* AgentActions */, None).await?;
mgr.tasks.set_agent_lock(/* AgentLocking */).await?;
mgr.tasks.test_action(/* TestAction */).await?;
```

</TabItem>
</Tabs>

## Reference

- [Task Automation API reference](pathname:///manager-sdk/reference/task-automation/) — `tasks`.
- [Task Schedule API reference](pathname:///manager-sdk/reference/task-schedule/) — the `schedules` namespace.
