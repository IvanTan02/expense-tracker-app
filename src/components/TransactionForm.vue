<script setup lang="ts">
import { TRANSACTION_TYPE } from '@/enums';
import type { Transaction } from '@/models/Transaction';
import { reactive, onMounted, ref, defineProps, type PropType } from 'vue';
import { useToast } from 'vue-toastification';
import axios from 'axios';
import { DateTime } from "luxon";

const props = defineProps({
  transaction: {
    type: Object as PropType<Transaction>,
  },
  editMode: {
    type: Boolean,
    default: false,
  }
})

const toast = useToast();
const emit = defineEmits<{
  (event: 'transactionSubmit', transaction: Transaction): void;
  (event: 'cancel'): void;
}>();

const transactionForm = reactive({
  title: '',
  type: TRANSACTION_TYPE.EXPENSE,
  amount: 0,
  category: '',
  date: DateTime.now().toFormat('yyyy-MM-dd'),
});

const transactionCategory = ref([]);
const isLoading = ref(true);

const initFormValues = () => {
  if (!props.transaction) return;
  transactionForm.title = props.transaction.title;
  transactionForm.type = props.transaction.type;
  transactionForm.amount = props.transaction.amount;
  transactionForm.category = props.transaction.category;
  transactionForm.date = props.transaction.date;
}

const onSubmit = () => {
  if (!transactionForm.title || !transactionForm.amount || !transactionForm.category) {
    toast.error('Fields are invalid');
    return;
  }
  const transaction: Transaction = {
    ...transactionForm,
    amount: Number(transactionForm.amount.toFixed(2))
  };
  if (props.editMode) transaction.id = props.transaction?.id;
  emit('transactionSubmit', transaction);
  resetForm();
}

const onCancel = () => {
  emit('cancel');
  resetForm();
}

const resetForm = () => {
  transactionForm.title = '';
  transactionForm.amount = 0;
  transactionForm.category = '';
}

onMounted(async () => {
  const response = await axios.get(`${import.meta.env.VITE_API_BASE_PATH}/transactions/categories`);
  transactionCategory.value = response.data;
  initFormValues();
  isLoading.value = false;
})

</script>

<template>
  <form @submit.prevent="onSubmit">
    <div class="tabs tabs-box tabs-md mb-5">
      <input class="tab w-1/2" aria-label="Expense" type="radio" id="expense" name="type"
        :value="TRANSACTION_TYPE.EXPENSE" v-model="transactionForm.type" :disabled="isLoading" />
      <input class="tab w-1/2" aria-label="Income" type="radio" id="income" name="type" :value="TRANSACTION_TYPE.INCOME"
        v-model="transactionForm.type" :disabled="isLoading" />
    </div>
    <div class="flex flex-col">
      <div class="grid grid-cols-1 lg:grid-cols-2">
        <div class="col-span-1 lg:pe-1 mb-2 lg:mb-5">
          <label class="input input-lg w-full">
            <span class="label"><i class="pi pi-pen-to-square text-neutral-content"></i></span>
            <input type="text" v-model="transactionForm.title" placeholder="Enter your transaction"
              :disabled="isLoading" />
          </label>
        </div>
        <div class="col-span-1 lg:ps-1 mb-2 lg:mb-5">
          <label class="select select-lg w-full">
            <span class="label"><i class="pi pi-folder text-neutral-content"></i></span>
            <select v-model="transactionForm.category" :disabled="isLoading">
              <option disabled selected value=''>{{ isLoading ? 'Loading Categories...' : 'Select Category' }}</option>
              <option v-for="category in transactionCategory" :key="category" :value="category">{{ category }}
              </option>
            </select>
          </label>
        </div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2">
        <div class="col-span-1 lg:pe-1 mb-2 lg:mb-5">
          <label class="input input-lg w-full">
            <span class="label"><i class="pi pi-dollar text-neutral-content"></i></span>
            <input type="number" v-model="transactionForm.amount" step=".01" :disabled="isLoading" />
          </label>
        </div>
        <div class="col-span-1 lg:ps-1 mb-2 lg:mb-5">
          <label class="input input-lg w-full">
            <span class="label"><i class="pi pi-calendar text-neutral-content"></i></span>
            <input type="date" v-model="transactionForm.date" :disabled="isLoading" />
          </label>
        </div>
      </div>
      <div class="flex flex-row justify-end">
        <button v-if="editMode" type="button" class="btn btn-soft btn-base me-1 grow" @click="onCancel"
          :disabled="isLoading">Cancel</button>
        <button class="btn btn-soft btn-primary ms-1 grow" type="submit"
          :disabled="isLoading">{{ editMode ? 'Save' : 'Add' }} Transaction</button>
      </div>
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

  /* Active tab style */
  :is(.tab-active, [aria-selected="true"], input:checked) {
    font-weight: bold;
    box-shadow: 0 1px oklch(100% 0 0 / calc(var(--depth) * 0.1)) inset,
      0 1px 1px -1px color-mix(in oklab, var(--color-neutral) calc(var(--depth) * 50%), #0000),
      0 1px 6px -4px color-mix(in oklab, var(--color-neutral) calc(var(--depth) * 100%), #0000);

    @media (forced-colors: active) {
      border: 1px solid;
    }
  }

  :is(.tab-active, [aria-selected="true"], input:checked)[aria-label="Expense"] {
    background-color: color-mix(in oklab,
        var(--color-error, var(--color-base-content)) 8%,
        var(--color-base-100));
    color: var(--color-error);
  }

  :is(.tab-active, [aria-selected="true"], input:checked)[aria-label="Income"] {
    background-color: color-mix(in oklab,
        var(--color-success, var(--color-base-content)) 8%,
        var(--color-base-100));
    color: var(--color-success);
  }

}
</style>
