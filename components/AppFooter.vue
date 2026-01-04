<script setup lang="ts">
// Footer component
</script>

<template>
  <footer class="footer">
    <div>Data updates continuously</div>

    <div>
      Powered by <a href="https://cryptostats.community">CryptoStats</a>
    </div>

    <div class="links">
      <a href="https://forum.cryptostats.community">Request Project</a>
      <span class="separator">|</span>
      <a href="https://t.me/+VNTjwOvI-W40Y2E5">Join our Telegram</a>
      <span class="separator">|</span>
      <a href="https://github.com/dmihal/l2-fees">GitHub</a>
    </div>

    <div class="sites">
      <strong>l2fees.info</strong>
      <span class="separator">|</span>
      <a href="https://cryptofees.info">cryptofees.info</a>
      <span class="separator">|</span>
      <a href="https://ethburned.info">ethburned.info</a>
      <span class="separator">|</span>
      <a href="https://money-movers.info">money-movers.info</a>
      <span class="separator">|</span>
      <a href="https://openorgs.info">openorgs.info</a>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  text-align: center;
  padding-top: 2rem;
  width: 100%;
}

.footer > div {
  margin: 0.5rem 0;
}

.separator {
  margin: 0 0.5rem;
  color: #999;
}

.links,
.sites {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.25rem;
}
</style>
