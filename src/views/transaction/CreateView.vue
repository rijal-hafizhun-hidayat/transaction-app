<script setup lang="ts">
import DashboardLayout from '@/layout/DashboardLayout.vue'
import InputLabel from '@/components/base/InputLabel.vue'
import DateInput from '@/components/base/DateInput.vue'
import TextInput from '@/components/base/TextInput.vue'
import PrimaryButton from '@/components/base/PrimaryButton.vue'
import { reactive, ref, type Ref } from 'vue'

interface Form {
  no: string
  date: Date
  costumer: string
  code: string
  name: string
  phone_number: string
}

const isLoading: Ref<boolean> = ref(false)
const form: Form = reactive({
  no: '',
  date: new Date(),
  costumer: '',
  code: '',
  name: '',
  phone_number: '',
})

const send = () => {
  console.log(form)
}
</script>
<template>
  <DashboardLayout>
    <template #header>
      <div class="flex justify-between">
        <div>
          <h2 class="font-semibold text-xl text-gray-800 leading-tight">Tambah Transaksi</h2>
        </div>
      </div>
    </template>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white mt-10 px-4 py-6 rounded shadow-md overflow-x-auto">
        <form @submit.prevent="send" class="space-y-4">
          <div class="space-y-7">
            <div class="space-y-3">
              <div>
                <h1 class="font-semibold">Transaksi</h1>
              </div>
              <div>
                <hr />
              </div>
              <div class="space-y-4">
                <div>
                  <InputLabel>no</InputLabel>
                  <TextInput type="text" class="mt-1 block w-full" v-model="form.no" />
                </div>
                <div>
                  <InputLabel>Tanggal</InputLabel>
                  <DateInput class="mt-1 block w-full" v-model="form.date" />
                </div>
              </div>
            </div>
            <div class="space-y-3">
              <div>
                <h1 class="font-semibold">Costumer</h1>
              </div>
              <div>
                <hr />
              </div>
              <div class="space-y-4">
                <div>
                  <InputLabel>kode</InputLabel>
                  <TextInput type="text" class="mt-1 block w-full" v-model="form.no" />
                </div>
                <div>
                  <InputLabel>nama</InputLabel>
                  <TextInput :disabled="true" class="mt-1 block w-full" v-model="form.name" />
                </div>
                <div>
                  <InputLabel>Telp</InputLabel>
                  <TextInput
                    :disabled="true"
                    class="mt-1 block w-full"
                    v-model="form.phone_number"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end">
            <PrimaryButton :disabled="isLoading" type="submit">simpan</PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  </DashboardLayout>
</template>
