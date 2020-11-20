import * as React from 'react';
import { Link } from 'react-router-dom';
import { Form, Button } from 'semantic-ui-react';

interface IProps {
    onSubmit: (username: string, password: string) => Promise<unknown>;
    predefinedUsername: string;
}

export const LoginForm: React.FC<IProps> = ({ onSubmit, predefinedUsername }) => {
    const [username, setUsername] = React.useState(predefinedUsername || 'user');
    const [password, setPassword] = React.useState('password');

    const handleSubmit = React.useCallback(() => onSubmit(username, password), [username, password]);

    return (
        <Form size="large">
            <Form.Input
                fluid
                icon="user"
                iconPosition="left"
                placeholder="Username"
                onChange={({ target: { value } }) => setUsername(value)}
                value={username}
            />
            <Form.Input
                fluid
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                type="password"
                onChange={({ target: { value } }) => setPassword(value)}
                value={password}
            />
            <Button primary fluid size="large" onClick={handleSubmit}>
                Login
            </Button>
            <div style={{ marginTop: 10 }}>
                <Link to={'/forgot-password' + (username ? `?username=${username}` : '')}>Forgot password?</Link>
            </div>
        </Form>
    );
};
