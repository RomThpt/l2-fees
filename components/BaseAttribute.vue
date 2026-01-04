<script setup lang="ts">
interface Props {
  title: string
  tooltip?: string
}

defineProps<Props>()
const showTooltip = ref(false)
</script>

<template>
  <div class="attribute">
    <div class="title">
      {{ title }}
      <span
        v-if="tooltip"
        class="tooltip-target"
        @mouseenter="showTooltip = true"
        @mouseleave="showTooltip = false"
      >
        ?
        <div v-if="showTooltip" class="tooltip-text">{{ tooltip }}</div>
      </span>
    </div>
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.attribute {
  margin: 8px 8px 8px 0;
}

.title {
  color: #999999;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tooltip-target {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #999999;
  color: #eeeeee;
  height: 18px;
  width: 18px;
  border-radius: 100px;
  font-size: 12px;
  cursor: help;
  position: relative;
}

.tooltip-text {
  position: absolute;
  width: 120px;
  background-color: black;
  color: #fff;
  text-align: center;
  padding: 5px;
  border-radius: 6px;
  white-space: normal;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
}
</style>
