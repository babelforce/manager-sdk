---
title: Go — getting started
sidebar_label: Getting started
---

# Go — getting started

## Install

```bash
go get github.com/babelforce/manager-sdk-go
```

```go
import (
    manager "github.com/babelforce/manager-sdk-go"
    // request & model types (CreateManagedUserRequest, query params, …) live here:
    managerapi "github.com/babelforce/manager-sdk-go/gen/manager"
)
```

Requires Go 1.26+ (the SDK uses range-over-func iterators).

The `manager` package holds the client and its config/convenience types (`Options`,
`ListUsersQuery`, `APIError`, …); request and model types come from the generated
`managerapi` package.

## Connect

```go
mgr, err := manager.Connect(ctx, manager.Options{
    Auth: manager.ClientCredentials(clientID, clientSecret),
    // BaseURL defaults to https://services.babelforce.com
})
if err != nil {
    log.Fatal(err)
}
```

See [Authentication](/guides/authentication) for all auth modes — Authorization Code + PKCE,
client-credentials, bearer, and password-grant.

## List users (auto-paginated)

`List` returns an iterator that pages for you:

```go
for user, err := range mgr.Users.List(ctx, manager.ListUsersQuery{}) {
    if err != nil {
        log.Fatal(err)
    }
    fmt.Println(user.Id, user.Email)
}

// or collect everything:
users, err := mgr.Users.ListAll(ctx, manager.ListUsersQuery{})
```

## Create / enable / disable / delete

```go
created, err := mgr.Users.Create(ctx, managerapi.CreateManagedUserRequest{
    Email: "new.user@acme.com",
})

err = mgr.Users.Enable(ctx, []string{"new.user@acme.com"})
err = mgr.Users.Disable(ctx, []string{"new.user@acme.com"})
err = mgr.Users.Delete(ctx, []string{"new.user@acme.com"})
```

## Error handling

Non-2xx responses return a typed `*manager.APIError`:

```go
_, err := mgr.Users.Create(ctx, req)
var apiErr *manager.APIError
if errors.As(err, &apiErr) {
    log.Printf("status=%d code=%s msg=%s", apiErr.Status, apiErr.Code, apiErr.Message)
}
```

## Custom base URL & HTTP client

```go
mgr, err := manager.Connect(ctx, manager.Options{
    BaseURL:    "https://acme.babelforce.com", // per-customer host override
    Auth:       manager.Bearer(token),
    HTTPClient: myInstrumentedClient,
})
```

## Reference

- [REST API reference](pathname:///manager-sdk/reference/manager/)
- [pkg.go.dev](https://pkg.go.dev/github.com/babelforce/manager-sdk-go)
