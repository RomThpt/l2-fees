<script setup lang="ts">
interface Option {
  value: string
  label: string
}

interface Props {
  options: Option[]
  selected: string
  small?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  change: [value: string]
}>()
</script>

<template>
  <ul :class="['bar', { small: props.small }]">
    <li
      v-for="option in props.options"
      :key="option.value"
      :class="{ selected: option.value === props.selected }"
      @click="emit('change', option.value)"
    >
      {{ option.label }}
    </li>
  </ul>
</template>

<style scoped>
.bar {
  display: flex;
  padding: 0;
  margin: 0;
  list-style: none;
}

.bar.small li {
  font-size: 14px;
}

li {
  padding: 6px;
  border: 1px solid #d0d1d9;
  border-right: none;
  background: transparent;
  font-size: 18px;
  color: #b0b4bf;
  cursor: pointer;
}

li:first-child {
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
}

li:last-child {
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
  border-right: 1px solid #d0d1d9;
}

li.selected {
  background: white;
  color: #091636;
  cursor: default;
}
</style>
