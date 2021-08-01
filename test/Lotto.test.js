const assert = require('assert')
const ganache = require('ganache-cli')
const { describe } = require('mocha')
const Web3 = require('web3')

const { abi, evm } = require('../compile')
const web3 = new Web3(ganache.provider())

let accounts, lotto

beforeEach(async () => {
    accounts = await web3.eth.getAccounts()

    lotto = await new web3.eth.Contract(abi)
        .deploy({ data: '0x' + evm.bytecode.object, arguments: [] })
        .send({ from: accounts[0], gas: '1000000' })
})

describe('Lotto Contract', () => {
    it('deploys a contract', () => {
        assert.ok(lotto.options.address)
    })

    it('lotto participation success', async () => {
        await lotto.methods.participate().send({
            from: accounts[1],
            value: web3.utils.toWei('0.02', 'ether')
        })
        const partipants = await lotto.methods.getParticipants().call({
            from: accounts[0]
        })
        assert.strictEqual(accounts[1], partipants[0])
        assert.strictEqual(1, partipants.length)
    })

    it('lotto multiple participation success', async () => {
        await lotto.methods.participate().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        })
        await lotto.methods.participate().send({
            from: accounts[1],
            value: web3.utils.toWei('0.03', 'ether')
        })
        await lotto.methods.participate().send({
            from: accounts[2],
            value: web3.utils.toWei('0.02', 'ether')
        })
        const partipants = await lotto.methods.getParticipants().call({
            from: accounts[0]
        })
        assert.strictEqual(accounts[0], partipants[0])
        assert.strictEqual(accounts[1], partipants[1])
        assert.strictEqual(accounts[2], partipants[2])
        assert.strictEqual(3, partipants.length)
    })

    it('lotto participation not enough money (ether <= 0.1)', async () => {
        try {
            await lotto.methods.participate().send({
                from: accounts[1],
                value: web3.utils.toWei('0.01', 'ether')
            })
            assert(false)
        } catch (err) {
            assert(err)
        }
    })

    it('draw lotto failed (not an administrator)', async () => {
        try {
            await lotto.methods.drawLotto().send({
                from: accounts[1]
            })
            assert(false)
        } catch (err) {
            assert(err)
        }
    })

    it('draw lotto success', async () => {
        await lotto.methods.participate().send({
            from: accounts[1],
            value: web3.utils.toWei('0.3', 'ether')
        })

        const initialBalance = await web3.eth.getBalance(accounts[1]) 
        await lotto.methods.drawLotto().send({ from: accounts[0] })
        const finalBalance = await web3.eth.getBalance(accounts[1]) 
        const balanceDifferent = finalBalance - initialBalance
        
        assert(balanceDifferent > web3.utils.toWei('0.29', 'ether')) // reduced by gas cost

        const partipants = await lotto.methods.getParticipants().call({
            from: accounts[0]
        })

        assert.strictEqual(0, partipants.length)
    })

})