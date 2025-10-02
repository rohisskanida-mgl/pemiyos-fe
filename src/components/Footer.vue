<script lang="ts">
export default {
  name: 'AppFooter'
}
</script>

<script setup lang="ts">
interface Props {
  version?: string
  organization?: string
  year?: string
}
withDefaults(defineProps<Props>(), {
  version: 'v1.0',
  organization: 'IYOS',
  year: '2025',
})
</script>

<template>
  <footer class="px-6 py-6 mt-auto">
    <div class="max-w-mobile mx-auto text-center">
      <p class="text-sm text-text-dark/60 mb-1">Pemiyos {{ version }}</p>
      <p class="text-xs text-text-dark/50">© {{ year }} {{ organization }}</p>
    </div>
  </footer>
</template>
