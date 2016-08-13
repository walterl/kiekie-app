import React from 'react';
import {connect} from 'react-redux';
import {hashHistory} from 'react-router';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

import '../../scss/startup.scss';


class StartUp extends React.Component {
    render() {
        const {status, message} = this.props,
            isDone = status === 'done',
            msg = isDone ? 'Startup done!' : message,
            onClick = () => hashHistory.push('/pics');

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
    const {status, message} = state.ui.startup;
    return {status, message};
}

export default connect(mapStateToProps)(StartUp);
