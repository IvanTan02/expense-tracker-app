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
      :class="` flex flex-row justify-between border-l-3 ${transaction.type === TRANSACTION_TYPE.EXPENSE ? 'border-l-red-400' : 'border-l-green-400'} mb-2 px-3 py-2 bg-neutral text-md lg:text-lg text-neutral-content`">
      {{ transaction.title }}
      <div>
        <span>{{ transaction.type === TRANSACTION_TYPE.EXPENSE ? '-' : '+' }}RM{{ transaction.amount.toFixed(2) }}</span>
        <button class="btn btn-soft btn-error ms-4 p-4" @click="deleteTransaction(transaction.id || undefined)"><i
            class="pi pi-times text-neutral-content text-xs"></i></button>
      </div>
    </li>
  </ul>
</template>
