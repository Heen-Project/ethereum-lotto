const HDWalletProvider = require('@truffle/hdwallet-provider')
const Web3 = require('web3')
const { abi, evm } = require('./compile')

const mnemonic_phrase = process.env.ACCOUNT_MNEMONIC
const rinkeby_network = process.env.RINKEBY_ENDPOINT

const provider = new HDWalletProvider({
    mnemonic: {
      phrase: mnemonic_phrase
    },
    providerOrUrl: rinkeby_network
})

const web3 = new Web3(provider)

const deploy = async () => {
    const accounts = await web3.eth.getAccounts()
    console.log(`Attempting to deploy from account ${accounts[0]}`)

    const address = await new web3.eth.Contract(abi)
        .deploy({ data: "0x" + evm.bytecode.object, arguments: [] })
        .send({ from: accounts[0], gas: '1000000' })

    console.log(`Contract deployed to ${address.options.address}`)
    provider.engine.stop()
}

deploy()