<script setup lang="ts">
// SEO meta
useSeoMeta({
  title: 'L2Fees.info',
  ogTitle: 'L2Fees.info',
  description: 'Ethereum Layer-1 is expensive. How much does it cost to use Layer-2?',
  ogDescription: 'Ethereum Layer-1 is expensive. How much does it cost to use Layer-2?',
  twitterCard: 'summary_large_image',
})

// Fetch fee data
const { data: feeData, loading, error } = await useFeeData()

// Mode toggle state
const mode = ref<'l2s' | 'rollups'>('l2s')

// Filter data based on mode
const filteredData = computed(() => {
  if (!feeData.value) return []

  let data = mode.value === 'rollups'
    ? feeData.value.filter((item) => item.id !== 'metisnetwork')
    : feeData.value

  // Mark metisnetwork as offchain DA
  data = data.map((item) =>
    item.id === 'metisnetwork' ? { ...item, offchainDA: true } : item
  )

  return data
})

const toggleOptions = [
  { value: 'l2s', label: 'All L2s' },
  { value: 'rollups', label: 'Full Rollups' },
]
</script>

<template>
  <main class="main">
    <h1 class="title">L2 Fees</h1>

    <p class="description">
      Ethereum Layer-1 is expensive.
      <br />
      How much does it cost to use Layer-2?
    </p>

    <div class="toolbar">
      <ToggleBar
        :options="toggleOptions"
        :selected="mode"
        small
        @change="(v) => mode = v as 'l2s' | 'rollups'"
      />
    </div>

    <div v-if="loading" class="loading">Loading fee data...</div>
    <div v-else-if="error" class="error">Error loading data: {{ error.message }}</div>
    <FeeList v-else-if="filteredData.length" :data="filteredData" />

    <div class="blog">
      How can rollups reduce their fees?
      <br />
      Read our first blog-post "
      <NuxtLink to="/blog/rollup-calldata-compression">
        Crunching the Calldata
      </NuxtLink>
      ".
    </div>

    <div class="l2beat">
      Want to better understand Ethereum's layer-2 ecosystem?
      <br />
      Visit our friends at <a href="https://l2beat.com">L2Beat.com</a> to learn more
      about scaling solutions and their risk assumptions.
    </div>
  </main>
</template>

<style scoped>
.main {
  padding: 2rem 0 0.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.title {
  margin: 0 0 16px;
  line-height: 1.15;
  font-size: 4rem;
  font-weight: 700;
  text-align: center;
}

.description {
  text-align: center;
  max-width: 800px;
  line-height: 1.5;
  font-size: 1.5rem;
  margin: 4px 0 20px;
}

.toolbar {
  max-width: 600px;
  width: 100%;
  display: flex;
  justify-content: flex-end;
}

.loading,
.error {
  padding: 2rem;
  text-align: center;
}

.error {
  color: #c00;
}

.blog {
  text-align: center;
  margin-bottom: 14px;
  font-style: italic;
  margin-top: 1rem;
}

.l2beat {
  max-width: 600px;
  margin: 4px 8px;
  text-align: center;
}
</style>
