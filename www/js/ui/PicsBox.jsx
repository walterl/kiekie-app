import React, {PropTypes} from 'react';
import {connect} from 'react-redux';

import {deletePic, savePic} from '../actions';

import Pic from './Pic';

import '../../scss/picsbox.scss';


class PicsBox extends React.Component {
    handleDeleteClick(id) {
        this.props.dispatch(deletePic(id));
    }

    handleSaveClick(id) {
        this.props.dispatch(savePic(id));
    }

    render() {
        var pics = this.props.pics.map(
            (pic) => {
                const onDelete = this.handleDeleteClick.bind(this, pic.id),
                    onSave = this.handleSaveClick.bind(this, pic.id);
                return <Pic
                    key={pic.id} src={pic.data} saved={pic.saved}
                    onDeleteClick={onDelete} onSaveClick={onSave} />;
            }
        );

        return <div id="picsbox">{pics}</div>;
    }
}

PicsBox.propTypes = {
    pics: PropTypes.array.isRequired
};

function mapStateToProps(state) {
    return {
        pics: state.pics
    };
}


export default connect(mapStateToProps)(PicsBox);
