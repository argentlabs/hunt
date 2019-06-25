import React, {Component} from 'react';

class Token extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
			<div>
				Id is {this.props.id}, state is {this.props.state}
            </div> 
        );
    }
}

export default Token;