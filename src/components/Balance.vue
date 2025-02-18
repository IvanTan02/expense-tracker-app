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
  <h4>Your Balance</h4>
  <h1 id="balance">RM{{ total.toFixed(2) }}</h1>

  <div class="inc-exp-container">
    <div>
      <h4>Income</h4>
      <p id="money-plus" class="money plus">+RM{{ income }}</p>
    </div>
    <div>
      <h4>Expense</h4>
      <p id="money-minus" class="money minus">-RM{{ expenses }}</p>
    </div>
  </div>
</template>

<style scoped>
.inc-exp-container {
  background-color: #fff;
  box-shadow: var(--box-shadow);
  padding: 20px;
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
}

.inc-exp-container>div {
  flex: 1;
  text-align: center;
}

.inc-exp-container>div:first-of-type {
  border-right: 1px solid #dedede;
}
</style>