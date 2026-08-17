# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Generic e-commerce catalog scaffolding built with **Quasar 2 + Vue 3 + TypeScript + Supabase**. Multi-tenant by design — each deployment is scoped to a `negocio_id` (business ID) from env vars. Orders are completed via WhatsApp (no payment gateway). Deployed on Vercel (SPA with history mode).

## Commands

```bash
yarn dev          # Start Quasar dev server (opens browser)
yarn build        # Production build
yarn lint         # ESLint (flat config, .ts/.js/.vue)
yarn format       # Prettier
```

No test suite exists (`yarn test` is a no-op).

## Environment Variables

Required in `.env` (see `.env.example`):
- `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` — Supabase project credentials
- `VITE_NEGOCIO_ID` — UUID scoping all product queries to one business
- `VITE_WHATSAPP_NUMBER` — WhatsApp number for order/contact messages

## Architecture

### Multi-tenant data isolation

All Supabase queries filter by `negocio_id` (from `src/config/business.ts → getBusinessId()`). The `useProducts` composable enforces this on every CRUD operation. The Supabase client is initialized in `src/boot/supabase.js` and exported as a singleton.

### Configuration layer (`src/config/`)

Per-deployment customization lives here, **not** in components:
- `branding.ts` — store name, logo, colors, hero text, contact info
- `categories.ts` — default product category list
- `whatsapp.ts` — WhatsApp number and message templates
- `business.ts` — reads env vars for Supabase + business ID

### Composables (`src/composables/`)

- `useProducts` — Supabase CRUD for the `products` table (fetch, create, update, delete)
- `useCatalog` — client-side filtering/search/category selection over a product list
- `useWhatsApp` — opens WhatsApp links for product inquiries, cart proposals, and contact

### Stores (Pinia, `src/stores/`)

- `cart` — shopping cart with localStorage persistence, dual-currency support (CUP/USD), totals by currency
- `auth` — Supabase auth with localStorage-backed session, used to gate `/adminstore` routes

### Routing (`src/router/routes.ts`)

Three layout groups:
- `MainLayout` — public pages: `/`, `/catalogo`, `/contacto`, `/acerca`
- `AuthLayout` — `/login`
- `AdminLayout` — `/adminstore` (requires auth via `meta.requiresAuth`)

### Types (`src/stores/types.ts`)

Shared interfaces: `Product`, `CartItem`, `OrderContact`, `OrderRecord`, `User`. Use these — don't redeclare product shapes in components.

## Key Conventions

- Spanish UI text throughout (labels, messages, route names)
- Currencies: `CUP` (default) and `USD` — cart tracks currency per item
- Product states: `'Disponible'` | `'Agotado'` — catalog hides agotado by default
- Quasar plugins enabled: Notify, LoadingBar, Dialog, Cookies
- Icon sets: Material Icons + Font Awesome v6
- Path aliases: `src/` → `src/`, `layouts/` → `src/layouts/`, `pages/` → `src/pages/`, `components/` → `src/components/`, `boot/` → `src/boot/`
