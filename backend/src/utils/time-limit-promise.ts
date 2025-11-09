export function timeLimitPromise<T>(
    promise: Promise<T>,
    limit: number,
    errorMessage: string
) {
    // eslint-disable-next-line no-undef
    let timeout: NodeJS.Timeout
    const timeoutPromise = new Promise((_, reject) => {
        timeout = setTimeout(() => {
            reject(errorMessage)
        }, limit)
    })
    return Promise.race([promise, timeoutPromise]).catch((err) => {
        clearTimeout(timeout)
        return Promise.reject(err)
    })
}
