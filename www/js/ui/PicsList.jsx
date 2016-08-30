import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {hashHistory} from 'react-router';

import {GridList} from 'material-ui/GridList';

import {selectPic} from '../actions';

import PicTile from './PicTile';

import '../../scss/picslist.scss';


class PicsList extends React.Component {
    handleTileClick(id) {
        this.props.dispatch(selectPic(id));
        hashHistory.push(`/pic/${id}`);
    }

    render() {
        const {cellHeight, pics} = this.props;
        return (
            <div id="pics-list-root">
                <GridList className="pics-list" cellHeight={cellHeight}>
                    {pics.map((pic) =>
                    <PicTile
                        key={pic.id} title={pic.note} error={pic.error}
                        isBusy={pic.busy} isSaved={pic.saved}
                        src={pic.thumbnail}
                        onTouchTap={this.handleTileClick.bind(this, pic.id)}
                    />
                    )}
                </GridList>
            </div>
        );
    }
}

PicsList.propTypes = {
    pics: PropTypes.array.isRequired,
    cellHeight: PropTypes.number.isRequired
};

function mapStateToProps(state) {
    return {
        pics: state.pics,
        cellHeight: state.ui.picsList.cellHeight
    };
}


export default connect(mapStateToProps)(PicsList);
