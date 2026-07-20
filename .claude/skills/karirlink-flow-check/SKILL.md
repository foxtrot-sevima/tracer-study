---
name: karirlink-flow-check
description: Use when editing or adding pages under v1/ (the Karirlink CDC mockup) so UX/UI changes stay consistent with karirlink-cdc-unified-flow.mmd.md and the existing design system — checks terminology (wave, cohort_year, campaign, Template Version) and reuses existing Quantum/ts-* component classes instead of inventing new patterns.
---

# Karirlink CDC Mockup — Flow & Design System Consistency Check

Before touching any file under `v1/`, ground the change in the documented business flow and the two design systems already established in this repo.

## 1. Read the flow doc first

`karirlink-cdc-unified-flow.mmd.md` (project root) is the source of truth for business flow: menu structure (Dashboard, Kuesioner, Mahasiswa/Alumni, Aktivitas) plus the detailed Admin flow (`A1`–`A8`) and Alumni flow (`B1`–`B11`) inside the Kuesioner menu.

Before adding or modifying a page, identify which node(s) in that diagram it represents. If it's unclear which step a change maps to, ask the user instead of guessing — don't invent flow steps that aren't in the doc.

## 2. Keep domain terminology consistent

Use **Wave** (Exit Survey / GS-I / GS-II) alongside Tahun Lulus for anything related to campaign targeting or cohort matching — never fall back to a bare "Tahun Lulus" picker for something that's conceptually a campaign/wave. This was a real gap found during audit (grep for wave/cohort/GS-I/GS-II/Exit across `v1/*.html` returned zero hits before it was fixed) — don't reintroduce it.

Other terms to keep consistent: **Campaign** (institusi + wave + cohort_year + tanggal buka-tutup), **Template Version** (explicit versioning — a published template can't be edited; changes create a new version), **response rate / drop-out** (per prodi & angkatan, not just aggregate totals).

## 3. Two separate design systems — don't mix them

- **Admin-facing pages** (`index.html`, `dashboard.html`, `kuesioner-*.html`, `alumni*.html`, etc.) use the **Quantum** component classes: `card`, `card__body`, `card__footer`, `btn btn_outline/btn_primary`, `tag tag_neutral/tag_outline`, `modal`, `form-control`, `select-default`, `collapse`. These come from `v1/assets/vendors/quantum-v2.2.1-202310260001/` and `v1/assets/karirlink/`.
- **Alumni-facing wizard pages** (`tracer-study-*.html`) use a lightweight, page-local `ts-*` system (`.ts-header`, `.ts-card`, `.ts-progress`, `.form-group`/`.form-select`/`.form-input`, `.btn/.btn-primary/.btn-outline`, `.info-box`, `.summary-box`, `.ts-footer`) defined inline in each file's own `<style>` block, kept byte-identical across files. When adding a new alumni-facing page, **copy the existing `<style>` block verbatim** from `tracer-study-step1.html` rather than writing new CSS or reaching for Quantum classes.

Check which family a page belongs to before styling it.

## 4. New pages must follow the base-href convention

Every page needs `<base href="/v1/">` as the first thing inside `<head>`, and all asset/link references must be relative with no `./` or `../` prefix (e.g. `assets/css/main.css`, `dashboard.html`). This is documented in `readme.md` at the project root — it's what keeps local preview (VS Code Live Preview / `npx serve`) and the Vercel deploy behaving identically. Don't add absolute-from-root (`/assets/...`) or parent-relative (`../assets/...`) paths.

## 5. Demonstrating states without real backend logic

This is a static mockup — there's no real session/cohort-matching logic. To show a state that would normally come from server logic (an alternate branch, an error condition, a terminal state), follow the existing pattern in `kuesioner-preview.html` (its "Mode Pratinjau Admin" banner with buttons that jump between steps) or `tracer-study-step2.html` (its "Mode Demo" banner linking to each possible outcome page). Add a small, clearly-labeled demo banner with links to the alternate static pages — don't write JS conditionals that pretend to compute real business logic.