import React from 'react';
import AppBar from 'material-ui/AppBar';

import PicsList from './PicsList';
import PhotoButton from './PhotoButton';

import '../../scss/app.scss';


export default class App extends React.Component {
    render() {
        const photoButton = <PhotoButton />;

        return (
            <div>
                <AppBar
                    title="SnapHappy"
                    iconElementRight={photoButton}
                    className="appbar"
                    showMenuIconButton={false}
                />
                <PicsList />
            </div>
        );
    }
}
