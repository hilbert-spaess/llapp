import React from 'react';
import {SidebarWrapped} from './sidebar.js';
import {useAuth0} from '@auth0/auth0-react';
import {APIHOST} from './api_config.js';
import {Redirect} from 'react-router-dom';
import {useApi} from './use-api.js';
import {Row} from 'react-bootstrap';

export class TutorView extends React.Component {

    render () {

	return (

		<SidebarWrapped
		    WrappedComponent={TutorView1}/>

	);
    }
}

const TutorView1 = () => {

    const {login, getAccessTokenWithPopup} = useAuth0();
    const opts = {audience: APIHOST};
    const {error, loading, data, refresh} = useApi(APIHOST + '/api/tutorview', {}, opts);

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
         <TutorContainer
             data={data}/>
        );
}

class TutorContainer extends React.Component {

    state = {choice: null}

    handleChoose = (id) => {

	this.setState({choice: id});

    }

    render () {

	if (this.state.choice != null) {

	    return (

		<Redirect to={{pathname: "/coursedays", data: {mode: "tutor", user_id: this.state.choice}}}/>

	    );
	}

	var users = [];

	for (var i = 0; i < this.props.data.users.length; i++) {

	    users.push(<UserCard
			   handleChoose={this.handleChoose}
			   data={this.props.data.users[i]}/>);
	}

	return (

	    <div className="tutorcontainer">
		<Row style={{justifyContent: "center"}}>
		    {users}
		</Row>
	    </div>
	);
    }
}

class UserCard extends React.Component {

    handleChoose = () => {

	this.props.handleChoose(this.props.data.user_id);

    }

    render () {

	return (

	    <div onClick={this.handleChoose} className="coursecard">
		<div className="tutorusercardtext">
		    {this.props.data.email}
		</div>
	    </div>
	);
    }
}
