import 'dotenv';
import React, {Component} from 'react';
import Signin from './Signin';
import Token from './Token';
import { ethers } from 'ethers';
import ABI from './abi.json';

class Home extends Component {

    constructor(props) {
        super(props);
        this.web3 = null;
        this.provider = null;
        this.nftContract = null;
        this.state = {
            walletEns: null,
            walletAddress: null,
            isRegistered: false,
            tokens: []
        }
    }

    async componentDidMount() { 
		this.provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_INFURA_URL);
        this.nftContract = new ethers.Contract(process.env.REACT_APP_NFT_CONTRACT, ABI, this.provider);
    }

    onRegistered = async (registeredEns) => { 
        let registeredAddress = await this.provider.resolveName(registeredEns);
        this.setState({
            isRegistered: true,
            walletEns: registeredEns,
            walletAddress: registeredAddress
        });
        this.findTokens();
    }

    findTokens = async () => {

        let tokens = [];
        let balance = await this.nftContract.functions.balanceOf(this.state.walletAddress);
    
        for(let i = 0; i < balance; i++) {
            let tokenId = await this.nftContract.functions.tokenOfOwnerByIndex(this.state.walletAddress, i);
            let tokenUri = await this.nftContract.functions.tokenURI(tokenId);
            let matchUri = await this.nftContract.functions.dualTokenURI(tokenId);
            tokens.push({
                'id': parseInt(tokenId), 
                'uri': tokenUri,
                'match': matchUri
            });
        }
        console.log(tokens);
        this.setState({
            tokens
        });
    }

    render() {
        const {
            isRegistered,
            walletEns,
            tokens
            } = this.state;
        return (
            <React.Fragment>
               <div className="logo-wrapper">
                    <h1 className="logo"><a href="https://emojihunt.xyz" className="text-hide">EmojiHunt</a></h1>
                </div>

                <div className="win-wrapper">
                    <img src="assets/images/win-circle.svg" className="win-circle" alt="Win 500 DAI" />

                    <img src="assets/images/animations/unicorn.gif" className="emoji-unicorn" alt="Unicorn Emoji" />

                    <p className="prize-amount medium">
                        $500
                        <img src="assets/images/icon-dai.svg" className="icon-dai" alt="DAI icon" />
                    </p>
                    <p className="prize-currency h2 regular">in DAI</p>
                </div>
                { isRegistered ? (
                <React.Fragment>
                    <main>

                        <div className="win-or-lose">
                            <img src="assets/images/animations/winner-cup.gif" className="emoji-winner-cup" alt="Winner cup emoji" />
                            <img src="assets/images/animations/flying-cash.gif" className="emoji-flying-cash" alt="Flying cash" />
                        </div>

                        <div className="your-emojis">

                            <h3 className="hello-ens">Hello {walletEns}</h3>

                            <div className="blue-box instructions">
                                <h4>How to play</h4>

                                <p>Find someone else with the emoji you need</p>
                                <p>To move to the next round, match your emojis by entering each other's Argent usernames!</p>
                                <p className="small">We don't advise you share your ENS publicly.</p>
                            </div>
                            {tokens.length === 0 ? (
                                <h2>Loading your Emojis...</h2>
                            ) : (
                                <div>
                                <h2>Your Emojis</h2>

                                {tokens.map( (token, index) => {
                                    return(
                                        <Token
                                            id={token.id}
                                            uri={token.uri}
                                            match={token.match}
                                            provider={this.provider}
                                            onError={this.props.onError}
                                            key={index}/>
                                    )
                                })}
                                </div>
                            )}
                            

                        </div>
                    </main>

                </React.Fragment>
                ) : (
                    <Signin onRegistered={this.onRegistered} onError={this.props.onError}/>
                )} 
            </React.Fragment>
        );
    }
}

export default Home;