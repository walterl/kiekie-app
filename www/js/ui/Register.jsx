import React from 'react';
import {connect} from 'react-redux';
import {hashHistory} from 'react-router';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import {registerRequest, registerFail} from '../server-actions.js';

import '../../scss/register.scss';


class Register extends React.Component {
    constructor(props) {
        super(props);

        this.userName = null;
        this.onRegisterClick = this.onRegisterClick.bind(this);
        this.onUserNameBlur = this.onUserNameBlur.bind(this);
    }

    lookupErrorMessage(errorCode) {
        if (errorCode && errorCode.message) {
            return errorCode.message;
        }
        return '';
    }

    lookupNameError(errorCode) {
        switch (errorCode) {
        case 'duplicate-user-name':
            return 'This user name already exists.';
        case 'empty-user-name':
            return 'Please enter a user name.';
        default:
            return '';
        }
    }

    onRegisterClick() {
        if (!this.userName) {
            this.props.registerFail('empty-user-name');
            return;
        }
        this.props.registerRequest(this.userName);
    }

    onUserNameBlur(e) {
        this.userName = e.target.value;
    }

    render() {
        const {status, error} = this.props,
            isBusy = status === 'busy',
            nameError = this.lookupNameError(error),
            errorMsg = this.lookupErrorMessage(error);
        var msgClasses = ['register-message'],
            msg = '';

        if (status === 'success') {
            msgClasses.push('register-success');
            msg = 'Registration successful!';
        } else if (errorMsg) {
            msgClasses.push('register-error');
            msg = errorMsg;
        }

        return <div className="register-screen">
            <div className="register-welcome">
                <h2>Welcome to Kiekie</h2>
                <p>
                    Please enter the user name that you would like to use,
                    below.
                </p>
            </div>

            <TextField
                hintText="User name" errorText={nameError}
                onChange={this.onUserNameBlur}
            />
            <br/>

            <RaisedButton
                className="register-btn"
                label="Register" primary={true} disabled={isBusy}
                onClick={this.onRegisterClick}
            />

            <div className={msgClasses.join(' ')}>{msg}</div>
        </div>;
    }
}

function mapStateToProps(state) {
    const {status, error} = state.ui.startup.register;
    return {status, error};
}

function mapDispatchToProps(dispatch) {
    return {
        registerRequest: (name) => dispatch(registerRequest(name)),
        registerFail: (error) => dispatch(registerFail('', error))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);
