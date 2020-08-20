import React from 'react';

export function getWord(data) {
    return fetch('/api/getword', {
	method: 'post',
	body: JSON.stringify(data),
	headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }).then(JSONconvert)
};

export function dumpResult(data) {
    return fetch('/api/dumpresult', {
	method: 'post',
	body: JSON.stringify(data),
	headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }).then(JSONconvert)
};

export function getChunk(data) {
    return fetch('/api/getchunk', {
	method: 'post',
	body: JSON.stringify(data),
	headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }).then(JSONconvert)
};

function JSONconvert(response) {
    return response.json();
};

export function getMode(userId) {
    return "1"
};
