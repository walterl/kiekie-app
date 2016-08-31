import React from 'react';
import {hashHistory} from 'react-router';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';



export default class Help extends React.Component {
    render() {
        const
            menuCloseBtn =
                <IconButton onTouchTap={() => hashHistory.goBack()}>
                    <NavigationArrowBack />
                </IconButton>;

        return <div>
            <AppBar
                title="Kiekie Help"
                iconElementLeft={menuCloseBtn}
            />
            <div>This is the help page.</div>
        </div>;
    }
}
