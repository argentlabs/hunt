import React, {Component} from 'react';
import Signin from './Signin';
import Token from './Token';
import { ethers } from 'ethers';

const RPC_URL = "https://ropsten.infura.io/v3/18a84d2ce0d94715a61a35a7717c4086";
const NFT_CONTRACT = "0xa6d1AD05EcF47a627c4950a3069C57d24846cB43";
const ABI = [
    {
        "constant": true,
        "inputs": [
          {
            "name": "owner",
            "type": "address"
          }
        ],
        "name": "balanceOf",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      }
];

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
		this.provider = new ethers.providers.JsonRpcProvider(RPC_URL);
        this.nftContract = new ethers.Contract(NFT_CONTRACT, ABI, this.provider);
    }

    onRegistered = async (registeredEns) => { 
        console.log("registered ENS " + registeredEns );
        let registeredAddress = await this.provider.resolveName(registeredEns);
        this.setState({
            isRegistered: true,
            walletEns: registeredEns,
            walletAddress: registeredAddress
        });
        this.findTokens();
    }

    findTokens = async () => {

        let balance = await this.nftContract.functions.balanceOf(this.state.walletAddress);
        console.log(balance);
    
        for(let i = 0; i < balance; i++) {
            let tokenId = await this.nftContract.methods.tokenOfOwnerByIndex(this.state.walletAddress, i);
            console.log(tokenId);
        }

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
               <div className="logo-wrapper">
                    <h1 className="logo"><a href="#" className="text-hide">EmojiHunt</a></h1>
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
                    <Signin onRegistered={this.onRegistered} onError={this.props.onError}/>
                )} 
            </React.Fragment>
        );
    }
}

export default Home;