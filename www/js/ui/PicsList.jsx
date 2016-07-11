import React, {PropTypes} from 'react';
import {connect} from 'react-redux';

import {selectPic} from '../actions';

import PicIcon from './PicIcon';

import '../../scss/picslist.scss';


class PicsList extends React.Component {
    handleIconClick(id) {
        this.props.dispatch(selectPic(id));
    }

    render() {
        var pics = this.props.pics.map(
            (pic) =>
                <PicIcon
                    key={pic.id} src={pic.data} saved={pic.saved}
                    onClick={this.handleIconClick.bind(this, pic.id)}
                />
        );

        return <div id="picslist">{pics}</div>;
    }
}

PicsList.propTypes = {
    pics: PropTypes.array.isRequired
};

function mapStateToProps(state) {
    return {
        pics: state.pics
    };
}


export default connect(mapStateToProps)(PicsList);
