const address = '0x37d49537DE670Ca313d84Eb017f8f7850ccF8eFa'
const abi = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "administrator",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "drawLotto",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getParticipants",
		"outputs": [
			{
				"internalType": "address payable[]",
				"name": "",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "participants",
		"outputs": [
			{
				"internalType": "address payable",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "participate",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	}
]


// export default async () => {
// 	const web3 = await initWeb3()
// 	return new web3.eth.Contract(abi, address)
// }
module.exports = { abi, address }