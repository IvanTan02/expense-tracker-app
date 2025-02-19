<script setup lang="ts">
import { computed, defineProps, type PropType } from 'vue';
import type { Transaction } from '@/models/Transaction';
import { TRANSACTION_TYPE } from '@/enums';

const props = defineProps({
  transactions: {
    type: Array as PropType<Transaction[]>,
    required: true,
  },
})

const total = computed(() => {
  return props.transactions.reduce((acc, transaction) => {
    return transaction.type === TRANSACTION_TYPE.EXPENSE ? acc - transaction.amount :
      transaction.type === TRANSACTION_TYPE.INCOME ? acc + transaction.amount : acc
  }, 0);
});

const income = computed(() => {
  return props.transactions
    .filter(transaction => transaction.type === TRANSACTION_TYPE.INCOME)
    .reduce((acc, transaction) => {
      return acc + transaction.amount;
    }, 0)
    .toFixed(2)
});

const expenses = computed(() => {
  return props.transactions
    .filter(transaction => transaction.type === TRANSACTION_TYPE.EXPENSE)
    .reduce((acc, transaction) => {
      return acc + transaction.amount;
    }, 0)
    .toFixed(2)
});

</script>

<template>
  <div class="mt-4 text-center">
    <h4 class="text-lg lg:text-2xl">Net Spend</h4>
    <h4 :class="`text-xl lg:text-3xl ${total >= 0 ? 'text-green-400' : 'text-red-400'}`">RM{{ total.toFixed(2) }}</h4>
  </div>

  <div class="inc-exp-container mt-4 bg-neutral rounded-lg flex flex-col justify-evenly lg:flex-row shadow-lg">
    <div class="text-center px-6 py-4 w-full lg:w-1/2">
      <h4 class="text-neutral-content">Income</h4>
      <p class="text-green-400">+RM{{ income }}</p>
    </div>
    <div class="text-center px-6 py-4 w-full lg:w-1/2">
      <h4>Expense</h4>
      <p class="text-red-400">-RM{{ expenses }}</p>
    </div>
  </div>
</template>

<style scoped>
.inc-exp-container>div:first-of-type {
  border-bottom: 1px solid var(--color-gray-500);
}

@media (width >=64rem) {
  .inc-exp-container>div:first-of-type {
    border-right: 1px solid var(--color-gray-500);
    border-bottom: none;
  }
}
</style>
