import React from 'react';
import {connect} from 'react-redux';

import Paper from 'material-ui/Paper';

import {redirect} from '../actions';

import '../../scss/startup.scss';


class StartUp extends React.Component {
    render() {
        const {finished, message} = this.props;

        if (finished) {
            this.props.redirectToPics();
            return null;
        }

        return <div className="startup-bg">
            <Paper className="startup-paper">
                <div>{message}</div>
            </Paper>
        </div>;
    }
}

function mapStateToProps(state) {
    const {finished, message} = state.ui.startup;
    return {finished, message};
}

function mapDispatchToProps(dispatch) {
    return {
        redirectToPics: () => dispatch(redirect('/pics'))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(StartUp);
