<script setup lang="ts">
import { ref, defineProps, type PropType } from 'vue';
import type { Transaction } from '@/models/Transaction';
import { TRANSACTION_TYPE } from '@/enums';
import Modal from './Modal.vue';

defineProps({
  transactions: {
    type: Array as PropType<Transaction[]>,
    required: true,
  },
})

const emit = defineEmits<{ (event: 'transactionDelete', transactionId: string): void }>();

// Track the transaction ID that will be edited/deleted
const selectedTransactionId = ref<string | null>(null);

const deleteTransaction = (transactionId?: string) => {
  if (transactionId) emit('transactionDelete', transactionId);
  closeDeleteConfirmation();
}

const dialog = ref<InstanceType<typeof Modal>>();

const showDeleteConfirmation = (transcationId: string) => {
  selectedTransactionId.value = transcationId;
  dialog.value?.show()
};

const closeDeleteConfirmation = () => {
  selectedTransactionId.value = null;
  dialog.value?.close()
};

</script>

<template>
  <ul id="list" class="list">
    <li v-for="transaction in transactions" :key="transaction.id"
      :class="` flex flex-row justify-between border-l-3 ${transaction.type === TRANSACTION_TYPE.EXPENSE ? 'border-l-red-400' : 'border-l-green-400'} mb-2 px-3 py-2 bg-neutral text-md lg:text-lg text-neutral-content`">
      {{ transaction.title }}
      <div>
        <span>{{ transaction.type === TRANSACTION_TYPE.EXPENSE ? '-' : '+' }}RM{{ transaction.amount.toFixed(2) }}</span>
        <button class="btn btn-soft btn-error ms-4 p-4" @click="showDeleteConfirmation(transaction.id!)"><i
            class="pi pi-times text-neutral-content text-xs"></i></button>
      </div>
    </li>
  </ul>
  <Modal ref="dialog">
    <h3 class="text-lg font-bold">Delete Transaction</h3>
    <p class="py-4">Are you sure you want to delete this transaction?</p>
    <div class="flex flex-row justify-end">
      <button class="btn me-2" @click="closeDeleteConfirmation">Cancel</button>
      <button class="btn btn-soft btn-error" @click="deleteTransaction(selectedTransactionId!)">Confirm</button>
    </div>
  </Modal>
</template>
