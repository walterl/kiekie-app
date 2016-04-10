import * as React from 'react';


export default class PicsBox extends React.Component {
    render() {
        var pics = this.props.pics.map((picData) => {
            return <li><img src={picData}/></li>;
        });

        return (
            <div>
                <button onClick={this.props.takePicture}>
                    Take Picture
                </button>
                <ul id="pics">{pics}</ul>
            </div>
        );
    }
}
