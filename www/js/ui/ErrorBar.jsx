import React from 'react';
import {connect} from 'react-redux';

import Snackbar from 'material-ui/Snackbar';

import {dismissError} from '../actions';


class ErrorBar extends React.Component {
    render() {
        const {error} = this.props;
        var errorMsg = '';

        if (!error) {
            return null;
        }

        if (error.message) {
            errorMsg = error.message;
        } else if (typeof error === 'string') {
            errorMsg = error;
        } else {
            errorMsg = error.toString();
        }

        return <Snackbar
            open={Boolean(error)}
            message={errorMsg}
            action="Dismiss"
            autoHideDuration={3000}
            onRequestClose={() => this.props.dismissError(error)}
        />;
    }
}


function mapStateToProps(state) {
    const {error} = state.ui;
    return {
        error: error && error.message
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dismissError: (e) => dispatch(dismissError(e))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ErrorBar);
