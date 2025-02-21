<script setup lang="ts">
import { ref, defineProps, type PropType } from 'vue';
import { getDtoFromTransaction, type Transaction } from '@/models/Transaction';
import { TRANSACTION_TYPE } from '@/enums';
import Modal from './Modal.vue';
import TransactionForm from './TransactionForm.vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';

defineProps({
  transactions: {
    type: Array as PropType<Transaction[]>,
    required: true,
  },
})

const toast = useToast();

const emit = defineEmits<{
  (event: 'transactionsUpdated'): void;
}>();

// Track the transaction ID that will be edited/deleted
const selectedTransaction = ref<Transaction | null>(null);

const editTransactionDialog = ref<InstanceType<typeof Modal>>();
const deleteConfirmationDialog = ref<InstanceType<typeof Modal>>();

const showEditTransaction = (transcation: Transaction) => {
  selectedTransaction.value = transcation;
  editTransactionDialog.value?.show()
}

const showDeleteConfirmation = (transcation: Transaction) => {
  selectedTransaction.value = transcation;
  deleteConfirmationDialog.value?.show()
};

const closeEditTransaction = () => {
  selectedTransaction.value = null;
  editTransactionDialog.value?.close()
};

const closeDeleteConfirmation = () => {
  selectedTransaction.value = null;
  deleteConfirmationDialog.value?.close()
};

const onSaveTransaction = async (transaction: Transaction) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_PATH}/transactions/${transaction.id}`, getDtoFromTransaction(transaction));
    if (response.status === 200) {
      toast.success('Transaction updated successfully.')
      closeEditTransaction();
      emit('transactionsUpdated');
    } else {
      toast.error('Failed to update transaction.')
    }
  } catch (error) {
    toast.error('Error adding transaction.');
    console.error(error);
  }
}

const deleteTransaction = async (transaction?: Transaction) => {
  try {
    if (!transaction || !transaction.id) return;
    const response = await axios.delete(`${import.meta.env.VITE_API_BASE_PATH}/transactions/${transaction.id}`);
    if (response.status === 200) {
      toast.info('Transaction deleted successfully.');
      closeDeleteConfirmation();
      emit('transactionsUpdated');
    } else {
      toast.error('Failed to delete transaction.')
    }
  } catch (error) {
    toast.error('Error adding transaction.');
    console.error(error);
  }
}

</script>

<template>
  <ul id="list" class="list">
    <li v-for="transaction in transactions" :key="transaction.id"
      :class="` flex flex-row justify-between border-l-3 ${transaction.type === TRANSACTION_TYPE.EXPENSE ? 'border-l-red-400' : 'border-l-green-400'} mb-2 px-3 py-2 bg-neutral text-md lg:text-lg text-neutral-content`">
      {{ transaction.title }}
      <div>
        <span>{{ transaction.type === TRANSACTION_TYPE.EXPENSE ? '-' : '+' }}RM{{ transaction.amount.toFixed(2) }}</span>
        <button class="btn btn-soft btn-info ms-5 p-4" @click="showEditTransaction(transaction)"><i
            class="pi pi-pencil text-neutral-content text-xs"></i></button>
        <button class="btn btn-soft btn-error ms-2 p-4" @click="showDeleteConfirmation(transaction)"><i
            class="pi pi-times text-neutral-content text-xs"></i></button>
      </div>
    </li>
  </ul>
  <!-- Edit Transaction -->
  <Modal ref="editTransactionDialog">
    <h2 class="text-xl uppercase font-bold text-center border-b-1 border-b-gray-500 pb-2 mb-3">Edit Transaction</h2>
    <TransactionForm v-if="selectedTransaction!" :key="selectedTransaction.id" :transaction="selectedTransaction"
      :editMode="true" @transactionSubmit="onSaveTransaction($event)" @cancel="closeEditTransaction" />
  </Modal>
  <!-- Confirm Delete Transaction -->
  <Modal ref="deleteConfirmationDialog">
    <h3 class="text-lg font-bold">Delete Transaction</h3>
    <p class="py-4">Are you sure you want to delete this transaction?</p>
    <div class="flex flex-row justify-end">
      <button class="btn me-2" @click="closeDeleteConfirmation">Cancel</button>
      <button class="btn btn-soft btn-error"
        @click="deleteTransaction(selectedTransaction || undefined)">Confirm</button>
    </div>
  </Modal>
</template>
