<script setup lang="ts">
interface Props {
  position: 'left' | 'right'
  adSlotId?: string
}

const props = withDefaults(defineProps<Props>(), {
  adSlotId: '',
})

const adContainerId = computed(() => `sidebar-ad-${props.position}`)

// Coinzilla integration - will be called when component mounts
onMounted(() => {
  // Coinzilla ads can be initialized here if needed
  // Example: window.coinzilla_display = window.coinzilla_display || []
  // window.coinzilla_display.push({ zone: props.adSlotId, ... })
})
</script>

<template>
  <aside :class="['sidebar-ad', `sidebar-ad--${position}`]">
    <div :id="adContainerId" class="ad-container">
      <!-- Coinzilla or custom ad slot -->
      <div class="ad-placeholder">
        <slot>
          <!-- Default placeholder for ad content -->
          <div class="ad-slot" :data-slot-id="adSlotId">
            <!-- Ad will be injected here -->
          </div>
        </slot>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar-ad {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
  display: none;
}

.sidebar-ad--left {
  left: 10px;
}

.sidebar-ad--right {
  right: 10px;
}

.ad-container {
  width: 160px;
  min-height: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.ad-placeholder {
  width: 160px;
  height: 600px;
  background: rgba(0, 0, 0, 0.02);
  border: 1px dashed rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ad-slot {
  width: 100%;
  height: 100%;
}

/* Show ads only on larger screens (1400px+) to have room for content + ads */
@media (min-width: 1400px) {
  .sidebar-ad {
    display: block;
  }
}

/* Adjust for extra large screens */
@media (min-width: 1600px) {
  .sidebar-ad--left {
    left: 20px;
  }

  .sidebar-ad--right {
    right: 20px;
  }
}
</style>
