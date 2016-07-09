import React from 'react';

import Pic from './pic';

import '../scss/picsbox.scss';


export default class PicsBox extends React.Component {
    render() {
        var i = 0,
            nextId = () => {
                i += 1;
                return `pic-${i}`;
            },
            pics = this.props.pics.map(
                (picData) => <Pic key={nextId()} src={picData} />
            );

        return <div id="picsbox">{pics}</div>;
    }
}
