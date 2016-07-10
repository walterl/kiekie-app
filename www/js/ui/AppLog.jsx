import React, {PropTypes} from 'react';
import {connect} from 'react-redux';


class AppLog extends React.Component {
    render() {
        const {enabled, entries} = this.props;
        var i = 0,
            nextId = () => {
                i += 1;
                return `log-${i}`;
            },
            lines = [];

        if (!enabled || !entries || !entries.length) {
            return null;
        }

        lines = entries.map(
            (line) => <li key={nextId()}>{line}</li>
        );

        return <ul id="log">{lines}</ul>;
    }
}

AppLog.propTypes = {
    enabled: PropTypes.bool,
    entries: PropTypes.array
};

function mapStateToProps(state) {
    var {enabled, entries} = state.log;
    return {enabled, entries};
}

export default connect(mapStateToProps)(AppLog);
