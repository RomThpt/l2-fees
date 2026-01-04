# L2Fees Migration Plan: Next.js to Nuxt 3

## Overview

Migrate the L2Fees.info application from Next.js 12 to Nuxt 3, maintaining the core fee comparison functionality while modernizing the stack.

## Current State Summary

- **Framework:** Next.js 12.2.5 with React 18
- **Styling:** Styled JSX (CSS-in-JS)
- **Data:** CryptoStats SDK for L2 fee data
- **Features:** Fee comparison table, protocol details, toggles for L2 types
- **Deployment:** Vercel-compatible

## Target State

- **Framework:** Nuxt 3 with Vue 3
- **Styling:** Scoped CSS (migrated from styled-jsx)
- **Data:** CryptoStats SDK (unchanged)
- **Features:** Same core functionality (blog deferred)
- **Deployment:** Vercel

---

## Phase 1: Project Setup

### 1.1 Initialize Nuxt 3 Project

```bash
# Create new Nuxt 3 project in separate directory
npx nuxi@latest init l2-fees-nuxt
cd l2-fees-nuxt

# Install dependencies
npm install @cryptostats/sdk ethers@5.7.0
npm install -D @nuxt/image sass
```

### 1.2 Configure Nuxt

Create `nuxt.config.ts`:
- SSR enabled (for SEO)
- Configure runtime config for API keys
- Set up meta tags and OG images
- Configure Vercel deployment preset

### 1.3 Project Structure

```
l2-fees-nuxt/
├── app.vue                 # Root component
├── nuxt.config.ts          # Nuxt configuration
├── pages/
│   └── index.vue           # Main fee comparison page
├── components/
│   ├── FeeList.vue         # Main list container
│   ├── FeeRow.vue          # Individual protocol row
│   ├── DetailsCard.vue     # Expandable details
│   ├── ToggleBar.vue       # Filter toggles
│   ├── AppHeader.vue       # Site header
│   └── AppFooter.vue       # Site footer
├── composables/
│   ├── useFeeData.ts       # CryptoStats SDK integration
│   └── useFormatters.ts    # USD/percent formatting
├── utils/
│   └── bundleItems.ts      # Protocol bundling logic
├── assets/
│   ├── css/
│   │   └── main.css        # Global styles
│   └── icons/              # SVG icons
├── public/
│   └── fonts/              # Custom fonts
└── server/
    └── api/
        └── fees.ts         # API route for fee data (if needed)
```

---

## Phase 2: Core Components Migration

### 2.1 Components to Migrate

| React Component | Vue Component | Priority | Complexity |
|-----------------|---------------|----------|------------|
| List.tsx | FeeList.vue | High | Medium |
| Row.tsx | FeeRow.vue | High | Medium |
| DetailsCard.tsx | DetailsCard.vue | High | Low |
| RowName.tsx | (inline in FeeRow) | High | Low |
| ToggleBar.tsx | ToggleBar.vue | High | Low |
| Button.tsx | BaseButton.vue | Medium | Low |
| Flags.tsx | ProtocolFlags.vue | Medium | Low |
| Footer.tsx | AppFooter.vue | Medium | Low |
| SocialTags.tsx | (use useHead) | Medium | Low |

### 2.2 Migration Pattern

For each component:

1. Create `.vue` file with `<script setup lang="ts">`
2. Convert React props to Vue props with `defineProps`
3. Convert useState to Vue `ref`/`reactive`
4. Convert useEffect to Vue `watch`/`onMounted`
5. Convert styled-jsx to `<style scoped>`
6. Convert event handlers (onClick -> @click)

### 2.3 Key Differences to Handle

| React | Vue 3 |
|-------|-------|
| `useState` | `ref()` / `reactive()` |
| `useEffect` | `watch()` / `onMounted()` |
| `{condition && <Component>}` | `v-if` directive |
| `array.map(item => <Item />)` | `v-for` directive |
| `className` | `class` |
| `onClick` | `@click` |
| `children` | `<slot />` |
| Context API | `provide`/`inject` or Pinia |

---

## Phase 3: Data Layer Migration

### 3.1 CryptoStats SDK Integration

Create `composables/useFeeData.ts`:

```typescript
import CryptoStatsSDK from '@cryptostats/sdk'

export const useFeeData = async () => {
  const sdk = new CryptoStatsSDK({
    moralisKey: useRuntimeConfig().moralisKey,
    executionTimeout: 60
  })

  const list = sdk.getCollection('l2-fees')
  await list.fetchAdapters()

  // Fetch fee data...
  return { feeData, loading, error }
}
```

### 3.2 Data Fetching Strategy

- Use `useAsyncData` for SSR-compatible data fetching
- Implement ISR with `routeRules` (revalidate every 5 minutes)
- Cache fee data on server side

---

## Phase 4: Styling Migration

### 4.1 Global Styles

Migrate from `_app.tsx` global styles to `assets/css/main.css`:
- Typography
- Color variables (CSS custom properties)
- Reset/normalize styles

### 4.2 Component Styles

Convert styled-jsx to scoped CSS:

**Before (React/styled-jsx):**
```jsx
<style jsx>{`
  .row { padding: 16px; }
`}</style>
```

**After (Vue scoped):**
```vue
<style scoped>
.row { padding: 16px; }
</style>
```

---

## Phase 5: Configuration & Deployment

### 5.1 Environment Variables

Create `.env` file:
```
NUXT_ETHERSCAN_KEY=your_key
NUXT_PUBLIC_GA_ID=G-TG6XPV9ZGL
```

### 5.2 Vercel Configuration

Nuxt 3 has built-in Vercel support. Create `vercel.json` if needed:
```json
{
  "buildCommand": "nuxt build",
  "outputDirectory": ".output"
}
```

### 5.3 Analytics Setup

- Install `@nuxtjs/plausible` module
- Configure GA4 with `vue-gtag`

---

## Phase 6: Testing & Launch

### 6.1 Pre-Launch Checklist

- [ ] All L2 protocols display correctly
- [ ] Fee data updates (ISR working)
- [ ] Toggle filters work (All L2s / Full Rollups)
- [ ] Details cards expand/collapse
- [ ] Mobile responsive
- [ ] SEO meta tags present
- [ ] OG images generate correctly
- [ ] Analytics tracking
- [ ] Performance audit (Lighthouse)

### 6.2 Deployment Steps

1. Push to GitHub
2. Connect repo to Vercel
3. Configure environment variables in Vercel
4. Deploy preview branch first
5. Test thoroughly
6. Deploy to production

---

## Files to Skip (Not Migrating)

- `pages/blog/*` - Blog functionality (deferred)
- `pages/api/social/*` - Social card generation (evaluate later)
- `pages/l1-fees-old.tsx` - Legacy page (removed)
- `components/blog-widgets/*` - Blog widgets (deferred)
- `components/L1*.tsx` - L1 fee components (removed in recent commits)

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| CryptoStats SDK Vue compatibility | High | SDK is framework-agnostic, should work |
| Styling differences | Medium | Careful CSS migration, visual testing |
| SSR data fetching | Medium | Use Nuxt's built-in patterns |
| Build time | Low | Nuxt 3 builds are fast |

---

## Estimated Effort

| Phase | Tasks | Est. Files |
|-------|-------|------------|
| Phase 1: Setup | Project init, config | 3-5 |
| Phase 2: Components | 10 components | 10-12 |
| Phase 3: Data | SDK integration | 2-3 |
| Phase 4: Styling | CSS migration | 5-8 |
| Phase 5: Config | Deploy setup | 2-3 |
| Phase 6: Testing | QA, fixes | varies |

---

## Next Steps

1. Review and approve this plan
2. Set up new external service accounts (Etherscan API, etc.)
3. Start Phase 1: Initialize Nuxt 3 project
4. Migrate components iteratively
5. Test and deploy

---

## Questions Before Starting

- Do you want the new project in a separate directory or replace existing?
- Do you have a specific domain/subdomain for staging?
- Any specific L2s you want to prioritize or remove?
