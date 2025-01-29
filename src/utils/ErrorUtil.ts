export class ErrorUtil {
  static formatErrorMessage(errors: Record<string, string[]>): string {
    if (typeof errors === 'string') {
      return errors
    }

    // If errors is an object, extract the messages
    return Object.entries(errors)
      .map(([key, messages]) => `${key}: ${messages.join(', ')}`)
      .join('; ')
  }
}
