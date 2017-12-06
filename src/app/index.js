import React from 'react';
import ReactDOM from 'react-dom';
const RenderApp = () => {
    return <div>Yo!</div>
}
const App = <div><RenderApp /></div>;
if (typeof ISOMORPHIC_WEBPACK === 'undefined') {
    ReactDOM.hydrate(App, document.getElementById('app'));
}
export default App;