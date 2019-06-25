import React, {Component} from 'react';
import {Button, InputGroup, InputGroupAddon, Input} from 'reactstrap';

const ARGENT_ENS = "argent.xyz";
const BACKEND_URL = "https://cloud-test.argent-api.com/hunt";

class Signin extends Component {

    constructor(props) {
        super(props);

        this.state = {
            error: false,
            ens: null
        }
    }

    handleInputChange = event => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    onRegister = async () => { 
        if (!this.state.ens.endsWith(ARGENT_ENS)) { 
            this.setState({
                error: true,
                errorMessage: 'Not an Argent ENS',
                ens: null
            });
            return;
        }
        try {
            const response  = await fetch(BACKEND_URL, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ens: this.state.ens })
            });
    
            if (response.ok !== true) {
                this.setState({
                    error: true,
                    errorMessage: 'You need an Argent wallet'
                });
                return;
            }
    
            const data = await response.json();
            console.log(data);

        } catch (er) {
            this.setState({
                error: true,
                errorMessage: 'Failed to contact the backend'
            });
            return;
        }
        this.props.onRegistered(this.state.ens);
    }

    render() {
        const {
            error
        } = this.state;
        return (
            <React.Fragment>
                <main>
                    <div>
                    {error ? (
                        <p>Invalid Argent ENS</p>
                    ) : null }
                    </div>
                    <div className="win-or-lose">
                        <img src="assets/images/animations/winner-cup.gif" className="emoji-winner-cup" alt="Winner cup emoji" />
                        <img src="assets/images/animations/flying-cash.gif" className="emoji-flying-cash" alt="Flying cash" />
                    </div>

                    <div className="countdown">
                        <h4>Starts in</h4>

                        <div className="timer">
                        <div className="days">
                            <span className="countdown-value">5</span>
                            DAIs
                        </div>

                        <div className="hours">
                            <span className="countdown-value">23</span>
                            hrs
                        </div>

                        <div className="minutes">
                            <span className="countdown-value">59</span>
                            min
                        </div>
                        </div>
                    </div>


                    <div className="how-to-play">
                        <h2>How to play</h2>

                        <div className="how-to-play__box">
                            <h5>Download Argent</h5>
                            <div className="app-store-buttons">
                                <a href="#"><img src="assets/images/app-store.svg" alt="Download on the App Store" /></a>
                                <a href="#"><img src="assets/images/google-play.svg" alt="Download on Google Play" /></a>
                            </div>
                        </div>

                        <div className="how-to-play__box ethereum-address">
                            <h5>Enter your address</h5>

                            <div className="input-group">
                                <input type="text" className="form-control form-text" placeholder="username"/>

                                <div className="input-group-append">.argent.xyz</div>
                            </div>
                        </div>

                        <button className="button">Get rich or DAI trying</button>
                    </div> 

                </main>
            </React.Fragment>
            


      


                // <div className="form-group">
                //     <label htmlFor="walletEns">Enter your Argent username</label>
                //     <InputGroup className="search-ens">
                //         <Input name="ens" className="form-search" id="ens" placeholder={`username.${ARGENT_ENS}`} onChange={this.handleInputChange} autoFocus/>
                //         <InputGroupAddon addonType="append"><Button onClick={this.onRegister}>{'Register'}</Button></InputGroupAddon>
                //     </InputGroup>
                // </div> 
        );
    }
}

export default Signin;