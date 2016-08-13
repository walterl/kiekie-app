import React from 'react';
import {connect} from 'react-redux';
import {hashHistory} from 'react-router';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import '../../scss/register.scss';


class Register extends React.Component {
    render() {
        const {error} = this.props,
            onClick = () => console.debug('Register clicked');

        return <div className="register-screen">
            <TextField hintText="User name" errorText={error} />
            <br />
            <RaisedButton
                className="register-btn"
                label="Register" primary={true} onClick={onClick}
            />
        </div>;
    }
}

function mapStateToProps(state) {
    return {
        error: state.ui.startup.register.error
    };
}

export default connect(mapStateToProps)(Register);
