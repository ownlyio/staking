import { useEffect, useState } from 'react'
import ownMustachio from '../../../img/staking/own-mustachio-rulers.png'

function ItemOWNMustachio() {
    let web3, stakingContract
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

    useEffect(() => {

    })

    return (
        <div className="col-12 col-md-4 s-item nft">
            <div className="splatform-item">
                <div className="splatform-item-img">
                    <img className="w-100" src={ownMustachio} alt="Stake OWN, Earn Mustachio Ruler" />
                </div>
                <p className="splatform-item-title text-center neo-bold text-color-6 font-size-170">Stake OWN, Earn Mustachio Ruler</p>
                <div className="splatform-item-divider my-3"></div>
                <div className="splatform-item-content">
                    <div className="d-flex justify-content-between mb-3">
                        <div className="splatform-desc text-left font-semibold font-size-100">Total Deposits</div>
                        <div className="splatform-desc text-right text-color-7 font-size-100">0.0000003</div>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                        <div className="splatform-desc text-left font-semibold font-size-100">Stake Required</div>
                        <div className="splatform-desc text-right text-color-7 font-size-100">0.0000003</div>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                        <div className="splatform-desc text-left font-semibold font-size-100">Remaining Rewards</div>
                        <div className="splatform-desc text-right text-color-7 font-size-100">300 MUSTACHIOS</div>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                        <div className="splatform-desc text-left font-semibold font-size-100">Your Deposit</div>
                        <div className="splatform-desc text-right text-color-7 font-size-100">0.0000003</div>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                        <div className="splatform-desc text-left font-semibold font-size-100">Date of Minting</div>
                        <div className="splatform-desc text-right text-color-7 font-size-100">April 10, 2022</div>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                        <div className="splatform-desc text-left font-semibold font-size-100">Duration</div>
                        <div className="splatform-desc text-right text-color-7 font-size-100">30 Days (30 Remaining)</div>
                    </div>
                </div>
                <div className="splatform-item-btn">
                    <button className="btn btn-custom-3 w-100 font-size-150">Stake Now!</button>
                </div>
            </div>
        </div>
    )
}

export default ItemOWNMustachio