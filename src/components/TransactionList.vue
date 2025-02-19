<script setup lang="ts">
import { defineProps, type PropType } from 'vue';
import type { Transaction } from '@/models/Transaction';
import { TRANSACTION_TYPE } from '@/enums';

defineProps({
  transactions: {
    type: Array as PropType<Transaction[]>,
    required: true,
  },
})

const emit = defineEmits<{ (event: 'transactionDelete', transactionId: string): void }>();

const deleteTransaction = (transactionId?: string) => {
  if (transactionId) emit('transactionDelete', transactionId);
}

</script>

<template>
  <ul id="list" class="list">
    <li v-for="transaction in transactions" :key="transaction.id"
      :class="`border-2 border-transparent ${transaction.type === TRANSACTION_TYPE.EXPENSE ? 'border-r-red-400' : 'border-r-green-400'} mb-2 px-3 py-2 bg-neutral text-md lg:text-lg text-neutral-content`">
      {{ transaction.title }}
      <span>{{ transaction.type === TRANSACTION_TYPE.EXPENSE ? '-' : '+' }}RM{{ transaction.amount.toFixed(2) }}</span>
      <button @click="deleteTransaction(transaction.id || undefined)" class="delete-btn">x</button>
    </li>
  </ul>
</template>

<style scoped>
.list li {
  box-shadow: var(--box-shadow);
  display: flex;
  justify-content: space-between;
  position: relative;
}

.delete-btn {
  cursor: pointer;
  background-color: #e74c3c;
  border: 0;
  color: #fff;
  font-size: 20px;
  line-height: 20px;
  padding: 2px 5px;
  position: absolute;
  top: 50%;
  left: 0;
  transform: translate(-100%, -50%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.list li:hover .delete-btn {
  opacity: 1;
}
</style>
