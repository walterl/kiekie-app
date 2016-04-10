import * as React from 'react';

import PicsBox from './picsbox';


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
        return (
            <div>
                <p id="status">Status: {this.state.status}</p>
                <PicsBox takePicture={this.takePicture.bind(this)} pics={this.state.pics}/>
            </div>
        );
    }
}
