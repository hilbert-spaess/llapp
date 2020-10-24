import {parse} from 'query-string';
import React from 'react';
import ReactDOM from 'react-dom';

export class Register extends React.Component {
    
    render () {
        
        var params = parse(this.props.location.search);
        
        var message = params.message;
        
        return (
            <div>
            <header className="loginmasthead text-center text-white">
             <Row style={{justifyContent: "space-around"}}>
    <Card className="login-content">
            {message}
            </Card>
            </Row>
            </header>
            </div>
            );
    }
}