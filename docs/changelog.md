---
title: Changelog
sidebar_label: Changelog
sidebar_position: 99
---

# Changelog

Release notes for the babelforce manager SDKs — TypeScript (`@babelforce/manager-sdk`), Go
(`github.com/babelforce/manager-sdk-go`), and Rust (`babelforce-manager-sdk`). All three SDKs share
one **lockstep version**, released together by a single git tag — a given version is the same feature
set in every language.

:::tip
This page is the customer-facing summary. Method-level detail lives in each package's `CHANGELOG`
(npm / pkg.go.dev / crates.io).
:::

## Authentication: first-class PKCE + consolidated guide (0.40.0)

The SDKs now support the **Authorization Code + PKCE** flow (RFC 7636) as a first-class option — the
recommended way to authenticate apps acting **on behalf of a user** (SPAs, CLIs, mobile/desktop), with
no client secret to store:

- New helpers to drive the flow: generate a PKCE verifier/challenge (`pkceChallenge` / `GeneratePKCE`
  / `pkce_challenge`), build the consent URL (`buildAuthorizeUrl` / `BuildAuthorizeURL` /
  `build_authorize_url`), and exchange the code (`authorizationCodeGrant` / `AuthorizationCodeGrant`;
  Rust uses `mgr.auth.token`).
- A new **`refreshToken`** auth mode (TypeScript/Go: transparent refresh with refresh-token rotation;
  Rust: `Auth::RefreshToken`, resolved once at connect).

The **OAuth guide is merged into a single [Authentication guide](/guides/authentication)** — an
overview, one section per flow, and guidance on when to use each. **Client credentials** is documented
with a note that issuing `client_id`/`client_secret` (OAuth2 applications) is currently in security
review / limited availability; prefer PKCE (user context) or the password grant (first-party) until it
ships.

## Manager spec refresh — richer docs & schema fixes (0.39.0)

Refreshed the vendored manager API spec and regenerated all three clients. Mostly expanded endpoint
descriptions and examples, plus a few schema corrections — **no new or removed operations**, so
coverage stays at [397/397](/coverage) across TypeScript, Go, and Rust:

- **Routing** — the `number` field is now typed as a phone-number reference (it previously, wrongly,
  reused the application schema).
- **Telephony agent-outbound settings** — now have their own request type.
- **Session variables** (conversations & sessions) — bodies are now typed as string→value maps.

Two small breaking changes follow from the corrections: in **Rust**, `sessions.update_variables` /
`conversations.update_session` now take a `HashMap<String, Value>` (was a free-form `Value`); in
**Go**, `Settings.Telephony.AgentOutbound.Update` takes its own `…OutboundRequestData` type (same
fields). TypeScript is unaffected.

## Authentication change — API-key auth removed ⚠️ (0.38.0)

**Breaking.** The babelforce API no longer accepts the `X-Auth-Access-Id` / `X-Auth-Access-Token`
header pair, so the **API-key auth mode has been removed** from all three SDKs. For server-to-server
auth, switch to the new **client-credentials** mode — an OAuth2 `client_credentials` grant that
exchanges a client ID / secret for a bearer token:

- TypeScript — `auth: { kind: "clientCredentials", clientId, clientSecret }`
- Go — `manager.ClientCredentials(clientID, clientSecret)`
- Rust — `Auth::ClientCredentials { client_id, client_secret }`

Bearer tokens and the (now legacy, first-party-only) password grant are unchanged. See
[Authentication](/guides/authentication).

## Full manager API parity 🎉 (TS/Go `0.37.0`, Rust `0.35.0`)

All three SDKs now wrap **100% of the manager API (356/356 operations)** — and **397/397** across
every vendored spec (manager, OAuth `auth`, `user`, task-automation, task-schedule). Ergonomic,
typed helper methods exist for every endpoint in TypeScript, Go, and Rust, at complete
three-language parity.

This release completes the expansion that began with the 187 → 356 spec refresh: agent presence /
provisioning / logs, dashboards, dialer behaviours, files, recordings, campaigns, integrations &
the action catalog, triggers & automations, conversations & SMS, business-hours / calendar ranges,
settings scopes, queues & selections, call control & live logging, plus a new **`system`** namespace
(`echo`/`ping`/`apiStatus`/`serverTime`/`timezones`/`tags`/`exportTemplates`/…). The CI coverage gate
is now re-enabled at **`full`** for all three SDKs, so parity can't regress.

## OAuth 2.0 namespace (TS/Go `0.19.0`, Rust `0.17.0`)

The OAuth 2.0 endpoints are now wrapped as an **`auth`** namespace — `mgr.auth.token`,
`mgr.auth.revoke`, `mgr.auth.authorize` — in all three SDKs. See the
[Authentication guide](/guides/authentication#oauth-20-endpoints). (First of the helper rollouts for
the expanded API.)

## Manager API expansion + OAuth (TS/Go `0.18.0`, Rust `0.16.0`)

The upstream manager API grew substantially — the vendored spec went from **187 to 356 operations** —
and a new **OAuth 2.0 `auth` API** (`/oauth/authorize`, `/oauth/token`, `/oauth/revoke`) was added.
This release **refreshes the generated clients across all three SDKs** to cover the new surface; the
ergonomic helper methods for the new operations roll out over the following releases (coverage is now
tracked against the expanded 397-operation scope on the [coverage page](/coverage)).

A few operations were **removed upstream** and are therefore gone from the SDKs (breaking):
`conversations.getEvent`, the per-type `calls.reporting.simpleByType`, and `metrics.push` / `reset`.
`calendars.addDate` now takes a date body. The `calls.reporting.simple`/`simpleAll` reports and
everything else are unchanged.

## 🎉 Three-language parity — the Rust SDK is complete (Rust `0.15.0`)

The **Rust SDK** (`babelforce-manager-sdk`) now wraps **100% of every babelforce manager spec** —
manager (v2), user, task-automation, and task-schedule — reaching **full parity with the TypeScript
and Go SDKs**. Every domain has a Rust tab in the guides, and CI now gates all three SDKs at 100%
coverage. The async, `tokio`/`reqwest`-based client offers the same ergonomic namespaces
(`mgr.users`, `mgr.agents`, `mgr.calls`, `mgr.tasks`, …), automatic retries, and typed errors.

See the [Rust getting-started guide](/rust/getting-started) and the [coverage matrix](/coverage).

## 0.17.0 — Task automation: metrics, usage, logs & agent actions

- `tasks` gained **metrics** (task/agent journals, interaction durations), **usage**, **logs**,
  **agent actions** (accept/reject/complete, locking), and **action testing**.
- 🎉 **The SDKs now cover 100% of every babelforce manager API** (manager, user, task-automation,
  task-schedule).

## 0.16.0 — Task automation: scripts, secrets & config

- `tasks` gained **scripts** (custom code by type), **secrets** (grouped by prefix), and
  **selection configuration** (account-level task selection).

## 0.15.0 — Events, logs & expressions

- New **`events`** (event definitions + custom events), **`logs`** (request audit log + live logs),
  and **`expressions`** (catalog + evaluator) namespaces.
- `integrations` gained action dispatch and single-action variables.
- 🎉 **The SDKs now cover 100% of the manager (v2) API.**
- New [Events, logs & expressions guide](/guides/events-logs).

## 0.14.0 — Prompts & babeldesk

- New **`prompts`** namespace — audio prompts, including upload.
- New **`babeldesk`** namespace — babeldesk dashboards and their widgets.
- New [Prompts & babeldesk guide](/guides/prompts-babeldesk).

## 0.13.0 — Conversations & sessions

- New **`conversations`** namespace — conversations with their events and session variables.
- New **`sessions`** namespace — the standalone call/automation session store.
- New [Conversations & sessions guide](/guides/conversations).

## 0.12.0 — Business hours & calendars

- New **`businessHours`** namespace — define business-hours rules.
- New **`calendars`** namespace — calendars and their special dates.
- New [Business hours & calendars guide](/guides/scheduling).

## 0.11.0 — Outbound & contacts

- New **`outbound`** namespace — dialer lists and their leads.
- New **`phonebook`** namespace — phonebook entries, with bulk CSV import/export.
- New **`campaigns`** namespace — outbound campaigns.
- New [Outbound & contacts guide](/guides/outbound).

## 0.10.0 — Integrations

- New **`integrations`** namespace — manage third-party integrations (CRUD), list available
  providers, fetch provider logos and session variables, and manage action associations.
- New [Integrations guide](/guides/integrations).

## 0.9.0 — Routing & automation

- New **`routing`** namespace — manage routing rules.
- New **`triggers`** namespace — workflow triggers, including clone and a dry-run `test`.
- New **`automations`** namespace — global automations (event triggers).
- New [Routing & automation guide](/guides/routing-automation).

## 0.8.0 — Queues & routing selections

- New **`queues`** namespace — list, create, fetch, update, and delete call queues.
- Nested **`queues.selections`** — manage a queue's selections (the rules that pick which
  agents/groups/tags it routes to), including agent/group/tag membership, plus `selectAgents` to
  resolve which agents a queue currently selects.
- New [Queues & selections guide](/guides/queues).

## 0.7.0 — Telephony

- **Call control** on `calls`: fetch a call, hang it up, create an inbound test call, and set call
  session variables.
- New **`sms`** namespace — list (auto-paginated) and fetch SMS records.
- New **`numbers`** namespace — list and fetch service (phone) numbers, and add tags to a number.
- New **`conferences`** namespace — list and fetch conferences.
- New [Telephony guide](/guides/telephony).

## 0.6.0 — Users & account

- `users` gained role management — list assignable roles, and add / remove roles for users by email
  — plus password-reset for users.
- New **`me`** namespace — the current user, their account/customer info, the accounts they can
  access, and self-service password reset.
- New [Users & account guide](/guides/users).

## 0.5.0 — Foundations

- Configure the client with a `baseUrl` (defaults to `https://services.babelforce.com`). The named
  `environment` option was removed.
- **Automatic retries** for transient failures (HTTP 429/5xx and network blips), with exponential
  backoff and `Retry-After` support — on by default, configurable per client.
- Refreshed, rebranded documentation site.
