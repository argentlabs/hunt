import React, {Component} from 'react';

const ARGENT_URL = "";
const ARGENT_ENS = "argent.xyz";
const NFT_CONTRACT = "0x4564F46670707cB37278ca09e856aF0792573A7A";

class Token extends Component {

    constructor(props) {
        super(props);

        this.state = {
            id: props.id,
            uri: props.uri,
            match: props.match,
            targetEns: null,
            provider: props.provider
        }
    }

    // async componentDidMount() {
		
    // }

    handleInputChange = event => { 
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value + '.' + ARGENT_ENS
        });
    }

    onMatch = async () => {
        let nav = navigator.userAgent;
        if(!nav.includes('Android') && !nav.includes('iPhone')) {
            this.props.onError(new Error('You can only match your token on a mobile phone'));
            return;
        }
        let targetAddress = await this.state.provider.resolveName(this.state.targetEns);
        let url = `${ARGENT_URL}/app/ah_requestMerge?to=${targetAddress}&contract=${NFT_CONTRACT}&ens=${this.state.targetEns}&id=${this.state.id}`
        window.open(url, '_blank');
    }

    render() {
        return (
            <React.Fragment>
                <div className="how-to-play__box">
                <div className="emojis">
                    <div className="you-have">
                    <h4>You have</h4>
                    🎉
                    </div>

                    <div className="you-need">
                    <h4>You need</h4>
                    🤠
                    </div>
                </div>

                <a href="https://twitter.com/share?ref_src=twsrc%5Etfw" className="twitter-share-button" data-size="large" data-text="Let&#39;s both win 500 #DAI! I have 🎉 and need 🤠" data-url="https://emojihunt.argent.xyz" data-hashtags="emojihunt" data-show-count="false">Tweet</a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

                <div className="form-group">
                    <div className="input-group">
                    <input name="targetEns" type="text" className="form-control form-text" placeholder="username"/>

                    <div className="input-group-append">.argent.xyz</div>
                    </div>
                </div>
                <button className="button" onClick={this.onMatch}>Match</button>
                </div>
            </React.Fragment>
			
        );
    }
}

export default Token;