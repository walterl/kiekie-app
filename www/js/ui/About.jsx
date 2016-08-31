import React from 'react';
import {hashHistory} from 'react-router';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';


export default class About extends React.Component {
    render() {
        const
            menuCloseBtn =
                <IconButton onTouchTap={() => hashHistory.goBack()}>
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
