import React from 'react';
import {connect} from 'react-redux';

import {lightBlack, white} from 'material-ui/styles/colors';
import ActionSettings from 'material-ui/svg-icons/action/settings';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import {redirect, setStartupFinished} from '../actions';
import {
    loginRequest, loginFail, registerRequest, registerFail
} from '../actions/server';

import '../../scss/login.scss';


const ENTER_KEY = 13,
    MESSAGES = {
        'login-success': 'Login successful!',
        'register-success': 'Registration successful!'
    };


class Login extends React.Component {
    constructor(props) {
        super(props);

        this.onRegisterClick = this.onRegisterClick.bind(this);
        this.onLoginClick = this.onLoginClick.bind(this);
    }

    determineFeedback(status, errors) {
        var msgClasses = ['message'],
            msg = '';

        if (['login-success', 'register-success'].includes(status)) {
            msg = MESSAGES[status];
            msgClasses.push('success-message');
            window.setTimeout(this.props.finishStartup, 2000);
        } else {
            msg = errors.message;
            msgClasses.push('error-message');
        }

        return {msg, msgClasses};
    }

    lookupErrors(error) {
        var errors = {userName: null, password: null, message: null};

        if (!error) {
            return errors;
        }

        if (error.messages) {
            errors.message = error.messages.join('<br/><br/>');
        } else if (error.message) {
            if (error.name === 'TypeError' &&
                error.message === 'Failed to fetch') {
                errors.message = 'Can\'t connect to Kiekie server.';
            } else {
                errors.message = error.message;
            }
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

    onLoginClick() {
        const userName = this.userNameInput.getValue(),
            password = this.passwordInput.getValue();
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
        const userName = this.userNameInput.getValue(),
            password = this.passwordInput.getValue();
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

    render() {
        const {status, error, userName} = this.props,
            btnDisabled = status === 'busy' || status.endsWith('-success'),
            errors = this.lookupErrors(error),
            {msg, msgClasses} = this.determineFeedback(status, errors),
            onUserNameKey = (e) => {
                if (e.keyCode === ENTER_KEY) {
                    this.passwordInput.focus();
                }
            },
            onPasswordKey = (e) => {
                if (e.keyCode === ENTER_KEY) {
                    this.passwordInput.blur();
                    this.loginButton.props.onTouchTap();
                }
            },
            setRef = (component, ref) => {
                this[ref] = component;
            };

        return <div className="login-screen">
            <AppBar
                className="login-appbar"
                iconElementLeft={
                    <IconButton onTouchTap={this.props.onSettingsClick}>
                        <ActionSettings color={lightBlack}/>
                    </IconButton>}
                style={{backgroundColor: white, boxShadow: null}}
            />

            <div className="welcome">
                <h2>Welcome to Kiekie</h2>
                <p>Please log in or register a new account to proceed.</p>
            </div>

            <TextField
                hintText="User name" floatingLabelText="User name"
                errorText={errors.userName}
                ref={(c) => setRef(c, 'userNameInput')}
                defaultValue={userName}
                onKeyDown={onUserNameKey}
            />
            <br/>

            <TextField
                hintText="Password" floatingLabelText="Password" type="password"
                errorText={errors.password}
                ref={(c) => setRef(c, 'passwordInput')}
                onKeyDown={onPasswordKey}
            />
            <br/>

            <RaisedButton
                className="action-btn"
                label="Login" primary={true} disabled={btnDisabled}
                ref={(c) => setRef(c, 'loginButton')}
                onTouchTap={this.onLoginClick}
            />
            <RaisedButton
                className="action-btn"
                label="Register" secondary={true} disabled={btnDisabled}
                onTouchTap={this.onRegisterClick}
            />

            <div className={msgClasses.join(' ')}>{msg}</div>
        </div>;
    }
}

function mapStateToProps(state) {
    const {status, error, userName} = state.ui.login;
    return {status, error, userName};
}

function mapDispatchToProps(dispatch) {
    return {
        finishStartup: () => dispatch(setStartupFinished()),
        loginRequest: (name, pw) => dispatch(loginRequest(name, pw)),
        loginFail: (name, error) => dispatch(loginFail(name, error)),
        registerRequest: (name, pw) => dispatch(registerRequest(name, pw)),
        registerFail: (name, error) => dispatch(registerFail(name, error)),
        onSettingsClick: () => dispatch(redirect('/settings', false))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
