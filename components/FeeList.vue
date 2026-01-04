<script setup lang="ts">
import type { FeeData } from '~/composables/useFeeData'
import { TokenType } from '~/types'

interface Props {
  data: FeeData[]
}

const props = defineProps<Props>()
const tokenType = ref<TokenType>(TokenType.ETH)

const sortedData = computed(() => {
  const query = 'feeTransferEth'
  return props.data
    .filter((protocol) => !!protocol.results[query])
    .sort((a, b) => (a.results[query] || 0) - (b.results[query] || 0))
})
</script>

<template>
  <div class="list">
    <div class="header">
      <div class="name">Name</div>
      <div class="amount">
        <span>Send {{ tokenType }}</span>
        <div class="dropdown">
          <ul>
            <li
              :class="{ selected: tokenType === TokenType.ETH }"
              @click="tokenType = TokenType.ETH"
            >
              ETH
            </li>
            <li
              :class="{ selected: tokenType === TokenType.TOKEN }"
              @click="tokenType = TokenType.TOKEN"
            >
              Tokens
            </li>
          </ul>
        </div>
      </div>
      <div class="amount">Swap tokens</div>
    </div>

    <FeeRow
      v-for="protocol in sortedData"
      :key="protocol.id"
      :protocol="protocol"
      :transfer-type="tokenType"
    />
  </div>
</template>

<style scoped>
.list {
  border: solid 1px lightGray;
  border-radius: 0px;
  margin: 4px;
  max-width: 600px;
  width: 100%;
}

.header {
  display: flex;
  padding: 0 4px;
  border-bottom: solid 1px lightGray;
  background: #eee;
  font-weight: 500;
  padding-left: 10px;
}

.header .amount:hover {
  cursor: pointer;
  background: #eee;
}

.header > div {
  padding: 16px 32px;
}

.name {
  flex: 1;
}

.amount {
  min-width: 160px;
  text-align: right;
  position: relative;
}

.dropdown {
  display: none;
  position: absolute;
  background: #eee;
  border: solid 1px darkGray;
  left: 0;
  right: 0;
  top: 55px;
  z-index: 10;
}

.dropdown ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.dropdown ul li {
  padding: 6px;
}

.dropdown ul li:hover {
  background: #ddd;
  cursor: pointer;
}

.dropdown ul li.selected {
  font-weight: 600;
}

.amount:hover .dropdown {
  display: block;
}

@media (max-width: 700px) {
  .header {
    padding-left: 28px;
    padding-right: 30px;
  }

  .header > div {
    font-size: 14px;
    padding: 8px 2px;
  }

  .amount {
    font-size: 16px;
    min-width: 110px;
  }

  .name {
    font-size: 14px;
  }
}
</style>
