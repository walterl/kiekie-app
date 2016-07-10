import React from 'react';
import AppBar from 'material-ui/AppBar';

import PicsBox from './picsbox';
import PhotoButton from './photo-button';

import '../scss/app.scss';
import AppLog from './applog';


export default class App extends React.Component {
    render() {
        var photoButton = <PhotoButton />;

        return (
            <div id="appapp">
                <AppBar
                    title="SnapHappy"
                    iconElementRight={photoButton}
                    className="appbar"
                    showMenuIconButton={false}
                />
                <AppLog />
                <PicsBox />
            </div>
        );
    }
}
