import React from 'react';

import {white} from 'material-ui/styles/colors';
import ActionInfo from 'material-ui/svg-icons/action/info';
import ActionSettings from 'material-ui/svg-icons/action/settings';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import NavigationMoreVert from 'material-ui/svg-icons/navigation/more-vert';


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

    renderUserMenu() {
        const menuIcon = <IconButton><NavigationMoreVert /></IconButton>,
            onHelpClick = this.props.onHelpClick,
            onRefreshClick = this.props.onRefreshClick,
            onSignoutClick = this.props.onLogoutClick;

        return (
            <IconMenu
                iconButtonElement={menuIcon}
                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
            >
                <MenuItem primaryText="Refresh" onTouchTap={onRefreshClick} />
                <MenuItem primaryText="Help" onTouchTap={onHelpClick} />
                <MenuItem primaryText="Sign out" onTouchTap={onSignoutClick} />
            </IconMenu>
        );
    }

    render() {
        const {userName, onAboutClick, onSettingsClick} = this.props,
            toggleMenu = () => this.setState({open: !this.state.open}),
            menuCloseBtn = this.renderBackButton(toggleMenu),
            userMenu = this.renderUserMenu();

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
                    iconElementRight={userMenu}
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

MenuButton.propTypes = {
    userName: React.PropTypes.string,

    onAboutClick: React.PropTypes.func.isRequired,
    onSettingsClick: React.PropTypes.func.isRequired
};
