<script setup lang="ts">
import Navbar from './components/Navbar.vue';
import Balance from './components/Balance.vue';
import TransactionList from './components/TransactionList.vue';
import AddTransaction from './components/AddTransaction.vue';
import type { Transaction } from './models/Transaction';
import { onMounted, ref } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast();

const transactions = ref<Transaction[]>([]);

const onTransactionSubmit = (transaction: Transaction) => {
  transactions.value.push(transaction);
  localStorage.setItem('transactions', JSON.stringify(transactions.value));
  toast.success('Transaction added successfully.');
}

const onTransactionDelete = (transactionId: string) => {
  transactions.value = transactions.value.filter(transaction => transaction.id !== transactionId);
  localStorage.setItem('transactions', JSON.stringify(transactions.value));
  toast.info('Transaction deleted successfully.');
}

onMounted(() => {
  const data = localStorage.getItem('transactions');
  transactions.value = data ? JSON.parse(data) : [];
})

</script>

<template>
  <Navbar />
  <div class="container">
    <Balance :transactions="transactions" />
    <TransactionList :transactions="transactions" @transactionDelete="onTransactionDelete($event)" />
    <AddTransaction @transactionSubmit="onTransactionSubmit($event)" />
  </div>
</template>