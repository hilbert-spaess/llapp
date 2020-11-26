import React from 'react';
import {Line} from 'rc-progress';

export class AnalysisContainer extends React.Component {

    state = {answeredCorrect: -1}
    
    handleNext = (event) => {

	this.props.handleNext({
	    metadata: {answeredCorrect: this.state.answeredCorrect,
		       type: this.props.type}});
    }
	    

    render () {

	return (

	    <div className="fillgapscard">
		<ProgressBar
		    progress={this.props.metadata.progress}/>
		<TextContainer
		    data={this.props.data.currentChunk}/>
		<QuestionContainer
		    data={this.props.data.currentChunk}/>
	    </div>

	);
    }
}

class TextContainer extends React.Component {

    render () {

	return (

	    <div className="analysistextcontainer">
		<div className="analysistext">
		    {this.props.data.text}
		</div>
	    </div>

	);
    }
}

class QuestionContainer extends React.Component {

    render () {

	return (

	    <div className="analysisquestioncontainer">
		<div className="analysisquestion">
		    {this.props.data.question}
		</div>
	    </div>

	);
    }
}

class ProgressBar extends React.Component {

    render () {

	return (

	    <div className="analysisprogress">
	    <Line percent={this.props.progress} strokeWidth="1"/>
	    </div>
	    
	);

    }
}
