export class NumberUtil {
  static formatRupiah(amount: number): string {
    return amount.toLocaleString('id-ID')
  }
}
