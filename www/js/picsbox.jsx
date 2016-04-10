import React from 'react';


export default class PicsBox extends React.Component {
    render() {
        var i = 0,
            pics = this.props.pics.map((picData) => {
                i++;
                return <li key={"pic-" + i}><img src={picData}/></li>;
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
