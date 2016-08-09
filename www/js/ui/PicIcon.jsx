import React, {PropTypes} from 'react';

import {GridTile} from 'material-ui/GridList';

import '../../scss/picicon.scss';


export default class PicIcon extends React.Component {
    render() {
        const {src, title, onClick} = this.props;
        return (
            <GridTile className="pic-icon" onClick={onClick} title={title}>
                <img src={src} />
            </GridTile>
        );
    }
}

PicIcon.propTypes = {
    src: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    onClick: PropTypes.func
};
