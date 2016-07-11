import React, {PropTypes} from 'react';

import Card from 'material-ui/Card/Card';
import CardMedia from 'material-ui/Card/CardMedia';

import '../../scss/picicon.scss';


export default class PicIcon extends React.Component {
    render() {
        const imgSrc = `data:image/png;base64,${this.props.src}`;
        return (
            <Card className="pic-icon" onClick={this.props.onClick} >
                <CardMedia className="media">
                    <img src={imgSrc} />
                </CardMedia>
            </Card>
        );
    }
}

PicIcon.propTypes = {
    src: PropTypes.string.isRequired,
    onClick: PropTypes.func
};
