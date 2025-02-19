<script setup lang="ts">
import { TRANSACTION_TYPE } from '@/enums';
import type { Transaction } from '@/models/Transaction';
import { reactive } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast();
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
  <h3 class="text-lg lg:text-2xl uppercase">Add Transaction</h3>
  <form @submit.prevent="onSubmit">
    <div class="tabs tabs-box tabs-md mb-5">
      <input class="tab w-50" aria-label="Income" type="radio" id="income" name="type" :value="TRANSACTION_TYPE.INCOME"
        v-model="transactionForm.type" />
      <input class="tab w-50" aria-label="Expense" type="radio" id="expense" name="type"
        :value="TRANSACTION_TYPE.EXPENSE" v-model="transactionForm.type" />
    </div>
    <div class="flex flex-col">
      <label class="floating-label mb-5">
        <span>Title</span>
        <input type="text" class="input input-lg w-100" v-model="transactionForm.title" />
      </label>
      <label class="floating-label mb-5">
        <span>Amount</span>
        <input type="number" class="input input-lg w-100" v-model="transactionForm.amount" />
      </label>
      <button class="btn btn-soft btn-primary">Add Transaction</button>
    </div>
  </form>
</template>
