import React from 'react';
import {Text} from 'react-native';

export function showWords(context, length, location, onChange, value) {
    var words = [];
    var tcolour = "black";
    var answer = {};
    for (var i = 0; i < length; i++) {
	    if (context[i]["u"] == 1) {
		var tcolour = "black";
	    } else {
		var tcolour = "black";
	    }

	    if (i!=location) {
		words.push(<Text>{context[i]['w']} </Text>);
	    } else {
		words.push(<input ref={(input) => {this.nameInput = input;}} value={value} onChange={onChange} style={{backgroundColor: "transparent", textAlign: "center"}}/>);
	    }
	};
    return words
};
	
export function showWordsBasicBlank(sentence, position) {
    var words = sentence.split("#");
    var locs = position.split(",");
    var out = [];
    for (var i =0 ; i<words.length; i++) {
	console.log(position);
	console.log(toString(i));
	console.log(locs);
	if (! (locs.includes(i.toString()))) {
	    out.push(<Text style={{fontSize:"15px"}}>{words[i]} </Text>);
	} else {
	    out.push(<Text style={{fontSize:"15px", color:"blue"}}>{words[i][0] + "_".repeat(words[i].length - 1)} </Text>);
	}
    };
    return out
};
