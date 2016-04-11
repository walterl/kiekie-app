import React from 'react';
import AppBar from 'material-ui/lib/app-bar';

import PicsBox from './picsbox';
import PhotoButton from './photo-button';

import '../scss/app.scss';


export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {status: 'Started', pics: []};
    }

    takePicture() {
        this.setState({status: 'Taking picture...'});

        navigator.camera.getPicture(
            (picData) => {
                var pics = this.state.pics;
                pics.push(picData);
                this.setState({pics, status: 'Picture taken'});
            },
            () => {
                this.setState({status: 'Failed taking picture'});
            }
        );
    }

    render() {
        const {status, pics} = this.state;
        const handleTakePicture = this.takePicture.bind(this);

        return (
            <div id="appapp">
                <AppBar
                    title="SnapHappy"
                    iconElementRight={<PhotoButton handler={handleTakePicture} />}
                    className="appbar"
                    showMenuIconButton={false}
                />
                <p id="status">Status: {status}</p>
                <PicsBox pics={pics} />
            </div>
        );
    }
}
