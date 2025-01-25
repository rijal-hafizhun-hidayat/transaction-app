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
  costumer: Costumer | string | null
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

const textButtonIsNewCostumer: Ref<string> = ref('buat costumer baru')
const isNewCostumer: Ref<boolean> = ref(false)
const isLoadingCostumer: Ref<boolean> = ref(false)
const costumers: Ref<Costumer[]> = ref([])
const isLoading: Ref<boolean> = ref(false)
const form: Form = reactive({
  no_transaction: '',
  date: new Date(),
  costumer: '',
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

const nameWithLang = (costumer: Costumer | null) => {
  if (!costumer || !costumer.nama || !costumer.kode) {
    return ''
  }
  return `${costumer.nama} - ${costumer.kode}`
}

const toogleIsNewCostumer = (): void => {
  isNewCostumer.value = !isNewCostumer.value

  if (isNewCostumer.value) {
    textButtonIsNewCostumer.value = 'sudah ada costumer'
    form.costumer = ''
  } else {
    textButtonIsNewCostumer.value = 'buat costumer baru'
    form.costumer = null
  }

  form.name = ''
  form.phone_number = ''
}

const setFormTelpAndName = (costumer: Costumer): void => {
  console.log(costumer)
  form.phone_number = costumer.telp
  form.name = costumer.nama
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
                <h1 class="font-bold">Costumer</h1>
              </div>
              <div>
                <hr />
              </div>
              <div class="space-y-4">
                <div>
                  <InputLabel>kode</InputLabel>
                  <div class="flex space-x-3">
                    <div class="block w-full">
                      <Multiselect
                        v-if="!isNewCostumer"
                        :close-on-select="true"
                        :clear-on-select="true"
                        :disabled="isLoadingCostumer"
                        class="mt-1 w-full"
                        v-model="form.costumer"
                        tag-placeholder="Add this as new tag"
                        placeholder="Search or add a tag"
                        @select="setFormTelpAndName"
                        label="nama"
                        track-by="id"
                        :custom-label="nameWithLang"
                        :options="costumers"
                        :multiple="false"
                        :taggable="false"
                      ></Multiselect>
                      <TextInput v-else class="mt-1 w-full" v-model="form.costumer" />
                    </div>
                    <div class="my-2">
                      <p>atau</p>
                    </div>
                    <div>
                      <PrimaryButton @click="toogleIsNewCostumer" type="button">{{
                        textButtonIsNewCostumer
                      }}</PrimaryButton>
                    </div>
                  </div>
                </div>
                <div>
                  <InputLabel>nama</InputLabel>
                  <TextInput
                    :disabled="!isNewCostumer"
                    class="mt-1 block w-full"
                    v-model="form.name"
                  />
                </div>
                <div>
                  <InputLabel>Telp</InputLabel>
                  <TextInput
                    :disabled="!isNewCostumer"
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
