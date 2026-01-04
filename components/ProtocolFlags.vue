<script setup lang="ts">
interface Props {
  flags: Record<string, string>
}

defineProps<Props>()

// Icon mapping - using Unicode symbols as placeholders
// Can be replaced with actual SVG icons later
const iconMap: Record<string, string> = {
  throtle: '&#9888;', // Warning triangle
  info: '&#8505;', // Info
  warning: '&#9888;', // Warning
  private: '&#128274;', // Lock
}
</script>

<template>
  <div class="flags">
    <div v-for="(desc, id) in flags" :key="id" class="flag">
      <span class="icon" v-html="iconMap[id] || '&#8505;'" />
      <div class="tooltip">{{ desc }}</div>
    </div>
  </div>
</template>

<style scoped>
.flags {
  padding: 4px;
  display: flex;
  gap: 4px;
}

.flag {
  position: relative;
  cursor: help;
}

.icon {
  font-size: 16px;
  opacity: 0.7;
}

.tooltip {
  width: 120px;
  display: none;
  background: black;
  position: absolute;
  color: white;
  font-size: 12px;
  text-align: center;
  padding: 5px;
  border-radius: 6px;
  white-space: normal;
  transform: translateX(-50%);
  left: 50%;
  top: 100%;
  z-index: 20;
}

.flag:hover .tooltip {
  display: block;
}
</style>
