import React from 'react';

import {white} from 'material-ui/styles/colors';
import ActionInfo from 'material-ui/svg-icons/action/info';
import ActionSettings from 'material-ui/svg-icons/action/settings';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';


export default class MenuButton extends React.Component {
    constructor(props) {
        super(props);

        this.state = {open: false};
    }

    renderBackButton(toggleMenu) {
        return (
            <IconButton onTouchTap={toggleMenu}>
                <NavigationArrowBack />
            </IconButton>
        );
    }

    render() {
        const {userName, onAboutClick, onSettingsClick} = this.props,
            toggleMenu = () => this.setState({open: !this.state.open}),
            menuCloseBtn = this.renderBackButton(toggleMenu),

        return <div>
            <IconButton onTouchTap={toggleMenu}>
                <NavigationMenu color={white} />
            </IconButton>

            <Drawer
                docked={false}
                open={this.state.open}
                onRequestChange={(open) => this.setState({open})}
            >
                <AppBar
                    title={userName}
                    className="menu-appbar"
                    iconElementLeft={menuCloseBtn}
                />
                <MenuItem
                    onTouchTap={onSettingsClick}
                    leftIcon={<ActionSettings/>}
                >Settings</MenuItem>
                <MenuItem
                    onTouchTap={onAboutClick}
                    leftIcon={<ActionInfo/>}
                >About Kiekie</MenuItem>
            </Drawer>
        </div>;
    }
}
