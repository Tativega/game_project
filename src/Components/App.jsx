import React from "react";
import { Route } from "react-router-dom";

import { Home } from "../Views/home";

const App = () => {
      return (
            <div>
                  <Route exact path="/" component={Home} />
            </div>
      );
};

export default App;