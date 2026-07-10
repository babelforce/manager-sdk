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

## Hyphenated-UUID ids normalized in every language (0.46.0)

babelforce entity ids are unhyphenated 32-char hex on the wire. The Rust SDK already normalized a
hyphenated UUID in a request path to that canonical form; TypeScript and Go passed it through raw —
the same input produced a different URL (and usually a 404). All three SDKs now put the **same
path** on the wire for the same id:

- **TypeScript**: a fetch-level normalizer rewrites hyphenated-UUID path segments
  (behavioral change — previously sent raw).
- **Go**: a request editor on every generated client does the same (behavioral change).
- **Rust**: unchanged — this was already its behavior.

Non-UUID path segments and query strings are untouched in all languages.

Also in **TypeScript**: a non-2xx error envelope with an empty (or non-string) `message` no longer
shadows a usable `error`/`detail` field — `ManagerApiError.message` now takes the first non-empty
string of `message` → `error` → `detail`, matching Go and Rust.

Both fixes were found by the behavioral conformance harness, which now covers all five scenario
families of its design (retry, auth/token, pagination, error envelopes, entity-ids — 39 scenarios
run against each language) plus a dispatch-drift gate. The harness is repo-internal; the published
packages contain none of it.

## Model strictness relaxed to match the live API (0.45.1)

A decode-robustness release, shared in lockstep across all three languages. The vendored spec
marked as required — or closed to new values — several fields the production API treats as optional
or open, so a strict client could reject perfectly valid responses. The spec is loosened and all
three SDKs regenerated:

- **Optional now, not required:** pagination `pages` / `current` / `total`, `GenericItemResponse.item`,
  `Event.id`, and `Conference.moderator`. `Conference.members` may also contain null slots (a member
  that has just left the conference).
- **Extended enums:** `EventType` gains `CAMPAIGN` and `CONFERENCE`; `IvrModule` gains `realtime`.
  In **Rust**, `EventType` and `IvrModule` are additionally tolerant of unknown values — a variant
  the server adds beyond the spec decodes to `Unknown` instead of failing the whole response.
- **Pagination facades hardened in every language:** a list envelope that omits the page count is
  treated as a single page — TypeScript `?? 1`, Rust `.unwrap_or(1)`, and Go's new `pageCount()`
  helper — so auto-pagination stops cleanly instead of panicking / dereferencing nil.

No public API surface changes in any language.

## Typed OAuth grant errors in TypeScript and Go (0.45.0)

A failed OAuth2 token grant (wrong credentials, an expired refresh token, an unavailable token
endpoint) now surfaces the SDK's typed API error in **every** language, so you can branch on the
structured `status`/`code` fields instead of parsing message strings:

- **TypeScript**: the grant helpers and the transparent token fetch throw `ManagerApiError`
  (`status`, `code`, `body`) on a non-2xx token response — previously a plain `Error`.
- **Go**: the grant functions return `*manager.APIError` (`Status`, `Code`, `Message`, `Body`;
  `errors.As` compatible) — previously an opaque error string.
- **Rust**: unchanged (`ManagerError::Api` was already typed) — lockstep version bump.

**Behavioral change:** callers matching the old `"… grant failed (status N)"` message strings
should switch to the typed fields. See
[Authentication → Grant failures](/guides/authentication#grant-failures).

## Maintenance: behavioral conformance harness (0.44.1)

No SDK changes in any language — all three packages bump in lockstep and are functionally identical
to 0.44.0:

- **Behavioral parity is now checked mechanically.** A conformance harness runs one scripted
  mock-server scenario set (retry semantics and OAuth token grants, 25 scenarios) against the real
  TypeScript, Go, and Rust clients in CI, so the SDKs are verified to *behave* the same — not just
  expose the same methods. Advisory for now; more scenario families will follow.

## Rust retry parity, richer auth options, agent filters (0.44.0)

The follow-up batch to the 0.43.0 audit: the three SDKs now also *behave* the same where they
previously only matched by method name. Breaking changes are Rust-only:

- **Rust retries now match TypeScript and Go.** A server-sent `Retry-After` header is honored
  (capped at the policy's `max_delay`), backoff is jittered, and the retryable status codes are
  configurable via the new `RetryPolicy.retry_status` field. **Breaking (Rust):** `RetryPolicy`
  struct literals need the new field (use `..RetryPolicy::default()`), and OAuth token requests —
  like every non-idempotent request — are now retried only on `429`, no longer on `5xx`.
- **Filter agent lists on the server, in every language.** Rust gains `ListAgentsQuery`
  (q, enabled, name, number, source id, line state, source, group ids/names, tags) on
  `agents.list(…)`, matching the existing TypeScript/Go filters. **Breaking (Rust):**
  `agents.list_page` takes the query as an argument.
- **Custom OAuth2 applications for password and refresh-token auth.** Go:
  `PasswordWithClientID(…)` and `RefreshTokenWithSecret(…)`; Rust: `Auth::Password { client_id }`
  and `Auth::RefreshToken { client_secret }` (optional fields). TypeScript already supported both
  via `clientId`/`clientSecret`.
- **TypeScript packaging:** legacy resolvers (`moduleResolution: "node10"`, older bundlers) now
  find the entry point and typings via top-level `main`/`types` fallbacks. The package remains
  ESM-only, now stated explicitly in the README.

## Reliability: Rust applications fixed, token auto-refresh, pagination hardening (0.43.0)

A cross-language reliability release driven by a full audit of all three SDKs. One breaking change,
in Rust only:

- **Rust applications now work end-to-end.** `create`, `update`, and `clone` previously reported
  every *successful* write as a decode error; they now succeed. Listings tolerate application
  module types the SDK doesn't know yet instead of failing for the whole account. **Breaking
  (Rust):** applications methods now return `ApplicationItem` — match on `.as_typed()` for the
  typed model, or inspect `Unknown { module, raw }` for new module types.
- **Rust sessions no longer expire.** Password, client-credentials, and refresh-token auth now
  refresh the access token automatically before expiry (single-flight; rotated refresh tokens are
  captured), matching TypeScript and Go. Token fetches also inherit the client's retry policy.
- **Pagination can no longer loop forever.** TypeScript and Go iterators advance by the locally
  requested page instead of trusting the server-echoed cursor. The users endpoint — which exposes
  no page parameter — is fetched once and returned as served in all three languages, and Rust
  gains a server-side email filter: `users.list(ListUsersQuery { email })`.
- **Go:** a hung token refresh no longer blocks other requests past their own context deadlines,
  and a 2xx response with a different status code than the spec declares now decodes the payload
  instead of surfacing as an error.
- **TypeScript:** retried 429/5xx responses release their connections, and the shipped examples
  work again (OAuth2 client credentials).

Also in this release: publishing is all-or-nothing across npm, the Go module, and crates.io (a
failing build for any language blocks every registry), every published artifact is leak-checked,
and the public REST API reference was resynced with the current specs.

## Maintenance: fully automated releases (0.42.3)

No SDK changes in any language — all three packages bump in lockstep and are functionally identical
to 0.42.2:

- **Publishing is now fully automated.** The Rust crate publishes to crates.io automatically on
  every release tag, exactly like the npm package and the Go module — all three registries receive
  a release at the same moment, with no manual step left.

## Rust: fix `list` → `get`/`update`/`delete` id round-trips (0.42.2)

A Rust-only fix — TypeScript and Go are unchanged and move in lockstep:

- **Path ids now normalize to the API's unhyphenated form.** babelforce addresses entities by their
  unhyphenated 32-char hex id, but callers commonly hold a hyphenated UUID (from `Uuid::to_string()`
  or a serialized model field) — so an id read from a `list` call used to 404 when fed back into
  `get`/`update`/`delete`. The fix is applied in the shared path-parameter encoder, so every resource
  is covered; no API or method signature changes.

## Rust: first crates.io release + pre-publish hardening (0.42.1)

The Rust SDK (`babelforce-manager-sdk`) is now published on **crates.io**. A Rust-only release —
TypeScript and Go are unchanged and move in lockstep:

- **Credentials no longer leak in `Debug` output** — `Auth`, `TokenRequest` and `PkceChallenge`
  redact secrets (client secret, tokens, password, PKCE verifier) when formatted.
- **`build_authorize_url` never panics** on a malformed/scheme-less base URL.
- **Auto-pagination is hardened** against a server that misreports its page cursor.
- **`Auth::Bearer` tolerates a trailing newline** in the token (no more opaque 401s).
- Ships `LICENSE`/`NOTICE` and complete `docs.rs` documentation.

## Rust: raw application create/clone & in-memory lead upload (0.42.0)

A Rust-only release — TypeScript and Go are unchanged and move in lockstep:

- **Raw application create/clone** — `applications.create_raw` and `applications.clone_raw` return
  the created/cloned record as raw JSON. The generated `Application` model can't deserialize real
  success bodies (a tagged-enum discriminator artifact), so the typed `create`/`clone` would
  misreport a completed write as a decode error; these read raw and lose nothing.
- **In-memory lead upload** — `outbound.upload_leads_bytes` uploads a lead CSV straight from bytes
  in memory (the same multipart request as `upload_leads`, no file on disk). Lead CSVs carry PII,
  so callers holding the content shouldn't have to write it out to upload it.

## Rust: single-page listing, report filters & raw reads (0.41.0)

A Rust-only release — TypeScript and Go are unchanged and move in lockstep:

- **Single-page listing** — `Page<T>` + `list_page(page, per_page)` on agents, queues,
  applications, numbers, files, recordings, dashboards, and integrations, plus a typed
  `CallReportFilter` with `ReportingResource::{list_page, simple_page}` for the detailed and
  timing call reports.
- **Raw-JSON reads where the generated models are stricter than the live API** — the applications
  read path (a tagged-enum decode bug meant no application payload ever round-tripped), the
  reporting reads `list_page_raw` / `simple_page_raw` / `calls.get_raw`, and a new
  `calls.hangup_raw` (live agent-bridged calls carry `bridged.queueId: null`, which the typed
  models reject).
- **Paged SMS reporting** — `sms.report_page(page, per_page)`.

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
