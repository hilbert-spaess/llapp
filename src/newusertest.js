import React from 'react';
import {useAuth0 } from '@auth0/auth0-react';
import {Redirect} from 'react-router-dom';
import {useApi} from './use-api.js';
import {APIHOST} from './api_config.js';
import {Card, Button, Row, Col, Container, Modal, ProgressBar} from 'react-bootstrap';
import {BarWrapped} from './sidebar.js';

export class NewUserTest extends React.Component {
    
    render () {
        return (
            <BarWrapped WrappedComponent={NewUserTest1}/>
        );
    }
}

export class NewUserTest1 extends React.Component {
    
    state = {native: null,
             answers: null,
            course: null}
    
    handleNativeClick = (id) => {
        
        console.log("henlo");
        
        this.setState({native: id});
        
    }
    
    handleLevelTestSubmit = (data) => {
        
        this.setState({answers: data.answers});
    
    }
    
    handleCourseChoiceSubmit = (course) => {
        
        this.setState({course});
    
    }
    
    render () {
        
        
        if (this.state.native==null) {
            return <NativeChoice
                    handleClick = {this.handleNativeClick}/>;
        } 
        if (this.state.answers==null) {
            return <LevelTestLoader
                    handleSubmit = {this.handleLevelTestSubmit}/>;
        }
        if (this.state.course==null) {
            return <CourseChoice
                    handleSubmit = {this.handleCourseChoiceSubmit}/>;
        }

        return (
            
            <Choose
            data={this.state}/>
            
            );

    }
}

export class NativeChoice extends React.Component {
    
    render () {
        
        return (
            
            <div className="mainbox">
                        <div className="maintext">
                Welcome! Let's work out your reading level. <br></br>
                    Are you a native English speaker?
                    </div>
                   <Row style={{marginTop: "3em", justifyContent: "space-evenly"}}>
                    <OptionCard 
                        id = {1}
                        variant="outline-success"
                        text="Yes"
                        handleClick = {this.props.handleClick}/>
                            
                    <OptionCard
                        id = {2}
                        variant="outline-danger"
                        text="No"
                        handleClick= {this.props.handleClick}/>
                    </Row>
                    </div>

        );
    }
}

const LevelTestLoader = (props) => {
    
    const {login, getAccessTokenWithPopup } = useAuth0();
    const opts = {audience: APIHOST, 
                  fetchOptions: {method: 'post',
                                 headers: {'Access-Control-Allow-Credentials': 'true',
                                           'Access-Control-Allow-Origin': '*',
                                           'Accept': 'application/json',
                                           'Content-Type': 'application/json',
                                          'Access-Control-Request-Method': 'POST'}}};
    const {error, loading, data, refresh} = useApi(APIHOST + '/api/newuserleveltest', {}, opts);
        
    const handleNext = async (parcelData) => {
        await props.handleNext(parcelData);
        refresh();
    }
        
    console.log(data);
    const getTokenAndTryAgain = async () => {
        await getAccessTokenWithPopup(opts);
        refresh()
  };
    if (loading) {
        return <div>Loading...</div>;
    }
    if (error) {
        if (error.error === 'consent_required') {
      return (
        <button onClick={getTokenAndTryAgain}>Consent to reading users</button>
      );
    }
    return <div>Oops {error.message}</div>;
    }

    return (
        <div>
        <LevelTest
            words={data.words}
            handleSubmit = {props.handleSubmit}
        />          
</div>
    );
}
    
export class LevelTest extends React.Component {
    
    state = {currentWord: 0,
            answers: [],
            progress: 0}
    
    handleClick = (id) => {
        this.setState(prevState => ({
            answers: [...prevState.answers, id]
        }));
        
        if (this.state.currentWord < this.props.words.length - 1) {
            var a = this.state.currentWord;
            this.setState({currentWord: a+1});
        } else {
            this.props.handleSubmit(this.state);
        }
    }
    
    render () {
        
        return (
            <div className="mainbox">
                        <div className="maintext">
            <Row style={{justifyContent: "center"}}>
            <ProgressBar style={{width: "80%", textAlign: "center"}} variant = "success" now={100*(this.state.currentWord/this.props.words.length)}/>
                </Row>
            <div style={{color: "grey", marginTop: "1em"}}>Do you understand this word?</div>
            <div style={{fontSize: "40px"}}>{this.props.words[this.state.currentWord]}</div>
            </div>
<Row style={{marginTop: "3em", justifyContent: "space-evenly"}}>
                    <OptionCard 
                        id = {1}
                        variant="outline-success"
                        text="Yes"
                        handleClick = {this.handleClick}/>
                            
                    <OptionCard
                        id = {0}
                        variant="outline-danger"
                        text="No"
                        handleClick= {this.handleClick}/>
                    </Row>
            </div>
            
            
            );
    }
}

const CourseChoice = (props) => {
        const {login, getAccessTokenWithPopup } = useAuth0();
        const opts = {audience: APIHOST};
        const {error, loading, data, refresh} = useApi(APIHOST + '/api/newuser', {}, opts);
        const getTokenAndTryAgain = async () => {
        await getAccessTokenWithPopup(opts);
        refresh()
      };
        if (loading) {
            return <div></div>;
        }
        if (error) {
            if (error.error === 'consent_required') {
          return (
            <button onClick={getTokenAndTryAgain}>Consent to reading users</button>
          );
        }
        return <div>Oops {error.message}</div>;
        }
        return (<CourseChoice1 
                choices = {data.choices}
                handleSubmit={props.handleSubmit}/>);
}

export class CourseChoice1 extends React.Component {
    
    render () {
        
        var choices = [];
        
        var keys = Object.keys(this.props.choices);
        
        for (var i = 0; i < keys.length; i++) {
            
            
            choices.push(<CourseCard
                         name={this.props.choices[keys[i]]["name"]}
                         id={keys[i]}
                         variant="outline-success"
                         buttonText="Choose"
                         handleClick = {this.props.handleSubmit}
                        />);
        }
    
         return (

                <div className="mainbox">
                            <div className="maintext">
                        Now choose one of our tailored reading courses to get started.
                        </div>
                       <Row style={{marginTop: "3em", justifyContent: "space-evenly"}}>
             {choices}
                        </Row>
                        </div>

            );
    }
}

export class CourseCard extends React.Component {
    
    onClick = (event) => {
        this.props.handleClick(this.props.id);
    }
    
    render () {
        
        return (
            
             <Card style={{height: "30rem", width: "20rem"}}>
            <div style={{textAlign: "center", marginTop: "1em", fontSize: "30px"}}>{this.props.name}</div>
            <div style={{position: "absolute", bottom: "10%", left: "50%", transform: "translate(-50%,0%)"}}>
            <Button style={{fontSize: "20px"}} block onClick={this.onClick} variant={this.props.variant}>{this.props.buttonText}</Button>
</div>
            
            </Card>


        );
    }
}
    

export class OptionCard extends React.Component {
    
    onClick = (event) => {
        this.props.handleClick(this.props.id);
    }
    
    render () {
        
        return (

            
             <Card style={{height: "20rem", width: "15rem", border: "0"}}>
            <Button style={{fontSize: "20px"}} onClick={this.onClick} variant={this.props.variant}>{this.props.text}</Button>
            
            </Card>


        );
    }
}

export class Ready extends React.Component {
    
    render () {
        
        return (
             <div className="mainbox">
                        <div className="maintext">
            
          Welcome! Let's work out your English level.
            </div>
            </div>
        );
    }
}

const Choose = (props) => {
        const {login, getAccessTokenWithPopup, user} = useAuth0();
        const opts = {audience: APIHOST};
        const {error, loading, data, refresh} = useApi(APIHOST + '/api/newuser', {course: props.data.course, native: props.data.native, answers: props.data.answers, email: user.email}, opts);
        const getTokenAndTryAgain = async () => {
        await getAccessTokenWithPopup(opts);
        refresh()
      };
        if (loading) {
            return <div>Loading...</div>;
        }
        if (error) {
            if (error.error === 'consent_required') {
          return (
            <button onClick={getTokenAndTryAgain}>Consent to reading users</button>
          );
        }
        return <div>Oops {error.message}</div>;
        }
        return (<Redirect to="/"/>);
    }


            
             