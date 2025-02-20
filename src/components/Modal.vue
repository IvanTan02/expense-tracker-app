<script setup lang="ts">
import { ref, defineExpose } from 'vue';

const dialogRef = ref<HTMLDialogElement | null>(null);

const showDialog = () => dialogRef.value?.showModal();
const closeDialog = () => dialogRef.value?.close();

const closeFromEvent = (event: Event) => {
  if (event.currentTarget === event.target) closeDialog();
}

defineExpose({ show: showDialog, close: closeDialog });
</script>

<template>
  <dialog ref="dialogRef" class="modal" @click="closeFromEvent">
    <div class="modal-box">
      <slot />
    </div>
  </dialog>
</template>
