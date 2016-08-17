import React from 'react';
import {connect} from 'react-redux';
import {hashHistory} from 'react-router';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

import {initRouteFollowed} from '../actions';

import '../../scss/startup.scss';


class StartUp extends React.Component {
    render() {
        const {initializing, initRoutes, message} = this.props,
            isDone = initializing.length === 0,
            msg = isDone ? 'Startup done!' : message,
            onClick = () => hashHistory.push('/pics');

        if (initRoutes.length) {
            hashHistory.push(initRoutes[0]);
            this.props.popInitRoute(initRoutes[0]);
            return null;
        }

        return <div className="startup-bg">
            <Paper className="startup-paper">
                <div>{msg}</div>
            </Paper>
            <RaisedButton
                label="Enter" primary={true} disabled={!isDone}
                onClick={onClick}
            />
        </div>;
    }
}

function mapStateToProps(state) {
    const {initializing, initRoutes, message} = state.ui.startup;
    return {initializing, initRoutes, message};
}

function mapDispatchToProps(dispatch) {
    return {
        popInitRoute: (rt) => dispatch(initRouteFollowed(rt))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(StartUp);
