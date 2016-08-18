import React from 'react';
import {connect} from 'react-redux';
import {hashHistory} from 'react-router';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import {
    loginRequest, loginFail, registerRequest, registerFail
} from '../actions/server';

import '../../scss/login.scss';


class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {userName: '', password: ''};

        this.onRegisterClick = this.onRegisterClick.bind(this);
        this.onLoginClick = this.onLoginClick.bind(this);
        this.onUserNameChange = this.onUserNameChange.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
    }

    leaveScreen() {
        this.props.popInitRoute('/login');

        window.setTimeout(() => {
            hashHistory.push('/');
        }, 2000);
    }

    lookupErrorMessage(errorCode) {
        if (errorCode && errorCode.messages) {
            return errorCode.messages.join('<br/><br/>');
        }
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

    lookupPasswordError(errorCode) {
        switch (errorCode) {
        case 'empty-password':
            return 'Please enter a password.';
        default:
            return '';
        }
    }

    renderDebugSkipButton() {
        const onClick = () => hashHistory.push('/');
        return <RaisedButton label="Skip >" onClick={onClick} />;
    }

    onLoginClick() {
        const {userName, password} = this.state;
        if (!userName) {
            this.props.loginFail(userName, 'empty-user-name');
            return;
        }
        if (!password) {
            this.props.loginFail(userName, 'empty-password');
            return;
        }
        this.props.loginRequest(userName, password);
    }

    onRegisterClick() {
        const {userName, password} = this.state;
        if (!userName) {
            this.props.registerFail(userName, 'empty-user-name');
            return;
        }
        if (!password) {
            this.props.registerFail(userName, 'empty-password');
            return;
        }
        this.props.registerRequest(userName, password);
    }

    onUserNameChange(e) {
        this.setState({userName: e.target.value});
    }

    onPasswordChange(e) {
        this.setState({password: e.target.value});
    }

    render() {
        const {status, error, debug} = this.props,
            btnDisabled = status === 'busy' || status === 'success',
            nameError = this.lookupNameError(error),
            passwordError = this.lookupPasswordError(error),
            errorMsg = this.lookupErrorMessage(error),
            debugSkipButton = debug ? this.renderDebugSkipButton() : null;
        var msgClasses = ['message'],
            msg = '';

        if (status === 'login-success') {
            msgClasses.push('success-message');
            msg = 'Login successful!';
            this.leaveScreen();
        } else if (status === 'register-success') {
            msgClasses.push('success-message');
            msg = 'Registration successful!';
            this.leaveScreen();
        } else if (errorMsg) {
            msgClasses.push('error-message');
            msg = errorMsg;
        }

        return <div className="login-screen">
            <div className="welcome">
                <h2>Welcome to Kiekie</h2>
                <p>Please log in or register a new account to proceed.</p>
            </div>

            <TextField
                hintText="User name" floatingLabelText="User name"
                errorText={nameError}
                onChange={this.onUserNameChange}
            />
            <br/>

            <TextField
                hintText="Password" floatingLabelText="Password" type="password"
                errorText={passwordError}
                onChange={this.onPasswordChange}
            />
            <br/>

            <RaisedButton
                className="action-btn"
                label="Login" primary={true} disabled={btnDisabled}
                onClick={this.onLoginClick}
            />
            <RaisedButton
                className="action-btn"
                label="Register" secondary={true} disabled={btnDisabled}
                onClick={this.onRegisterClick}
            />

            <div className={msgClasses.join(' ')}>{msg}</div>

            {debugSkipButton}
        </div>;
    }
}

function mapStateToProps(state) {
    const {status, error} = state.ui.login;
    return {
        debug: state.config.debug,
        status, error
    };
}

function mapDispatchToProps(dispatch) {
    return {
        loginRequest: (name, passwd) => dispatch(loginRequest(name, passwd)),
        loginFail: (name, error) => dispatch(loginFail(name, error)),
        registerRequest: (name) => dispatch(registerRequest(name)),
        registerFail: (name, error) => dispatch(registerFail(name, error))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
