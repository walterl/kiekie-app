/* global cordova */
import React from 'react';
import {hashHistory} from 'react-router';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';

import '../../scss/about.scss';


export default class About extends React.Component {
    renderCloseButton() {
        return <IconButton onTouchTap={() => hashHistory.goBack()}>
            <NavigationArrowBack />
        </IconButton>;
    }

    render() {
        const menuCloseBtn = this.renderCloseButton(),
            www = cordova.isBrowser ? '' : 'www/',
            logoUrl = cordova.file.applicationDirectory + `${www}logo.png`,
            srcUrl = 'https://github.com/walterl/kiekie-app',
            licUrl = `${srcUrl}/blob/master/LICENSE`,
            twitterLink =
                <a href="https://twitter.com/wasbeer">Walter Leibbrandt</a>;

        return <div className="about">
            <AppBar
                title="About Kiekie"
                iconElementLeft={menuCloseBtn}
            />
            <div>
                <img src={logoUrl} alt="Kiekie Logo" />
                <h1>Kiekie</h1>
                <div className="blurb">
                    <p>
                    A Free and <a href={srcUrl} target="_blank">Open Source</a>,
                    on-line photo gallery.
                    </p>
                    <p>
                        Licensed under
                        the <a href={licUrl} target="_blank">MIT License</a>.
                    </p>
                    <p>© 2016 - present, {twitterLink}.</p>
                </div>
            </div>
            <div className="ded">
                Vir Ellie &#9829;
            </div>
        </div>;
    }
}
