---
title: Business hours & calendars
sidebar_label: Business hours & calendars
---

# Business hours & calendars

Define business-hours rules and calendars (with special dates) used by routing and automations.
Available as `mgr.businessHours` / `mgr.BusinessHours` / `mgr.business_hours` and `mgr.calendars` /
`mgr.Calendars` / `mgr.calendars`.

## Business hours

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
for await (const b of mgr.businessHours.list()) console.log(b.id);
const created = await mgr.businessHours.create({ /* RestCreateBusinessHourBody */ });
await mgr.businessHours.update(created.item.id, { /* RestUpdateBusinessHourBody */ });
await mgr.businessHours.delete(created.item.id);
```

</TabItem>
<TabItem value="go" label="Go">

```go
for b, err := range mgr.BusinessHours.List(ctx, managerapi.ListBusinessHoursParams{}) { /* ... */ }
created, _ := mgr.BusinessHours.Create(ctx, managerapi.RestCreateBusinessHour{})
_, _ = mgr.BusinessHours.Update(ctx, created.Item.Id.String(), managerapi.RestUpdateBusinessHour{})
_ = mgr.BusinessHours.Delete(ctx, created.Item.Id.String())
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
for b in mgr.business_hours.list_all().await? {
    println!("{}", b.id);
}
let created = mgr.business_hours.create(/* RestCreateBusinessHour */).await?;
mgr.business_hours.update(&created.item.id.to_string(), /* RestUpdateBusinessHour */).await?;
mgr.business_hours.delete(&created.item.id.to_string()).await?;
```

</TabItem>
</Tabs>

## Calendars

CRUD plus calendar dates (`getDates` / `addDate`).

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
for await (const c of mgr.calendars.list()) console.log(c.id);
const created = await mgr.calendars.create({ /* RestCreateCalendarBody */ });
await mgr.calendars.getDates(created.item.id);
await mgr.calendars.addDate(created.item.id, { /* CalendarDateBody */ });
await mgr.calendars.delete(created.item.id);
```

</TabItem>
<TabItem value="go" label="Go">

```go
for c, err := range mgr.Calendars.List(ctx, managerapi.ListCalendarsParams{}) { /* ... */ }
created, _ := mgr.Calendars.Create(ctx, managerapi.RestCreateCalendar{})
dates, _ := mgr.Calendars.GetDates(ctx, created.Item.Id.String())
_, _ = mgr.Calendars.AddDate(ctx, created.Item.Id.String(), managerapi.CalendarDateBody{})
_ = mgr.Calendars.Delete(ctx, created.Item.Id.String())
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
for c in mgr.calendars.list_all().await? {
    println!("{}", c.id);
}
let created = mgr.calendars.create(/* RestCreateCalendar */).await?;
mgr.calendars.get_dates(&created.item.id.to_string()).await?;
mgr.calendars.add_date(&created.item.id.to_string(), /* CalendarDateBody */).await?;
mgr.calendars.delete(&created.item.id.to_string()).await?;
```

</TabItem>
</Tabs>

## Ranges, individual dates & bulk operations

Business hours expose their weekly **ranges** (list/add/get/remove) and bulk update/delete across
records; calendars expose individual **dates** (get/update/remove), a `testDate` helper to evaluate
a date against the calendar, and bulk update/delete.

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
await mgr.businessHours.addRanges(bhId, { /* BusinessHourRangesBody */ });
const ranges = await mgr.businessHours.listRanges(bhId);
await mgr.businessHours.getRange(bhId, rangeId);
await mgr.businessHours.removeRange(bhId, rangeId);
await mgr.businessHours.bulkUpdate({ /* BusinessHourBulkUpdateRequest */ });
await mgr.businessHours.bulkDelete([bhId1, bhId2]);

await mgr.calendars.getDate(calId, dateId);
await mgr.calendars.updateDate(calId, dateId, { /* CalendarDateBody */ });
await mgr.calendars.removeDate(calId, dateId);
const test = await mgr.calendars.testDate("2026-12-25");
await mgr.calendars.bulkUpdate({ /* CalendarBulkUpdateRequest */ });
await mgr.calendars.bulkDelete([calId1, calId2]);
```

</TabItem>
<TabItem value="go" label="Go">

```go
_, _ = mgr.BusinessHours.AddRanges(ctx, bhID, managerapi.BusinessHourRangesBody{})
ranges, _ := mgr.BusinessHours.ListRanges(ctx, bhID)
_, _ = mgr.BusinessHours.GetRange(ctx, bhID, rangeID)
_, _ = mgr.BusinessHours.RemoveRange(ctx, bhID, rangeID)
_, _ = mgr.BusinessHours.BulkUpdate(ctx, managerapi.BusinessHourBulkUpdateRequest{})
_, _ = mgr.BusinessHours.BulkDelete(ctx, []string{bhID1, bhID2})

_, _ = mgr.Calendars.GetDate(ctx, calID, dateID)
_, _ = mgr.Calendars.UpdateDate(ctx, calID, dateID, managerapi.CalendarDateBody{})
_, _ = mgr.Calendars.RemoveDate(ctx, calID, dateID)
date := "2026-12-25"
test, _ := mgr.Calendars.TestDate(ctx, &date)
_, _ = mgr.Calendars.BulkUpdate(ctx, managerapi.CalendarBulkUpdateRequest{})
_, _ = mgr.Calendars.BulkDelete(ctx, []string{calID1, calID2})
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
mgr.business_hours.add_ranges(&bh_id, /* BusinessHourRangesBody */).await?;
let ranges = mgr.business_hours.list_ranges(&bh_id).await?;
mgr.business_hours.get_range(&bh_id, &range_id).await?;
mgr.business_hours.remove_range(&bh_id, &range_id).await?;
mgr.business_hours.bulk_update(/* BusinessHourBulkUpdateRequest */).await?;
mgr.business_hours.bulk_delete(vec![bh_id1.clone(), bh_id2.clone()]).await?;

mgr.calendars.get_date(&cal_id, &date_id).await?;
mgr.calendars.update_date(&cal_id, &date_id, /* CalendarDateBody */).await?;
mgr.calendars.remove_date(&cal_id, &date_id).await?;
let test = mgr.calendars.test_date(Some("2026-12-25")).await?;
mgr.calendars.bulk_update(/* CalendarBulkUpdateRequest */).await?;
mgr.calendars.bulk_delete(vec![cal_id1.clone(), cal_id2.clone()]).await?;
```

</TabItem>
</Tabs>

## Reference

- [REST API reference](pathname:///manager-sdk/reference/manager/)
