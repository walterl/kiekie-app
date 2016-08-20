import React from 'react';
import {connect} from 'react-redux';

import Paper from 'material-ui/Paper';

import '../../scss/startup.scss';


class StartUp extends React.Component {
    render() {
        const {message} = this.props;

        return <div className="startup-bg">
            <Paper className="startup-paper">
                <div>{message}</div>
            </Paper>
        </div>;
    }
}

function mapStateToProps(state) {
    const {message} = state.ui.startup;
    return {message};
}

export default connect(mapStateToProps)(StartUp);
