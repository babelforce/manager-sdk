---
title: Rust — getting started
sidebar_label: Getting started
---

# Rust — getting started

The Rust SDK is the crate [`babelforce-manager-sdk`](https://crates.io/crates/babelforce-manager-sdk).
It mirrors the TypeScript and Go SDKs at [parity with each other](/coverage).

## Install

```toml
[dependencies]
babelforce-manager-sdk = "0.46"
tokio = { version = "1", features = ["macros", "rt-multi-thread"] }
```

## Connect

```rust
use babelforce_manager_sdk::{Auth, ManagerClient};

#[tokio::main]
async fn main() -> Result<(), babelforce_manager_sdk::ManagerError> {
    let mgr = ManagerClient::connect(Auth::ClientCredentials {
        client_id: "…".into(),
        client_secret: "…".into(),
    })
    .await?; // base_url defaults to https://services.babelforce.com

    for user in mgr.users.list_all().await? {
        println!("{}", user.email);
    }
    Ok(())
}
```

Point at another host or tune retries with the builder:

```rust
use babelforce_manager_sdk::{Auth, ManagerClient, RetryPolicy};

let mgr = ManagerClient::builder(Auth::Bearer { token: "…".into() })
    .base_url("https://acme.babelforce.com")
    .retry(RetryPolicy::default())
    .connect()
    .await?;
```

See [Authentication](/guides/authentication) for all auth modes — Authorization Code + PKCE,
client-credentials, bearer, and password-grant.

## Create / enable / disable / delete

```rust
use babelforce_manager_sdk::gen::manager::models::CreateManagedUserRequest;

mgr.users.create(CreateManagedUserRequest::new("new.user@acme.com".into(), vec![])).await?;
mgr.users.enable(vec!["new.user@acme.com".into()]).await?;
mgr.users.disable(vec!["new.user@acme.com".into()]).await?;
mgr.users.delete(vec!["new.user@acme.com".into()]).await?;
```

## Error handling

Every facade call returns `Result<T, ManagerError>`. A non-2xx response is the
`ManagerError::Api` variant, carrying the status, API error code, message, and raw body:

```rust
use babelforce_manager_sdk::ManagerError;

match mgr.users.create(/* CreateManagedUserRequest */).await {
    Ok(created) => { /* … */ }
    Err(ManagerError::Api { status, code, message, .. }) => {
        eprintln!("status={status} code={code:?} msg={message}");
    }
    Err(e) => eprintln!("{e}"), // Network / Decode / InvalidArgument
}
```

:::note
The full operation list is on the [Coverage page](/coverage); the API reference lives on
[docs.rs](https://docs.rs/babelforce-manager-sdk).
:::
