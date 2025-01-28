import type { Customer } from './CustomerInterface'
import type { Item } from './ItemInterface'

export interface SearchForm {
  search: string
}
export interface TransactionFetch {
  message: string
  data: Transaction[] | string
  sum_total: number
}
export interface Transaction {
  id: number
  kode: string
  tgl: Date
  subtotal: number
  diskon: number
  ongkir: number
  total_bayar: number
  total_qty: number
  created_at: Date
  updated_at: Date
  customer: {
    kode: string
    name: string
    telp: string
    created_at: Date
    updated_at: Date
  }
}
export interface TransactionForm {
  no_transaction: string
  date: Date
  customer: Customer | string | null
  name: string
  phone_number: string
  items: Item | null
}
