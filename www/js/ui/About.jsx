import React from 'react';
import {connect} from 'react-redux';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';

import {redirect} from '../actions';


class About extends React.Component {
    render() {
        const
            menuCloseBtn =
                <IconButton onTouchTap={this.props.redirectToPics}>
                    <NavigationArrowBack />
                </IconButton>;

        return <div>
            <AppBar
                title="About Kiekie"
                iconElementLeft={menuCloseBtn}
            />
            <div>This is the about page.</div>
        </div>;
    }
}


function mapDispatchToProps(dispatch) {
    return {
        redirectToPics: () => dispatch(redirect('/pics'))
    };
}

export default connect(null, mapDispatchToProps)(About);
