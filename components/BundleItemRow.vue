<script setup lang="ts">
import type { FeeData } from '~/composables/useFeeData'
import { formatUSD } from '~/utils/formatters'

interface Props {
  item: FeeData
}

defineProps<Props>()
</script>

<template>
  <div
    class="bundle-item"
    :style="item.metadata.icon ? { backgroundImage: `url('${item.metadata.icon}')` } : {}"
  >
    <div class="name">{{ item.metadata.name }}</div>
    <div class="amount">{{ formatUSD(item.results.feeTransferEth) }}</div>
  </div>
</template>

<style scoped>
.bundle-item {
  display: flex;
  background-repeat: no-repeat;
  background-position: 10px center;
  background-size: 20px 20px;
  padding: 4px;
  text-decoration: none;
  background-color: #eee;
}

.bundle-item:hover {
  background-color: #dddddd;
}

.name {
  padding-left: 32px;
  flex: 1;
}

.amount {
  min-width: 200px;
  text-align: right;
  font-family: 'Noto Sans TC', sans-serif;
}

@media (max-width: 700px) {
  .amount {
    font-size: 14px;
    min-width: 110px;
    padding-left: 8px;
  }
}
</style>
