

let providerHandle
let EventEmitter = require("events").EventEmitter
const vsysEventEmitter = new EventEmitter()
const methodType = ["address", "publicKey", "amount", "tokenAmount", "watchedTokens", "depositToken", "withdrawToken", "lockToken", "send", "addToken",'webList', "info", "sendNFT", "execContractFunc", "signContent", "regContract"]
const eventType = ["accountsChanged", "chainChanged"]
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
    on(eventName, callBack) {
        if (!eventType.includes(eventName)) {
            return { "result": false, "message": "Invalid event" }
        }
        vsysEventEmitter.on(eventName, callBack)
        providerHandle = ({detail}) => {
            vsysEventEmitter.emit(eventName, detail)
        }
        let listenerName = "vsys-on-" + eventName
        window.addEventListener(listenerName, providerHandle)
    }
    removeListener(eventName, callBack) {
        let listenerName = "vsys-on-" + eventName
        providerHandle = ({detail}) => {
            vsysEventEmitter.emit(eventName, detail)
        }
        window.removeEventListener(listenerName, providerHandle)
        vsysEventEmitter.removeListener(eventName, callBack)
    }
}
window.vsys = new vsys()
