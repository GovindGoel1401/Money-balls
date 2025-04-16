<template>
  <q-page>
    <div class="q-pa-md">
      <q-list separator bordered>
        <q-slide-item
          left-color="positive"
          right-color="negative"
          v-for="entry in entries"
          :key="entry.id"
          @right="onEntrySlideRight($event, entry)"
          @left="onEntrySlideLeft($event, entry)"
        >
          <template v-slot:left>
            <q-icon name="check" />
          </template>
          <template v-slot:right>
            <q-icon name="delete" />
          </template>

          <q-item>
            <q-item-section
              :class="[
                useAmountColorClass(entry.amount),
                { 'text-grey-5': entry.reviewed }
              ]"
            >
              {{ entry.name || 'Unnamed' }}
            </q-item-section>

            <q-item-section
              side
              :class="[
                useAmountColorClass(entry.amount),
                'text-right',
                { 'text-grey-5': entry.reviewed }
              ]"
            >
              {{ currencify(entry.amount) }}
            </q-item-section>
          </q-item>
        </q-slide-item>
      </q-list>
    </div>

    <q-footer class="bg-transparent">
      <div class="row q-px-md q-py-sm shadow-up-3 q-mb-sm">
        <div class="col text-grey-7 text-h6">Balance</div>
        <div class="col text-h6 text-right" :class="useAmountColorClass(balance)">
          {{ currencify(balance) }}
        </div>
      </div>

      <q-form @submit="addEntry" class="row q-px-sm q-pb-sm q-col-gutter-sm bg-primary">
        <div class="col">
          <q-input
            ref="nameRef"
            v-model="addEntryForm.name"
            outlined
            bg-color="white"
            placeholder="Name"
            dense
          />
        </div>
        <div class="col">
          <q-input
            v-model.number="addEntryForm.amount"
            outlined
            bg-color="white"
            input-class="text-right"
            type="number"
            step="0.01"
            placeholder="Amount"
            dense
          />
        </div>
        <div class="col col-auto">
          <q-btn round color="primary" icon="add" type="submit" />
        </div>
      </q-form>
    </q-footer>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { uid, useQuasar } from 'quasar'
import { useCurrencify } from 'src/use/useCurrencify'
import { useAmountColorClass } from 'src/use/useAmountColorClass'

const $q = useQuasar()

const entries = ref([
  { id: 'id1', name: 'Salary', amount: 4999.99, reviewed: false },
  { id: 'id2', name: 'Rent', amount: -999, reviewed: false },
  { id: 'id3', name: 'Phone', amount: -14.99, reviewed: false },
  { id: 'id4', name: '', amount: 0, reviewed: false }
])

function currencify(amount) {
  let posNegSymbol = ''
  if (amount > 0) posNegSymbol = '+'
  else if (amount < 0) posNegSymbol = '-'

  const currencySymbol = '$'
  const amountPositive = Math.abs(amount)

  if (typeof amount !== 'number') {
    amount = Number(amount) || 0
  }

  const amountFormatted = amountPositive.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })

  return `${posNegSymbol} ${currencySymbol} ${amountFormatted}`
}

const balance = computed(() => {
  return entries.value.reduce((acc, { amount }) => acc + amount, 0)
})

const nameRef = ref(null)

const addEntryFormDefault = {
  name: '',
  amount: null
}

const addEntryForm = reactive({ ...addEntryFormDefault })

const addEntryFormReset = () => {
  Object.assign(addEntryForm, addEntryFormDefault)
  nameRef.value.focus()
}

const addEntry = () => {
  const newEntry = {
    ...addEntryForm,
    id: uid(),
    reviewed: false
  }
  entries.value.push(newEntry)
  addEntryFormReset()
}

const onEntrySlideRight = ({ reset }, entry) => {
  $q.dialog({
    title: 'Delete Entry',
    message: `
      Delete this entry?
      <div class="q-mt-md text-weight-bold ${useAmountColorClass(entry.amount)}">
        ${entry.name || 'Unnamed'} : ${currencify(entry.amount)}
      </div>`,
    cancel: true,
    persistent: true,
    html: true,
    ok: {
      label: 'Delete',
      color: 'negative',
      noCaps: true
    },
    cancel: {
      color: 'primary',
      noCaps: true
    }
  }).onOk(() => {
    deleteEntry(entry.id)
  }).onCancel(() => {
    reset()
  })
}

const onEntrySlideLeft = ({ reset }, entry) => {
  $q.dialog({
    title: 'Mark as Reviewed',
    message: `
      Mark this entry as reviewed?
      <div class="q-mt-md text-weight-bold ${useAmountColorClass(entry.amount)}">
        ${entry.name || 'Unnamed'} : ${currencify(entry.amount)}
      </div>`,
    cancel: true,
    persistent: true,
    html: true,
    ok: {
      label: 'Mark Reviewed',
      color: 'positive',
      noCaps: true
    },
    cancel: {
      color: 'primary',
      noCaps: true
    }
  }).onOk(() => {
    markReviewed(entry.id)
    $q.notify({
      message: `"${entry.name || 'Unnamed'}" marked as reviewed.`,
      color: 'positive'
    })
    reset()
  }).onCancel(() => {
    reset()
  })
}

const deleteEntry = (entryID) => {
  const index = entries.value.findIndex((entry) => entry.id === entryID)
  entries.value.splice(index, 1)
  $q.notify('Entry Deleted')
}

const markReviewed = (entryID) => {
  const entry = entries.value.find((e) => e.id === entryID)
  if (entry) {
    entry.reviewed = true
  }
}
</script>
