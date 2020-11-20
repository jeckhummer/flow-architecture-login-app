import * as React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

import { buildServices } from '../services';
import { FlowManager } from './FlowManager';
import { Layout } from './Layout';

const App: React.FC = () => {
    const { loginFlowService, forgotPasswordFlowService } = React.useMemo(buildServices, []);

    return (
        <BrowserRouter>
            <Layout>
                <Switch>
                    <Route path="/" exact>
                        <FlowManager key="login" service={loginFlowService} />
                    </Route>
                    <Route path="/forgot-password" exact>
                        <FlowManager key="forgot-password" service={forgotPasswordFlowService} />
                    </Route>
                    <Redirect to="/" />
                </Switch>
            </Layout>
        </BrowserRouter>
    );
};

export default App;
