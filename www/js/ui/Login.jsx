import React from 'react';
import {connect} from 'react-redux';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import {redirect} from '../actions';
import {
    loginRequest, loginFail, registerRequest, registerFail
} from '../actions/server';

import '../../scss/login.scss';


const MESSAGES = {
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
            window.setTimeout(this.props.redirectToPics, 2000);
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
        const onClick = this.props.redirectToPics;
        if (this.props.debug) {
            return <RaisedButton label="Skip >" onClick={onClick} />;
        }
        return null;
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
            btnDisabled = status === 'busy' || status === 'success',
            errors = this.lookupErrors(error),
            {msg, msgClasses} = this.determineFeedback(status, errors),
            setRef = (component, ref) => {
                this[ref] = component;
            };

        return <div className="login-screen">
            <div className="welcome">
                <h2>Welcome to Kiekie</h2>
                <p>Please log in or register a new account to proceed.</p>
            </div>

            <TextField
                hintText="User name" floatingLabelText="User name"
                errorText={errors.userName}
                ref={(c) => setRef(c, 'userNameInput')}
                defaultValue={userName}
            />
            <br/>

            <TextField
                hintText="Password" floatingLabelText="Password" type="password"
                errorText={errors.password}
                ref={(c) => setRef(c, 'passwordInput')}
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
    const {status, error, userName} = state.ui.login;
    return {
        debug: state.config.debug,
        status, error, userName
    };
}

function mapDispatchToProps(dispatch) {
    return {
        redirectToPics: () => dispatch(redirect('/pics')),
        loginRequest: (name, passwd) => dispatch(loginRequest(name, passwd)),
        loginFail: (name, error) => dispatch(loginFail(name, error)),
        registerRequest: (name) => dispatch(registerRequest(name)),
        registerFail: (name, error) => dispatch(registerFail(name, error))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
