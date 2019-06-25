import React, {Component} from 'react';
import Signin from './Signin';
import Token from './Token';
import { ethers } from 'ethers';

const RPC_URL = "";
const NFT_CONTRACT = "";
const ABI = [];

class Home extends Component {

    constructor(props) {
        super(props);
        this.web3 = null;
        this.provider = null;
        this.nftContract = null;
        this.state = {
            walletEns: null,
            isRegistered: false,
            tokens: []
        }
    }

    async componentDidMount() {
		this.provider = new ethers.providers.JsonRpcProvider(RPC_URL);
		this.nftContract = new ethers.Contract(NFT_CONTRACT, ABI, this.provider);
	}

    onRegistered = async (value) => {
        this.setState({
            isRegistered: true,
            walletEns: value
        });
        this.findTokens();
    }

    findTokens = async () => {
        this.setState({
            tokens : [
                {"id":"1", "state": "available"},
                {"id":"1", "state": "available"},
                {"id":"3", "state": "available"}
                ]
        })
    }

    render() {
        const {
            isRegistered,
            walletEns,
            tokens
        } = this.state;
        return (
            <React.Fragment>
               <div class="logo-wrapper">
                    <h1 class="logo"><a href="#" class="text-hide">EmojiHunt</a></h1>
                </div>

                <div class="win-wrapper">
                    <img src="assets/images/win-circle.svg" class="win-circle" alt="Win 500 DAI" />

                    <img src="assets/images/animations/unicorn.gif" class="emoji-unicorn" alt="Unicorn Emoji" />

                    <p class="prize-amount medium">
                        $500
                        <img src="assets/images/icon-dai.svg" class="icon-dai" alt="DAI icon" />
                    </p>
                    <p class="prize-currency h2 regular">in DAI</p>
                </div>
                { isRegistered ? (
                <div>
                    <p>
                        Hello {walletEns}
                    </p>
                    <ul>
                        {tokens.map( (token, index) => {
                            return(
                                <li>
                                    <Token id={token.id} state={token.state}/>
                                </li>
                            )
                        })}
                    </ul>
                </div>
                ) : (
                    <Signin onRegistered={this.onRegistered}/>
                )} 
            </React.Fragment>
        );
    }
}

export default Home;