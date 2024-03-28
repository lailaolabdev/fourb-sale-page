import Swal from 'sweetalert2'
export const SuccessSwal = (item) => {
    Swal.fire({
        icon: 'success',
        title: item,
        showConfirmButton: false,
        timer: 1800
    })
}
export const successUpdateSwal = (item) => {
    Swal.fire({
        icon: 'success',
        title: item,
        showConfirmButton: false,
        timer: 1800
    })
}
export const successDeleteSwal = (item) => {
    Swal.fire({
        icon: 'success',
        title: item,
        showConfirmButton: false,
        timer: 1800
    })
}
export const errorSwal = (err) => {
    Swal.fire({
        icon: 'error',
        text: err,
        showConfirmButton: false,
        timer: 3000
    })
}

export const warningSwal = (text) => {
    Swal.fire({
        icon: 'warning',
        text: text,
        showConfirmButton: false,
        timer: 3000
    })
}

export const errorTitleWithTextSwal = (title, text) => {
    Swal.fire({
        icon: 'error',
        title,
        text,
        showConfirmButton: false,
        timer: 5000
    })
}

export const errorPermissionTitleWithTextSwal = (title, text) => {
    Swal.fire({
        icon: 'error',
        title,
        text,
        showConfirmButton: false,
        focusDeny: false,
        focusCancel: false,
        returnFocus: false,
        showCloseButton: true
    })
}

export const wariningWithTextAndConfirmButton = (title, detail, onConfirm) => {
    Swal.fire({
        title: title,
        text: detail,
        icon: 'success',
        timer: 5000
    }).then(async () => {
        try {
            await onConfirm()
        } catch (error) {
            console.log("Error: ", error)
        }
    })
}