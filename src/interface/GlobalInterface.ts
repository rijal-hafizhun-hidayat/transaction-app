export interface Validation {
  status: number
  data: {
    statusCode: number
    errors: Record<string, string[]>
  }
}
