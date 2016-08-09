import React, {PropTypes} from 'react';

import {GridTile} from 'material-ui/GridList';

import '../../scss/picicon.scss';


export default class PicIcon extends React.Component {
    render() {
        const {src, onClick} = this.props,
            title = this.props.saved ? 'Saved' : 'NOT Saved';
        return (
            <GridTile className="pic-icon" onClick={onClick} title={title}>
                <img src={src} />
            </GridTile>
        );
    }
}

PicIcon.propTypes = {
    src: PropTypes.string.isRequired,
    onClick: PropTypes.func
};
