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
            <main>
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
		</main>
        );
    }
}

export default Home;