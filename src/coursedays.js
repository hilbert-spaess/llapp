import React, {useRef} from 'react';
import {SidebarWrapped} from './sidebar.js';
import {Row} from 'react-bootstrap';
import {useAuth0} from '@auth0/auth0-react';
import {useApi} from './use-api.js';
import {APIHOST} from './api_config.js';
import {Redirect} from 'react-router-dom';
import {LearningSupervisor1} from './ReadingSupervisor.js';
import {ArrowLeft} from 'react-feather';

export class CourseDays extends React.Component {

    render () {

	const {data} = this.props.location;

	return (

	    <SidebarWrapped
		WrappedComponent={CourseDaysLoader}
		data={data}
		thin={true}/>

	);
    }
}

const CourseDaysLoader = (props) => {

    const {login, getAccessTokenWithPopup } = useAuth0();
    const opts = {audience: APIHOST, 
                  fetchOptions: {method: 'post',
                                 headers: {'Access-Control-Allow-Credentials': 'true',
                                           'Access-Control-Allow-Origin': '*',
                                           'Accept': 'application/json',
                                            'Content-Type': 'application/json',
                                          'Access-Control-Request-Method': 'POST'}}};
    const {error, loading, data, refresh} = useApi(APIHOST + '/api/coursedays', {}, opts);

    if (loading) {
	return <div></div>;
    }
    if (error) {
	return <div>Oops {error.message}</div>;
    }
    console.log(data);
    return (
	<CourseDays1
	    data={props.data}
	    daydata={data}/>
    );
}

class CourseDays1 extends React.Component {

    state = {day: null,
	     keyno: null}

    handleStart = (i) => {

	this.setState({day: i});

    }

    handleBack = () => {

	this.setState({day: null});

    }

    switchKey = (i) => {
	console.log("switchkey");
	this.setState({keyno: i});

    }

    render () {

	if (this.state.day != null) {

	    return (

		<CourseLoader
		    id={this.state.day}
		    data={this.props.data}
		    notifications={this.props.daydata.notifications[this.state.day - 1]}
		    handleBack={this.handleBack}
		    keyno={this.state.keyno}
		    switchKey={this.switchKey}/>

	    );

	}

	var courseCards = [];

	for (var i = 1; i < this.props.daydata.days + 1; i++) {

	    courseCards.push(<CourseCard
				 id={i}
				 title={"Day " + i.toString()}
				 handleClick={this.handleStart}/>);
	}

	console.log(this.props.data);

	return (

	    <div className="coursecardcontainer">
		{this.props.data != undefined && this.props.data.mode=="tutor" && <TutorBack/>}
		<Row style={{justifyContent: "center"}}>
		    {courseCards}
		</Row>
	    </div>
	);
    }
}

class TutorBack extends React.Component {

    state = {return: 0}

    handleClick= () => {

	this.setState({return: 1});

    }

    render () {

	if (this.state.return) {

	    return (

		<Redirect to="/tutors"/>

	    );
	}

	return (

	    <ArrowLeft style={{position: "fixed", cursor: "pointer"}} size={30} onClick={this.handleClick}/>

	);

    }
}

class CourseCard extends React.Component {

    handleClick = () => {

	this.props.handleClick(this.props.id);

    }

    render () {

	return (

	    <div onClick={this.handleClick} className="coursecard fadein">
		<div className="coursetitle">
		    {this.props.title}
		</div>
		{this.props.notification > 0 ? <div className="notification">
						   <div className="centerno">
						   {this.props.notification}
					       </div></div> : <div></div>}
	    </div>
	);
    }
}

const CourseLoader = (props) => {
    
     const {login, getAccessTokenWithPopup } = useAuth0();
     const opts = {audience: APIHOST};
    const {error, loading, data, refresh} = useApi(APIHOST + '/api/coursedata', {id: props.id, data: props.data}, opts);
     const getTokenAndTryAgain = async () => {
        await getAccessTokenWithPopup(opts);
        refresh()
  };
    console.log("to do: cached data");
    if (loading) {
        return <div></div>;
    }
    if (error) {
        if (error.error === 'consent_required') {
      return (
        <button onClick={getTokenAndTryAgain}>Consent to reading users</button>
      );
    }
    return <div>Oops {error.message}</div>;
    }
    if (data.displayType == "newUser") {
        return <Redirect to="/newusertest"/>;
    }
    return (
         <CourseLoad
             data={data}
	     notifications={props.notifications}
	     handleBack={props.handleBack}
	     keyno={props.keyno}
	     switchKey={props.switchKey}/>
        );
}   


class CourseLoad extends React.Component {

    handleClick = (i) => {

	this.props.switchKey(i);

    }

    handleBack = () => {
	this.props.switchKey(null);
	this.forceUpdate();

    }

    render () {

	console.log(this.props.notifications);
	console.log(this.props.keyno);

	if (this.props.keyno == null) {

	    console.log(this.props.data);

	    var keyCards = [];

	    for (var i = 0; i < Object.keys(this.props.data.allChunks).length; i++) {

		var notification = this.props.notifications[Object.keys(this.props.data.allChunks)[i].charAt(0)];
		console.log(notification);

		keyCards.push(<CourseCard
				  id={i}
				  title={Object.keys(this.props.data.allChunks)[i]}
				  handleClick={this.handleClick}
				  notification={(this.props.data.data.mode == "tutor") ? 0 : notification}/>);
	    }

	    return (

		<div className="coursecardcontainer">
		    <CourseBack
			handleBack={this.props.handleBack}/>
		<Row style={{justifyContent: "center"}}>
		    {keyCards}
		</Row>
	    </div>

	    );

	}

	console.log(this.props.data.allChunks);

	var newdata = this.props.data;
	newdata.allChunks = this.props.data.allChunks[Object.keys(this.props.data.allChunks)[this.props.keyno]];

	return (

		<LearningSupervisor1
		    data={{read_data: newdata, handleBack: this.handleBack}}
		    type={(this.props.data.data.mode == "tutor") ? "tutor" : "daily_reading"}/>

	);
    }
}

class CourseBack extends React.Component {

    render () {

	return (

	    <ArrowLeft style={{position: "fixed"}} size={30} onClick={this.props.handleBack}/>

	);
    }
}
    
