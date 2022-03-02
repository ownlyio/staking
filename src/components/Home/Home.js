import './Home.css'

import ownly from '../../img/ownly/own-token.webp'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoins, faReceipt, faWallet } from '@fortawesome/free-solid-svg-icons'

import ownMustachio from '../../img/staking/own-mustachio-rulers.png'
import ownBusd from '../../img/staking/own-busd.png'

export default function Home() {
    const filterStakingOptions = (e, type) => {
        // add active class
        const activeElement = document.querySelectorAll('.splatform-btn-item.active')[0]
        activeElement.classList.remove('active')
        
        const clickedElement = e.target
        clickedElement.classList.add("active")

        // remove items with display none
        const itemsWithDisplayNone = document.querySelectorAll('.s-item.d-none')
        for (var i = 0; i < itemsWithDisplayNone.length; i++) {
            itemsWithDisplayNone[i].classList.remove('d-none')
        }

        // filter staking options by class name
        // for type = 0, just remove the display none for all items
        if (type === 1) { // liquidity
            const otherItems = document.querySelectorAll(".s-item:not(.liquidity)")
            for (var i = 0; i < otherItems.length; i++) {
                otherItems[i].classList.add('d-none')
            }
        } else if (type == 2) { // nft
            const otherItems = document.querySelectorAll(".s-item:not(.nft)")
            for (var i = 0; i < otherItems.length; i++) {
                otherItems[i].classList.add('d-none')
            }
        }
    }

    return (
        <section>
            <div id="home">
                <div className="container h-100">
                    <div className="row justify-content-center align-items-center h-100">
                        <div className="col-12 col-md-6">
                            <div className="home-content">
                                <p className="home-title font-size-320 text-color-3 neo-bold mb-4">Stake your OWN Tokens, Earn Rewards!</p>
                                <p className="home-sub font-size-130 text-color-6 mb-5">Stake your $OWN tokens to our staking platform and earn rewards. Get exclusive bonuses and over 50.00% fees back. Keep your coins in your wallet and under control.</p>
                                <div className="home-cta d-flex align-items-center">
                                    <a href="#staking-platforms" className="home-btn-1 btn btn-custom-1 rounded-lg">See Staking Options</a>
                                    <a href="#how-it-works" className="home-btn-2 btn btn-custom-8 rounded-lg">How it works</a>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6 d-none d-md-block">
                            <div className="home-img">
                                <img src={ownly} alt="Ownly Logo" className="w-100" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="how-it-works">
                <div className="container h-100">
                    <p className="hiw-title font-size-250 text-center text-color-2 neo-bold mb-3">How this works</p>
                    <p className="hiw-sub font-size-130 text-center text-color-7 mb-5">Simple steps to earn rewards and still having a full control of your coins</p>

                    <div className="row justify-content-center align-items-center">
                        <div className="col-12 col-md-4">
                            <div className="hiw-item-content">
                                <div className="hiw-icon mb-3 text-center">
                                    <FontAwesomeIcon icon={faWallet} size="4x" color="#616161" />
                                </div>
                                <p className="hiw-item-title font-size-150 text-center font-semibold text-color-3 mb-3">Use your Metamask Wallet</p>
                                <p className="hiw-item-sub font-size-110 text-center neo-light text-color-6 mb-0">You decide how much you'll stake. You'll use your Metamask wallet for this.</p>
                            </div>
                        </div>
                        <div className="col-12 col-md-4">
                            <div className="hiw-item-content">
                                <div className="hiw-icon mb-3 text-center">
                                    <FontAwesomeIcon icon={faReceipt} size="4x" color="#616161" />
                                </div>
                                <p className="hiw-item-title font-size-150 text-center font-semibold text-color-3 mb-3">Stake your tokens</p>
                                <p className="hiw-item-sub font-size-110 text-center neo-light text-color-6 mb-0">Approve and stake your coins from your own wallet to our platform.</p>
                            </div>
                        </div>
                        <div className="col-12 col-md-4">
                            <div className="hiw-item-content">
                                <div className="hiw-icon mb-3 text-center">
                                    <FontAwesomeIcon icon={faCoins} size="4x" color="#616161" />
                                </div>
                                <p className="hiw-item-title font-size-150 text-center font-semibold text-color-3 mb-3">Earn your rewards</p>
                                <p className="hiw-item-sub font-size-110 text-center neo-light text-color-6 mb-0">Sit back, relax, and receive rewards directly to your own wallet - coins and/or NFTs!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="staking-platforms" className="mb-5">
                <div className="container">
                    <p className="splatform-title font-size-250 text-center text-color-4 neo-bold mb-3">Our Staking Platforms</p>
                    <p className="splatform-sub font-size-130 text-center text-color-7 mb-5">Stake your OWN Tokens and earn tokens, NFTs or other tokens!</p>

                    <div className="splatform-btns mb-4">
                        <div className="d-flex w-100">
                            <button onClick={(e) => filterStakingOptions(e, 0)} className="btn splatform-btn-item neo-bold active">All</button>
                            <button onClick={(e) => filterStakingOptions(e, 1)} className="btn splatform-btn-item neo-bold">Liquidity</button>
                            <button onClick={(e) => filterStakingOptions(e, 2)} className="btn splatform-btn-item neo-bold">NFTs</button>
                        </div>
                    </div>
                    <div className="row justify-content-start align-items-center">
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
                    </div>
                </div>
            </div>
        </section>
    )
}
