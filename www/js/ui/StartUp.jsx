import React from 'react';
import {connect} from 'react-redux';
import {hashHistory} from 'react-router';

import Paper from 'material-ui/Paper';

import '../../scss/startup.scss';


class StartUp extends React.Component {
    render() {
        const {message, redirect} = this.props;

        if (redirect) {
            hashHistory.push(redirect);
        }

        return <div className="startup-bg">
            <Paper className="startup-paper">
                <div>{message}</div>
            </Paper>
        </div>;
    }
}

function mapStateToProps(state) {
    const {message, redirect} = state.ui.startup;
    return {message, redirect};
}

export default connect(mapStateToProps)(StartUp);
