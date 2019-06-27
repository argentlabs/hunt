import React, { Component } from 'react';
import './App.css';
import Home from './components/Home';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

class App extends Component {

	state = {
		error: null
	}

	handleError = (error) => { 
		console.log("App.js catched error [" + error.message + "]");
		this.setState({ error });
	}

	onCloseError = () => {
		this.setState({ error: null });
	}

	render() {
		const {
			error
		} = this.state;
		return (
			<div className="App">
				{error ? ( 
				<Modal isOpen={true} toggle={this.onCloseError} className={this.props.className}>
					<ModalHeader toggle={this.onCloseError}>{error.title}</ModalHeader>
					<ModalBody><div dangerouslySetInnerHTML={{__html: error.message}}/></ModalBody>
				</Modal>) 
				: null }
				<Home onError={this.handleError}/>
			</div>
	  	);
	}

	
}

export default App;
