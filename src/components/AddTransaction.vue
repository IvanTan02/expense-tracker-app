<script setup lang="ts">
import { TRANSACTION_TYPE } from '@/enums';
import type { Transaction } from '@/models/Transaction';
import { reactive } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast();

// const emit = defineEmits<Transaction>(['transactionSubmit']);
const emit = defineEmits<{ (event: 'transactionSubmit', transaction: Transaction): void }>();

const transactionForm = reactive<Transaction>({
  title: '',
  type: TRANSACTION_TYPE.INCOME,
  amount: 0,
});

const onSubmit = () => {
  if (!transactionForm.title || !transactionForm.amount) {
    toast.error('Fields are invalid');
    return;
  }
  emit('transactionSubmit', { ...transactionForm, id: Math.floor(Math.random() * 100000).toString() });
  transactionForm.title = '';
  transactionForm.amount = 0;
}
</script>

<template>
  <h3>Add New Transaction</h3>
  <form id="form" @submit.prevent="onSubmit">
    <div class="form-control">
      <input type="radio" id="income" name="type" :value="TRANSACTION_TYPE.INCOME" v-model="transactionForm.type" />
      <label for="income">Income</label>
      <input type="radio" id="expense" name="type" :value="TRANSACTION_TYPE.EXPENSE" v-model="transactionForm.type" />
      <label for="expense">Expense</label>
    </div>
    <div class="form-control">
      <label for="text">Text</label>
      <input type="text" id="text" v-model="transactionForm.title" placeholder="Enter text..." />
    </div>
    <div class="form-control">
      <label for="amount">Amount</label>
      <input type="number" id="amount" v-model="transactionForm.amount" placeholder="Enter amount..." />
    </div>
    <button class="btn">Add transaction</button>
  </form>
</template>