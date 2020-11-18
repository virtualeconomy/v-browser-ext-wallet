# V Browser Extension Wallet

## How to build and import to Chrome manually

1. install node.js from https://nodejs.org

2. clone this project

	``` bash
	$ git clone https://github.com/virtualeconomy/v-browser-ext-wallet.git
	```

3. clone submodule

	``` bash
	$ cd v-browser-ext-wallet
	$ git submodule update --init
	```

4. install packages

	```bash
	$ npm install
	```

5. build

	```
	$ npm run build
	```

6. import to chrome
Open Chrome browser, go to the `chrome://extensions/` page and click the `Load unpacked extension` button and select the build folder for your extension to install it.

## Web page interaction specification (for dApp developer)

Once extension wallet sucessfully installed, the Chrome/Firefox will detect `window.vsys` variable in page. You can open Chrome/Firefox with some domain (for example: https://www.google.com ) and input the following JS code in console to test:

``` javascript
window.vsys && window.vsys.isInstalled
```

If return `true`, it means the V extension wallet works properly.

### Load Extension Wallet Basic Info

The JS sample code of request:

``` javascript
async function getWalletInfo() {
  const info = await window.vsys.request({ method: 'info' })
  return info
}
```

Result:

``` 
{
    "result": true,
    "message": "OK",
    "name": "V Systems Browser Extension Wallet",
    "version": "1.1.0",
    "network": "Mainnet"	// or "Testnet"
}
```

### Get Current Selected Address of Extension Wallet

The JS sample code of request:

``` javascript
async function getAddress() {
  const address = await window.vsys.request({ method: 'address' })
  return address
}
```

Result:

``` 
{
    "result": true,
    "message": "OK",
    "address": "AR7qzJzuHrKxxxxxxxxBMtct7F2JsZxu"
}
```

### Get Public Key of Selected Account

The JS sample code of request:

``` javascript
async function getPublicKey() {
  const publicKey = await window.vsys.request({ method: 'publicKey' })
  return publicKey
}
```

Result:

``` 
{
    "result": true,
    "message": "OK",
    "publicKey": "2nCUEoyoquxxxxxxxxugG3ENdGcrRduGxnzC",
    "address": "AR7qzJzuHrKxxxxxxxxBMtct7F2JsZxu"
}
```

### Get VSYS Balance of Selected Account

The JS sample code of request:

``` javascript
async function getAmount() {
  const amount = await window.vsys.request({ method: 'amount' })
  return amount
}
```

Result:

``` 
{
    "result": true,
    "message": "OK",
    "address": "AR7qzJzuHrKxxxxxxxxBMtct7F2JsZxu"
    "amount": "100.5"
}
```

### Get Token Balance of Selected Account

The JS sample code of request:

``` javascript
function getTokenAmount() {
  window.vsys.request({
      method: 'tokenAmount',
      params:
        {
          tokenId: '<Token ID>'
        }
    })
    .then((response) => { 
        const tokenAmount = response.data
        return tokenAmount
    })
    .catch((error) => console.error)
}
```

Result:

``` 
{
    "result": true,
    "message": "OK",
    "address": "AR7qzJzuHrKxxxxxxxxBMtct7F2JsZxu"
    "tokenId": "TWZZfKFqcaNVe5xxxxxxxxnBRJMjDDByqv84",
    "amount": "200.8"
}
```

### List Watched Token of Extension Wallet

The JS sample code of request:

``` javascript
async function getWatchedTokens() {
  const myTokens = await window.vsys.request({ method: 'watchedTokens' })
  return myTokens
}
```

Result:

``` 
{
	"result": true,
	"message": "OK",
	"token": [{
			"tokenId": "TWZZfKFqcaNVe5xxxxxxxxnBRJMjDDByqv84",
			"contractId": "CC8Jx8aLkKVxxxxxxxCSkn1GBLcjZ32k",
			"contractType": "TokenContract"
		},
		{
			"tokenId": "TWZ3nPYyCJAxxxxxxxxYJMQK4dpiQ1m6v4",
			"contractId": "IDCC3k8ExdySxxxxxxxxxXdX4dTHtFVs35s",
			"contractType": "NonFungibleContract"
		}
	]
}
```

The `contractType` could be the following value:

```
SystemContract
TokenContract
TokenContractWithSplit
LockContract
NonFungibleContract
PaymentChannelContract
DepositWithdrawContract
GeneralContract
```

If developers want to get user NFT list, he/she can filter the result with `NonFungibleContract` type only to get the user's NFT list.

### Add Token to Watch List of Extension Wallet

The JS sample code of request:

``` javascript
function addToken() {
  window.vsys.request({
      method: 'addToken',
      params:
        {
          tokenSymbol: 'my NFT',
          tokenId: '< Token ID >'
        }
    })
    .then((response) => console.log(response))
    .catch((error) => console.error);
}
```

Result:

``` 
{
	"result": true,
	"message": "OK"	
}
```

### Website Requests VSYS or Token Transaction

The JS sample code of request:

``` javascript
function sendToken() {
  window.vsys.request({
      method: 'send',
      params:
        {
          tokenId: '<Token ID>',
          publicKey: '2nCUEoyoquxxxxxxxxugG3ENdGcrRduGxnzC',
          recipient: '<recipient address>',
          amount: '0.1',
          description: '<description>'
        }
    })
    .then((response) => console.log(response))
    .catch((error) => console.error);
}

```

If you send Token, you need to fill in `tokenId`. Otherwise, if not set `tokenId`, you will send VSYS. The `amount` can be Number or String type. To avoid the loss of precision due to very large numbers, we recommend to pass the `amount` parameter with String type.

Result:

``` 
{
	"result": true,
	"message": "OK",
	"transactionId": "2dSYyPQuh44J6ExxxxxxxNcEU4q4iLiVcahVc4n"
}
```

### Website Requests Deposit/Withdraw/Lock Token

The JS sample code of request Deposit:

``` javascript
function depositToken() {
   window.vsys.request({
      method: 'depositToken',
      params:
        {
          contractId: '<Contract ID>',
          publicKey: '2nCUEoyoquxxxxxxxxugG3ENdGcrRduGxnzC',
          amount: '50.6'
        }
    })
    .then((response) => console.log(response))
    .catch((error) => console.error);
}
```

The JS sample code of request Withdraw:

``` javascript
function withdrawToken() {
   window.vsys.request({
      method: 'withdrawToken',
      params:
        {
          contractId: '<Contract ID>',
          publicKey: '2nCUEoyoquxxxxxxxxugG3ENdGcrRduGxnzC',
          amount: '50.6'
        }
    })
    .then((response) => console.log(response))
    .catch((error) => console.error);
}
```

The JS sample code of request Lock:

``` javascript
function lockToken() {
   window.vsys.request({
      method: 'lockToken',
      params:
        {
          contractId: '<Contract ID>',
          lockTime: (Date.now() + 300 * 1000) * 1e6, //Lock 300 seconds
          publicKey: '2nCUEoyoquxxxxxxxxugG3ENdGcrRduGxnzC'
        }
    })
    .then((response) => console.log(response))
    .catch((error) => console.error);
}
```

The `contractId` must be lock contract ID or payment channel contract ID. The `method` can be `withdrawToken`, `depositToken` or `lockToken`. The `amount` can be Number or String type. To avoid the loss of precision due to very large numbers, we recommend to pass the `amount` parameter with String type. The `lockTime` is the timestamp of lock end. It is Number type and unit is nanosecond.

Result:

``` 
{
	"result": true,
	"message": "OK",
	"transactionId": "2dSYyPQuh44J6ExxxxxxxNcEU4q4iLiVcahVc4n"
}
```

### Website Requests Executing Contract Function

The JS sample code of request:

``` javascript
function executeContractFunction() {
   window.vsys.request({
      method: 'execContractFunc',
      params:
        {
          contractId: '<Contract ID>',
          publicKey: '2nCUEoyoquxxxxxxxxugG3ENdGcrRduGxnzC',
          functionIndex: 3,
          functionData: "G3ENdGcrRduGxxxxxxxxxxgG3ENdGcrnCUEo"
          attachment: 'HXRC'
        }
    })
    .then((response) => console.log(response))
    .catch((error) => console.error);
}
```

The `contractId` can be any contract ID. The `functionIndex` is the function index of contract. The `functionData` is the parameters of executing function. Every parameter is a DataEntry type. To generate `functionData` string, you need encode data of DataEntry array to bytes array and then use Base58 to encode the bytes array. The `attachment` is Base58 encoded string.


Result:

``` 
{
	"result": true,
	"message": "OK",
	"transactionId": "2dSYyPQuh44J6ExxxxxxxNcEU4q4iLiVcahVc4n"
}
```

### Website Requests Contract Register

The JS sample code of request:

``` javascript
function registerContractFunction() {
   window.vsys.request({
      method: 'regContract',
      params:
        {
          publicKey: '2nCUEoyoquxxxxxxxxugG3ENdGcrRduGxnzC',
          contract: 'VJodouhmnHVDwtkBZ2xxxxxxxxxxxxxxxxxxxxcmTfB3KFW2M',
          initData: '152wXX2z3TJUooxxxxxmU3AA9SVPkBgtxzQRAq',
          description: 'My contract for xxxxx'
        }
    })
    .then((response) => console.log(response))
    .catch((error) => console.error);
}
```

`contract` is contract content which is Base58 encoded string. `initData` is the parameters of contract initialization. Every parameter is a DataEntry type. To generate `initData` string, you need encode data of DataEntry array to bytes array and then use Base58 to encode the bytes array. `description` is the contract description which is string type.

Result:

``` 
{
	"result": true,
	"message": "OK",
	"transactionId": "2dSYyPQuh44J6ExxxxxxxNcEU4q4iLiVcahVc4n"
}
```

### Website Requests Content Signature

The JS sample code of request:

``` javascript
function registerContractFunction() {
   window.vsys.request({
      method: 'regContract',
      params:
        {
          publicKey: '2nCUEoyoquxxxxxxxxugG3ENdGcrRduGxnzC',
          content: 'VJodouhmnHVDwtkBZ2xxxxxxxxxxxxxxxxxxxxcmTfB3KFW2M'
        }
    })
    .then((response) => console.log(response))
    .catch((error) => console.error);
}
```

The `content` is the content bytes, which encoded with Base58.

Result:

``` 
{
	"result": true,
	"message": "OK",
	"signture": "2dSYyPQuh44J6ExxxxxxxNcEU4q4iLiVcahVc4n"
}
```

### Common Error

1. If the wallet is first time used without account created, any request will be failed, and the returned result is as follows:

	``` 
	{
	    "result": false,
	    "message": "account is not created"
	}
	```
	
	To solve this problem, the user needs to **open the extension wallet and create a account** before proceeding to the next step.


2. When the wallet is locked, any request will be failed, and the returned result is as follows:

	``` 
	{
	    "result": false,
	    "message": "account is locked"
	}
	```
	
	To solve this problem, the user needs to **open the extension wallet and enter the password to unlock** before proceeding to the next step.



