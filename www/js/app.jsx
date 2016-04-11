import React from 'react';
import AppBar from 'material-ui/lib/app-bar';

import PicsBox from './picsbox';
import PhotoButton from './photo-button';

import '../scss/app.scss';


class AppLog extends React.Component {
    render() {
        var i = 0,
            nextId = () => `log-${i++}`,
            lines = this.props.logLines.map(
                (line) => <li key={nextId()}>{line}</li>
            );

        return <ul id="log">{lines}</ul>;
    }
}

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {log: ['Started'], pics: []};
    }

    log(msg) {
        var l = this.state.log;

        if (msg === undefined) { return l.join('\n'); }

        l.push(msg);
        this.setState({log: l});
        return l;
    }

    takePicture() {
        this.log('Taking picture...');

        navigator.camera.getPicture(
            (picData) => {
                var pics = this.state.pics;
                pics.push(picData);
                this.setState({pics});
                this.log('Picture taken');
            },
            () => {
                this.log('Failed taking picture');
            }
        );
    }

    render() {
        const {log, pics} = this.state;
        const handleTakePicture = this.takePicture.bind(this);
        var showLog = this.props.showLog || false,
            appLog = showLog ? <AppLog logLines={log} /> : "",
            picsBox = pics.length ? <PicsBox pics={pics} /> : "";

        return (
            <div id="appapp">
                <AppBar
                    title="SnapHappy"
                    iconElementRight={<PhotoButton handler={handleTakePicture} />}
                    className="appbar"
                    showMenuIconButton={false}
                />
                {appLog}
                {picsBox}
            </div>
        );
    }
}
