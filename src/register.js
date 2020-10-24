import {parse} from 'query-string';
import React from 'react';
import ReactDOM from 'react-dom';
import {Row, Card} from 'react-bootstrap';

import {Redirect} from 'react-router-dom';

export class Register extends React.Component {
    
    state = {continued: null}
    
    handleSubmit = () => {
        
        this.setState({continued: 1});
        
    }
    
    render () {
        
        if (this.state.continued == 1) {
            
            return <Redirect to="/home"/>
                
        }
        
        var params = parse(this.props.location.search);
        
        var message = params.message;
        
        return (
            <div>
            <header className="loginmasthead text-center text-white">
             <Row style={{justifyContent: "space-around"}}>
    <Card className="login-content">
         
        <div style={{color: "black", textAlign: "center", fontSize: "25px"}}>
            {message}
</div>
<div style={{textAlign: "center"}}>
<button onClick={this.handleSubmit} style={{width: "40%", marginTop: "1em"}} className="btn btn-primary login-rounded-pill">Continue</button>
</div>
            </Card>
            </Row>
            </header>
            </div>
            );
    }
}