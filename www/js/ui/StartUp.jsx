import React from 'react';
import {connect} from 'react-redux';
import {hashHistory} from 'react-router';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

import '../../scss/startup.scss';


class StartUp extends React.Component {
    render() {
        const {done, message} = this.props,
            msg = done ? 'Startup done!' : message,
            onClick = () => hashHistory.push('/pics');

        return <div className="startup-bg">
            <Paper className="startup-paper">
                <div>{msg}</div>
            </Paper>
            <RaisedButton
                label="Enter" primary={true} disabled={!done}
                onClick={onClick}
            />
        </div>;
    }
}

function mapStateToProps(appState) {
    const {done, message} = appState.ui.startup;
    return {done, message};
}

export default connect(mapStateToProps)(StartUp);
