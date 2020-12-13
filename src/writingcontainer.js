import React from 'react';
import {Line} from 'rc-progress';
import {Text} from 'react-native';
import {ArrowLeft, ArrowRight, Edit} from 'react-feather';
import {useApi} from './use-api.js';
import { useAuth0 } from '@auth0/auth0-react';
import {Redirect} from 'react-router-dom';
import {APIHOST} from './api_config.js';

export class WritingContainer extends React.Component {

    state = {answers: this.props.metadata.answers}

    handleSubmit = (data) => {

	var newanswers = this.state.answers;

	newanswers[this.props.data.currentChunk.id] = data;

	this.setState({answers: newanswers});

    }

    render () {

	return (

	    <WritingContainerLogging
		data={this.props.data}
		metadata={this.props.metadata}
		answer={this.state.answers[this.props.data.currentChunk.id]}
		handleSubmit={this.handleSubmit}
		parcelData={{answers: this.state.answers, course_id: this.props.metadata.course_id}}/>
	);
    }
}

const WritingContainerLogging = (props) => {

    const payload=props.parcelData;
    const {login, getAccessTokenWithPopup } = useAuth0();
    const opts = {audience: APIHOST, 
                  fetchOptions: {method: 'post',
                                 body: payload,
                                 headers: {'Access-Control-Allow-Credentials': 'true',
                                           'Access-Control-Allow-Origin': '*',
                                           'Accept': 'application/json',
                                            'Content-Type': 'application/json',
                                          'Access-Control-Request-Method': 'POST'}}};
    const {error, loading, data, refresh} = useApi(APIHOST + '/api/analysislog', payload, opts);

    const handleSubmit = async (data) => {
	await props.handleSubmit(data);
	refresh();
    }

    console.log(props.metadata.course_id);

    return (

	<div>
	    <PromptContainer
		data={props.data}
		metadata={props.metadata}/>
	    <EntryContainer
		answer={props.answer}
		onSubmit={handleSubmit}/>
	</div>
    );
}

class PromptContainer extends React.Component {

    render () {

	console.log(this.props.data);
	console.log(this.props.metadata);

	var promptLines=[];

	for (var i = 0; i < this.props.data.currentChunk.prompt.text.split("\n").length; i++) {
	    promptLines.push(<div>{this.props.data.currentChunk.prompt.text.split("\n")[i]}</div>);
	}
	    

	return (

	    <div className="promptcontainer">
		<div className="prompttitle">
		    {this.props.data.currentChunk.prompt.title}
		</div>
		<div className="prompttext">
		    {promptLines}
		</div>
	    </div>
	);
    }
}

class EntryContainer extends React.Component {

    state = {value: this.props.answer}

    handleChange= (event) => {

	this.setState({value: event.target.value});

    }

    onSubmit = () => {

	console.log(this.state.value);

	this.props.onSubmit(this.state.value);

    }

    render () {

	return (
	    <>
	    <div className="entrycontainer">
		<textarea  value={this.state.value} className="entrytext" onChange={this.handleChange}/>
	    </div>
		<button className="writingsubmit" onClick={this.onSubmit}>Save</button>
	    </>
	    
	    
	);
    }
}
