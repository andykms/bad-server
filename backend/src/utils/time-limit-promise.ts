export function timeLimitPromise<T>(promise: Promise<T>, limit: number, errorMessage: string) {
  let _timeout: NodeJS.Timeout;
  const timeoutPromise = new Promise((resolve, reject)=>{
    _timeout = setTimeout(()=>{
      reject(errorMessage)
    }, limit)
  });
  return Promise.race([promise, timeoutPromise]).catch((err)=>{
    clearTimeout(_timeout);
    return Promise.reject(err);
  })
}