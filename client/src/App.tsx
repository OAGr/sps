import * as React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import ApolloClient, { createNetworkInterface } from "apollo-client";
import { ApolloProvider } from "react-apollo";
import { createStore, combineReducers } from "redux";
import "bootstrap/dist/css/bootstrap.min.css";

const { SERVER_URL } = process.env;
// const networkInterface = createNetworkInterface({ uri: process.env.REACT_APP_SERVER_URL });
const networkInterface = createNetworkInterface({ uri: "localhost:3000" });
const reduxDevtoolsMiddleware: any =
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__();

const client = new ApolloClient({
  networkInterface,
  dataIdFromObject: (o: { id: string }) => o.id,
});

const store = createStore(
  reduxDevtoolsMiddleware
);

export class Layout extends React.Component {
  public render() {
    return (
      <div className="container">
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
    <Route exact={true} path="/" component={LandingPage} />
    <Route exact={true} path="/questions:questionId" component={LandingPage} />
  </div>
);

class App extends React.Component {
  public render() {
    return (
      <ApolloProvider store={store} client={client}>
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
