import React from 'react';

import {white} from 'material-ui/styles/colors';
import ActionHelp from 'material-ui/svg-icons/action/help';
import ActionInfo from 'material-ui/svg-icons/action/info';
import ActionSettings from 'material-ui/svg-icons/action/settings';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import NavigationMoreVert from 'material-ui/svg-icons/navigation/more-vert';


export default class MenuButton extends React.Component {
    constructor(props) {
        super(props);

        this.state = {open: false};
        this.toggleMenu = this.toggleMenu.bind(this);
    }

    toggleMenu() {
        this.setState({open: !this.state.open});
    }

    renderBackButton() {
        return (
            <IconButton onTouchTap={this.toggleMenu}>
                <NavigationArrowBack />
            </IconButton>
        );
    }

    renderUserMenu() {
        const menuIcon = <IconButton><NavigationMoreVert /></IconButton>,
            onSignoutClick = this.props.onLogoutClick;

        return (
            <IconMenu
                iconButtonElement={menuIcon}
                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
            >
                <MenuItem primaryText="Sign out" onTouchTap={onSignoutClick} />
            </IconMenu>
        );
    }

    render() {
        const
            {userName, onAboutClick, onHelpClick, onSettingsClick} = this.props,
            onRefreshClick = () => {
                this.toggleMenu();
                this.props.onRefreshClick();
            },
            menuCloseBtn = this.renderBackButton(this.toggleMenu),
            userMenu = this.renderUserMenu();

        return <div>
            <IconButton onTouchTap={this.toggleMenu}>
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
                    primaryText="Reload pictures"
                    onTouchTap={onRefreshClick}
                    leftIcon={<NavigationRefresh/>}
                />
                <MenuItem
                    primaryText="Settings"
                    onTouchTap={onSettingsClick}
                    leftIcon={<ActionSettings/>}
                />
                <MenuItem
                    primaryText="Help"
                    onTouchTap={onHelpClick}
                    leftIcon={<ActionHelp/>}
                />
                <MenuItem
                    primaryText="About Kiekie"
                    onTouchTap={onAboutClick}
                    leftIcon={<ActionInfo/>}
                />
            </Drawer>
        </div>;
    }
}

MenuButton.propTypes = {
    userName: React.PropTypes.string,

    onAboutClick: React.PropTypes.func.isRequired,
    onHelpClick: React.PropTypes.func.isRequired,
    onLogoutClick: React.PropTypes.func.isRequired,
    onRefreshClick: React.PropTypes.func.isRequired,
    onSettingsClick: React.PropTypes.func.isRequired
};
