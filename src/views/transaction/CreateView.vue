<script setup lang="ts">
import DashboardLayout from '@/layout/DashboardLayout.vue'
import InputLabel from '@/components/base/InputLabel.vue'
import DateInput from '@/components/base/DateInput.vue'
import TextInput from '@/components/base/TextInput.vue'
import PrimaryButton from '@/components/base/PrimaryButton.vue'
import DangerButton from '@/components/base/DangerButton.vue'
import Multiselect from 'vue-multiselect'
import { onMounted, reactive, ref, type Ref } from 'vue'
import type { AxiosError, AxiosResponse } from 'axios'
import api from '@/plugin/api'
import { NumberUtil } from '@/utils/NumberUtil'

interface Form {
  no_transaction: string
  date: Date
  costumer: Costumer | string | null
  name: string
  phone_number: string
  items: Item | null
}
interface Fetch {
  message: string
  data: string | Costumer[] | Item[]
}
interface Item {
  id: number
  kode: string
  nama: string
  harga: number
  created_at: Date
  updated_at: Date
}
interface Costumer {
  id: number
  kode: string
  nama: string
  telp: string
  created_at: Date
  updated_at: Date
}

const items: Ref<Item[]> = ref([])
const textButtonIsNewCostumer: Ref<string> = ref('buat costumer baru')
const isNewCostumer: Ref<boolean> = ref(false)
const isLoadingCostumer: Ref<boolean> = ref(false)
const isLoadingItem: Ref<boolean> = ref(false)
const costumers: Ref<Costumer[]> = ref([])
const isLoading: Ref<boolean> = ref(false)
const selectedItems: Ref<Item[]> = ref([])
const discountTotalPrice: Ref<string> = ref('')
const shippingCost: Ref<string> = ref('')
const subTotalPrice: Ref<number> = ref(0)
const totalPrice: Ref<number> = ref(0)
const batchDiscountPrice: Ref<number[]> = ref([])
const batchTotalPriceItem: Ref<number[]> = ref([])
const batchItemQuantities: Ref<number[]> = ref([])
const batchItemDiscount: Ref<number[]> = ref([])
const batchPriceAfterDiscount: Ref<number[]> = ref([])
const form: Form = reactive({
  no_transaction: '',
  date: new Date(),
  costumer: '',
  name: '',
  phone_number: '',
  items: null,
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

  try {
    isLoadingItem.value = true
    const result: AxiosResponse<Fetch> = await api.get('item')
    items.value = result.data.data as Item[]
    console.log(items.value)
  } catch (error) {
    const err = error as AxiosError
    console.log(err)
  } finally {
    isLoadingItem.value = false
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

const pushSelectedItems = () => {
  selectedItems.value.push(form.items as Item)
  console.log(selectedItems.value)
  form.items = null
}

const destroySelectedItemByItemId = (itemId: number) => {
  console.log(batchItemQuantities.value)
  console.log(batchItemDiscount.value)

  const index = selectedItems.value.findIndex((item) => item.id === itemId)

  if (index !== -1) {
    selectedItems.value.splice(index, 1)
    batchItemQuantities.value.splice(index, 1)
    batchItemDiscount.value.splice(index, 1)
    batchDiscountPrice.value.splice(index, 1)
    batchTotalPriceItem.value.splice(index, 1)
    batchPriceAfterDiscount.value.splice(index, 1)
  }
}

const calculateDiscountPrice = (index: number): number => {
  const price = selectedItems.value[index].harga
  const discount = batchItemDiscount.value[index]
  const discountPrice = discount ? price * (discount / 100) : 0

  if (discountPrice !== 0) {
    batchDiscountPrice.value[index] = discountPrice
    return discountPrice
  }

  return discountPrice
}

const calculatePriceAfterDiscount = (index: number, price: number): number => {
  const discount = batchItemDiscount.value[index]
  const discountPrice = calculateDiscountPrice(index)
  const priceAfterDiscount = discount ? price - discountPrice : 0

  if (priceAfterDiscount !== 0) {
    batchPriceAfterDiscount.value[index] = priceAfterDiscount
    return priceAfterDiscount
  }

  return priceAfterDiscount
}

const calculateTotalPriceItem = (index: number, price: number): number => {
  const quantity = batchItemQuantities.value[index]
  const discountPrice = calculatePriceAfterDiscount(index, price)
  const totalPriceItem = quantity ? quantity * discountPrice : 0

  if (totalPriceItem !== 0) {
    batchTotalPriceItem.value[index] = totalPriceItem
    return totalPriceItem
  }

  return totalPriceItem
}

const calculateSubTotal = (): number => {
  subTotalPrice.value = selectedItems.value.reduce((sum, item, index) => {
    return sum + calculateTotalPriceItem(index, item.harga)
  }, 0)

  return subTotalPrice.value
}

const calculateTotalPrice = (discount: string, shippingCost: string): number => {
  totalPrice.value =
    subTotalPrice.value - parseInt(discount as string) + parseInt(shippingCost as string)
  return totalPrice.value ? totalPrice.value : 0
}

const send = () => {
  console.log(form)
  console.log(batchItemQuantities.value)
  console.log(batchItemDiscount.value)
  console.log(batchDiscountPrice.value)
  console.log(batchTotalPriceItem.value)
  console.log(batchPriceAfterDiscount.value)
  console.log(discountTotalPrice.value)
  console.log(shippingCost.value)
  console.log(subTotalPrice.value)
  console.log(totalPrice.value)
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
                <h1 class="font-bold">Transaksi</h1>
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
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-1">
                    <div>
                      <Multiselect
                        v-if="!isNewCostumer"
                        :close-on-select="true"
                        :clear-on-select="true"
                        :disabled="isLoadingCostumer"
                        class="mt-1"
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
                      <TextInput v-else class="mt-1" v-model="form.costumer" />
                    </div>
                    <div>
                      <p class="text-center">atau</p>
                    </div>
                    <div>
                      <PrimaryButton class="w-full" @click="toogleIsNewCostumer" type="button"
                        ><span class="text-center">
                          {{ textButtonIsNewCostumer }}
                        </span></PrimaryButton
                      >
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
            <div>
              <div class="space-y-3">
                <div>
                  <h1 class="font-bold">Barang</h1>
                </div>
                <div>
                  <hr />
                </div>
                <div>
                  <Multiselect
                    :close-on-select="true"
                    :clear-on-select="true"
                    :disabled="isLoadingItem"
                    class="mt-1"
                    @select="pushSelectedItems"
                    v-model="form.items"
                    tag-placeholder="Add this as new tag"
                    placeholder="Search or add a tag"
                    label="nama"
                    track-by="id"
                    :options="items"
                    :multiple="false"
                    :taggable="false"
                  ></Multiselect>
                </div>
                <div class="overflow-x-auto">
                  <table class="w-full whitespace-nowrap">
                    <thead>
                      <tr class="text-left font-bold">
                        <th class="pb-4 pt-6 px-6">#</th>
                        <th class="pb-4 pt-6 px-6">Kode barang</th>
                        <th class="pb-4 pt-6 px-6">Nama Barang</th>
                        <th class="pb-4 pt-6 px-6">Qty</th>
                        <th class="pb-4 pt-6 px-6">Harga Bandrol</th>
                        <th class="pb-4 pt-6 px-6">Diskon (%)</th>
                        <th class="pb-4 pt-6 px-6">Diskon (Rp)</th>
                        <th class="pb-4 pt-6 px-6">Harga Diskon</th>
                        <th class="pb-4 pt-6 px-6">Total</th>
                        <th class="pb-4 pt-6 px-6">Aksi</th>
                      </tr>
                    </thead>
                    <tbody v-if="selectedItems.length > 0">
                      <tr v-for="(selectedItem, index) in selectedItems" :key="selectedItem.id">
                        <td class="border-t items-center px-6 py-4">
                          {{ index + 1 }}
                        </td>
                        <td class="border-t items-center px-6 py-4">
                          {{ selectedItem.kode }}
                        </td>
                        <td class="border-t items-center px-6 py-4">
                          {{ selectedItem.nama }}
                        </td>
                        <td class="border-t items-center px-6 py-4">
                          <TextInput
                            class="w-20"
                            type="number"
                            v-model="batchItemQuantities[index]"
                          />
                        </td>
                        <td class="border-t items-center px-6 py-4">
                          {{ NumberUtil.formatRupiah(selectedItem.harga) }}
                        </td>
                        <td class="border-t items-center px-6 py-4">
                          <TextInput
                            type="number"
                            class="w-full"
                            v-model="batchItemDiscount[index]"
                          />
                        </td>
                        <td class="border-t items-center px-6 py-4">
                          {{ NumberUtil.formatRupiah(calculateDiscountPrice(index)) }}
                        </td>
                        <td class="border-t items-center px-6 py-4">
                          {{
                            NumberUtil.formatRupiah(
                              calculatePriceAfterDiscount(index, selectedItem.harga),
                            )
                          }}
                        </td>
                        <td class="border-t items-center px-6 py-4">
                          {{
                            NumberUtil.formatRupiah(
                              calculateTotalPriceItem(index, selectedItem.harga),
                            )
                          }}
                        </td>
                        <td class="border-t items-center px-6 py-4 flex justify-start space-x-4">
                          <div>
                            <DangerButton
                              @click="destroySelectedItemByItemId(selectedItem.id)"
                              type="button"
                              >Hapus</DangerButton
                            >
                          </div>
                        </td>
                      </tr>
                    </tbody>
                    <tbody v-else>
                      <tr class="hover:bg-gray-100">
                        <td class="border-t items-center px-6 py-4 text-center" colspan="10">
                          <span>data not found</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="flex justify-end">
                  <table>
                    <tbody>
                      <tr class="text-left">
                        <th>Sub total</th>
                        <th>:</th>
                        <th>{{ NumberUtil.formatRupiah(calculateSubTotal()) }}</th>
                      </tr>
                      <tr class="text-left">
                        <th>Diskon</th>
                        <th>:</th>
                        <th><TextInput type="number" v-model="discountTotalPrice" /></th>
                      </tr>
                      <tr class="text-left">
                        <th>Ongkir</th>
                        <th>:</th>
                        <th><TextInput type="number" v-model="shippingCost" /></th>
                      </tr>
                      <tr class="text-left">
                        <th>Total bayar</th>
                        <th>:</th>
                        <th>
                          {{
                            NumberUtil.formatRupiah(
                              calculateTotalPrice(discountTotalPrice, shippingCost),
                            )
                          }}
                        </th>
                      </tr>
                    </tbody>
                  </table>
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
