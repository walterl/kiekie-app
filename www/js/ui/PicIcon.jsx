import React, {PropTypes} from 'react';

import {GridTile} from 'material-ui/GridList';


export default class PicIcon extends React.Component {
    render() {
        const {src, onClick} = this.props,
            title = this.props.saved ? 'Saved' : 'NOT Saved';
        return (
            <GridTile title={title} onClick={onClick}>
                <img src={src} />
            </GridTile>
        );
    }
}

PicIcon.propTypes = {
    src: PropTypes.string.isRequired,
    onClick: PropTypes.func
};
