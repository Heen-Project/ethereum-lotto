import { useEffect, useRef, useState }   from 'react'
import { abi, address } from './utils/lotto'
import initWeb3 from './utils/web3'
import './App.css'

const { ethereum } = window

const App = () => {
  const lotto = useRef(null)
  const [web3, setWeb3] = useState(null)
  const [metaMask, setMetaMask] = useState(false)
  const [isRinkeby, setIsRinkeby] = useState(false)
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(false)
  const [administrator, setAdministrator] = useState('')
  const [participants, setParticipants] = useState([])
  const [balance, setBalance] = useState('')
  const [value, setValue] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const initialize = async () => {
      if (web3 === null && ethereum) {
          const web3Instance = await initWeb3()
          setWeb3(web3Instance)

          const chainId = await ethereum.request({ method: 'eth_chainId' })
          if (chainId === '0x4') {
            setIsRinkeby(true)
          }

          setMetaMask(true)

          if (web3Instance !== null) {
            lotto.current = new web3Instance.eth.Contract(abi, address)
            try {
              const accounts = await ethereum.request({ method: 'eth_accounts' })
              if (accounts.length > 0 && ethereum.isConnected()) {
                setConnected(true)
              }
            } catch (error) {
              console.error(error)
            }

            ethereum.on('accountsChanged', (_accounts) => {
              window.location.reload()
            })
          }
      }
    }
    initialize()
  }, [])

  useEffect(() => {
    if (connected) {
      const handler = async () => {
        const administrator = await lotto.current.methods.administrator().call()
        setAdministrator(administrator)
        updateParticipantsInfo()
      }
      handler()
    }
  }, [connected])

  const getAccount = async (_event) => {
    setLoading(true)
    try {
      await ethereum.request({ method: 'eth_requestAccounts' })
    } catch (error) {}
    setLoading(false)
  }

  const updateParticipantsInfo = async () => {
    const participants = await lotto.current.methods.getParticipants().call()
    const balance = await web3.eth.getBalance(lotto.current.options.address)
    setParticipants(participants)
    setBalance(balance)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (value > 0.01){
      setLoading(true)
      const accounts = await web3.eth.getAccounts()
      setMessage('Transaction is processing...')
      await lotto.current.methods.participate().send({
        from: accounts[0],
        value: web3.utils.toWei(value, 'ether')
      })
      setMessage('You have participated successfully!')
      updateParticipantsInfo()
      setLoading(false)
    } else {
      setMessage('More than 0.01 Ether is required for participation')
    }
  }

  const drawLotto = async (event) => {
    event.preventDefault()
    setLoading(true)
    const accounts = await web3.eth.getAccounts()
    setMessage('Lotto draw is in process...')
    await lotto.current.methods.drawLotto().send({
      from: accounts[0]
    })
    setMessage('The lotto has been drawn!')
    updateParticipantsInfo()
    setLoading(false)
  }

  return (
    <div className='App'>
      {!web3 && !metaMask && (
        <div className='page-center'>
          <div className='alert error'>
            <h1 className='no-margin-top'>Ethereum Lotto</h1>
            <p className='no-margin'>
              MetaMask is required to run this app!<br/> Please install MetaMask and then refresh this
              page.
            </p>
          </div>
        </div>
      )}

      {web3 && metaMask && !isRinkeby && (
        <div className='page-center'>
          <div className='alert error'>
            <h1 className='no-margin-top'>Ethereum Lotto</h1>
            <p className='no-margin'>
              You must be connected to the <strong>Rinkeby test network</strong> for Ether
              transactions to use this app.
            </p>
          </div>
        </div>
      )}

      {web3 && !connected && isRinkeby && (
        <div className='page-center'>
          <section className='card'>
            <h1 className='no-margin-top'>Ethereum Lotto</h1>
            <p className='center'>
              Want to try your luck in the lottery?<br/> Connect with your MetaMask and start competing right
              away!
            </p>
            <div className='center'>
              <button
                className='btn primaryBtn'
                type='button'
                onClick={getAccount}
                disabled={loading}>
                Connect with MetaMask
              </button>
            </div>
          </section>
        </div>
      )}

      {web3 && connected && isRinkeby && (
        <div className='page-center'>
          <section className='card'>
            <h1 className='no-margin-top'>Ethereum Lotto</h1>
            <p className='center'>
              This contract is managed by {administrator}.<br/>
              {participants.length === 1
                ? `There is currently ${participants.length} person entered, `
                : `There are currently ${participants.length} people entered, `}
              competing to win {web3.utils.fromWei(balance, 'ether')} ether!
            </p>

            <hr />
            <form onSubmit={onSubmit}>
              <h4>Want to try your luck?</h4>
              <div>
                <label>Amount of ether you want to participate:</label>{' '}
                <input type='number' value={value} onChange={(event) => setValue(event.target.value)} />{' '}
                <button className='btn primaryBtn' type='submit' disabled={loading}>
                  Participate 
                </button>
              </div>
            </form>

            {administrator.toLowerCase() === ethereum.selectedAddress && (
              <>
                <center>
                  <hr />
                  <h4>Ready to draw the lotto?</h4>
                  <button
                    className='btn primaryBtn'
                    type='button'
                    onClick={drawLotto}
                    disabled={loading}>
                    Draw Lotto
                  </button>
                </center>
              </>
            )}
            
            <hr className='add-margin-top' />
            <h2 className='center'>{message}</h2>
          </section>
        </div>
      )}
    </div>
  )
}
export default App