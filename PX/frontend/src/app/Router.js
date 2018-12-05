import React from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import MainWrapper from "./MainWrapper";
import Layout from "../pages/header_sidebar/Layout";
import LogIn from "../pages/account/LogIn";
import Register from "../pages/account/Register";
import Forgot from "../pages/account/Forgot";
import Terms from "../pages/terms/Terms";
import Optout from "../pages/optout";
import Notfound from "../pages/notfound";

import Ui from "./ui";

const Router = () => (
  <MainWrapper>
    <main>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={LogIn} />
          <Route path="/forgot" component={Forgot} />
          <Route path="/signup" component={Register} />
          <Route path="/terms" component={Terms} />
          <Route path="/optout" component={Optout} />
          <Route path="/ui" component={Ui} />
          {/* <Route exact path="*" component={Notfound} /> */}
        </Switch>
      </BrowserRouter>
    </main>
  </MainWrapper>
);

export default Router;
