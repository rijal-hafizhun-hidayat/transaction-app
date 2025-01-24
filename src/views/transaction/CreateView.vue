<script setup lang="ts">
import DashboardLayout from '@/layout/DashboardLayout.vue'
import InputLabel from '@/components/base/InputLabel.vue'
import DateInput from '@/components/base/DateInput.vue'
import TextInput from '@/components/base/TextInput.vue'
import PrimaryButton from '@/components/base/PrimaryButton.vue'
import Multiselect from 'vue-multiselect'
import { onMounted, reactive, ref, type Ref } from 'vue'
import type { AxiosError, AxiosResponse } from 'axios'
import api from '@/plugin/api'

interface Form {
  no_transaction: string
  date: Date
  costumer: string
  code_costumer: string
  name: string
  phone_number: string
}
interface Fetch {
  message: string
  data: string | Costumer[]
}
interface Costumer {
  id: number
  kode: string
  nama: string
  telp: string
  created_at: Date
  updated_at: Date
}

const isLoadingCostumer: Ref<boolean> = ref(false)
const costumers: Ref<Costumer[]> = ref([])
const isLoading: Ref<boolean> = ref(false)
const form: Form = reactive({
  no_transaction: '',
  date: new Date(),
  costumer: '',
  code_costumer: '',
  name: '',
  phone_number: '',
})

onMounted(async () => {
  try {
    isLoading.value = true
    const result: AxiosResponse<Fetch> = await api.get('transaction/code')
    form.no_transaction = result.data.data as string
  } catch (error) {
    const err = error as AxiosError
    console.log(err)
  } finally {
    isLoading.value = false
  }

  try {
    isLoadingCostumer.value = true
    const result: AxiosResponse<Fetch> = await api.get('costumer')
    costumers.value = result.data.data as Costumer[]
  } catch (error) {
    const err = error as AxiosError
    console.log(err)
  } finally {
    isLoadingCostumer.value = false
  }
})

const nameWithLang = ({ nama, kode }: { nama: string; kode: string }) => {
  return `${nama} - ${kode}`
}

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
                  <TextInput
                    type="text"
                    :disabled="true"
                    class="mt-1 block w-full"
                    v-model="form.no_transaction"
                  />
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
                  <Multiselect
                    :close-on-select="true"
                    :clear-on-select="true"
                    :disabled="isLoadingCostumer"
                    class="block mt-1 w-full"
                    v-model="form.costumer"
                    tag-placeholder="Add this as new tag"
                    placeholder="Search or add a tag"
                    label="nama"
                    track-by="id"
                    :custom-label="nameWithLang"
                    :options="costumers"
                    :multiple="false"
                    :taggable="false"
                  ></Multiselect>
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
