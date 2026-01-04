<script setup lang="ts">
// Simple header component - can be enhanced later with CryptoStats header
</script>

<template>
  <header class="header">
    <NuxtLink to="/" class="logo">
      L2Fees.info
    </NuxtLink>
  </header>
</template>

<style scoped>
.header {
  width: 100%;
  padding: 1rem;
  display: flex;
  justify-content: center;
}

.logo {
  font-size: 1.25rem;
  font-weight: 600;
  text-decoration: none;
  color: #091636;
}

.logo:hover {
  color: #666666;
}
</style>
