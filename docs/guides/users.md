---
title: Users & account
sidebar_label: Users & account
---

# Users & account

Manage users, their roles, and password resets (v2 manager API), and read the **current user** and
the accounts they can access. Available as `mgr.users` / `mgr.me` (TypeScript), `mgr.Users` /
`mgr.Me` (Go), and `mgr.users` / `mgr.me` (Rust).

## List, create, enable/disable, delete

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
for await (const user of mgr.users.list()) console.log(user.email);
const all = await mgr.users.listAll({ email: "@acme.com" });

await mgr.users.create({ email: "new.user@acme.com", roles: [] });
await mgr.users.enable(["new.user@acme.com"]);
await mgr.users.disable(["old.user@acme.com"]);
await mgr.users.delete(["old.user@acme.com"]);
```

</TabItem>
<TabItem value="go" label="Go">

```go
for user, err := range mgr.Users.List(ctx, manager.ListUsersQuery{}) {
    if err != nil { log.Fatal(err) }
    fmt.Println(user.Email)
}
_, _ = mgr.Users.Create(ctx, managerapi.CreateManagedUserRequest{Email: "new.user@acme.com"})
_ = mgr.Users.Enable(ctx, []string{"new.user@acme.com"})
_ = mgr.Users.Disable(ctx, []string{"old.user@acme.com"})
_ = mgr.Users.Delete(ctx, []string{"old.user@acme.com"})
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
use babelforce_manager_sdk::gen::manager::models::CreateManagedUserRequest;

let users = mgr.users.list_all().await?;

mgr.users.create(CreateManagedUserRequest::new("new.user@acme.com".into(), vec![])).await?;
mgr.users.enable(vec!["new.user@acme.com".into()]).await?;
mgr.users.disable(vec!["old.user@acme.com".into()]).await?;
mgr.users.delete(vec!["old.user@acme.com".into()]).await?;
```

</TabItem>
</Tabs>

## Roles

List the assignable role names, and grant or revoke roles for users by email.

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
const roles = await mgr.users.listRoles();
await mgr.users.addRoles(["agent@acme.com"], ["agent"]);
await mgr.users.removeRoles(["agent@acme.com"], ["supervisor"]);
```

</TabItem>
<TabItem value="go" label="Go">

```go
roles, _ := mgr.Users.ListRoles(ctx)
_ = mgr.Users.AddRoles(ctx, []string{"agent@acme.com"}, []managerapi.AccountRole{"agent"})
_ = mgr.Users.RemoveRoles(ctx, []string{"agent@acme.com"}, []managerapi.AccountRole{"supervisor"})
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
use babelforce_manager_sdk::gen::manager::models::AccountRole;

let roles = mgr.users.list_roles().await?;
mgr.users.add_roles(vec!["agent@acme.com".into()], vec![AccountRole::Agent]).await?;
mgr.users.remove_roles(vec!["agent@acme.com".into()], vec![AccountRole::Supervisor]).await?;
```

</TabItem>
</Tabs>

## Password resets

Trigger a password-reset email for one or more users:

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
await mgr.users.resetPasswords(["user@acme.com"]);
```

</TabItem>
<TabItem value="go" label="Go">

```go
_ = mgr.Users.ResetPasswords(ctx, []string{"user@acme.com"})
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
mgr.users.reset_passwords(vec!["user@acme.com".into()]).await?;
```

</TabItem>
</Tabs>

## The current user (`me`)

The `me` namespace describes the authenticated principal — useful for "who am I" checks, listing
the accounts a token can reach, and self-service password reset.

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
const { item: user } = await mgr.me.get();
const accounts = await mgr.me.accounts();
await mgr.me.resetPassword();
```

</TabItem>
<TabItem value="go" label="Go">

```go
me, _ := mgr.Me.Get(ctx)
accounts, _ := mgr.Me.Accounts(ctx)
_ = mgr.Me.ResetPassword(ctx)
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
let me = mgr.me.get().await?;
let accounts = mgr.me.accounts().await?;
mgr.me.reset_password().await?;
```

</TabItem>
</Tabs>

## Manager-side user lookups

The `users` resource also exposes the manager-side current principal (`me`) and a lookup by email.

<Tabs groupId="sdk">
<TabItem value="ts" label="TypeScript">

```ts
const me = await mgr.users.me();
const user = await mgr.users.getByEmail("agent@example.com");
```

</TabItem>
<TabItem value="go" label="Go">

```go
me, _ := mgr.Users.Me(ctx)
user, _ := mgr.Users.GetByEmail(ctx, "agent@example.com")
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
let me = mgr.users.me().await?;
let user = mgr.users.get_by_email("agent@example.com").await?;
```

</TabItem>
</Tabs>

## Reference

- [Manager API reference](pathname:///manager-sdk/reference/manager/) — the `users` resource.
- [User API reference](pathname:///manager-sdk/reference/user/) — the `me` namespace.
