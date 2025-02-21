<script setup lang="ts">
import Navbar from './components/Navbar.vue';
import Balance from './components/Balance.vue';
import TransactionList from './components/TransactionList.vue';
import TransactionForm from './components/TransactionForm.vue';
import { getDtoFromTransaction, getTransactionFromDto, type Transaction, type TransactionDTO } from './models/Transaction';
import { onMounted, ref } from 'vue';
import { useToast } from 'vue-toastification';
import axios from 'axios';
import LoadingSpinner from './components/LoadingSpinner.vue';

const toast = useToast();

const transactions = ref<Transaction[]>([]);
const isLoading = ref(true);

const initTransactions = async () => {
  isLoading.value = true;
  const response = await axios.get(`${import.meta.env.VITE_API_BASE_PATH}/transactions`);
  const responseData = response.data as TransactionDTO[];
  transactions.value = responseData.map(transaction => getTransactionFromDto(transaction));
  isLoading.value = false;
}

const onTransactionSubmit = async (transaction: Transaction) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_PATH}/transactions`, getDtoFromTransaction(transaction));
    if (response.status === 200) {
      toast.success('Transaction added successfully.');
      initTransactions();
    } else {
      toast.error('Error adding transaction.');
    }
  } catch (error) {
    toast.error('Error adding transaction.');
    console.error(error);
  }
}

onMounted(async () => {
  initTransactions();
})

</script>

<template>
  <section class="m-auto p-5" style="max-width: 800px;">
    <Navbar />
    <div class="flex flex-col" v-if="!isLoading">
      <Balance :transactions="transactions" />
      <h3 class="mt-10 mb-2 pb-2 text-lg lg:text-2xl uppercase border-b-1 border-b-gray-500">Add Transaction</h3>
      <TransactionForm @transactionSubmit="onTransactionSubmit($event)" />
      <h3 class="mt-10 mb-2 pb-2 text-lg lg:text-2xl uppercase border-b-1 border-b-gray-500">History</h3>
      <div style="max-height: 300px; overflow-y: auto;">
        <TransactionList :transactions="transactions" @transactionsUpdated="() => { initTransactions() }" />
      </div>
    </div>
    <LoadingSpinner v-if="isLoading" />
  </section>
</template>

<style scoped></style>
