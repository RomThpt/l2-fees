// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  // SSR for SEO
  ssr: true,

  // Nitro configuration for Vercel
  nitro: {
    preset: 'vercel',
  },

  // Optimize: exclude SDK from client bundle
  vite: {
    optimizeDeps: {
      exclude: ['@cryptostats/sdk'],
    },
  },

  // Runtime config for environment variables
  runtimeConfig: {
    etherscanKey: process.env.ETHERSCAN_KEY || '',
    mongoConnectionString: process.env.MONGO_CONNECTION_STRING || '',
    redisUrl: process.env.REDIS_URL || '',
    executionTimeout: process.env.EXECUTION_TIMEOUT || '60',
    public: {
      gaId: process.env.NUXT_PUBLIC_GA_ID || 'G-TG6XPV9ZGL',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://l2fees.info',
    },
  },

  // App configuration
  app: {
    head: {
      title: 'L2Fees.info',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Ethereum Layer-1 is expensive. How much does it cost to use Layer-2?',
        },
        { property: 'og:title', content: 'L2Fees.info' },
        {
          property: 'og:description',
          content: 'Ethereum Layer-1 is expensive. How much does it cost to use Layer-2?',
        },
        { property: 'og:site_name', content: 'L2Fees' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'coinzilla', content: '0a07da88e8853d8979015618cc9f70fb' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500&display=swap',
        },
      ],
    },
  },

  // Route rules for ISR (Incremental Static Regeneration)
  routeRules: {
    '/': { isr: 300 }, // Revalidate every 5 minutes
  },

  // CSS
  css: ['~/assets/css/main.css'],

  // TypeScript
  typescript: {
    strict: true,
    typeCheck: false, // Disabled during dev due to vite-plugin-checker issue
  },
})
