export interface CustomerForm {
  code: string
  name: string
  phone_number: string
}

export interface FetchCustomer {
  message: string
  data: Customer | Customer[]
}

export interface FetchCustomerCode {
  message: string
  data: string
}

export interface Customer {
  id: number
  kode: string
  nama: string
  telp: string
  created_at: Date
  updated_at: Date
}
