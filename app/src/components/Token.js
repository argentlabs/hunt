import 'dotenv';
import React, {Component} from 'react';

class Token extends Component {

    constructor(props) {
        super(props);

        this.state = {
            id: props.id,
            image: null,
            target: null,
            targetEns: null,
            provider: props.provider,
            isMatching: false
        }
    }

    async componentDidMount() {
        let image, target;
		if(this.props.uri) {
            image = await this.getImage(this.props.uri); console.log(image);
            this.setState({
                image
            });
        }
        if(this.props.match) {
            target = await this.getImage(this.props.match);console.log(target);
            this.setState({
                target
            });
        }
    }

    componentDidUpdate() {
        window.twttr.widgets.load();
    }

    handleInputChange = event => { 
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value + '.' + process.env.REACT_APP_ARGENT_ENS
        });
    }

    onMatch = async () => { 
        this.setState({isMatching: true});
        let nav = 'Android';//navigator.userAgent;
        if(!nav.includes('Android') && !nav.includes('iPhone')) {
            this.props.onError(new Error('EmojiHunt can only be played on Mobile.'));
            this.setState({isMatching: false});
            return;
        }
        let targetAddress = await this.state.provider.resolveName(this.state.targetEns); 
        if(!targetAddress) {
            this.props.onError(new Error('You need to match with another Argent user.'));
            this.setState({isMatching: false});
            return;
        }
        let url = `${process.env.REACT_APP_ARGENT_URL}/app/ah_requestMerge?to=${targetAddress}&contract=${process.env.REACT_APP_NFT_CONTRACT}&ens=${this.state.targetEns}&id=${this.state.id}`
        window.open(url, '_self');
        this.setState({isMatching: false});
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
            return {'icon': data.properties.image.description, 'twitter': data.properties.twitter.description};
        } catch (er) {
            this.props.onError(new Error('Error while loading the image'));
            return;
        }
    }

    render() {
        const {
            isMatching,
            image,
            target
        } = this.state;
        return (
            <React.Fragment>
                <div className="how-to-play__box">
                <div className="emojis">
                    <div className="you-have">
                    <h4>You have</h4>
                        <img src={image? image.icon : null} alt="The Emoji NFT you have" />
                    </div>

                    <div className="you-need">
                    <h4>You need</h4>
                        <img src={target ? target.icon : null} alt="The Emoji NFT you need" />
                    </div>
                </div>
                {image && target ? (
                    <a href="https://twitter.com/share?ref_src=twsrc%5Etfw" className="twitter-share-button" data-size="large" data-text={`Let's both win 500 #DAI! I have ${image.twitter} and need ${target.twitter}`} data-url="https://emojihunt.argent.xyz" data-hashtags="emojihunt" data-show-count="false">Find a match on Twitter</a>
                ) : null }
                
                <div className="form-group">
                    <div className="input-group">
                    <input name="targetEns" type="text" className="form-control form-text" placeholder="username" onChange={this.handleInputChange}/>

                    <div className="input-group-append">{process.env.REACT_APP_ARGENT_ENS}</div>
                    </div>
                </div>
                <button className="button" disabled={isMatching} onClick={!isMatching? this.onMatch : null}>{isMatching ? 'Matching...' : 'Match'}</button>
                </div>
            </React.Fragment>
			
        );
    }
}

export default Token;