var React = require('react');
var ReactDOM = require('react-dom');

var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Navigation = ReactRouter.Navigation; // mixin
var History = ReactRouter.History;
var createBrowserHistory = require('history/lib/createBrowserHistory');

var helpers = require('./helpers');

// Firebase
var Rebase = require('re-base');
var base = Rebase.createClass('https://scorching-fire-5945.firebaseio.com/');

/*
  App
*/

var App = React.createClass({

  getInitialState : function() {
    return {
      fishes : {},
      order : {}
    }
  },

  componentDidMount : function() {
    // get the state from Firebase
    base.syncState(this.props.params.storeId + '/fishes', {
      context : this,
      state : 'fishes'
    });
  },

  addToOrder : function(key) {
    this.state.order[key] = this.state.order[key] + 1 || 1;
    this.setState({ order : this.state.order })
  },

  addFish : function(fish) {
    var timestamp = (new Date()).getTime();
    // update the state object
    this.state.fishes['fish-' + timestamp] = fish;

    // set the state
    this.setState({ fishes : this.state.fishes });
  },

  loadSamples : function() {
    this.setState({ 
      fishes : require('./sample-fishes')
    });
  },

  renderFish : function(key){
    return <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder} />
  },

  render : function() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market" />
          <ul className="list-of-fish">
            {Object.keys(this.state.fishes).map(this.renderFish)}
          </ul>
        </div>
        <Order fishes={this.state.fishes} order={this.state.order} />
        <Inventory addFish={this.addFish} loadSamples={this.loadSamples} />
      </div>
    )
  }
})

/* Fish component
  <Fish />
*/

var Fish = React.createClass({

  onButtonClick : function(event) {
    event.preventDefault;
    console.log("Adding: ", this.props.index);
    this.props.addToOrder(this.props.index);
  },

  render : function() {

    var details = this.props.details;
    var isAvailable = (details.status === 'available' ? true : false);
    var buttonText = (isAvailable ? 'Add To Order' : 'Sold Out!' );

    return(
      <li className="menu-fish">
        <img src={details.image} />
        <h3 className="fish-name">
          {details.name}
          <span className="price">{helpers.formatPrice(details.price)}</span>
        </h3>
        <p>{details.desc}</p>
        <button disabled={!isAvailable} onClick={this.onButtonClick}>{buttonText}</button>
      </li>
    )

  }
});

/* Edit Fish
  <EditFish/>
*/

// tk tk


/*
  Add Fish Form
  <AddFishForm/>
*/

var AddFishForm = React.createClass({

  createFish : function(event) {
    // 1. stop form from submitting
    event.preventDefault();

    // 2. take data from the form and create an object
    var fish = {
      name: this.refs.name.value,
      price: this.refs.price.value,
      status: this.refs.status.value,
      desc: this.refs.desc.value,
      image: this.refs.image.value
    }

    // 3. add the fish to the App State
    this.props.addFish(fish);

  },

  render : function() {

    return (
      <form className="fish-edit" ref="fishForm" onSubmit={this.createFish}>
        <input type="text" ref="name" placeholder="Fish Name"/>
        <input type="text" ref="price" placeholder="Fish Price" />
        <select ref="status">
          <option value="available">Fresh!</option>
          <option value="unavailable">Sold Out!</option>
        </select>
        <textarea type="text" ref="desc" placeholder="Desc"></textarea>
        <input type="text" ref="image" placeholder="URL to Image" />
        <button type="submit">+ Add Item </button>
      </form>
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

  renderOrder : function(key) {
    var fish = this.props.fishes[key];
    var count = this.props.order[key];

    if (!fish) {
      return <li key={key}>sorry, fish no longer available</li>
    }

    return (
      <li>
        <span>{count}</span>lbs
        {fish.name}
        <span className="price">{helpers.formatPrice(count * fish.price)}</span>
      </li>
    )
  },

  render : function() {
    var orderIds = Object.keys(this.props.order);
    var total = orderIds.reduce((prevTotal, key)=> {
      var fish = this.props.fishes[key];
      var count = this.props.order[key];
      var isAvailable = fish && fish.status == 'available';

      if(fish && isAvailable) {
        return prevTotal + (count * parseInt(fish.price) || 0);
      }

      return prevTotal;

    }, 0);

    return (
      <div className="order-wrap">
        <h2 className="order-title">Order</h2>
        <ul className="order">
          {orderIds.map(this.renderOrder)}
          <li className="total">
            <strong>Total:</strong>
            {helpers.formatPrice(total)}
          </li>
        </ul>
      </div>
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
      <div>
        <h2>Inventory</h2>

        <AddFishForm {...this.props} />
        <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
      </div>
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

