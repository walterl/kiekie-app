import React, {PropTypes} from 'react';

import {yellow500} from 'material-ui/styles/colors';
import {GridTile} from 'material-ui/GridList';
import ContentSave from 'material-ui/svg-icons/content/save';

import '../../scss/pictile.scss';


export default class PicTile extends React.Component {
    render() {
        const {isSaved, src, onClick} = this.props;
        var {title} = this.props,
            icon = null;

        if (!isSaved) {
            icon = <ContentSave className="action-icon" color={yellow500}/>;

            // We need a truthy title for the tile title overlay to display
            title = title || ' ';
        }

        return (
            <GridTile
                className="pic-tile" onClick={onClick} title={title}
                actionIcon={icon}
            >
                <img src={src} />
            </GridTile>
        );
    }
}

PicTile.propTypes = {
    isSaved: PropTypes.bool.isRequired,
    src: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    onClick: PropTypes.func
};
