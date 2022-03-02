import { useEffect, useState } from 'react'
import axios from 'axios'

import ownBusd from '../../../img/staking/own-busd.png'

// PRODUCTION
import { stakingTokenAbi, stakingTokenAddress } from '../../../utils/contracts/liquidity/cakelp-own/stakingToken'
import { stakingAbi, stakingAddress } from '../../../utils/contracts/liquidity/cakelp-own/staking'

// DEVELOPMENT
// import { stakingTokenAbi, stakingTokenAddress } from '../../../utils/contracts/liquidity/cakelp-own/stakingTokenDev'
// import { stakingAbi, stakingAddress } from '../../../utils/contracts/liquidity/cakelp-own/stakingDev'

// Utils
import { configureWeb3 } from '../../../utils/web3Init'
import { getApr } from '../../../utils/apr'

function ItemCakeLPOWN() {
    let web3, stakingContract
    const [_web3, setWeb3] = useState()
    const [_stakingContract, setStakingContract] = useState()
    const [_stakingTokenContract, setStakingTokenContract] = useState()
    const [state, setState] = useState({
        isLoaded: false,
        isConnected: false,
        account: "",
        hasMetamask: false,
        totalLPTokensStaked: 0,
        userCurrentLPStaked: 0,
        userRate: 0,
        apr: "--",
        userRewardsEarned: 0,
        lpStakingDuration: 0,
    })

    // state updater
    const _setState = (name, value) => {
        setState(prevState => ({...prevState, [name]: value}))
    }

    // convert a timestamp to days
    const convertTimestamp = async unixTime => {
        const req = await axios.get(`https://ownly.tk/api/get-remaining-time-from-timestamp/${unixTime}`)
        return Math.floor(req.data / (3600*24))
    }

    // round to the nearest hundredths
    const roundOff = num => {
        return +(Math.round(num + "e+2")  + "e-2");
    }
    
    useEffect(() => {
        async function _init() {
            // WEB3 RPC - BSC MAINNET
            web3 = configureWeb3("https://bsc-dataseed.binance.org/")
            // WEB3 RPC - BSC TESTNET (COMMENT WHEN PRODUCTION)
            // web3 = configureWeb3("https://data-seed-prebsc-1-s1.binance.org:8545/")

            // RPC Initialize
            stakingContract = new web3.eth.Contract(stakingAbi, stakingAddress)

            // Metamask
            const web3Metamask = configureWeb3()

            if (web3Metamask !== 1) { 
                const stakingContractMetamask = new web3Metamask.eth.Contract(stakingAbi, stakingAddress)
                const stakingTokenContractMetamask = new web3Metamask.eth.Contract(stakingTokenAbi, stakingTokenAddress)
                setWeb3(web3Metamask)
                setStakingContract(stakingContractMetamask)
                setStakingTokenContract(stakingTokenContractMetamask)
                _setState("hasMetamask", true)
            } else {
                _setState("hasMetamask", false)
            }

            // get staking duration
            const duration = await stakingContract.methods.periodFinish().call()
            const calculatedDuration = await convertTimestamp(duration)
            _setState("lpStakingDuration", calculatedDuration)
    
            // get total deposits
            const totalLP = await stakingContract.methods.totalSupply().call()
            _setState("totalLPTokensStaked", web3.utils.fromWei(totalLP))

            // APR
            const apr = await getApr()
            _setState("apr", roundOff(apr))
        }
        
        _init()
    })

    return (
        <div className="col-12 col-md-4 s-item liquidity">
            <div className="splatform-item">
                <div className="splatform-item-img">
                    <img className="w-100" src={ownBusd} alt="Stake OWN/BUSD, Earn OWN" />
                </div>
                <p className="splatform-item-title text-center neo-bold text-color-6 font-size-170">Stake OWN/BUSD, Earn OWN</p>
                <div className="splatform-item-divider my-3"></div>
                <div className="splatform-item-content">
                    <div className="d-flex justify-content-between mb-3">
                        <div className="splatform-desc text-left font-semibold font-size-100">Total Deposits</div>
                        <div className="splatform-desc text-right text-color-7 font-size-100">0.0000003</div>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                        <div className="splatform-desc text-left font-semibold font-size-100">Your Total Deposits</div>
                        <div className="splatform-desc text-right text-color-7 font-size-100">0.0000003</div>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                        <div className="splatform-desc text-left font-semibold font-size-100">Your Rate</div>
                        <div className="splatform-desc text-right text-color-7 font-size-100">0.0000003</div>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                        <div className="splatform-desc text-left font-semibold font-size-100">APR</div>
                        <div className="splatform-desc text-right text-color-7 font-size-100">10.23 %</div>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                        <div className="splatform-desc text-left font-semibold font-size-100">Total Rewards</div>
                        <div className="splatform-desc text-right text-color-7 font-size-100">120,000,000 OWN</div>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                        <div className="splatform-desc text-left font-semibold font-size-100">Duration</div>
                        <div className="splatform-desc text-right text-color-7 font-size-100">120 Days (10 Remaining)</div>
                    </div>
                </div>
                <div className="splatform-item-btn">
                    <button className="btn btn-custom-3 w-100 font-size-150">Stake Now!</button>
                </div>
            </div>  
        </div>
    )
}

export default ItemCakeLPOWN