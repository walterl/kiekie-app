import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {hashHistory} from 'react-router';

import {GridList} from 'material-ui/GridList';

import {selectPic} from '../actions';

import PicIcon from './PicIcon';

import '../../scss/picslist.scss';


class PicsList extends React.Component {
    handleIconClick(id) {
        this.props.dispatch(selectPic(id));
        hashHistory.push(`/pic/${id}`);
    }

    render() {
        const {cellHeight, pics} = this.props;
        return (
            <div id="pics-list-root">
                <GridList className="pics-list" cellHeight={cellHeight}>
                    {pics.map((pic) =>
                    <PicIcon
                        key={pic.id} src={pic.uri} saved={pic.saved}
                        onClick={this.handleIconClick.bind(this, pic.id)}
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
