import React, {PropTypes} from 'react';

import {GridTile} from 'material-ui/GridList';

import '../../scss/pictile.scss';


export default class PicTile extends React.Component {
    render() {
        const {src, title, onClick} = this.props;
        return (
            <GridTile className="pic-tile" onClick={onClick} title={title}>
                <img src={src} />
            </GridTile>
        );
    }
}

PicTile.propTypes = {
    src: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    onClick: PropTypes.func
};
