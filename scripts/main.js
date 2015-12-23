var React = require('react');
var ReactDOM = require('react-dom');

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

  render : function() {
    return (
      <form className="store-selector">
        {/* this is a comment in jsx */}
        <h2>Please Enter A Store</h2>
        <input type="text" ref="storeId" required/>
        <input type="Submit"/>
      </form>
    )
  }
});


ReactDOM.render(<App/>, document.querySelector('#main'));

