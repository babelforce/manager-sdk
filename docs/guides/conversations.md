---
title: Conversations & sessions
sidebar_label: Conversations & sessions
---

# Conversations & sessions

Conversations (with their events and session variables) and the standalone call/automation session
store. Available as `mgr.conversations` / `mgr.Conversations` / `mgr.conversations` and
`mgr.sessions` / `mgr.Sessions` / `mgr.sessions`.

## Conversations

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
for await (const c of mgr.conversations.list()) console.log(c.id);
const created = await mgr.conversations.create({ /* RestCreateConversationBody */ });
await mgr.conversations.update(created.item.id, { /* RestUpdateConversationBody */ });
await mgr.conversations.delete(created.item.id);
```

</TabItem>
<TabItem value="go" label="Go">

```go
for c, err := range mgr.Conversations.List(ctx, managerapi.ListConversationsParams{}) { /* ... */ }
created, _ := mgr.Conversations.Create(ctx, managerapi.RestCreateConversation{})
_, _ = mgr.Conversations.Update(ctx, created.Item.Id.String(), managerapi.RestUpdateConversation{})
_ = mgr.Conversations.Delete(ctx, created.Item.Id.String())
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
for c in mgr.conversations.list_all().await? {
    println!("{}", c.id);
}
let created = mgr.conversations.create(/* RestCreateConversation */).await?;
mgr.conversations.update(&created.item.id.to_string(), /* RestUpdateConversation */).await?;
mgr.conversations.delete(&created.item.id.to_string()).await?;
```

</TabItem>
</Tabs>

## Events & session variables

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
const events = await mgr.conversations.events(conversationId);

const session = await mgr.conversations.getSession(conversationId);
await mgr.conversations.updateSession(conversationId, { /* ConversationSessionVariables */ });
```

</TabItem>
<TabItem value="go" label="Go">

```go
events, _ := mgr.Conversations.Events(ctx, conversationID)

session, _ := mgr.Conversations.GetSession(ctx, conversationID)
_, _ = mgr.Conversations.UpdateSession(ctx, conversationID, managerapi.ConversationSessionVariables{})
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
let events = mgr.conversations.events(&conversation_id).await?;

let session = mgr.conversations.get_session(&conversation_id).await?;
mgr.conversations.update_session(&conversation_id, std::collections::HashMap::from([("foo".to_string(), serde_json::json!("bar"))])).await?;
```

</TabItem>
</Tabs>

### Append events, open/close & event timeline

Append a custom event, open or close a conversation, fetch its first/latest event, or page the
global event stream across all conversations.

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
await mgr.conversations.addEvent(conversationId, { /* ConversationEventRequest */ });
await mgr.conversations.open(conversationId);
await mgr.conversations.close(conversationId);
const first = await mgr.conversations.firstEvent(conversationId);
const latest = await mgr.conversations.latestEvent(conversationId);
for await (const e of mgr.conversations.allEvents()) console.log(e.id);
```

</TabItem>
<TabItem value="go" label="Go">

```go
_, _ = mgr.Conversations.AddEvent(ctx, conversationID, managerapi.ConversationEventRequest{})
_, _ = mgr.Conversations.Open(ctx, conversationID)
_, _ = mgr.Conversations.Close(ctx, conversationID)
first, _ := mgr.Conversations.FirstEvent(ctx, conversationID)
latest, _ := mgr.Conversations.LatestEvent(ctx, conversationID)
for e, err := range mgr.Conversations.AllEvents(ctx, managerapi.ListAllConversationEventsParams{}) { /* ... */ }
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
mgr.conversations.add_event(&conversation_id, /* ConversationEventRequest */).await?;
mgr.conversations.open(&conversation_id).await?;
mgr.conversations.close(&conversation_id).await?;
let first = mgr.conversations.first_event(&conversation_id).await?;
let latest = mgr.conversations.latest_event(&conversation_id).await?;
for e in mgr.conversations.all_events().await? { println!("{}", e.id); }
```

</TabItem>
</Tabs>

## Sessions

The standalone session store at `/api/v2/sessions`.

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
const created = await mgr.sessions.create();
const session = await mgr.sessions.get(sessionId);
await mgr.sessions.updateVariables(sessionId, { /* UpdateSessionVariablesRequest */ });
```

</TabItem>
<TabItem value="go" label="Go">

```go
created, _ := mgr.Sessions.Create(ctx)
session, _ := mgr.Sessions.Get(ctx, sessionID)
_, _ = mgr.Sessions.UpdateVariables(ctx, sessionID, managerapi.UpdateSessionVariablesRequest{})
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
let created = mgr.sessions.create().await?;
let session = mgr.sessions.get(&session_id).await?;
mgr.sessions.update_variables(&session_id, std::collections::HashMap::from([("foo".to_string(), serde_json::json!("bar"))])).await?;
```

</TabItem>
</Tabs>

## Reference

- [REST API reference](pathname:///manager-sdk/reference/manager/)
