import {parse} from 'query-string';
import React from 'react';
import ReactDOM from 'react-dom';

export class Register extends React.Component {
    
    render () {
        
        var params = parse(this.props.location.search);
        
        var message = params.message;
        
        return (
            <div>
            {message}
            </div>
            );
    }
}