import React, {useRef} from 'react';
import {SidebarWrapped} from './sidebar.js';
import {Row} from 'react-bootstrap';
import {useAuth0} from '@auth0/auth0-react';
import {useApi} from './use-api.js';
import {APIHOST} from './api_config.js';
import {Redirect} from 'react-router-dom';
import {LearningSupervisor1} from './ReadingSupervisor.js';

export class CourseDays extends React.Component {

    render () {

	const {data} = this.props.location;

	return (

	    <SidebarWrapped
		WrappedComponent={CourseDays1}
		data={data}/>

	);
    }
}

class CourseDays1 extends React.Component {

    state = {active: null}

    handleStart = (i) => {

	this.setState({active: i});

    }

    render () {

	if (this.state.active != null) {

	    return (

		<CourseLoader
		    id={this.state.active}
		    data={this.props.data}/>

	    );

	}

	var courseCards = [];

	for (var i = 1; i < 6; i++) {

	    courseCards.push(<CourseCard
				 id={i}
				 title={"Day " + i.toString()}
				 handleClick={this.handleStart}/>);
	}

	return (

	    <div className="coursecardcontainer">
		<Row style={{justifyContent: "center"}}>
		    {courseCards}
		</Row>
	    </div>
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
        data={data}/>
        );
}   


class CourseLoad extends React.Component {

    render () {

	console.log(this.props.data.allChunks);

	return (

	    <Redirect to={{pathname: "/read", data: {read_data: this.props.data}, type: (this.props.data.data.mode == "tutor") ? "tutor" : "daily_reading"}}/>

	);
    }
}

    
