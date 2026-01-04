<script setup lang="ts">
import type { FeeData } from '~/composables/useFeeData'

interface Props {
  protocol: FeeData
}

defineProps<Props>()
</script>

<template>
  <div class="details-card">
    <!-- Bundle items if any -->
    <div v-if="protocol.children">
      <BundleItemRow
        v-for="item in protocol.children.sort((a, b) => (b.results.feeTransferEth || 0) - (a.results.feeTransferEth || 0))"
        :key="item.id"
        :item="item"
      />
    </div>

    <div class="metadata">
      <div v-if="protocol.metadata.description" class="description">
        {{ protocol.metadata.description }}
      </div>

      <div class="row">
        <BaseAttribute v-if="protocol.metadata.website" title="Website">
          <a :href="protocol.metadata.website" target="_blank" rel="noopener noreferrer">
            {{ protocol.metadata.website.replace('https://', '') }}
          </a>
        </BaseAttribute>
      </div>

      <div class="spacer" />

      <div v-if="protocol.metadata.l2BeatSlug">
        <BaseButton
          :href="`https://l2beat.com/projects/${protocol.metadata.l2BeatSlug}/`"
          target="_blank"
        >
          More Details at L2Beat.com
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.details-card {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.metadata {
  padding: 12px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.description {
  margin: 4px 0;
}

.row {
  display: flex;
}

.row > :deep(div) {
  flex: 1;
}

.spacer {
  flex: 1;
}
</style>
