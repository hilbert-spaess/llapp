import React from 'react';

export function getWord(data) {
    return fetch('http://localhost:5000/api/getword', {
	method: 'post',
	body: JSON.stringify(data),
	headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }).then(JSONconvert)
};

export function dumpResult(data) {
    return fetch('http://localhost:5000/api/dumpresult', {
	method: 'post',
	body: JSON.stringify(data),
	headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }).then(JSONconvert)
};

export function getChunk(data) {
    return fetch('http://52.90.25.104/api/getchunk', {
	method: 'post',
	body: JSON.stringify(data),
	headers: {
        'Accept': 'application/json',
            'Content-Type': 'application/json',
	    'Access-Control-Request-Method': 'POST'	    
      }
    }).then(JSONconvert)
};

function JSONconvert(response) {
    return response.json();
};

export function getMode(userId) {
    return "1"
};
