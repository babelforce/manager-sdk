---
title: Outbound & contacts
sidebar_label: Outbound & contacts
---

# Outbound & contacts

Outbound dialer lists and leads, phonebook entries (with bulk CSV import/export), and outbound
campaigns. Available as `mgr.outbound`, `mgr.phonebook`, and `mgr.campaigns` (same names in all
three SDKs).

## Outbound lists & leads

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
const lists = await mgr.outbound.lists();
const list = await mgr.outbound.createList({ /* CreateOutboundListRequest */ });
await mgr.outbound.addLead(list.item.id, { /* AddOutboundLeadRequest */ });
await mgr.outbound.updateLead(list.item.id, leadId, { /* ... */ });
await mgr.outbound.deleteLead(list.item.id, leadId);
await mgr.outbound.clearList(list.item.id); // remove all leads
```

</TabItem>
<TabItem value="go" label="Go">

```go
lists, _ := mgr.Outbound.Lists(ctx)
list, _ := mgr.Outbound.CreateList(ctx, managerapi.CreateOutboundListRequest{})
_, _ = mgr.Outbound.AddLead(ctx, list.Item.Id.String(), managerapi.AddOutboundLeadRequest{})
_, _ = mgr.Outbound.UpdateLead(ctx, list.Item.Id.String(), leadID, managerapi.AddOutboundLeadRequest{})
_ = mgr.Outbound.DeleteLead(ctx, list.Item.Id.String(), leadID)
_, _ = mgr.Outbound.ClearList(ctx, list.Item.Id.String())
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
let lists = mgr.outbound.lists().await?;
let list = mgr.outbound.create_list(/* CreateOutboundListRequest */).await?;
mgr.outbound.add_lead(&list.item.id.to_string(), /* AddOutboundLeadRequest */).await?;
mgr.outbound.update_lead(&list.item.id.to_string(), &lead_id, /* AddOutboundLeadRequest */).await?;
mgr.outbound.delete_lead(&list.item.id.to_string(), &lead_id).await?;
mgr.outbound.clear_list(&list.item.id.to_string()).await?; // remove all leads
```

</TabItem>
</Tabs>

## Phonebook

CRUD plus bulk CSV `download` / `upload`.

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
for await (const e of mgr.phonebook.list()) console.log(e.id);
await mgr.phonebook.create({ /* RestCreatePhonebookEntryBody */ });
const csv = await mgr.phonebook.download();
await mgr.phonebook.upload(csvFile);
```

</TabItem>
<TabItem value="go" label="Go">

```go
for e, err := range mgr.Phonebook.List(ctx, managerapi.ListPhonebookEntrysParams{}) { /* ... */ }
_, _ = mgr.Phonebook.Create(ctx, managerapi.RestCreatePhonebookEntry{})
csv, _ := mgr.Phonebook.Download(ctx) // []byte
_ = mgr.Phonebook.Upload(ctx, "text/csv", file)
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
use std::path::PathBuf;

for e in mgr.phonebook.list_all().await? {
    println!("{}", e.id);
}
mgr.phonebook.create(/* RestCreatePhonebookEntry */).await?;
let csv = mgr.phonebook.download().await?; // String
mgr.phonebook.upload(PathBuf::from("contacts.csv"), false).await?; // overwrite = false
```

</TabItem>
</Tabs>

## Campaigns

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
const campaigns = await mgr.campaigns.list();
const c = await mgr.campaigns.create({ /* CreateCampaignRequest */ });
await mgr.campaigns.update(c.item.id, { /* UpdateCampaignRequest */ });
await mgr.campaigns.delete(c.item.id);
```

</TabItem>
<TabItem value="go" label="Go">

```go
campaigns, _ := mgr.Campaigns.List(ctx)
c, _ := mgr.Campaigns.Create(ctx, managerapi.CreateCampaignRequest{})
_, _ = mgr.Campaigns.Update(ctx, c.Item.Id.String(), managerapi.UpdateCampaignRequest{})
_ = mgr.Campaigns.Delete(ctx, c.Item.Id.String())
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
let campaigns = mgr.campaigns.list().await?;
let c = mgr.campaigns.create(/* CreateCampaignRequest */).await?;
mgr.campaigns.update(&c.item.id.to_string(), /* UpdateCampaignRequest */).await?;
mgr.campaigns.delete(&c.item.id.to_string()).await?;
```

</TabItem>
</Tabs>

## Lists, leads, attempts & uploads

Beyond list/lead CRUD, the resource exposes outbound list management, lead/attempt browsing,
agent-initiated outbound calls, bulk lead deletion, and CSV lead uploads.

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
const list = await mgr.outbound.getList(listId);
await mgr.outbound.updateList(listId, { /* CreateListRequest */ });
await mgr.outbound.deleteList(listId);

const leads = await mgr.outbound.leadsAll({ listId });
const attempts = await mgr.outbound.attemptsAll({ campaignId });
await mgr.outbound.createAgentCall(agentId, { /* AgentOutboundCallRequest */ });

await mgr.outbound.bulkDeleteLeads(listId, { /* LeadBulkDeleteRequest */ });
await mgr.outbound.uploadLeads(listId, { /* file + mapping */ });
```

</TabItem>
<TabItem value="go" label="Go">

```go
list, _ := mgr.Outbound.GetList(ctx, listID)
_, _ = mgr.Outbound.UpdateList(ctx, listID, managerapi.CreateListRequest{})
_ = mgr.Outbound.DeleteList(ctx, listID)

leads, _ := mgr.Outbound.LeadsAll(ctx, managerapi.ListOutboundLeadsParams{})
attempts, _ := mgr.Outbound.AttemptsAll(ctx, managerapi.ListOutboundAttemptsParams{})
_, _ = mgr.Outbound.CreateAgentCall(ctx, agentID, managerapi.AgentOutboundCallRequest{})
_, _ = mgr.Outbound.BulkDeleteLeads(ctx, listID, managerapi.LeadBulkDeleteRequest{})
_, _ = mgr.Outbound.UploadLeads(ctx, listID, "leads.csv", file, manager.UploadLeadsOptions{})
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
let list = mgr.outbound.get_list(&list_id).await?;
mgr.outbound.update_list(&list_id, /* CreateListRequest */).await?;
mgr.outbound.delete_list(&list_id).await?;

let leads = mgr.outbound.leads().await?;
let attempts = mgr.outbound.attempts().await?;
mgr.outbound.create_agent_call(&agent_id, /* AgentOutboundCallRequest */).await?;
mgr.outbound.bulk_delete_leads(&list_id, /* LeadBulkDeleteRequest */).await?;
mgr.outbound.upload_leads(&list_id, std::path::PathBuf::from("leads.csv"), None, None, None).await?;
```

</TabItem>
</Tabs>

### Leads in a specific list & phonebook bulk delete

Fetch a single lead or the leads of a specific list (filterable by dial status), and bulk-delete
phonebook entries by id.

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
const lead = await mgr.outbound.getLead(listId, leadId);
const inList = await mgr.outbound.listLeads(listId, { status: "pending" });
await mgr.phonebook.bulkDelete([entryId1, entryId2]);
```

</TabItem>
<TabItem value="go" label="Go">

```go
lead, _ := mgr.Outbound.GetLead(ctx, listID, leadID)
inList, _ := mgr.Outbound.ListLeads(ctx, listID, managerapi.ListLeadsInListParams{})
_, _ = mgr.Phonebook.BulkDelete(ctx, []string{entryID1, entryID2})
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
let lead = mgr.outbound.get_lead(&list_id, &lead_id).await?;
let in_list = mgr.outbound.list_leads(&list_id, None, None).await?;
mgr.phonebook.bulk_delete(vec![entry_id1.clone(), entry_id2.clone()]).await?;
```

</TabItem>
</Tabs>

## Campaign monitoring, leads & lists

Each campaign exposes realtime status/statistics, its hopper and (processed) leads, lead-list
assignment, and a logout-all-agents control.

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
const status = await mgr.campaigns.status(campaignId);
const stats = await mgr.campaigns.statistics(campaignId, { from, to });
const hopper = await mgr.campaigns.hopper(campaignId);
const leads = await mgr.campaigns.leads(campaignId);
const processed = await mgr.campaigns.processedLeads(campaignId);

await mgr.campaigns.setListById(campaignId, listId);   // or setList(id, body) / unsetList(id)
await mgr.campaigns.logoutAllAgents(campaignId);
```

</TabItem>
<TabItem value="go" label="Go">

```go
status, _ := mgr.Campaigns.Status(ctx, campaignID)
stats, _ := mgr.Campaigns.Statistics(ctx, campaignID, nil)
hopper, _ := mgr.Campaigns.Hopper(ctx, campaignID)
leads, _ := mgr.Campaigns.Leads(ctx, campaignID)
processed, _ := mgr.Campaigns.ProcessedLeads(ctx, campaignID)

_, _ = mgr.Campaigns.SetListById(ctx, campaignID, listID)
_, _ = mgr.Campaigns.LogoutAllAgents(ctx, campaignID)
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
let status = mgr.campaigns.status(&campaign_id).await?;
let stats = mgr.campaigns.statistics(&campaign_id, None, None).await?;
let hopper = mgr.campaigns.hopper(&campaign_id).await?;
let leads = mgr.campaigns.leads(&campaign_id).await?;
let processed = mgr.campaigns.processed_leads(&campaign_id).await?;

mgr.campaigns.set_list_by_id(&campaign_id, &list_id).await?;
mgr.campaigns.logout_all_agents(&campaign_id).await?;
```

</TabItem>
</Tabs>

## Reference

- [REST API reference](pathname:///manager-sdk/reference/manager/)
