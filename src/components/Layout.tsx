import * as React from 'react';
import { Grid } from 'semantic-ui-react';

export const Layout: React.FC = ({ children }) => (
    <Grid textAlign="center" style={{ height: '100vh' }} verticalAlign="middle">
        <Grid.Column style={{ maxWidth: 480 }}>{children}</Grid.Column>
    </Grid>
);
