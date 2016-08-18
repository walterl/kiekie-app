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

    lookupErrors(error) {
        var errors = {userName: null, password: null, message: null};

        if (!error) {
            return errors;
        }

        if (error.messages) {
            errors.message = error.messages.join('<br/><br/>');
        } else if (error.message) {
            errors.message = error.message;
        }

        switch (error) {
        case 'duplicate-user-name':
            errors.userName = 'This user name already exists.';
            break;
        case 'empty-user-name':
            errors.userName = 'Please enter a user name.';
            break;
        case 'empty-password':
            errors.password = 'Please enter a password.';
            break;
        default:
            break;
        }

        return errors;
    }

    renderDebugSkipButton() {
        const onClick = () => hashHistory.push('/');
        if (this.props.debug) {
            return <RaisedButton label="Skip >" onClick={onClick} />;
        }
        return null;
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
        const {status, error} = this.props,
            btnDisabled = status === 'busy' || status === 'success',
            errors = this.lookupErrors(error);
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
        } else if (errors.message) {
            msgClasses.push('error-message');
            msg = errors.message;
        }

        return <div className="login-screen">
            <div className="welcome">
                <h2>Welcome to Kiekie</h2>
                <p>Please log in or register a new account to proceed.</p>
            </div>

            <TextField
                hintText="User name" floatingLabelText="User name"
                errorText={errors.userName}
                onChange={this.onUserNameChange}
            />
            <br/>

            <TextField
                hintText="Password" floatingLabelText="Password" type="password"
                errorText={errors.password}
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

            {this.renderDebugSkipButton()}
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
