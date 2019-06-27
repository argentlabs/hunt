import 'dotenv';
import React, {Component} from 'react';

class Signin extends Component {

    constructor(props) {
        super(props);

        this.state = {
            ens: null,
            isRegistering: false
        }

        this.timerId = null;
    }

    componentDidMount = async () => {
        console.log("nav " + navigator.userAgent);
		this.startTimer();
    }

    startTimer = () => {
        var countDownDate = new Date("July 26, 2019 24:00:00").getTime();

        if(!this.timerId) {
            this.timerId = setInterval(() => {
                var now = new Date().getTime();
                var distance = countDownDate - now;
            
                if(this.timer == null) {
                    this.timer = {}
                }
                // Time calculations for days, hours, minutes and seconds
                let days = Math.floor(distance / (1000 * 60 * 60 * 24));
                let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    
                this.setState({
                    timer: {
                        days,
                        hours,
                        minutes
                    }
                })
            } , 1000);
        }
        
    }

    handleInputChange = event => { 
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value + '.' + process.env.REACT_APP_ARGENT_ENS
        });
    }

    onRegister = async () => { 
        this.setState({isRegistering: true});
        if(!this.state.ens) {
            this.state.ens = process.env.REACT_APP_ARGENT_ENS;
        }
        try {
            const response  = await fetch(process.env.REACT_APP_BACKEND_URL, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ens: this.state.ens })
            });
            
            if (response.ok !== true) { 
                const data = await response.json(); 
                switch(data.message) {
                    case 'ensNotRegistered':
                        this.props.onError(new Error('Please download Argent first, then try again'));
                        break;
                    case 'ensMalformedOrTooShort':
                        this.props.onError(new Error('ENS incorrect'));
                        break;
                    default:
                        this.props.onError(new Error('Unknown server error'));
                }
                this.setState({isRegistering: false});
                return;
            }
            
            this.props.onRegistered(this.state.ens);

        } catch (er) {
            this.props.onError(new Error('Error while contacting server'));
            this.setState({isRegistering: true});
            return;
        }
    }

    render() {
        const {
            isRegistering
        } = this.state;
        return (
            <React.Fragment>
                <main>
                    <div className="win-or-lose">
                        <img src="assets/images/animations/winner-cup.gif" className="emoji-winner-cup" alt="Winner cup emoji" />
                        <img src="assets/images/animations/flying-cash.gif" className="emoji-flying-cash" alt="Flying cash" />
                    </div>

                    <div className="blue-box countdown">
                        <h4>Starts in</h4>

                        <div className="timer">
                        <div className="days">
                            <span className="countdown-value">{this.timerId ? this.state.timer.days : 0}</span>
                            DAIs
                        </div>

                        <div className="hours">
                            <span className="countdown-value">{this.timerId ? this.state.timer.hours : 0}</span>
                            hrs
                        </div>

                        <div className="minutes">
                            <span className="countdown-value">{this.timerId ? this.state.timer.minutes : 0}</span>
                            min
                        </div>
                        </div>
                    </div>


                    <div className="how-to-play">
                        <h2>Join the game!</h2>

                        <div className="how-to-play__box">
                            <h5>Download Argent</h5>
                            <div className="app-store-buttons">
                                <a href="http://argent.app.link"><img src="assets/images/app-store.svg" alt="Download on the App Store" /></a>
                                <a href="http://argent.app.link"><img src="assets/images/google-play.svg" alt="Download on Google Play" /></a>
                            </div>
                        </div>

                        <div className="how-to-play__box ethereum-address">
                            <h5>Enter your Argent username (ENS)</h5>
                            <div className="input-group">
                                <input name="ens" type="text" className="form-control form-text" placeholder="username" onChange={this.handleInputChange}/>
                                <div className="input-group-append">{process.env.REACT_APP_ARGENT_ENS}</div>
                            </div>
                        </div>

                        <button className="button" disabled={isRegistering} onClick={!isRegistering? this.onRegister : null}>{isRegistering? "One moment…" : "Get rich or DAI trying"}</button>
                    </div> 

                </main>
            </React.Fragment>
        );
    }
}

export default Signin;