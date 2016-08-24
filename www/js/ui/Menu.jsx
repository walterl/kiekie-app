import React from 'react';

import {white, darkBlack} from 'material-ui/styles/colors';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';

import '../../scss/menu.scss';


export default class MenuButton extends React.Component {
    constructor(props) {
        super(props);

        this.state = {open: false};
    }

    renderMenuDrawer() {
        const toggleMenu = () => this.setState({open: !this.state.open}),
            menuCloseBtn =
                <IconButton onTouchTap={toggleMenu}>
                    <NavigationArrowBack color={darkBlack} />
                </IconButton>;

        return (
            <Drawer
                docked={false}
                open={this.state.open}
                onRequestChange={(open) => this.setState({open})}
            >
                <AppBar
                    className="menu-appbar"
                    iconElementLeft={menuCloseBtn}
                />
                <MenuItem>Settings</MenuItem>
                <MenuItem>About Kiekie</MenuItem>
            </Drawer>
        );
    }

    render() {
        const toggleMenu = () => this.setState({open: !this.state.open});

        return <div>
            <IconButton onTouchTap={toggleMenu}>
                <NavigationMenu color={white} />
            </IconButton>

            {this.renderMenuDrawer()}
        </div>;
    }
}
