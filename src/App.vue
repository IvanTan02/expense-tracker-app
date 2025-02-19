<script setup lang="ts">
import Navbar from './components/Navbar.vue';
import Balance from './components/Balance.vue';
import TransactionList from './components/TransactionList.vue';
import AddTransaction from './components/AddTransaction.vue';
import { getDtoFromTransaction, getTransactionFromDto, type Transaction, type TransactionDTO } from './models/Transaction';
import { onMounted, ref } from 'vue';
import { useToast } from 'vue-toastification';
import axios from 'axios';
import MoonLoader from 'vue-spinner/src/MoonLoader.vue';

const toast = useToast();

const transactions = ref<Transaction[]>([]);
const isLoading = ref(true);

const initTransactions = async () => {
  const response = await axios.get(`${import.meta.env.VITE_API_BASE_PATH}/transactions`);
  const responseData = response.data as TransactionDTO[];
  transactions.value = responseData.map(transaction => getTransactionFromDto(transaction));
  isLoading.value = false;
}

const onTransactionSubmit = async (transaction: Transaction) => {
  isLoading.value = true;
  await axios.post(`${import.meta.env.VITE_API_BASE_PATH}/transactions`, getDtoFromTransaction(transaction));
  toast.success('Transaction added successfully.');
  initTransactions();
}

const onTransactionDelete = async (transactionId: string) => {
  isLoading.value = true;
  await axios.delete(`${import.meta.env.VITE_API_BASE_PATH}/transactions/${transactionId}`);
  toast.info('Transaction deleted successfully.');
  initTransactions();
}

onMounted(async () => {
  initTransactions();
})

</script>

<template>
  <section class="m-auto p-5" style="max-width: 800px;">
    <Navbar />
    <div class="flex flex-col">
      <Balance :transactions="transactions" />
      <AddTransaction @transactionSubmit="onTransactionSubmit($event)" />
      <h3 class="mt-10 mb-2 pb-2 text-lg lg:text-2xl uppercase border-b-1 border-b-gray-500">History</h3>
      <div class="flex flex-row justify-center">
        <moon-loader :loading="isLoading" size="40px"></moon-loader>
      </div>
      <TransactionList v-if="!isLoading" :transactions="transactions"
        @transactionDelete="onTransactionDelete($event)" />
    </div>
  </section>
</template>

<style scoped></style>
