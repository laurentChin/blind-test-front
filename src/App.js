import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { Home } from "./pages/Home";
import { Master } from "./pages/Master";

import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Blind test App</h1>
      </header>
      <div className="main">
        <Router>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/create-session" exact component={Master} />
          </Switch>
        </Router>
      </div>
    </div>
  );
}

export default App;
