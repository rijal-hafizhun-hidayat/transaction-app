<script setup lang="ts">
import DashboardLayout from '@/layout/DashboardLayout.vue'
import InputLabel from '@/components/base/InputLabel.vue'
import DateInput from '@/components/base/DateInput.vue'
import TextInput from '@/components/base/TextInput.vue'
import PrimaryButton from '@/components/base/PrimaryButton.vue'
import PointerRequired from '@/components/base/PointerRequired.vue'
import DangerButton from '@/components/base/DangerButton.vue'
import InputError from '@/components/base/InputError.vue'
import AlertForm from '@/components/base/AlertForm.vue'
import Multiselect from 'vue-multiselect'
import { computed, onMounted, reactive, ref, type Ref } from 'vue'
import type { AxiosError, AxiosResponse } from 'axios'
import api from '@/plugin/api'
import { NumberUtil } from '@/utils/NumberUtil'
import { ErrorUtil } from '@/utils/ErrorUtil'
import { SweetAlertUtil } from '@/utils/SweetAlertUtil'
import { useRouter } from 'vue-router'
import type { Validation } from '@/interface/GlobalInterface'
import type { Item, ItemFetch } from '@/interface/ItemInterface'
import type { Customer, FetchCustomer, FetchCustomerCode } from '@/interface/CustomerInterface'
import type { TransactionFetch, TransactionForm } from '@/interface/TransactionInterface'

const router = useRouter()
const validation: Ref<Validation | null> = ref(null)
const items: Ref<Item[]> = ref([])
const textButtonIsNewCustomer: Ref<string> = ref('buat costumer baru')
const isNewCustomer: Ref<boolean> = ref(false)
const isLoadingCustomer: Ref<boolean> = ref(false)
const isLoadingItem: Ref<boolean> = ref(false)
const customers: Ref<Customer[]> = ref([])
const isLoading: Ref<boolean> = ref(false)
const selectedItems: Ref<Item[]> = ref([])
const discountTotalPrice: Ref<number> = ref(0)
const shippingCost: Ref<number> = ref(0)
const subTotalPrice: Ref<number> = ref(0)
const totalPrice: Ref<number> = ref(0)
const batchDiscountPrice: Ref<number[]> = ref([])
const batchTotalPriceItem: Ref<number[]> = ref([])
const batchItemQuantities: Ref<number[]> = ref([])
const batchItemDiscount: Ref<number[]> = ref([])
const batchPriceAfterDiscount: Ref<number[]> = ref([])
const form: TransactionForm = reactive({
  no_transaction: '',
  date: new Date(),
  customer: '',
  name: '',
  phone_number: '',
  items: null,
})

onMounted(async () => {
  try {
    isLoading.value = true
    const result: AxiosResponse<TransactionFetch> = await api.get('transaction/code')
    form.no_transaction = result.data.data as string
  } catch (error) {
    const err = error as AxiosError
    if (err.response?.status === 400) {
      validation.value = err.response as Validation
    } else if (err.response?.status === 404) {
      validation.value = err.response as Validation
      const errors = ErrorUtil.formatErrorMessage(validation.value.data.errors)
      SweetAlertUtil.errorAlert(errors)
    }
  } finally {
    isLoading.value = false
  }

  try {
    isLoadingCustomer.value = true
    const result: AxiosResponse<FetchCustomer> = await api.get('customer')
    customers.value = result.data.data as Customer[]
  } catch (error) {
    const err = error as AxiosError
    if (err.response?.status === 400) {
      validation.value = err.response as Validation
    } else if (err.response?.status === 404) {
      validation.value = err.response as Validation
      const errors = ErrorUtil.formatErrorMessage(validation.value.data.errors)
      SweetAlertUtil.errorAlert(errors)
    }
  } finally {
    isLoadingCustomer.value = false
  }

  try {
    isLoadingItem.value = true
    const result: AxiosResponse<ItemFetch> = await api.get('item')
    items.value = result.data.data as Item[]
  } catch (error) {
    const err = error as AxiosError
    if (err.response?.status === 400) {
      validation.value = err.response as Validation
    } else if (err.response?.status === 404) {
      validation.value = err.response as Validation
      const errors = ErrorUtil.formatErrorMessage(validation.value.data.errors)
      SweetAlertUtil.errorAlert(errors)
    }
  } finally {
    isLoadingItem.value = false
  }
})

const nameWithLang = (costumer: Customer | null) => {
  if (!costumer || !costumer.nama || !costumer.kode) {
    return ''
  }
  return `${costumer.nama} - ${costumer.kode}`
}

const generateCustomerCode = async () => {
  try {
    const result: AxiosResponse<FetchCustomerCode> = await api.get('customer/code')
    form.customer = result.data.data as string
  } catch (error) {
    const err = error as AxiosError
    if (err.response?.status === 400) {
      validation.value = err.response as Validation
    } else if (err.response?.status === 404) {
      validation.value = err.response as Validation
      const errors = ErrorUtil.formatErrorMessage(validation.value.data.errors)
      SweetAlertUtil.errorAlert(errors)
    }
  }
}

const toogleIsNewCostumer = async (): Promise<void> => {
  isNewCustomer.value = !isNewCustomer.value

  if (isNewCustomer.value) {
    textButtonIsNewCustomer.value = 'sudah ada costumer'
    await generateCustomerCode()
  } else {
    textButtonIsNewCustomer.value = 'buat costumer baru'
    form.customer = null
  }

  form.name = ''
  form.phone_number = ''
}

const setFormTelpAndName = (customer: Customer): void => {
  console.log(customer)
  form.phone_number = customer.telp
  form.name = customer.nama
}

const pushSelectedItems = () => {
  const item: Item = form.items as Item
  selectedItems.value.push(form.items as Item)
  batchItemQuantities.value.push(1)
  batchItemDiscount.value.push(0)
  batchDiscountPrice.value.push(0)
  batchPriceAfterDiscount.value.push(0)
  batchTotalPriceItem.value.push(item.harga)
  subTotalPrice.value = subTotalPrice.value + item.harga
  totalPrice.value = totalPrice.value + item.harga
  console.log(selectedItems.value)
  form.items = null
}

const destroySelectedItemByItemId = (itemId: number) => {
  const index = selectedItems.value.findIndex((item) => item.id === itemId)

  if (index !== -1) {
    subTotalPrice.value = subTotalPrice.value - selectedItems.value[index].harga
    totalPrice.value = totalPrice.value - selectedItems.value[index].harga
    selectedItems.value.splice(index, 1)
    batchItemQuantities.value.splice(index, 1)
    batchItemDiscount.value.splice(index, 1)
    batchDiscountPrice.value.splice(index, 1)
    batchTotalPriceItem.value.splice(index, 1)
    batchPriceAfterDiscount.value.splice(index, 1)
  }
}

const calculateTotalPriceItemByQty = (index: number): void => {
  const total = batchItemQuantities.value[index] * batchPriceAfterDiscount.value[index]
  batchTotalPriceItem.value[index] = total
  calculateSubTotal()
  calculateTotalPrice()
}

const calculateDiscountPriceByDiscountPct = (index: number): void => {
  const discountPrice = (batchItemDiscount.value[index] / 100) * selectedItems.value[index].harga

  batchDiscountPrice.value[index] = discountPrice

  batchPriceAfterDiscount.value[index] = selectedItems.value[index].harga - discountPrice
  batchTotalPriceItem.value[index] =
    batchItemQuantities.value[index] * batchPriceAfterDiscount.value[index]

  calculateSubTotal()
  calculateTotalPrice()
}

const calculateSubTotal = (): void => {
  subTotalPrice.value = 0
  for (let index = 0; index < batchTotalPriceItem.value.length; index++) {
    subTotalPrice.value = subTotalPrice.value + batchTotalPriceItem.value[index]
  }

  totalPrice.value = subTotalPrice.value
}

const calculateTotalPrice = (): void => {
  if (isNaN(shippingCost.value)) {
    shippingCost.value = 0
  }
  if (isNaN(discountTotalPrice.value)) {
    discountTotalPrice.value = 0
  }
  totalPrice.value =
    Number(subTotalPrice.value) + Number(shippingCost.value) - Number(discountTotalPrice.value)
}

const customerCode = computed(() => {
  if (typeof form.customer === 'object' && form.customer !== null) {
    return (form.customer as Customer).kode
  }
  return form.customer
})

const send = async (): Promise<void> => {
  try {
    isLoading.value = true
    const result: AxiosResponse<TransactionFetch> = await api.post('transaction', {
      no_transaction: form.no_transaction,
      items: selectedItems.value,
      date: form.date,
      customer_code: customerCode.value,
      subtotal: subTotalPrice.value,
      discount: discountTotalPrice.value ? Number(discountTotalPrice.value) : 0,
      shipping_cost: shippingCost.value ? Number(shippingCost.value) : 0,
      total_price: totalPrice.value,
      qty: batchItemQuantities.value,
      discount_pct: batchItemDiscount.value,
      discount_nominal: batchDiscountPrice.value,
      discount_price: batchPriceAfterDiscount.value,
      total: batchTotalPriceItem.value,
      name: form.name,
      phone_number: form.phone_number,
      is_new_costumer: isNewCustomer.value,
    })

    SweetAlertUtil.successAlert(result.data.message)
    router.push({
      name: 'transaction.index',
    })
  } catch (error) {
    const err = error as AxiosError
    if (err.response?.status === 400) {
      validation.value = err.response as Validation
    } else if (err.response?.status === 404) {
      validation.value = err.response as Validation
      const errors = ErrorUtil.formatErrorMessage(validation.value.data.errors)
      SweetAlertUtil.errorAlert(errors)
    }
  } finally {
    isLoading.value = false
  }
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
    <AlertForm />
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
                  <InputLabel>no <PointerRequired /></InputLabel>
                  <TextInput
                    type="text"
                    :disabled="true"
                    class="mt-1 block w-full"
                    v-model="form.no_transaction"
                  />
                  <InputError
                    v-if="
                      validation &&
                      validation.status === 400 &&
                      validation.data.errors.no_transaction
                    "
                    :message="validation.data.errors.no_transaction[0]"
                  />
                </div>
                <div>
                  <InputLabel>Tanggal <PointerRequired /></InputLabel>
                  <DateInput class="mt-1 block w-full" v-model="form.date" />
                  <InputError
                    v-if="validation && validation.status === 400 && validation.data.errors.date"
                    :message="validation.data.errors.date[0]"
                  />
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
                  <InputLabel>kode <PointerRequired /></InputLabel>
                  <div class="flex flex-col sm:flex-row space-x-3">
                    <div class="w-full">
                      <Multiselect
                        v-if="!isNewCustomer"
                        :close-on-select="true"
                        :clear-on-select="true"
                        :disabled="isLoadingCustomer"
                        class="mt-1"
                        v-model="form.customer"
                        tag-placeholder="Add this as new tag"
                        placeholder="Search or add a tag"
                        @select="setFormTelpAndName"
                        label="nama"
                        track-by="id"
                        :custom-label="nameWithLang"
                        :options="customers"
                        :multiple="false"
                        :taggable="false"
                      ></Multiselect>
                      <TextInput v-else class="mt-1 w-full" v-model="form.customer" />
                      <InputError
                        v-if="
                          validation &&
                          validation.status === 400 &&
                          validation.data.errors.customer_code
                        "
                        :message="validation.data.errors.customer_code[0]"
                      />
                    </div>
                    <div>
                      <p class="text-center my-3 sm:my-2">atau</p>
                    </div>
                    <div>
                      <PrimaryButton class="w-full" @click="toogleIsNewCostumer" type="button"
                        ><span class="text-center">
                          {{ textButtonIsNewCustomer }}
                        </span></PrimaryButton
                      >
                    </div>
                  </div>
                </div>
                <div>
                  <InputLabel>nama <PointerRequired /></InputLabel>
                  <TextInput
                    :disabled="!isNewCustomer"
                    class="mt-1 block w-full"
                    v-model="form.name"
                  />
                  <InputError
                    v-if="validation && validation.status === 400 && validation.data.errors.name"
                    :message="validation.data.errors.name[0]"
                  />
                </div>
                <div>
                  <InputLabel>Telp <PointerRequired /></InputLabel>
                  <TextInput
                    :disabled="!isNewCustomer"
                    class="mt-1 block w-full"
                    v-model="form.phone_number"
                  />
                  <InputError
                    v-if="
                      validation && validation.status === 400 && validation.data.errors.phone_number
                    "
                    :message="validation.data.errors.phone_number[0]"
                  />
                </div>
              </div>
            </div>
            <div>
              <div class="space-y-3">
                <div>
                  <h1 class="font-bold">Barang <PointerRequired /></h1>
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
                  <InputError
                    v-if="validation && validation.status === 400 && validation.data.errors.items"
                    :message="validation.data.errors.items[0]"
                  />
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
                            @input="calculateTotalPriceItemByQty(index)"
                            :required="true"
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
                            @input="calculateDiscountPriceByDiscountPct(index)"
                            :required="true"
                            type="number"
                            class="w-full"
                            v-model="batchItemDiscount[index]"
                          />
                        </td>
                        <td class="border-t items-center px-6 py-4">
                          {{ NumberUtil.formatRupiah(batchDiscountPrice[index]) }}
                        </td>
                        <td class="border-t items-center px-6 py-4">
                          {{ NumberUtil.formatRupiah(batchPriceAfterDiscount[index]) }}
                        </td>
                        <td class="border-t items-center px-6 py-4">
                          {{ NumberUtil.formatRupiah(batchTotalPriceItem[index]) }}
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
                        <th>{{ NumberUtil.formatRupiah(subTotalPrice) }}</th>
                      </tr>
                      <tr class="text-left">
                        <th>Diskon</th>
                        <th>:</th>
                        <th>
                          <div>
                            <TextInput
                              @input="calculateTotalPrice"
                              type="number"
                              v-model="discountTotalPrice"
                            />
                            <InputError
                              v-if="
                                validation &&
                                validation.status === 400 &&
                                validation.data.errors.discount
                              "
                              :message="validation.data.errors.discount[0]"
                            />
                          </div>
                        </th>
                      </tr>
                      <tr class="text-left">
                        <th>Ongkir</th>
                        <th>:</th>
                        <th>
                          <div>
                            <TextInput
                              @input="calculateTotalPrice"
                              type="number"
                              v-model="shippingCost"
                            />
                            <InputError
                              v-if="
                                validation &&
                                validation.status === 400 &&
                                validation.data.errors.shipping_cost
                              "
                              :message="validation.data.errors.shipping_cost[0]"
                            />
                          </div>
                        </th>
                      </tr>
                      <tr class="text-left">
                        <th>Total bayar</th>
                        <th>:</th>
                        <th>
                          {{ NumberUtil.formatRupiah(totalPrice) }}
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
