import * as React from 'react';
import * as ReactDOM from 'react-dom';
const RenderApp = () => {
    return <div>Yo!</div>;
};
const App = <div><RenderApp /></div>;
declare var ISOMORPHIC_WEBPACK: any;
if (typeof ISOMORPHIC_WEBPACK === 'undefined') {
    ReactDOM.hydrate(App, document.getElementById('app'));
}
// ReactDOM.render(App, document.getElementById('root'));
export default App;