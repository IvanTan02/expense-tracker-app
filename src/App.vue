<script setup lang="ts">
import Navbar from './components/Navbar.vue';
import Balance from './components/Balance.vue';
import TransactionList from './components/TransactionList.vue';
import AddTransaction from './components/AddTransaction.vue';
import { getDtoFromTransaction, getTransactionFromDto, type Transaction, type TransactionDTO } from './models/Transaction';
import { onMounted, ref } from 'vue';
import { useToast } from 'vue-toastification';
import axios from 'axios';

const toast = useToast();

const transactions = ref<Transaction[]>([]);
const isLoading = ref(true);

const initTransactions = async () => {
  const response = await axios.get(`http://localhost:8000/transactions`);
  const responseData = response.data as TransactionDTO[];
  transactions.value = responseData.map(transaction => getTransactionFromDto(transaction));
  isLoading.value = false;
}

const onTransactionSubmit = async (transaction: Transaction) => {
  isLoading.value = true;
  await axios.post(`http://localhost:8000/transactions`, getDtoFromTransaction(transaction));
  toast.success('Transaction added successfully.');
  initTransactions();
}

const onTransactionDelete = async (transactionId: string) => {
  isLoading.value = true;
  await axios.delete(`http://localhost:8000/transactions/${transactionId}`);
  toast.info('Transaction deleted successfully.');
  initTransactions();
}

onMounted(async () => {
  initTransactions();
})

</script>

<template>
  <Navbar />
  <div class="container">
    <Balance :transactions="transactions" />
    <h3>History</h3>
    <div v-if="isLoading">Loading...</div>
    <TransactionList v-if="!isLoading" :transactions="transactions" @transactionDelete="onTransactionDelete($event)" />
    <AddTransaction @transactionSubmit="onTransactionSubmit($event)" />
  </div>
</template>