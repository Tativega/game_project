import React from "react";
import { Route } from "react-router-dom";

import { Home } from "../Views/home";
import Pong from "../Components/Body/Pong"

const App = () => {
      return (
            <div>
                  <Route exact path="/" component={Home} />
                  <Route exact path="/pong" component={Pong} />
            </div>
      );
};

export default App;