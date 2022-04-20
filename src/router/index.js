import React from 'react';
import dynamic from 'dva/dynamic';
import { routerRedux, Route, Switch, Redirect } from 'dva/router';
import App from '../module/app/components/App';
import Home from '../module/admin/routes/HomePage';
import routes from './router';

const { ConnectedRouter } = routerRedux;

export default function RouterConfig(props) {
  console.log("router.js-props", props);
  const { history, app } = props

  return (
    <ConnectedRouter history={history}>
      <App>
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/home" />} />
          <Route exact path="/home" component={Home} />
          {routes.map(({ path, ...dynamics }, key) => (
            <Route
              key={key}
              exact
              path={path}
              component={dynamic({
                app,
                ...dynamics
              })}
            />
          ))}
        </Switch>
      </App>
    </ConnectedRouter>
  );
}
