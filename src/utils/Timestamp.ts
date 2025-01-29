export class Timestamp {
  static formatTimestamp(date: Date): string {
    const parseDate = new Date(date)
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      //   hour: 'numeric',
      //   minute: 'numeric',
      //   hour12: true,
    }
    const formattedDate = parseDate.toLocaleString('id-ID', options)

    return formattedDate
  }

  static formatTimestampFull(date: Date): string {
    const parseDate = new Date(date)
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }
    const formattedDate = parseDate.toLocaleString('id-ID', options)

    return formattedDate
  }
}
