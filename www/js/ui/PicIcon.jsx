import React, {PropTypes} from 'react';

import {GridTile} from 'material-ui/GridList';


export default class PicIcon extends React.Component {
    render() {
        const imgSrc = `data:image/png;base64,${this.props.src}`,
            title = this.props.saved ? 'Saved' : 'NOT Saved';
        return (
            <GridTile title={title}>
                <img src={imgSrc} />
            </GridTile>
        );
    }
}

PicIcon.propTypes = {
    src: PropTypes.string.isRequired,
    onClick: PropTypes.func
};
