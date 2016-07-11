import React from 'react';
import AppBar from 'material-ui/AppBar';

import PicsBox from './PicsBox';
import PhotoButton from './PhotoButton';

import '../../scss/app.scss';


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
                <PicsBox />
            </div>
        );
    }
}
