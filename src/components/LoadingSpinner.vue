<script setup lang="ts">
import MoonLoader from 'vue-spinner/src/MoonLoader.vue';
import { defineProps } from 'vue';

defineProps({
  containerSize: { type: String, default: '100px' },
  loaderSize: { type: String, default: '40px' },
  color: { type: String, default: '#d7dae5' },
})
</script>

<template>
  <div class="flex flex-row justify-center items-center" :style="`height: ${containerSize}`">
    <moon-loader :size="loaderSize" :color="color"></moon-loader>
  </div>
</template>
