export function convertStringDate(dateString: string, __separator?: string) {
    const separator = __separator || '-'
    const dateArr = dateString.split(separator)
    const year = dateArr[0] || new Date(Date.now()).getFullYear()
    const month = dateArr[1] || new Date(Date.now()).getMonth()
    const day = dateArr[2] || new Date(Date.now()).getDay()

    const dateObj = new Date(`${month}/${day}/${year}`)

    return dateObj
}
