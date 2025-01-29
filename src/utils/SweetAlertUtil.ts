import Swal, { type SweetAlertResult } from 'sweetalert2'

export class SweetAlertUtil {
  static errorAlert(message: string) {
    Swal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      confirmButtonText: 'OK',
    })
  }

  static successAlert(message: string) {
    return Swal.fire({
      title: 'Success!',
      text: message,
      icon: 'success',
      confirmButtonText: 'OK',
    })
  }

  static showConfirmationDialog = async (text: string): Promise<SweetAlertResult> => {
    return await Swal.fire({
      title: 'Are you sure?',
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    })
  }
}
