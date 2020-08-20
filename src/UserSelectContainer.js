import React from 'react';
import ReactDOM from 'react-dom';
import {Card, Button, Row, Col, Container} from 'react-bootstrap';

export class UserSelectContainer extends React.Component {
    render () {
        return (
            <div className="ui centered card">
              <UserSelectForm
                onSubmit = {this.props.onSubmit}
              />
            </div>
        );
    }
}

class UserSelectForm extends React.Component {

    state = {value: ""}

    handleSubmit = (event) => {
        this.props.onSubmit(this.state.value);
    }

    handleChange = (event) => {
        this.setState({value: event.target.value});
    }
        
    render () {
        return (
		<form onSubmit={this.handleSubmit}>
		    <div className="input">
		    <input
		value={this.state.value}
		onChange={this.handleChange} />
		    </div>
		    <div className="input">
		    <input type="submit" value="Submit" />
		    </div>
	        </form>
        );
    }
}
