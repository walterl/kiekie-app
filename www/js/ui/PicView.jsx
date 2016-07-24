import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';


class PicView extends React.Component {
    render() {
        const {pic} = this.props;

        if (!pic) {
            return <Link to="/">No pic; go back</Link>;
        }

        return (
            <img src={pic.data} />
        );
    }
}

function mapStateToProps(state, ownProps) {
    const {picId} = ownProps.params;
    var selected = state.pics.filter((p) => p.id === picId),
        pic = selected.length ? selected[0] : null;
    return {pic};
}

export default connect(mapStateToProps)(PicView);
