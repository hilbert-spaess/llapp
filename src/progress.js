import React from 'react';
import ReactDOM from 'react-dom';
import {Card, Button, Row, Col, Container, CardDeck, ProgressBar, Modal, ListGroup} from 'react-bootstrap';
import {loadVocab} from './client.js';
import {useApi} from './use-api.js';
import { useAuth0 } from '@auth0/auth0-react';
import {APIHOST} from './api_config.js';
import {BarWrapped} from './sidebar.js';
import {Text} from 'react-native';

export class ProgressContainer extends React.Component {
    
    state = {
        showDialog: false
    }
    
    render () {
        return (
            <BarWrapped WrappedComponent={LoadingProgressContainer}/>
        );
    }
}

export const LoadingProgressContainer = () => {
    
     const {login, getAccessTokenWithPopup } = useAuth0();
     const opts = {audience: APIHOST};
     const {error, loading, data, refresh} = useApi(APIHOST + '/api/loadprogress', {}, opts);
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
         <ProgressContainer1
        data={data}/>
        );
}   

export class ProgressContainer1 extends React.Component {
    
    render () {
        
        return (
            
            <div>
            
            <ListGroup style={{marginTop: "3em", fontSize: "20px"}} variant="flush">
  <ListGroup.Item><div style={{fontWeight: "bold", fontSize: "30px"}}>Active Course</div>{this.props.data["course_name"]}</ListGroup.Item>
      
      <ListGroup.Item><div style={{fontWeight: "bold", fontSize: "30px"}}>Vocab Progress</div>
<div style={{fontSize: "40px", display: "inline"}}>{this.props.data["active"]} </div> new words active so far. <br></br>
    <div style={{fontSize: "40px", display: "inline"}}>{this.props.data["mastered"]} </div> new words mastered so far. <br></br>
    </ListGroup.Item>
      
  <ListGroup.Item>
      <div style={{fontWeight: "bold", fontSize: "30px"}}>Level Progress</div>
<ProgressBar style={{marginTop: "1em", marginBottom: "1em"}} variant="success" now={this.props.data["level_prop"]}/>
You are <div style={{fontFace: "bold", color: "green", display: "inline"}}>{this.props.data["level_prop"]}%</div> of the way to an increase in vocab level.
      </ListGroup.Item>

</ListGroup>

</div>

        );
    }
}


