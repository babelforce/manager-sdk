---
title: Prompts & babeldesk
sidebar_label: Prompts & babeldesk
---

# Prompts & babeldesk

Audio prompts and babeldesk dashboards/widgets. Available as `mgr.prompts` / `mgr.Prompts` /
`mgr.prompts` and `mgr.babeldesk` / `mgr.Babeldesk` / `mgr.babeldesk` (with a nested `widgets`
sub-resource).

## Prompts

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
for await (const p of mgr.prompts.list()) console.log(p.id);
const uploaded = await mgr.prompts.upload(audioFile);
await mgr.prompts.update(uploaded.item.id, { /* RestUpdatePromptBody */ });
await mgr.prompts.delete(uploaded.item.id);
```

</TabItem>
<TabItem value="go" label="Go">

```go
for p, err := range mgr.Prompts.List(ctx, managerapi.ListPromptsParams{}) { /* ... */ }
uploaded, _ := mgr.Prompts.Upload(ctx, "audio/wav", file) // io.Reader
_, _ = mgr.Prompts.Update(ctx, uploaded.Item.Id.String(), managerapi.RestUpdatePrompt{})
_ = mgr.Prompts.Delete(ctx, uploaded.Item.Id.String())
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
use std::path::PathBuf;

for p in mgr.prompts.list_all().await? {
    println!("{}", p.id);
}
let uploaded = mgr.prompts.upload(PathBuf::from("greeting.wav"), None, Some("Greeting")).await?;
mgr.prompts.update(&uploaded.item.id.to_string(), /* RestUpdatePrompt */).await?;
mgr.prompts.delete(&uploaded.item.id.to_string()).await?;
```

</TabItem>
</Tabs>

## babeldesk dashboards & widgets

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
for await (const d of mgr.babeldesk.list()) console.log(d.id);
const dash = await mgr.babeldesk.create({ /* RestCreateBabeldeskBody */ });

for await (const w of mgr.babeldesk.widgets.list()) console.log(w.id);
const widget = await mgr.babeldesk.widgets.create({ /* RestCreateBabeldeskWidgetBody */ });
```

</TabItem>
<TabItem value="go" label="Go">

```go
for d, err := range mgr.Babeldesk.List(ctx, managerapi.ListBabeldesksParams{}) { /* ... */ }
dash, _ := mgr.Babeldesk.Create(ctx, managerapi.RestCreateBabeldesk{})

for w, err := range mgr.Babeldesk.Widgets.List(ctx, managerapi.ListBabeldeskWidgetsParams{}) { /* ... */ }
widget, _ := mgr.Babeldesk.Widgets.Create(ctx, managerapi.RestCreateBabeldeskWidget{})
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
for d in mgr.babeldesk.list_all().await? {
    println!("{}", d.id);
}
let dash = mgr.babeldesk.create(/* RestCreateBabeldesk */).await?;

for w in mgr.babeldesk.widgets.list_all().await? {
    println!("{}", w.id);
}
let widget = mgr.babeldesk.widgets.create(/* RestCreateBabeldeskWidget */).await?;
```

</TabItem>
</Tabs>

## Prompt uses & widget settings

Find where a prompt is referenced, or read the settings for a widget type.

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
const uses = await mgr.prompts.uses(promptId);
const settings = await mgr.babeldesk.widgetSettings("babelconnect");
```

</TabItem>
<TabItem value="go" label="Go">

```go
uses, _ := mgr.Prompts.Uses(ctx, promptID)
settings, _ := mgr.Babeldesk.WidgetSettings(ctx, "babelconnect")
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
let uses = mgr.prompts.uses(&prompt_id).await?;
let settings = mgr.babeldesk.widget_settings("babelconnect").await?;
```

</TabItem>
</Tabs>

## Reference

- [REST API reference](pathname:///manager-sdk/reference/manager/)
