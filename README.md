STARKS-PROOF INFRA

Description:

Following apis makes the results of stark proof available to the starknet contract.

First, The dapp that want to prove some property, need to create a condition using the `/conditions` api.

Conditions are the requirements that the Dapp expects to pass. On Creating a condition, The API will return a id. This Id is the hash of the conditions.

The user who wants to verify a property to any starknet contract, should use the /postProof route. The user (or anyone on behalf of the user) passes the id returned in previous step and the value that they want to prove.

The postProof api processes the request and sends it to the SHARP. Once the train is processed, The backend code(or node) passes the result of the proof to the starknet contract thorugh L1_to_L2 Bridge.


Contract Address:

L2 Forwader : https://goerli.etherscan.io/address/0x61bada630ffcd6082f7a6859fd9cef30e8996d4b

Registry(conditions) : https://testnet-2.starkscan.co/contract/0x02224fbbc5fbcc5489f8e1d492bf734c8d79c50d7a295bee5049c9d7259de5be

API / Postman :

https://documenter.getpostman.com/view/9280214/2s8Yt1rp4a

Result:

<img width="1128" alt="Post Conditions" src="https://user-images.githubusercontent.com/56735482/204991852-d32a06c4-e517-494b-b66b-256c5703581e.png">

<img width="1122" alt="Post Proof" src="https://user-images.githubusercontent.com/56735482/204991919-8a0c40ea-443e-47ab-a781-bdeaf9d2fb8a.png">

Contributors:
