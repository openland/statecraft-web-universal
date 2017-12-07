import * as React from 'react';
import * as ReactDOM from 'react-dom';
class RenderApp extends React.Component<{}, { v: number }> {
    constructor(props: {}) {
        super(props);
        this.state = { v: 6 };
    }
    render() {
        return <button onClick={() => this.setState({ v: this.state.v + 1 })}>State: ${this.state.v} </button>;
    }
}
const App = <div><RenderApp /></div>;
declare var ISOMORPHIC_WEBPACK: any;
if (typeof ISOMORPHIC_WEBPACK === 'undefined') {
    ReactDOM.hydrate(App, document.getElementById('app'));
}
// ReactDOM.render(App, document.getElementById('root'));
export default App;