<script setup lang="ts">
import { TRANSACTION_TYPE } from '@/enums';
import type { Transaction } from '@/models/Transaction';
import { reactive } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast();
const emit = defineEmits<{ (event: 'transactionSubmit', transaction: Transaction): void }>();

const transactionForm = reactive<Transaction>({
  title: '',
  type: TRANSACTION_TYPE.EXPENSE,
  amount: 0,
});

const onSubmit = () => {
  if (!transactionForm.title || !transactionForm.amount) {
    toast.error('Fields are invalid');
    return;
  }
  emit('transactionSubmit', { ...transactionForm, amount: Number(transactionForm.amount.toFixed(2)), id: Math.floor(Math.random() * 100000).toString() });
  transactionForm.title = '';
  transactionForm.amount = 0;
}
</script>

<template>
  <h3 class="mt-10 mb-2 pb-2 text-lg lg:text-2xl uppercase border-b-1 border-b-gray-500">Add Transaction</h3>
  <form @submit.prevent="onSubmit">
    <div class="tabs tabs-box tabs-md mb-5">
      <input class="tab w-1/2" aria-label="Expense" type="radio" id="expense" name="type"
        :value="TRANSACTION_TYPE.EXPENSE" v-model="transactionForm.type" />
      <input class="tab w-1/2" aria-label="Income" type="radio" id="income" name="type" :value="TRANSACTION_TYPE.INCOME"
        v-model="transactionForm.type" />
    </div>
    <div class="flex flex-col">
      <label class="input input-lg mb-5 w-full">
        <span class="label"><i class="pi pi-pen-to-square text-neutral-content"></i></span>
        <input type="text" v-model="transactionForm.title" placeholder="Enter your transaction" />
      </label>
      <div>
        <label class="input validator input-lg w-full">
          <span class="label"><i class="pi pi-dollar text-neutral-content"></i></span>
          <input type="number" v-model="transactionForm.amount" step=".01" />
        </label>
        <div class="validator-hint">Max two decimal places</div>
      </div>
      <button class="btn btn-soft btn-primary">Add Transaction</button>
    </div>
  </form>
</template>

<style scoped>
.tabs-box {
  background-color: var(--color-base-200);
  padding: 0.25rem;
  border-radius: var(--radius-field);
  box-shadow: 0 -0.5px oklch(100% 0 0 / calc(var(--depth) * 0.1)) inset,
    0 0.5px oklch(0% 0 0 / calc(var(--depth) * 0.05)) inset;

  /* Default tab style (inactive) */
  .tab {
    border-radius: var(--radius-field);
    border-style: none;
    background-color: var(--color-base-300);
    color: var(--color-base-content-dim);
    transition: background-color 0.2s ease-in, color 0.2s ease-in;

    &:hover {
      background-color: var(--color-base-400);
    }

    &:focus-visible {
      outline-offset: 2px;
    }
  }

  /* Active tab state */
  :is(.tab-active, [aria-selected="true"], input:checked) {
    background-color: color-mix(in oklab,
        var(--color-secondary, var(--color-base-content)) 8%,
        var(--color-base-100));
    color: var(--color-secondary);
    font-weight: bold;

    &:hover {
      color: var(--color-secondary);
    }

    box-shadow: 0 1px oklch(100% 0 0 / calc(var(--depth) * 0.1)) inset,
    0 1px 1px -1px color-mix(in oklab, var(--color-neutral) calc(var(--depth) * 50%), #0000),
    0 1px 6px -4px color-mix(in oklab, var(--color-neutral) calc(var(--depth) * 100%), #0000);

    @media (forced-colors: active) {
      border: 1px solid;
    }
  }
}
</style>
