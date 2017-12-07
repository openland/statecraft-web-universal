const React = require('react');
const ReactDOM = require('react-dom');
const RenderApp = () => {
    return <div>Yo!</div>
}
const App = <div><RenderApp /></div>;
if (typeof ISOMORPHIC_WEBPACK === 'undefined') {
    ReactDOM.hydrate(App, document.getElementById('app'));
}
module.exports = App;