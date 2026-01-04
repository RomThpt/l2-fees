<script setup lang="ts">
import type { FeeData } from '~/composables/useFeeData'
import { TokenType } from '~/types'
import { formatUSD } from '~/utils/formatters'

interface Props {
  protocol: FeeData
  transferType: TokenType
}

const props = defineProps<Props>()
const isOpen = ref(false)

const isApp = computed(() => props.protocol.metadata.category !== 'l1')
const isNotRollup = computed(() => !!props.protocol.offchainDA)

const flags = computed(() => ({
  ...props.protocol.metadata.flags,
  ...(props.protocol.metadata.flagsByQuery || {})['feeTransferEth'],
}))

const transferAmount = computed(() => {
  if (props.transferType === TokenType.ETH) {
    return props.protocol.results.feeTransferEth
  }
  return props.protocol.results.feeTransferToken || props.protocol.results.feeTransferERC20
})

const itemClasses = computed(() => ({
  item: true,
  app: isApp.value,
  open: isOpen.value,
  'not-rollup': isNotRollup.value,
}))

const backgroundStyle = computed(() => {
  if (props.protocol.metadata.icon) {
    return { backgroundImage: `url('${props.protocol.metadata.icon}')` }
  }
  return {}
})

function toggle() {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <div>
    <div :class="itemClasses" :style="backgroundStyle" @click="toggle">
      <div class="row-name">
        <RowName
          :name="protocol.metadata.name"
          :short-name="protocol.metadata.shortName"
          :subtitle="protocol.metadata.subtitle"
        />
        <ProtocolFlags :flags="flags" />
      </div>
      <div class="amount">{{ formatUSD(transferAmount) }}</div>
      <div class="amount">{{ formatUSD(protocol.results.feeSwap) }}</div>
      <div class="arrow">
        <span v-if="isOpen">&#x25B2;</span>
        <span v-else>&#x25BC;</span>
      </div>
    </div>

    <Transition name="slide">
      <div v-if="isOpen" class="details-container">
        <DetailsCard :protocol="protocol" />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.item {
  display: flex;
  padding: 0 4px;
  background-color: #fff;
  font-size: 18px;
  background-repeat: no-repeat;
  background-position: 10px center;
  background-size: 20px 20px;
  padding-left: 10px;
  color: black;
  text-decoration: none;
  align-items: center;
  height: 54px;
  cursor: pointer;
}

.item:hover {
  background-color: #f5f5f5;
}

.item.app {
  background-color: #fad3f6;
}

.item.app:hover {
  background-color: #f8c3f3;
}

.item.not-rollup {
  background-color: #ede8ec;
  color: gray;
}

.row-name {
  flex: 1;
  display: flex;
  align-items: center;
}

.amount {
  padding-left: 32px;
  min-width: 160px;
  text-align: right;
  font-family: 'Noto Sans TC', sans-serif;
}

.arrow {
  padding: 0 4px;
  height: 24px;
  opacity: 0.7;
  font-size: 12px;
  display: flex;
  align-items: center;
}

.details-container {
  overflow: hidden;
  border-top: solid 1px #e3e3e3;
  border-bottom: solid 1px #e3e3e3;
  display: flex;
  flex-direction: column;
}

/* Slide transition */
.slide-enter-active {
  animation: slidein 0.3s ease-out;
}

.slide-leave-active {
  animation: slideout 0.3s ease-in;
}

@keyframes slidein {
  from {
    max-height: 0;
    opacity: 0;
  }
  to {
    max-height: 400px;
    opacity: 1;
  }
}

@keyframes slideout {
  from {
    max-height: 400px;
    opacity: 1;
  }
  to {
    max-height: 0;
    opacity: 0;
  }
}

@media (max-width: 700px) {
  .amount {
    font-size: 14px;
    min-width: 110px;
    padding-left: 8px;
  }

  .item {
    padding-left: 30px;
    background-position: 6px center;
  }

  .arrow {
    padding: 0 2px;
  }
}
</style>
