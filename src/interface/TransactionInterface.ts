import type { Customer } from './CustomerInterface'
import type { Item } from './ItemInterface'

export interface SearchForm {
  search: string
}
export interface TransactionFetch {
  message: string
  data: Transaction[] | string | TransactionWithSaleDateAndCustomerAndItem
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

export interface TransactionWithSaleDateAndCustomerAndItem {
  id: number
  kode: string
  tgl: Date
  customer_id: number
  subtotal: number
  diskon: number
  ongkir: number
  total_bayar: number
  created_at: Date
  updated_at: Date
  sales_det: SalesDetWithItem[]
  customer: Customer
}
export interface SalesDetWithItem {
  id: number
  t_sales_id: number
  m_barang_id: number
  harga_bandrol: number
  qty: number
  diskon_pct: number
  diskon_nilai: number
  harga_diskon: number
  total: number
  item: Item
}
