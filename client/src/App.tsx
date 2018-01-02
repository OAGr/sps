import * as React from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import ApolloClient from "apollo-client";
import { ApolloProvider } from "react-apollo";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createStore, combineReducers } from "redux";
import { EntityIndex } from "./pages/EntityIndex";
import { EntityShow } from "./pages/EntityShow";
import { EntityEdit } from "./pages/EntityEdit";
import { MetricIndex } from "./pages/MetricIndex";
import { PropertyIndex } from "./pages/PropertyIndex";
import { MetricShow } from "./pages/MetricShow";
import { NewMetricForm } from "./pages/NewMetricForm";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "react-datasheet/lib/react-datasheet.css";
import { PropertyEdit } from "./pages/PropertyEdit";
import { CategoryNew } from "./pages/CategoryNew";

const { SERVER_URL } = process.env;
// const networkInterface = createNetworkInterface({ uri: process.env.REACT_APP_SERVER_URL });
const reduxDevtoolsMiddleware: any =
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__();

const client: any = new ApolloClient({
  link: new HttpLink({ uri: SERVER_URL || "http://localhost:8080/graphql" }),
  cache: new InMemoryCache(),
});

const store = createStore(
  reduxDevtoolsMiddleware
);

const AdminHeader = () => {
  return (
  <Navbar>
  <Navbar.Header>
    <Navbar.Brand>
      <Link to="/properties/">Admin Section</Link>
    </Navbar.Brand>
  </Navbar.Header>
  <Nav>
    <LinkContainer to="/admin/entities/edit">
      <NavItem eventKey={2}>Entities</NavItem>
    </LinkContainer>
    <LinkContainer to="/admin/properties/edit">
      <NavItem eventKey={1}>Categories</NavItem>
    </LinkContainer>
    <LinkContainer to="/admin/metrics/new">
      <NavItem eventKey={4}>New Metric</NavItem>
    </LinkContainer>
    <LinkContainer to="/admin/categories/new">
      <NavItem eventKey={4}>New Category</NavItem>
    </LinkContainer>
  </Nav>
</Navbar>
  );
};

const ViewingHeader = () => {
  return (
  <Navbar>
  <Navbar.Header>
    <Navbar.Brand>
      <Link to="/entities">Simple Prediction System</Link>
    </Navbar.Brand>
  </Navbar.Header>
  <Nav>
    <LinkContainer to="/entities">
      <NavItem eventKey={3} href="/entities">Entities</NavItem>
    </LinkContainer>
    <LinkContainer to="/metrics">
      <NavItem eventKey={2}>Metrics</NavItem>
    </LinkContainer>
  </Nav>
</Navbar>
  );
};

const Header = () => {
  const adminTest = /\/admin\//;
  const isAdmin = adminTest.test(window.location.href);
  if (isAdmin) {
    return (<AdminHeader/> );
  } else {
    return (<ViewingHeader/> );
  }
};

export class Layout extends React.Component {
  public render() {
    return (
      <div className="container-fluid">
        <Header/>
        <div className="app-content">{this.props.children}</div>
      </div>
    );
  }
}

const LandingPage = () => (
  <div>
    hi there!
  </div>
);

const Routes = () => (
  <div>
    <Route exact={true} path="/entities" component={EntityIndex} />
    <Route path="/entities/:entityId" component={EntityShow} />
    <Route exact={true} path="/metrics" component={MetricIndex} />
    <Route exact={true} path="/properties" component={PropertyIndex} />
    <Route exact={true} path="/metrics/:metricId" component={MetricShow} />
    <Route exact={true} path="/admin/entities/edit" component={EntityEdit} />
    <Route exact={true} path="/admin/metrics/new" component={NewMetricForm} />
    <Route exact={true} path="/admin/properties/edit" component={PropertyEdit} />
    <Route exact={true} path="/admin/categories/new" component={CategoryNew} />
  </div>
);

class App extends React.Component {
  public render() {
    return (
      <ApolloProvider client={client}>
        <BrowserRouter>
          <Layout>
            <Routes />
          </Layout>
        </BrowserRouter>
      </ApolloProvider>
    );
  }
}

export { App };
