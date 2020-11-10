

let providerHandle
const methodType = ["address", "publicKey", "amount", "tokenAmount", "watchedTokens", "depositToken", "withdrawToken", "lockToken", "send", "addToken", "info"]
class vsys {

    constructor() {
        this.isInstalled = true
    }

    request(data) {
        return new Promise((resolve, reject) => {
            if (!data || !data.method) {
                resolve({
                    "result": false,
                    "message": "invalid data!"
                })
                return
            }
            const method = data.method
            if (!methodType.includes(method)) {
                resolve({
                    "result": false,
                    "message": "invalid method!"
                })
                return
            }
            window.removeEventListener("vsys-request-" + method, providerHandle)
            providerHandle = ({detail}) => {
                if (typeof detail.error !== 'undefined') {
                    reject(detail.error)
                } else {
                    resolve(detail)
                }
            }
            let message = {
                target: "vsys-inpage",
                data: data,
                type: "vsys-request"
            }
            window.addEventListener("vsys-request-" + method, providerHandle)
            window.postMessage(message, "*")
        })
    }
}
window.vsys = new vsys()
