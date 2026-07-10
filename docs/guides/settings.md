---
title: Global settings
sidebar_label: Global settings
---

# Global settings

Read and write account-level settings (v2 manager API). Available as `mgr.settings` /
`mgr.Settings` / `mgr.settings`, grouped by scope.

Groups: `app` (`customerLogging`, `conversations`, `integrations`, `agentStatus`),
`telephony` (`agentInbound`, `agentOutbound`, `agentRecording`, `agentWrapup`, `postCall`),
`audit` (`default`), `ui` (`i18n`), `retention` (`periods`).

In TypeScript and Go each group is read/written as its **data payload** — the SDK handles the
`{ scope, key }` envelope. In Rust each section is a flat `mgr.settings.<scope>_<section>()` reader
and a `set_<scope>_<section>(..)` writer that return the section's typed response (read its
`item.data`).

## Read a setting

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
const recording = await mgr.settings.telephony.agentRecording.get();
console.log(recording.alwaysRecordOutbound);

const i18n = await mgr.settings.ui.i18n.get();
```

</TabItem>
<TabItem value="go" label="Go">

```go
recording, err := mgr.Settings.Telephony.AgentRecording.Get(ctx)
// recording.AlwaysRecordOutbound ...

i18n, _ := mgr.Settings.Ui.I18n.Get(ctx)
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
let recording = mgr.settings.telephony_agent_recording().await?;
// recording.item.data ...

let i18n = mgr.settings.ui_i18n().await?;
```

</TabItem>
</Tabs>

## Update a setting

`update` returns the new value. The update payload is the request type (all fields optional, so you
can send just what you want to change).

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
const updated = await mgr.settings.app.customerLogging.update({ enabled: true });

await mgr.settings.telephony.agentWrapup.update({
  cancelWrapUp: true,
  maxExtension: 30,
});
```

</TabItem>
<TabItem value="go" label="Go">

```go
enabled := true
_, _ = mgr.Settings.App.CustomerLogging.Update(ctx, managerapi.SettingsAppCustomerLoggingRequestData{
    Enabled: &enabled,
})

cancel, maxExt := true, 30
_, _ = mgr.Settings.Telephony.AgentWrapup.Update(ctx, managerapi.SettingsTelephonyAgentWrapupRequestData{
    CancelWrapUp: &cancel,
    MaxExtension: &maxExt,
})
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
mgr.settings.set_app_customer_logging(/* SettingsAppCustomerLoggingRequest */).await?;
mgr.settings.set_telephony_agent_wrapup(/* SettingsTelephonyAgentWrapupRequest */).await?;
```

</TabItem>
</Tabs>

## List & clear settings generically

Beyond the typed section accessors, you can list or clear settings by scope/key without knowing the
section type — useful for admin tooling that walks the whole configuration.

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
const all = await mgr.settings.listAll();
const appScope = await mgr.settings.listInScope("app");
await mgr.settings.clear("app", "customer.logging");
await mgr.settings.clearInScope("telephony");
await mgr.settings.clearAll();
```

</TabItem>
<TabItem value="go" label="Go">

```go
all, _ := mgr.Settings.ListAll(ctx)
appScope, _ := mgr.Settings.ListInScope(ctx, "app")
_, _ = mgr.Settings.Clear(ctx, "app", "customer.logging")
_, _ = mgr.Settings.ClearInScope(ctx, "telephony")
_, _ = mgr.Settings.ClearAll(ctx)
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
let all = mgr.settings.list_all().await?;
let app_scope = mgr.settings.list_in_scope("app").await?;
mgr.settings.clear("app", "customer.logging").await?;
mgr.settings.clear_in_scope("telephony").await?;
mgr.settings.clear_all().await?;
```

</TabItem>
</Tabs>

## Reference

- [REST API reference](pathname:///manager-sdk/reference/manager/)
