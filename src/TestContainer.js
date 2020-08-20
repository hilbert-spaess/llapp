import React from 'react';
import ReactDOM from 'react-dom';
import {Card, Col, Row, Button, Container, Modal} from 'react-bootstrap';
import {getWord, dumpResult, getMode, getChunk} from './client.js'

export class TestContainer extends React.Component {

    state = {
        word: "",
        number: 0,
        userId: "1",
        testMode: "1",
        answered: "",
        finish: false,
	score: 0
    }

    handleStartClick = () => {
        getWord(this.state).then(this.loadWord);
    };

    loadWord = (data) => {
        this.setState({word: data.word,
		       score: data.score,
		       number: this.state.number + 1});
    };

    handleCorrect = () => {
        this.setState({answered: 1}, () => {
			   getWord(this.state).then(this.loadWord);
	});
    };
        
    handleFalse = () => {
        this.setState({answered: 0}, () => {
			   getWord(this.state).then(this.loadWord);
	});
    };
    
    render () {
        if (this.state.number===0) {
            return (
                <div className="content">
                  <StartCard
                    onStartClick={this.handleStartClick}
                  />
                </div>
            );
        } else if (this.state.number===11) {
            return (
                <div className="content">
                  <EndCard
                    onEndTest={this.props.onEndTest}/></div>
            );
        } else {
        return (
            <div className="content">
            <DescriptionCard
              testMode="1"
              number={this.state.number}
            />
              <TestCard
                userId={this.state.userId}
                word={this.state.word}
                testMode={this.state.testMode}
                onCorrect={this.handleCorrect}
                onFalse={this.handleFalse}
                onEndTest={this.props.onEndTest}
              />
              <NumberCard
                number={this.state.number}
              />
            </div>
        
        );
        }
    };
};

class StartCard extends React.Component {
    render () {
        return (
            <div className="ui centered card">
              <h1>Let's work out how good your English is.</h1>
              <div
                className="ui bottom attach basic green button"
                onClick={this.props.onStartClick}
                >
                  Go.
                </div>
              </div>
        );
    };
}
            
class TestCard extends React.Component {
    render () {
        if (this.props.testMode === "1") {
            return (
                <Test1
                  userId={this.props.userId}
                  word={this.props.word}
                  onCorrect={this.props.onCorrect}
                  onFalse={this.props.onFalse}
                />
            );
        } else if (this.props.finish===true) {
            return (
                <EndCard
                  onEndTest={this.props.onEndTest}/>
            );
        } else {
            return (
                <ErrorCard />
            );
        }
    };
};

class EndCard extends React.Component {
    render () {
        return (
            <div className="ui centered card">
              <h1>We've got all we need.</h1>
              <div
                className="ui bottom attach basic green button"
                onClick={this.props.onEndTest}>
            Start learning English.
              </div>
            </div>
        );
    };
};

class ErrorCard extends React.Component {
    render () {
        return (
            <div className="ui centered card">
              Not implemented yet.
            </div>
        );
    };
};

class NumberCard extends React.Component {
    render () {
        return (
            <div className="labeltext2">
              {this.props.number}/10
            </div>
        );
    };
};

class DescriptionCard extends React.Component {
    render () {
        return (
            <div className="labeltext">
              Do you recognise this word?
            </div>
        );
    };
};

class Test1 extends React.Component {
    render () {
        return (
            <div className="ui centered card">
              <h1>{this.props.word}</h1>
              <div className="ui two bottom attached buttons">
                <button
                  className="ui green button"
                  onClick={this.props.onCorrect}>
                </button>
                <button
                  className="ui red button"
                  onClick={this.props.onFalse}>
                </button>
              </div>
            </div>
        );
    };
};
