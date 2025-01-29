export interface Item {
  id: number
  kode: string
  nama: string
  harga: number
  created_at: Date
  updated_at: Date
}

export interface ItemForm {
  code: string
  name: string
  price: string
}

export interface SearchItemForm {
  search: string
}

export interface ItemFetch {
  message: string
  data: Item[] | Item | string
}
