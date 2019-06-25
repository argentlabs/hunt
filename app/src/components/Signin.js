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
            <div>
                {error ? (
                    <p>Invalid Argent ENS</p>
                ) : null }
                <div className="form-group">
                    <label htmlFor="walletEns">Enter your Argent username</label>
                    <InputGroup className="search-ens">
                        <Input name="ens" className="form-search" id="ens" placeholder={`username.${ARGENT_ENS}`} onChange={this.handleInputChange} autoFocus/>
                        <InputGroupAddon addonType="append"><Button onClick={this.onRegister}>{'Register'}</Button></InputGroupAddon>
                    </InputGroup>
                </div> 
            </div>
        );
    }
}

export default Signin;