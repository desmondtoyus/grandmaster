import React, { Component } from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import { parseQuery } from "../functions";
import { readActiveUser } from "../redux/actions/user.actions";
import { connect } from "react-redux";
import Home from "../pages/home";
import Accounts from "../pages/accounts";
import Layout from "../pages/header_sidebar/Layout";

import Advertisers from "../pages/advertisers";

import Campaigns from "../pages/campaigns";
import Flights from "../pages/flights";
import Placements from "../pages/placements";
import Publishers from "../pages/publishers";
import Integrations from "../pages/integrations";
import Marketplaces from "../pages/marketplaces";
import Users from "../pages/users";
import DomainLists from "../pages/domain.lists";
import BundleLists from "../pages/bundle.lists";
import IpLists from "../pages/ip.lists";
import AppLists from "../pages/app.lists";
import IFlights from "../pages/iflights";
import Flight from "../pages/flight/flight";
import Placement from "../pages/placement/placement";

import Publisher from "../pages/publisher";
import Analytics from "../pages/analytics";
import ConvAnalytics from "../pages/conversion.analytics";
import Rejections from "../pages/rejections";
import DomainList from "../pages/domain.list";
import BundleList from "../pages/bundle.list";
import IpList from "../pages/ip.list";
import AppList from "../pages/app.list";
import SelectAccount from "../pages/select.account";
import Advertiser from "../pages/advertiser";
import Account from "../pages/account";
import Campaign from "../pages/campaign";

import Advertiserpage from "../pages/advertiserpage";
import Reporting from "../pages/reporting";
import Notfound from "../pages/notfound";

class Ui extends Component {
  componentWillMount() {
    this.props.readActiveUser();
  }

  render() {
    const { activeUser, location, history } = this.props;
    if (!activeUser) {
      return <div> </div>;
    }

    const { open } = this.props;

    return (
      <div>
        <Layout
          query={parseQuery(location.search)}
          history={history}
          title={`${activeUser.scope_account.name}`}
          user={activeUser.user}
          callback={history.push}
        />
        <div className="container__wrap">
          <Switch>
            <Route path="/ui/selectaccount" component={SelectAccount} />
            <Route path={"/ui/accounts"} component={Accounts} />
            <Route path={"/ui/home"} component={Home} />
            <Route path={"/ui/advertisers"} component={Advertisers} />
            <Route path={"/ui/campaigns"} component={Campaigns} />
            <Route path={"/ui/flights"} component={Flights} />
            <Route path={"/ui/placements"} component={Placements} />
            <Route path={"/ui/publishers"} component={Publishers} />
            <Route path={"/ui/integrations"} component={Integrations} />
            <Route path={"/ui/marketplaces"} component={Marketplaces} />
            <Route path={"/ui/users"} component={Users} />
            <Route path={"/ui/conversion"} component={ConvAnalytics} />
            <Route path={"/ui/lists"} component={DomainLists} />
            <Route path={"/ui/bundles"} component={BundleLists} />
            <Route path={"/ui/apps"} component={AppLists} />
            <Route path={"/ui/ips"} component={IpLists} />
            <Route path={"/ui/iflights/:id"} component={IFlights} />
            <Route path={"/ui/flights"} component={Flights} />
            <Route path={"/ui/flight/:status/:id"} component={Flight} />
            <Route path={"/ui/placement/:status/:id"} component={Placement} />

            <Route path={"/ui/rejections"} component={Rejections} />
            <Route path={"/ui/analytics"} component={Analytics} />
            <Route path={"/ui/publisher/:id"} component={Publisher} />
            <Route path={"/ui/list/:status/:id"} component={DomainList} />
            <Route path={"/ui/bundle/:status/:id"} component={BundleList} />
            <Route path={"/ui/app/:status/:id"} component={AppList} />
            <Route path={"/ui/ip/:status/:id"} component={IpList} />
            <Route path={"/ui/advertiser/:id"} component={Advertiser} />
            <Route path={"/ui/account/:id"} component={Account} />
            <Route path={"/ui/campaign/:id"} component={Campaign} />

            <Route path="/ui/reporting" component={Reporting} />

            <Route path={"/ui/advertiserpage"} component={Advertiserpage} />
            <Route path="*" component={Notfound} />

            {/* <Route exact path="*" component={LogIn} />  */}
          </Switch>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { activeUser } = state.shared;
  const { open } = state.menu;

  return { activeUser, open };
};

export default connect(
  mapStateToProps,
  { readActiveUser }
)(Ui);
