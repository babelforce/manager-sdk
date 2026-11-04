---
title: Telephony
sidebar_label: Telephony
---

# Telephony

Call control plus the SMS, service-number, and conference resources (v2 manager API). Call
**reporting** has its own [guide](/guides/call-reporting); this page covers the live/operational
surface.

## Call control

`mgr.calls` / `mgr.Calls` / `mgr.calls` — fetch a call, hang it up, create an inbound test call, and
set call session variables.

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
const { item: call } = await mgr.calls.get(callId);
await mgr.calls.hangup(callId);
const test = await mgr.calls.createTestCall({ /* CreateTestCall */ });
await mgr.calls.setSessionVariables(callId, { variables: { "app.customerId": "abc-123" } });
```

</TabItem>
<TabItem value="go" label="Go">

```go
call, _ := mgr.Calls.Get(ctx, callID)
_, _ = mgr.Calls.Hangup(ctx, callID)
test, _ := mgr.Calls.CreateTestCall(ctx, managerapi.CreateTestCall{})
_, _ = mgr.Calls.SetSessionVariables(ctx, callID, managerapi.SetCallSessionVariablesRequest{Variables: &map[string]interface{}{"app.customerId": "abc-123"}})
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
let call = mgr.calls.get(&call_id).await?;
mgr.calls.hangup(&call_id).await?;
let test = mgr.calls.create_test_call(/* CreateTestCallRequest */).await?;

use babelforce_manager_sdk::gen::manager::models::SetCallSessionVariablesRequest;
mgr.calls.set_session_variables(&call_id, SetCallSessionVariablesRequest {
    variables: Some(std::collections::HashMap::from([("app.customerId".to_string(), serde_json::json!("abc-123"))])),
}).await?;
```

</TabItem>
</Tabs>

:::note
Session-variable keys must be prefixed with `app.` to take effect — keys without it are ignored by
the API.
:::

### Cancel & queue calls

Cancel a call, list the calls currently waiting in a queue, or request a callback for a queued
caller.

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
await mgr.calls.cancel(callId);
for await (const q of mgr.calls.listQueued(queueId)) console.log(q.id);
await mgr.calls.queueCallback(queueId, { /* QueueCallbackRequest */ });
```

</TabItem>
<TabItem value="go" label="Go">

```go
_, _ = mgr.Calls.Cancel(ctx, callID)
for q, err := range mgr.Calls.ListQueued(ctx, queueID, managerapi.ListQueuedCallsParams{}) { /* ... */ }
_, _ = mgr.Calls.QueueCallback(ctx, queueID, managerapi.QueueCallbackRequest{})
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
mgr.calls.cancel(&call_id).await?;
for q in mgr.calls.list_queued(&queue_id).await? { println!("{}", q.id); }
mgr.calls.queue_callback(&queue_id, /* QueueCallbackRequest */).await?;
```

</TabItem>
</Tabs>

## SMS

`mgr.sms` / `mgr.Sms` / `mgr.sms` — list (auto-paginated) and fetch SMS records.

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
for await (const sms of mgr.sms.list()) console.log(sms.id);
const { item } = await mgr.sms.get(smsId);
```

</TabItem>
<TabItem value="go" label="Go">

```go
for sms, err := range mgr.Sms.List(ctx, managerapi.ListSmssParams{}) {
    if err != nil { log.Fatal(err) }
    fmt.Println(sms.Id)
}
got, _ := mgr.Sms.Get(ctx, smsID)
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
for sms in mgr.sms.list_all().await? {
    println!("{}", sms.id);
}
let got = mgr.sms.get(&sms_id).await?;
```

</TabItem>
</Tabs>

### Send, delete & reporting

Send an outbound SMS, simulate an inbound one (`testInbound`), delete a record, or page the SMS
reporting stream.

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
const sent = await mgr.sms.send({ /* SmsSendRequest */ });
await mgr.sms.testInbound({ /* SmsSendRequest */ });
await mgr.sms.delete(sent.item.id);
for await (const sms of mgr.sms.report()) console.log(sms.id);
```

</TabItem>
<TabItem value="go" label="Go">

```go
sent, _ := mgr.Sms.Send(ctx, managerapi.SmsSendRequest{})
_, _ = mgr.Sms.TestInbound(ctx, managerapi.SmsSendRequest{})
_, _ = mgr.Sms.Delete(ctx, sent.Item.Id.String())
for sms, err := range mgr.Sms.Report(ctx, managerapi.ReportSmsParams{}) { /* ... */ }
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
let sent = mgr.sms.send(/* SmsSendRequest */).await?;
mgr.sms.test_inbound(/* SmsSendRequest */).await?;
mgr.sms.delete(&sent.item.id.to_string()).await?;
for sms in mgr.sms.report().await? { println!("{}", sms.id); }
```

</TabItem>
</Tabs>

## Service numbers

`mgr.numbers` / `mgr.Numbers` / `mgr.numbers` — list, fetch, and update service (phone) numbers, and add tags.

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
const all = await mgr.numbers.listAll();
const { item } = await mgr.numbers.get(numberId);
await mgr.numbers.addTags(numberId, ["vip", "sales"]);
await mgr.numbers.update(numberId, { /* service-number fields */ });
```

</TabItem>
<TabItem value="go" label="Go">

```go
all, _ := mgr.Numbers.ListAll(ctx, managerapi.ListServiceNumbersParams{})
got, _ := mgr.Numbers.Get(ctx, numberID)
_, _ = mgr.Numbers.AddTags(ctx, numberID, []managerapi.Tag{"vip", "sales"})
_, _ = mgr.Numbers.Update(ctx, numberID, map[string]any{ /* fields */ })
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
use std::collections::HashMap;

let all = mgr.numbers.list_all().await?;
let got = mgr.numbers.get(&number_id).await?;
mgr.numbers.add_tags(&number_id, vec!["vip".into(), "sales".into()]).await?;
mgr.numbers.update(&number_id, HashMap::new()).await?;
```

</TabItem>
</Tabs>

## Conferences

`mgr.conferences` / `mgr.Conferences` / `mgr.conferences` — list and fetch conferences.

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
for await (const conf of mgr.conferences.list()) console.log(conf.id);
const { item } = await mgr.conferences.get(conferenceId);
```

</TabItem>
<TabItem value="go" label="Go">

```go
for conf, err := range mgr.Conferences.List(ctx, managerapi.ListConferencesParams{}) {
    if err != nil { log.Fatal(err) }
    fmt.Println(conf.Id)
}
got, _ := mgr.Conferences.Get(ctx, conferenceID)
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
for conf in mgr.conferences.list_all().await? {
    println!("{}", conf.id);
}
let got = mgr.conferences.get(&conference_id).await?;
```

</TabItem>
</Tabs>

## Reference

- [REST API reference](pathname:///manager-sdk/reference/manager/)
