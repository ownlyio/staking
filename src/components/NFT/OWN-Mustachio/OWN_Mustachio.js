import './OWN_Mustachio.css'
import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Modal } from 'react-bootstrap'
import { faCheckCircle, faExclamationCircle, faExternalLinkAlt, faSpinner } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'

import Navbar from '../../Navbar/Navbar'

import metamask from '../../../img/metamask.png'
import ownMustachio from '../../../img/staking/own-mustachio-rulers.png'

// PRODUCTION
// import { stakingTokenAbi, stakingTokenAddress } from '../../../utils/contracts/liquidity/cakelp-own/stakingToken'
// import { stakingAbi, stakingAddress } from '../../../utils/contracts/liquidity/cakelp-own/staking'

// DEVELOPMENT
import { nftStakingAbi, nftStakingAddress } from '../../../utils/contracts/nft/own-mustachio/nftStakingDev'
import { nftTokenAbi, nftTokenAddress } from '../../../utils/contracts/nft/own-mustachio/nftTokenDev'
import { stakingTokenAbi, stakingTokenAddress } from '../../../utils/contracts/nft/own-mustachio/stakingTokenDev'

// Utils
import { configureWeb3 } from '../../../utils/web3Init'
import { getApr } from '../../../utils/apr'
import networks from '../../../utils/networks'

function OWN_Mustachio() {
    let web3, nftStakingContract, nftTokenContract
    const [_web3, setWeb3] = useState()
    const [_nftStakingContract, setNftStakingContract] = useState()
    const [_nftTokenContract, setNftTokenContract] = useState()
    const [_stakingTokenContract, setStakingTokenContract] = useState()
    const [state, setState] = useState({
        isConnected: false,
        account: "",
        currentOwnBalance: 0,
        isApproved: false,
        detectedChangeMessage: "",
        hasMetamask: false,
        isLoaded: false,
        totalOwnTokensStaked: 0,
        stakeRequired: 0,
        remainingRewards: 0,
        userOwnDeposits: 0,
        dateStaked: "--",
        nftStakingDuration: 0,
        userRemainingDuration: 0,
        txError: "",
        txHash: "",
    })

    // Other Variables
    // PRODUCTION
    // const explorerUrl = "https://bscscan.com/tx/"
    // DEVELOPMENT
    const explorerUrl = "https://testnet.bscscan.com/tx/"

    // Modals
    const [showNotConnected, setShowNotConnected] = useState(false)
    const handleCloseNotConnected = () => setShowNotConnected(false)
    const handleShowNotConnected = () => setShowNotConnected(true)
    const [showPleaseWait, setShowPleaseWait] = useState(false)
    const handleClosePleaseWait = () => setShowPleaseWait(false)
    const handleShowPleaseWait = () => setShowPleaseWait(true)
    const [showOnApprove, setShowOnApprove] = useState(false)
    const handleCloseOnApprove = () => setShowOnApprove(false)
    const handleShowOnApprove = () => setShowOnApprove(true)
    const [showOnError, setShowOnError] = useState(false)
    const handleCloseOnError = () => setShowOnError(false)
    const handleShowOnError = () => setShowOnError(true)
    const [showStaked, setShowStaked] = useState(false)
    const handleCloseStaked = () => setShowStaked(false)
    const handleShowStaked = () => setShowStaked(true)
    const [showClaim, setShowClaim] = useState(false)
    const handleCloseClaim = () => setShowClaim(false)
    const handleShowClaim = () => setShowClaim(true)
    const [showExit, setShowExit] = useState(false)
    const handleCloseExit = () => setShowExit(false)
    const handleShowExit = () => setShowExit(true)
    const [showMetamaskInstall, setShowMetamaskInstall] = useState(false)
    const handleCloseMetamaskInstall = () => setShowMetamaskInstall(false)
    const handleShowMetamaskInstall = () => setShowMetamaskInstall(true)
    const [showWrongNetwork, setShowWrongNetwork] = useState(false)
    const handleCloseWrongNetwork = () => setShowWrongNetwork(false)
    const handleShowWrongNetwork = () => setShowWrongNetwork(true)
    const [showDetected, setShowDetected] = useState(false)
    const handleCloseDetected = () => setShowDetected(false)
    const handleShowDetected = () => setShowDetected(true)
    // const [showTopStakers, setShowTopStakers] = useState(false)
    // const handleCloseTopStakers = () => setShowTopStakers(false)
    // const handleShowTopStakers = () => setShowTopStakers(true)

    useEffect(() => {
        async function _init() {
            // WEB3 RPC - BSC MAINNET
            // web3 = configureWeb3("https://bsc-dataseed.binance.org/")
            // WEB3 RPC - BSC TESTNET (COMMENT WHEN PRODUCTION)
            web3 = configureWeb3("https://data-seed-prebsc-1-s1.binance.org:8545/")

            // RPC Initialize
            nftStakingContract = new web3.eth.Contract(nftStakingAbi, nftStakingAddress)
            nftTokenContract = new web3.eth.Contract(nftTokenAbi, nftTokenAddress)

            // get total deposits
            const totalStaked = await nftStakingContract.methods.totalDeposits(nftTokenAddress).call()
            _setState("totalOwnTokensStaked", web3.utils.fromWei(totalStaked))

            // get remaining rewards
            const remainingRewards = await nftStakingContract.methods.remainingRewards(nftTokenAddress).call()
            _setState("remainingRewards", remainingRewards)

            // get staking required
            const stakeRequired = await nftTokenContract.methods.getStakeRequired().call()
            _setState("stakeRequired", web3.utils.fromWei(stakeRequired))
            
            // // Metamask account init
            const web3Metamask = configureWeb3()

            if (web3Metamask !== 1) { 
                const nftStakingContractMetamask = new web3Metamask.eth.Contract(nftStakingAbi, nftStakingAddress)
                const nftTokenContractMetamask = new web3Metamask.eth.Contract(nftTokenAbi, nftTokenAddress)
                const stakingTokenContractMetamask = new web3Metamask.eth.Contract(stakingTokenAbi, stakingTokenAddress)
                setWeb3(web3Metamask)
                setNftStakingContract(nftStakingContractMetamask)
                setNftTokenContract(nftTokenContractMetamask)
                setStakingTokenContract(stakingTokenContractMetamask)
                _setState("hasMetamask", true)
            } else {
                _setState("hasMetamask", false)
            }
        }
        
        _init()
        // accountChangedListener()
        // networkChangedListener()
    }, [])

    // account change listener (metamask only)
    // const accountChangedListener = () => {
    //     if (window.ethereum) {
    //         window.ethereum.on('accountsChanged', (accounts) => {
    //             _setState("detectedChangeMessage", "Account change detected!")
    //             handleShowDetected()
    //         })
    //     }
    // }

    // // network change listener (metamask only)
    // const networkChangedListener = () => {
    //     if (window.ethereum) {
    //         window.ethereum.on('chainChanged', (chainId) => {
    //             // PRODUCTION
    //             // if (chainId !== "0x38") {
    //             // DEVELOPMENT
    //             if (chainId !== "0x61") { 
    //                 _setState("detectedChangeMessage", "Network change detected!")
    //                 handleShowDetected()
    //             }
    //         })
    //     }
    // }

    // function that will automatically update the details after approve, stake, claim and exit
    const updateDetails = async () => {
        // get total deposits
        const totalStaked = await _nftStakingContract.methods.totalDeposits(nftTokenAddress).call()
        _setState("totalOwnTokensStaked", _web3.utils.fromWei(totalStaked))

        getDetailsOfUserAcct(state.account)
    }

    // function that will get the details of the user's account (balances, staked tokens etc)
    const getDetailsOfUserAcct = async acct  => {
        const currentItem = await _nftStakingContract.methods.getCurrentStakingItem(acct, nftTokenAddress).call()
        if (Number(currentItem.startTime) !== 0) {
            const options = {year: 'numeric', month: 'long', day: 'numeric'}
            _setState("dateStaked", new Date(currentItem.startTime * 1000).toLocaleDateString("en-US", options))
        }

        if (Number(currentItem.amount) !== 0) {
            _setState("userOwnDeposits", web3.utils.fromWei(currentItem.amount))
        }

        // get OWN balance
        const ownBalance = await _stakingTokenContract.methods.balanceOf(acct).call()
        _setState("currentOwnBalance", _web3.utils.fromWei(ownBalance))

        // get staking duration
        const duration = await _nftTokenContract.methods.getStakeDuration().call()
        const calculatedDuration = convertSecToDays(duration)
        _setState("nftStakingDuration", calculatedDuration)

        if (Number(currentItem.startTime) !== 0) {
            const remainingDuration = Number(currentItem.startTime) + calculatedDuration
            const calculatedRemaining = await convertTimestamp(remainingDuration)
            _setState("userRemainingDuration", calculatedRemaining)
        }

        _setState("isLoaded", true)
        
        // refresh data every 10 seconds
        // setInterval(() => {
        //     async function _getDetails() {
        //         // get total deposits
        //         const totalLP = await _stakingContract.methods.totalSupply().call()
        //         _setState("totalLPTokensStaked", _web3.utils.fromWei(totalLP))

        //         // APR
        //         const apr = await getApr()
        //         _setState("apr", roundOff(apr))

        //         const lpTokenBal = await _stakingTokenContract.methods.balanceOf(acct).call()
        //         _setState("currentLPBalance", _web3.utils.fromWei(lpTokenBal))
        //         const lpTokenStaked = await _stakingContract.methods.balanceOf(acct).call()
        //         _setState("userCurrentLPStaked", _web3.utils.fromWei(lpTokenStaked))
        //         const rewardsEarned = await _stakingContract.methods.earned(acct).call()
        //         _setState("userRewardsEarned", _web3.utils.fromWei(rewardsEarned))

        //         // compute user rate
        //         computeUserRate(totalLP, lpTokenStaked)
        //     }
            
        //     _getDetails()
        // }, 10000)
    }

    // switch network      
    const switchNetwork = async (networkName) => {
        try {
            await _web3.currentProvider.request({
                method: "wallet_switchEthereumChain",
                // PRODUCTION
                // params: [{ chainId: "0x38" }],
                // DEVELOPMENT
                params: [{ chainId: "0x61" }],
            })

            handleCloseWrongNetwork()
        } catch (error) {
            if (error.code === 4902) {
                try {
                    await web3.currentProvider.request({
                        method: "wallet_addEthereumChain",
                        params: [networks[networkName]],
                    })
                } catch (error) {
                    _setState("txError", error.message)
                    handleShowOnError()
                }
            }
        }
    }

    // connect wallet
    // const connect = async wallet => {
    const connect = async () => {
        if (state.hasMetamask) {
            const netId = await _web3.eth.net.getId() // 97 - BSC testnet, 56 - BSC Mainnet
            
            // PRODUCTION
            // if (netId === 56) {
            // DEVELOPMENT
            if (netId === 97) {
                const acct = await window.ethereum.request({ method: "eth_requestAccounts"})
                if (acct.length > 0) {
                    _setState("isConnected", true)
                    _setState("account", acct[0])
                }

                getDetailsOfUserAcct(acct[0])
            } else {
                handleShowWrongNetwork()
            }
        } else {
            handleShowMetamaskInstall()
        }
    }

    // approve
    // const approveStaking = async () => {
    //     const approveAmountEth = getStakeAmount()

    //     if (approveAmountEth === "0" || approveAmountEth === 0 || approveAmountEth === "") {
    //         handleShowOnError()
    //         _setState("txError", "Please provide a valid amount!")
    //     } else {
    //         const approveAmount = _web3.utils.toWei(approveAmountEth)
        
    //         await _stakingTokenContract.methods.approve(stakingAddress, approveAmount).send({
    //             from: state.account
    //         })
    //         .on('transactionHash', function(hash){
    //             handleShowPleaseWait()
    //         })
    //         .on('error', function(error) {
    //             handleClosePleaseWait()
    //             handleShowOnError()
    //             _setState("isApproved", false)
    //             _setState("txError", error.message)
    //         })
    //         .then(async function(receipt) {
    //             handleClosePleaseWait()
    //             handleShowOnApprove()
    //             _setState("isApproved", true)
    //             _setState("txHash", receipt.transactionHash)
    //             _setState("stakedAmount", approveAmountEth)
    //             _setState("helpText", `${approveAmountEth} OWN/BUSD ready for staking.`)
    //         })
    //     }
    // }

    // stake
    // const enterStaking = async () => {
    //     const stakeAmountEth = state.stakedAmount

    //     if (stakeAmountEth === "0" || stakeAmountEth === 0) {
    //         handleShowOnError()
    //         _setState("txError", "Please provide a valid amount!")
    //     } else {
    //         const stakeAmount = _web3.utils.toWei(stakeAmountEth)
            
    //         await _stakingContract.methods.stake(stakeAmount).send({
    //             from: state.account
    //         })
    //         .on('transactionHash', function(hash){
    //             handleShowPleaseWait()
    //         })
    //         .on('error', function(error) {
    //             handleClosePleaseWait()
    //             handleShowOnError()
    //             _setState("txError", error.message)
    //         })
    //         .then(async function(receipt) {
    //             handleClosePleaseWait()
    //             handleShowStaked()
    //             _setState("txHash", receipt.transactionHash)
    //             _setState("helpText", `${3} OWN/BUSD successfully staked.`)
    //             updateDetails()

    //             // reset values
    //             document.getElementById("stake-input-num").value = 0
    //             _setState("stakedAmount", 0)
    //         })
    //     }
    // }

    // claim
    // const claimRewards = async () => {
    //     const rewards = state.userRewardsEarned

    //     if (rewards === "0" || rewards === 0) {
    //         handleShowOnError()
    //         _setState("txError", "You do not have any reward tokens to claim.")
    //     } else {
    //         await _stakingContract.methods.getReward().send({
    //             from: state.account
    //         })
    //         .on('transactionHash', function(hash){
    //             handleShowPleaseWait()
    //         })
    //         .on('error', function(error) {
    //             handleClosePleaseWait()
    //             handleShowOnError()
    //             _setState("txError", error.message)
    //         })
    //         .then(async function(receipt) {
    //             handleClosePleaseWait()
    //             handleShowClaim()
    //             _setState("txHash", receipt.transactionHash)
    //             _setState("helpText", 'Please enter an amount greater than 0.')
    //             updateDetails()
    //         })
    //     }
    // }

    // exit
    // const claimAndWithdraw = async () => {
    //     const withdrawAmt = state.userCurrentLPStaked

    //     if (withdrawAmt === "0" || withdrawAmt === 0 ) {
    //         handleShowOnError()
    //         _setState("txError", "You do not have any LP Tokens staked.")
    //     } else {
    //         await _stakingContract.methods.exit().send({
    //             from: state.account
    //         })
    //         .on('transactionHash', function(hash){
    //             handleShowPleaseWait()
    //         })
    //         .on('error', function(error) {
    //             handleClosePleaseWait()
    //             handleShowOnError()
    //             _setState("txError", error.message)
    //         })
    //         .then(async function(receipt) {
    //             handleClosePleaseWait()
    //             handleShowExit()
    //             _setState("txHash", receipt.transactionHash)
    //             _setState("helpText", 'Please enter an amount greater than 0.')
    //             updateDetails()
    //         })
    //     }
    // }

    // Utility functions
    // convert seconds to days
    const convertSecToDays = secTime => {
        // PRODUCTION
        // return Math.floor(secTime / (3600*24))
        // DEVELOPMENT
        return secTime / (3600*24)
    }

    // convert a timestamp to days
    const convertTimestamp = async unixTime => {
        const req = await axios.get(`https://ownly.tk/api/get-remaining-time-from-timestamp/${unixTime}`)
        return Math.floor(req.data / (3600*24))
    }

    // make an address short
    const shortenAddress = (address, prefixCount, postfixCount) => {
        let prefix = address.substr(0, prefixCount);
        let postfix = address.substr(address.length - postfixCount, address.length);
    
        return prefix + "..." + postfix;
    }

    // get stake amount from text field
    const getStakeAmount = () => {
        return document.getElementById("stake-input-num").value
    }

    // state updater
    const _setState = (name, value) => {
        setState(prevState => ({...prevState, [name]: value}))
    }

    // MAX function
    // const triggerMaxAmount = () => {
    //     document.getElementById("stake-input-num").value = state.currentLPBalance
    // }

    // add thousands separator
    const addCommasToNumber = (x, decimal = 5) => {
        if (!Number.isInteger(Number(x))) {
            x = Number(x).toFixed(decimal)
        }

        return x.toString().replace(/^[+-]?\d+/, function(int) {
            return int.replace(/(\d)(?=(\d{3})+$)/g, '$1,');
        });
    }

    return (
        <div className="app" style={{"backgroundColor": "rgb(244, 246, 248)"}}>
            <Navbar connect={connect} isConnected={state.isConnected} account={state.account} shortenAddress={shortenAddress} />
            {/* <Navbar handleShowWalletProviders={handleShowWalletProviders} isConnected={state.isConnected} account={state.account} shortenAddress={shortenAddress} /> */}

            <div className="container">
                <section id="app-staking" className="mb-4">
                    <div className="row justify-content-center align-items-center">
                        <div className="col-12 col-lg-5">
                            <div className="splatform-item-img">
                                <img className="w-100" src={ownMustachio} alt="Stake OWN, Earn Mustachio Marauder" />
                            </div>
                            <p className="splatform-item-title text-center font-size-170 text-color-3 neo-black mb-3">Stake OWN, Earn Mustachio Marauder</p>
                            <p className="total-dep bg-color-21 text-white text-center font-size-90 neo-light mb-5"><b>YOUR BALANCE:</b> {addCommasToNumber(state.currentOwnBalance)} OWN</p>

                            <p className="font-size-130 text-color-2 neo-bold mb-3">Rules:</p>
                            <ul>
                                <li className="font-size-110 text-color-6 mb-3">
                                    <p className="neo-light">Stake 15 Million OWN <b>without unstaking</b> for <b>60 Days</b> to earn 1 Mustachio Marauder NFT.</p>
                                </li>
                                <li className="font-size-110 text-color-6 mb-3">
                                    <p className="neo-light">After <b>60 days</b> of staking without unstaking your OWN tokens, you can now earn 1 Mustachio Marauder NFT and withdraw your OWN tokens back to your wallet.</p>
                                    <p className="neo-light"><b>Note:</b> 1 address per staking only.</p>
                                </li>
                                <li className="font-size-110 text-color-6 mb-3">
                                    <p className="neo-light">Staking is available until the <b>200 Mustachio Marauders</b> runs out.</p>
                                </li>
                            </ul>
                            <div className="add-liquidity mx-auto" style={{"width": "60%"}}>
                                <a href="https://ownly.io/pancake" target="_blank" rel="noreferrer" className="w-100 btn btn-custom-7 rounded-lg mb-2">GET YOUR OWN TOKENS</a>
                                {/* <p className="font-size-90 text-color-6 neo-light mt-3 mb-4">
                                    <a href="https://pancakeswap.finance/info/pool/0x5b14378d1bab6bf323ebd6cfd4a26ec2c49598da" target="_blank" rel="noreferrer" className="stake-link">
                                        <b>See Pair Info</b>
                                        &nbsp;<FontAwesomeIcon size="sm" icon={faExternalLinkAlt} />
                                    </a>
                                </p> */}
                            </div>
                        </div>
                        <div className="col-12 col-lg-7">
                            <hr className="my-5 d-block d-lg-none" />

                            <p className="text-center font-size-170 text-color-2 neo-bold mb-1">Stake Your OWN Tokens Here</p>
                            <p className="text-center font-size-90 text-color-6 neo-light mb-3">Stake your <b>OWN Tokens</b> and receive <b>1 Mustachio Marauder</b></p>
                            <p className="total-dep bg-color-21 text-white text-center font-size-110 neo-light mb-3"><b>TOTAL DEPOSITS:</b> {addCommasToNumber(state.totalOwnTokensStaked)} OWN</p>

                            {/* <p className="font-size-90 text-center text-color-6 neo-light mb-4">
                                <a onClick={handleShowTopStakers} className="stake-link cursor-pointer">
                                    <b>VIEW STAKERS' LEADERBOARD</b>
                                </a>
                            </p> */}

                            <div className="staking-card mx-auto" style={{"width": "85%"}}>
                                <div className="app-card">
                                    {/* STAKING FORM */}
                                    <form>
                                        <p className="font-size-110 neo-light mb-1">Stake $OWN</p>
                                        <div className="form-group stake-form mb-3">
                                            <input type="number" id="stake-input-num" className="form-control form-control-lg stake-input" readOnly="true" value={state.stakeRequired} />
                                        </div>
                                        {/* <div className="d-flex justify-content-between mb-1">
                                            { state.isConnected ? (
                                                <button onClick={approveStaking} type="button" className="btn stake-btn-func btn-custom-2" disabled={state.isApproved}>APPROVE</button>
                                            ) : (
                                                <button type="button" onClick={handleShowNotConnected} className="btn stake-btn-func btn-custom-2" disabled={state.isApproved}>APPROVE</button>
                                            )}
                                            <button onClick={enterStaking} type="button" className="btn stake-btn-func btn-custom-2" disabled={!state.isApproved}>STAKE</button>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <button onClick={claimRewards} type="button" className="btn stake-btn-func btn-custom-2" disabled={!state.isLoaded}>UNSTAKE</button>
                                            <button onClick={claimAndWithdraw} type="button" className="btn stake-btn-func btn-custom-2" disabled={!state.isLoaded}>CLAIM & WITHDRAW</button>
                                        </div> */}
                                    </form>
                                    {/* END STAKING FORM */}

                                    <hr className="my-4" />

                                    {/* DETAILS */}
                                    <div className="d-none d-sm-block">
                                        <div className="d-flex justify-content-between">
                                            <p className="mb-3 neo-bold font-size-90">Stake Required</p>
                                            <p className="mb-3 neo-regular font-size-90">{addCommasToNumber(state.stakeRequired)} OWN</p>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <p className="mb-3 neo-bold font-size-90">Remaining Rewards</p>
                                            <p className="mb-3 neo-regular font-size-90">{addCommasToNumber(state.remainingRewards)} MUSTACHIOS</p>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <p className="mb-3 neo-bold font-size-90">Your Deposit</p>
                                            { state.isConnected ? (
                                                <p className="mb-3 neo-regular font-size-90">{addCommasToNumber(state.userOwnDeposits)} OWN</p>
                                            ) : (
                                                <p className="mb-3 neo-regular font-size-90">Connect Wallet</p>
                                            )}
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <p className="mb-3 neo-bold font-size-90">Date Staked</p>
                                            <p className="mb-3 neo-regular font-size-90">{state.dateStaked}</p>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <p className="mb-3 neo-bold font-size-90">Duration</p>
                                            { state.isConnected ? (
                                                <p className="mb-3 neo-regular font-size-90">{addCommasToNumber(state.nftStakingDuration)} Days ({addCommasToNumber(state.userRemainingDuration)} remaining)</p>
                                            ) : (
                                                <p className="mb-3 neo-regular font-size-90">Connect Wallet</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="d-block d-sm-none">
                                        <div className="mb-3">
                                            <p className="mb-1 neo-bold font-size-110">Stake Required</p>
                                            <p className="mb-1 neo-regular font-size-90">{addCommasToNumber(state.stakeRequired)} OWN</p>
                                        </div>
                                        <div className="mb-3">
                                            <p className="mb-1 neo-bold font-size-110">Remaining Rewards</p>
                                            <p className="mb-1 neo-regular font-size-90">{addCommasToNumber(state.remainingRewards)} MUSTACHIOS</p>
                                        </div>
                                        <div className="mb-3">
                                            <p className="mb-1 neo-bold font-size-110">Your Deposit</p>
                                            { state.isConnected ? (
                                                <p className="mb-1 neo-regular font-size-90">{addCommasToNumber(state.userOwnDeposits)} OWN</p>
                                            ) : (
                                                <p className="mb-3 neo-regular font-size-90">Connect Wallet</p>
                                            )}
                                        </div>
                                        <div className="mb-3">
                                            <p className="mb-1 neo-bold font-size-110">Date Staked</p>
                                            <p className="mb-1 neo-regular font-size-90">{state.dateStaked}</p>
                                        </div>
                                        <div>
                                            <p className="mb-1 neo-bold font-size-110">Duration</p>
                                            { state.isConnected ? (
                                                <p className="mb-1 neo-regular font-size-90">{addCommasToNumber(state.nftStakingDuration)} Days ({addCommasToNumber(state.userRemainingDuration)} remaining)</p>
                                            ) : (
                                                <p className="mb-3 neo-regular font-size-90">Connect Wallet</p>
                                            )}
                                        </div>
                                    </div>
                                    {/* END DETAILS */}

                                    <hr className="my-4" />


                                    {/* PRODUCTION */}
                                    {/* <p className="font-size-90 text-color-6 neo-light mb-1">
                                        <a href={`https://bscscan.com/address/${nftStakingAddress}`} target="_blank" rel="noreferrer" className="stake-link">
                                            <b>View Staking Contract</b>
                                            &nbsp;<FontAwesomeIcon size="sm" icon={faExternalLinkAlt} />
                                        </a>
                                    </p> */}
                                    {/* DEVELOPMENT */}
                                    <p className="font-size-90 text-color-6 neo-light mb-1">
                                        <a href={`https://testnet.bscscan.com/address/${nftStakingAddress}`} target="_blank" rel="noreferrer" className="stake-link">
                                            <b>View Smart Contract</b>
                                            &nbsp;<FontAwesomeIcon color="black" size="sm" icon={faExternalLinkAlt} />
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Modals */}
            {/* Modal for not connected */}
            <Modal show={showNotConnected} onHide={handleCloseNotConnected} backdrop="static" keyboard={false} size="sm" centered>
                <Modal.Body>
                    <div className="text-center mb-3">
                        <FontAwesomeIcon color="red" size="6x" icon={faExclamationCircle} />
                    </div>
                    <p className="app-error-modal-content text-center font-andes text-lg">Please connect to your Metamask Wallet.</p>
                </Modal.Body>
                <Modal.Footer className="justify-content-center">
                    <Button className="font-w-hermann w-hermann-reg" variant="secondary" onClick={handleCloseNotConnected}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal> 

            {/* Modal for error transaction */}
            <Modal show={showOnError} onHide={handleCloseOnError} backdrop="static" keyboard={false} size="sm" centered>
                <Modal.Body>
                    <div className="text-center mb-3">
                        <FontAwesomeIcon color="red" size="6x" icon={faExclamationCircle} />
                    </div>
                    <p className="app-error-modal-content text-center font-andes text-lg">Error: {state.txError}</p>
                </Modal.Body>
                <Modal.Footer className="justify-content-center">
                    <Button className="font-w-hermann w-hermann-reg" variant="secondary" onClick={handleCloseOnError}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal> 

            {/* Modal for waiting */}
            <Modal show={showPleaseWait} onHide={handleClosePleaseWait} backdrop="static" keyboard={false} size="sm" centered>
                <Modal.Body>
                    <div className="text-center mb-3">
                        <FontAwesomeIcon color="grey" size="6x" icon={faSpinner} spin />
                    </div>
                    <p className="app-error-modal-content text-center font-andes text-lg">Please wait...</p>
                </Modal.Body>
                <Modal.Footer className="justify-content-center">
                    <Button className="font-w-hermann w-hermann-reg" variant="secondary" onClick={handleClosePleaseWait}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal> 

            {/* Modal for successful approve */}
            <Modal show={showOnApprove} onHide={handleCloseOnApprove} backdrop="static" keyboard={false} size="md" centered>
                <Modal.Body>
                    <div className="text-center mb-3">
                        <FontAwesomeIcon color="green" size="6x" icon={faCheckCircle} />
                    </div>
                    <p className="app-success-modal-content text-center font-andes text-lg">Your transaction was approved. You can now proceed.</p>
                </Modal.Body>
                <Modal.Footer className="justify-content-center">
                    <Button className="font-w-hermann w-hermann-reg" variant="secondary" onClick={handleCloseOnApprove}>
                        Close
                    </Button>
                    <Button className="font-w-hermann w-hermann-reg" variant="primary" onClick={() => window.open(explorerUrl + state.txHash, '_blank').focus()}>
                        View on BscScan
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal for successful staking */}
            <Modal show={showStaked} onHide={handleCloseStaked} backdrop="static" keyboard={false} size="md" centered>
                <Modal.Body>
                    <div className="text-center mb-3">
                        <FontAwesomeIcon color="green" size="6x" icon={faCheckCircle} />
                    </div>
                    <p className="app-success-modal-content text-center font-andes text-lg">Your OWN tokens are staked successfully.</p>
                </Modal.Body>
                <Modal.Footer className="justify-content-center">
                    <Button className="font-w-hermann w-hermann-reg" variant="secondary" onClick={handleCloseStaked}>
                        Close
                    </Button>
                    <Button className="font-w-hermann w-hermann-reg" variant="primary" onClick={() => window.open(explorerUrl + state.txHash, '_blank').focus()}>
                        View on BscScan
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal for successful claim */}
            <Modal show={showClaim} onHide={handleCloseClaim} backdrop="static" keyboard={false} size="md" centered>
                <Modal.Body>
                    <div className="text-center mb-3">
                        <FontAwesomeIcon color="green" size="6x" icon={faCheckCircle} />
                    </div>
                    <p className="app-success-modal-content text-center font-andes text-lg">Your reward tokens are claimed successfully.</p>
                </Modal.Body>
                <Modal.Footer className="justify-content-center">
                    <Button className="font-w-hermann w-hermann-reg" variant="secondary" onClick={handleCloseClaim}>
                        Close
                    </Button>
                    <Button className="font-w-hermann w-hermann-reg" variant="primary" onClick={() => window.open(explorerUrl + state.txHash, '_blank').focus()}>
                        View on BscScan
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal for successful exit */}
            <Modal show={showExit} onHide={handleCloseExit} backdrop="static" keyboard={false} size="md" centered>
                <Modal.Body>
                    <div className="text-center mb-3">
                        <FontAwesomeIcon color="green" size="6x" icon={faCheckCircle} />
                    </div>
                    <p className="app-success-modal-content text-center font-andes text-lg">You have successfully withdrawn your staked OWN Tokens and reward tokens.</p>
                </Modal.Body>
                <Modal.Footer className="justify-content-center">
                    <Button className="font-w-hermann w-hermann-reg" variant="secondary" onClick={handleCloseExit}>
                        Close
                    </Button>
                    <Button className="font-w-hermann w-hermann-reg" variant="primary" onClick={() => window.open(explorerUrl + state.txHash, '_blank').focus()}>
                        View on BscScan
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal for No Metamask */}
            <Modal show={showMetamaskInstall} onHide={handleCloseMetamaskInstall} backdrop="static" keyboard={false} size="sm" centered>
                <Modal.Body>
                    <div style={{"textAlign": "center"}}>
                        <img src={metamask} alt="Metamask logo" />
                    </div>
                    <p className="app-metamask-modal-content text-center font-andes text-lg">Metamask is currently not installed</p>
                </Modal.Body>
                <Modal.Footer className="justify-content-center">
                    <Button className="font-w-hermann w-hermann-reg" variant="secondary" onClick={handleCloseMetamaskInstall}>
                        Close
                    </Button>
                    <Button className="font-w-hermann w-hermann-reg" variant="primary" onClick={() => window.open("https://metamask.io/download", '_blank').focus()}>
                        Install Metamask
                    </Button>
                </Modal.Footer>
            </Modal> 

            {/* Modal for incorrect network */}
            <Modal show={showWrongNetwork} onHide={handleCloseWrongNetwork} backdrop="static" keyboard={false} size="sm" centered>
                <Modal.Body>
                    <div className="text-center mb-3">
                        <FontAwesomeIcon color="green" size="6x" icon={faExclamationCircle} />
                    </div>
                    {/* PRODUCTION */}
                    {/* <p className="app-network-modal-content text-center font-andes text-lg">Please connect to BSC Mainnet</p> */}
                    {/* DEVELOPMENT */}
                    <p className="app-network-modal-content text-center font-andes text-lg">Please connect to BSC Testnet</p>
                </Modal.Body>
                <Modal.Footer className="justify-content-center">
                    <Button className="font-w-hermann w-hermann-reg" variant="secondary" onClick={handleCloseWrongNetwork}>
                        Close
                    </Button>
                    {/* PRODUCTION */}
                    {/* <Button className="font-w-hermann w-hermann-reg" variant="primary" onClick={() => switchNetwork("bscmainnet")}>
                        Switch Network
                    </Button> */}
                    {/* DEVELOPMENT */}
                    <Button className="font-w-hermann w-hermann-reg" variant="primary" onClick={() => switchNetwork("bsctestnet")}>
                        Switch Network
                    </Button>
                </Modal.Footer>
            </Modal>     

            {/* Modal for change detection */}
            <Modal show={showDetected} onHide={handleCloseDetected} backdrop="static" keyboard={false} size="sm" centered>
                <Modal.Body>
                    <div className="text-center mb-3">
                        <FontAwesomeIcon color="green" size="6x" icon={faExclamationCircle} />
                    </div>
                    <p className="app-network-modal-content text-center font-andes text-lg">{state.detectedChangeMessage}</p>
                </Modal.Body>
                <Modal.Footer className="justify-content-center">
                    <Button className="font-w-hermann w-hermann-reg" variant="primary" onClick={() => window.location.reload()}>
                        Reload
                    </Button>
                </Modal.Footer>
            </Modal>     

            {/* Modal for stakers leaderboard */}
            {/* <Modal show={showTopStakers} onHide={handleCloseTopStakers} backdrop="static" keyboard={false} size="lg" centered>
                <Modal.Body>
                    <TopStakers shortenAddress={shortenAddress} addCommasToNumber={addCommasToNumber} />
                </Modal.Body>
                <Modal.Footer className="justify-content-center">
                    <Button className="font-w-hermann w-hermann-reg" variant="secondary" onClick={handleCloseTopStakers}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>      */}

            {/* End Modals */}
        </div>
    );
}

export default OWN_Mustachio
