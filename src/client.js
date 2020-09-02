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

export function firstChunk(data) {
    return fetch('http://localhost:5000/api/firstchunk', {
        method: 'post',
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json',
                'Content-Type': 'application/json',
            'Access-Control-Request-Method': 'POST'	    
      }
    }).then(JSONconvert)
};

export function getChunk(data) {
    return fetch('http://localhost:5000/api/getchunk', {
	method: 'post',
	body: JSON.stringify(data),
	headers: {
        'Accept': 'application/json',
            'Content-Type': 'application/json',
	    'Access-Control-Request-Method': 'POST'	    
      }
    }).then(JSONconvert)
};

export function loadVocab(data) {
    return fetch('http://localhost:5000/api/loadvocab', {
	method: 'post',
	body: JSON.stringify(data),
	headers: {
        'Accept': 'application/json',
            'Content-Type': 'application/json',
	    'Access-Control-Request-Method': 'POST'	    
      }
    }).then(JSONconvert)
};

export function getData(data) {
    return fetch('http://localhost:5000/api/getdata', {
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
