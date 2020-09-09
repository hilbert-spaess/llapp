import React from 'react';
import {useAuth0} from '@auth0/auth0-react';

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

export const firstChunk = (data) => {
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

export function getChunk(data, accessToken) {
    return fetch('http://localhost:5000/api/getchunk', {
	method: 'post',
	body: data,
	headers: {
        'Accept': 'application/json',
            'Content-Type': 'application/json',
	    'Access-Control-Request-Method': 'POST',
        'Authorization': `Bearer ${accessToken}`,
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

export function JSONconvert(response) {
    return response.json();
};

export function getMode(userId) {
    return "1"
};
