import React from 'react';
import ReactDOM from 'react-dom';
import {useLocation, Link} from 'react-router-dom';
import {Card, Button, Row, Col, Container, Modal, ProgressBar} from 'react-bootstrap';
import {InteractionCard} from './InteractionCard.js';
import {getChunk, firstChunk, getData, JSONconvert} from './client.js';
import {FreeBarWrapped} from './sidebar.js';
import {Text} from 'react-native';
import {useApi} from './use-api.js';
import { useAuth0 } from '@auth0/auth0-react';
import {Redirect} from 'react-router-dom';
import {APIHOST} from './api_config.js';
import {Tutorial} from './tutorial.js';
import {CheckCircle, Type, AlignLeft, Eye} from 'react-feather';
import {LessonContainer} from './LessonContainer.js';


export class LessonsSupervisor extends React.Component {
    
    render () {
        return (
            <FreeBarWrapped WrappedComponent={LessonsSupervisor1}/>
            );
    }
}

export class LessonsSupervisor1 extends React.Component {
    
    state = {
        parcelData: {answeredCorrect: "-1"},
        loading: 0,
        runningProgress: [0, 0]
    };

    handleNext = async (parcelData) => {
        console.log(parcelData);
        this.setState({loading: 1});
        await this.setState({parcelData});
        this.setState({loading: 0});
    };
    
    render () {
        if (this.state.loading == 1) {
            return (
                <div></div>
                );
        } else {
        return (
            <LessonsContainerData
            parcelData={this.state.parcelData}
            handleNext={this.handleNext}
            runningProgress={this.state.runningProgress}
            />
        );
    }
    }
}

const LessonsContainerData = (props) => {
    
    const location = useLocation();
    console.log(location.pathname);
    var payload = props.parcelData;
    payload["lessons"] = (location == "/lessons");
    console.log(payload);
    const {login, getAccessTokenWithPopup } = useAuth0();
    const opts = {audience: APIHOST, 
                  fetchOptions: {method: 'post',
                                 body: payload,
                                 headers: {'Access-Control-Allow-Credentials': 'true',
                                           'Access-Control-Allow-Origin': '*',
                                           'Accept': 'application/json',
                                            'Content-Type': 'application/json',
                                          'Access-Control-Request-Method': 'POST'}}};
    const {error, loading, data, refresh} = useApi(APIHOST + '/api/getlessons', payload, opts);
        
    const handleNext = async (parcelData) => {
        await props.handleNext(parcelData);
        refresh();
    }
    
    const handleTutorialNext = async () => {
        await props.handleNext({tutorial: "done", answeredCorrect: "-1"});
        refresh();
    }
        
    console.log(data);
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
    if (data.displayType == "newUser") {
        return <Redirect to="/newusertest"/>;
    }
        
    console.log(data);
    return (
        <div>
        <LessonsContainerUpdatable
            lessons={data.lessons}
            displayType= {data.displayType}
        />          
</div>
    );
}

class LessonsContainerUpdatable extends React.Component {
    
    
    render () {
        
        return <LessonsContainerLogging
                lessons={this.props.lessons}/>;
        
    }
}

const LessonsContainerLogging = (props) => {
    
    
    const payload = props.parcelData;
    const {login, getAccessTokenWithPopup } = useAuth0();
    const opts = {audience: APIHOST, 
                  fetchOptions: {method: 'post',
                                 body: payload,
                                 headers: {'Access-Control-Allow-Credentials': 'true',
                                           'Access-Control-Allow-Origin': '*',
                                           'Accept': 'application/json',
                                            'Content-Type': 'application/json',
                                          'Access-Control-Request-Method': 'POST'}}};
    const {error, loading, data, refresh} = useApi(APIHOST + '/api/loglesson', payload, opts);
    
    const handleNext = async (parcelData) => {
        props.handleNext(parcelData);
        console.log("WOOOOOOOW");
        console.log("WOOOOOOOW");
        refresh();
    }
    
    if (props.displayType != "done") {

    return (
        <div>
        <LessonContainer
            lessons = {props.lessons}
        />
        </div>
    );
} else if (loading) {
    return <div></div>;
} else {
    return (
        <div> <Redirect to="/vocab"/></div>
        );
}
}

class LessonsOverContainer extends React.Component {
    
    render () {
        
        return <div className="maintext">Lessons are over</div>
        
    }
}
