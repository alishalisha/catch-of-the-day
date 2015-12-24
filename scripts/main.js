var React = require('react');
var ReactDOM = require('react-dom');

var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Navigation = ReactRouter.Navigation; // mixin
var History = ReactRouter.History;
var createBrowserHistory = require('history/lib/createBrowserHistory');

var helpers = require('./helpers');


/*
  App
*/

var App = React.createClass({

  render : function() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market" />
        </div>
        <Order />
        <Inventory />
      </div>
    )
  }
})

/*
  Header component
  <Header/>
*/

var Header = React.createClass({
  render : function() {
    return (
      <header className="top">
        <h1>Catch of the Day</h1>
        <h3 className="tagline"><span>{this.props.tagline}</span></h3>
      </header>
    )
  }
})

/*
  Order component
  <Order/>
*/

var Order = React.createClass({
  render : function() {
    return (
      <h1>Order</h1>
    )
  }
})

/*
  Inventory component
  <Inventory/>
*/

var Inventory = React.createClass({
  render : function() {
    return (
      <h1>Inventory</h1>
    )
  }
})

/*
  Store Picker component
  <StorePicker/>
*/

var StorePicker = React.createClass({

  mixins : [History],

  goToStore : function(event) {
    event.preventDefault();
    // get the data from the input
    var storeId = this.refs.storeId.value;
    // transition from StorePicker to App
    this.history.pushState(null, '/store/' + storeId);
  },

  render : function() {
    return (
      <form className="store-selector" onSubmit={this.goToStore}>
        {/* this is a comment in jsx */}
        <h2>Please Enter A Store</h2>
        <input type="text" ref="storeId" value={helpers.getFunName()} required/>
        <input type="Submit"/>
      </form>
    )
  }
});

/*
  Not Found
*/

var NotFound = React.createClass({
  render : function() {
    return <h1>404 Not found!</h1>
  }
})


/*
  Routes
*/

var routes = (
  <Router history={createBrowserHistory()}>
    <Route path="/" component={StorePicker}/>
    <Route path="/store/:storeId" component={App}/>
    <Route path="*" component={NotFound}/>
  </Router>
)



ReactDOM.render(routes, document.querySelector('#main'));

