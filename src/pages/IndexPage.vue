<template>
  <q-page>
    <div class="q-pa-md">
      <q-list separator bordered>
        <q-slide-item
          left-color="positive"
          right-color="negative"
          v-for="entry in entries"
          :key="entry.id"
         @right="onEntrySlideRight($event,entry)">
        <template v-slot:left>
          <q-icon name="done" />
        </template>
        <template v-slot:right>
          <q-icon name="delete"/>
        </template>

        
        
        <q-item
>
          <q-item-section 
          :class="useAmountColorClass(entry.amount)"
          >
            {{ entry.name || 'Unnamed' }}
          </q-item-section>

          <q-item-section 
          :class="useAmountColorClass(entry.amount)"
          
          side>
            {{ currencify(entry.amount) }}
          </q-item-section>
        </q-item>
        </q-slide-item>
      </q-list>
    </div>
    <q-footer
    class="bg-transparent"
    >
    <div class="row q-px-md q-py-sm shadow-up-3 q-mb-sm">
      <div class="col text-grey-7 text-h6">
      
      Balance
      
      </div>
      <div class ="col text-h6 text-right"
      :class="useAmountColorClass(balance)"
      >
      
      {{ currencify(balance) }}
      
      </div>
    </div>
      <q-form
      @submit="addEntry"
       class="row q-px-sm q-pb-sm q-col-gutter-sm bg-primary">
        
        <div class="col">
          <q-input 
          ref="nameRef"
          v-model="addEntryForm.name"
          outlined
          bg-color="white" 
           placeholder="Name" 
           dense />
        </div>
        <div class="col">
          <q-input 
          
          outlined 
          v-model.number="addEntryForm.amount"
          bg-color="white" 
          input-class="text-right"
          type="number"
          step="0.01"
           placeholder="Amount" 
           dense />
        </div>
        <div class="col col-auto">
          <q-btn 
          round color="primary" 
          icon="add"
          type="submit" />
        </div>

      </q-form>
    </q-footer>
  </q-page>
</template>

<script setup>
import { uid,useQuasar} from 'quasar'
import { ref,computed,reactive} from 'vue'
import { useCurrencify} from 'src/use/useCurrencify'
import { useAmountColorClass } from 'src/use/useAmountColorClass'


const $q= useQuasar()
const entries = ref([ 
  {
    id: 'id1',
    name: 'Salary',
    amount: 4999.99
  },
  {
    id: 'id2',
    name: 'Rent',
    amount: -999
  },
  {
    id: 'id3',
    name: 'Phone',
    amount: -14.99
  },
  {
    id: 'id4',
    name: '',
    amount: 0
  }
])

function currencify(amount) {
  let posNegSymbol = ''
  if (amount > 0) posNegSymbol = '+'
  else if (amount < 0) posNegSymbol = '-'
  const currencySymbol = '$',
        amountPositive= Math.abs(amount)

  if (typeof amount !== 'number') {
    amount = Number(amount) || 0
  }
  
  const amountFormatted = amountPositive.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })

  // Use backticks for string interpolation
  return `${posNegSymbol} ${currencySymbol} ${amountFormatted}`
}

const balance = computed(() =>{
  return entries.value.reduce((accumulator,{ amount }) => {
      return accumulator + amount 
  },0)
})

const nameRef = ref(null)
const addEntryFormdefault={
  name:'',
  amount: null
}
const addEntryForm = reactive({

  ...addEntryFormdefault
})
const addEntryFormReset=()=>{
  Object.assign(addEntryForm, addEntryFormdefault)
  nameRef.value.focus()
}
const addEntry=() =>{
  // const newEntry ={
    // id: uid(),
    // name:'addEntryForm.name',
    // amount: addEntryForm.amount
  // }

  const newEntry = Object.assign({}, addEntryForm, { id: uid() })

  entries.value.push(newEntry)
  
}
const onEntrySlideRight = ({reset,entry}) =>{
  $q.dialog({
        title: 'Delete Entry',
        message: 'Delete this Entry?<div class="q-mt-md text-weight-bold ${ useAmountColorClass(entry.amount)}">${entry.name} : ${entry.amount}</div>',
        cancel: true,
        persistent: true,
        html:true,
        ok:{
          label: 'Delete',
          color: 'negative',
          noCaps: true
        },
        cancel:{
          // label: 'Delete',
          color: 'primary',
          noCaps: true
        }
      }).onOk(() => {
        // console.log('>>>> OK')
        deleteEntry(entry.id)
      }).onCancel(() => {
        reset()
      })
}


const deleteEntry=entryID=> {
    const index = entries.value.findIndex(entry=>entry.id === entryID)
    entries.value.splice(index,1)
    $q.notify('Entry Deleted')
}
</script>
