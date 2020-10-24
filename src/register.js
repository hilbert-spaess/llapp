import {parse} from 'query-string';
import React from 'react';
import ReactDOM from 'react-dom';
import {Row, Card} from 'react-bootstrap';

export class Register extends React.Component {
    
    render () {
        
        var params = parse(this.props.location.search);
        
        var message = params.message;
        
        return (
            <div>
            <header className="loginmasthead text-center text-white">
             <Row style={{justifyContent: "space-around"}}>
    <Card className="login-content">
        <div style={{color: "black", textAlign: "center", fontSize: "30px"}}>
            {message}
</div>
            </Card>
            </Row>
            </header>
            </div>
            );
    }
}