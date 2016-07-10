import React, {PropTypes} from 'react';
import {connect} from 'react-redux';

import Pic from './pic';

import '../scss/picsbox.scss';


class PicsBox extends React.Component {
    render() {
        var i = 0,
            nextId = () => {
                i += 1;
                return `pic-${i}`;
            },
            pics = this.props.pics.map(
                (pic) => <Pic key={nextId()} src={pic.data} />
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
