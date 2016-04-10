import React from 'react';
import RaisedButton from 'material-ui/lib/raised-button';


export default class PicsBox extends React.Component {
    render() {
        var i = 0,
            pics = this.props.pics.map((picData) => {
                i++;
                return <li key={"pic-" + i}><img src={picData}/></li>;
            });

        return (
            <div>
                <ul id="pics">{pics}</ul>
            </div>
        );
    }
}
