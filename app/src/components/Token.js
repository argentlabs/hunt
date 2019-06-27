import React, {Component} from 'react';

const ARGENT_URL = "emojihunt.argent.xyz";
const ARGENT_ENS = "argent.xyz";
const NFT_CONTRACT = "0x4564F46670707cB37278ca09e856aF0792573A7A";

class Token extends Component {

    constructor(props) {
        super(props);

        this.state = {
            id: props.id,
            image: null,
            target: null,
            targetEns: null,
            provider: props.provider
        }
    }

    async componentDidMount() {
        let image, targetImage;
		if(this.props.uri) {
            image = await this.getImage(this.props.uri);
        }
        if(this.props.match) {
            targetImage = await this.getImage(this.props.match);
        }
        this.setState({
            image,
            targetImage
        });
    }

    handleInputChange = event => { 
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value + '.' + ARGENT_ENS
        });
    }

    onMatch = async () => {
        let nav = 'Android';//navigator.userAgent;
        if(!nav.includes('Android') && !nav.includes('iPhone')) {
            this.props.onError(new Error('You can only match your token on a mobile phone'));
            return;
        }
        let targetAddress = await this.state.provider.resolveName(this.state.targetEns); console.log(targetAddress);
        let url = `${ARGENT_URL}/app/ah_requestMerge?to=${targetAddress}&contract=${NFT_CONTRACT}&ens=${this.state.targetEns}&id=${this.state.id}`
        window.open(url, '_blank');
    }

    getImage = async (url) => {
        try {
            const response  = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok !== true) { 
                this.props.onError(new Error(`Unkown token ${url}`));
            }

            const data = await response.json(); 
            return data.image.description;
        } catch (er) {
            this.props.onError(new Error('Error while loading the image'));
            return;
        }
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
                <button className="button" onClick={this.onMatch} onChange={this.handleInputChange}>Match</button>
                </div>
            </React.Fragment>
			
        );
    }
}

export default Token;