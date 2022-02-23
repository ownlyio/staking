import './Home.css'

import ownly from '../../img/ownly/own-token.webp'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoins, faReceipt, faWallet } from '@fortawesome/free-solid-svg-icons'

export default function Home() {
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
                                    <a href="#" className="home-btn-1 btn btn-custom-1 rounded-lg">See Staking Options</a>
                                    <a href="#" className="home-btn-2 btn btn-custom-8 rounded-lg">How it works</a>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="home-img">
                                <img src={ownly} alt="Ownly Logo" className="w-100" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="how-it-works" className="mb-5">
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
        </section>
    )
}
