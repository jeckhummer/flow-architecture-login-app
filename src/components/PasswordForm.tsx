import * as React from 'react';
import { Form, Button, Icon } from 'semantic-ui-react';

interface IProps {
    onSubmit: (password: string) => Promise<unknown>;
    onGoBack: () => void;
}

export const PasswordForm: React.FC<IProps> = ({ onSubmit, onGoBack }) => {
    const [password, setPassword] = React.useState('password2');

    const handleSubmit = React.useCallback(() => onSubmit(password), [password]);

    return (
        <Form size="large">
            <Form.Input
                fluid
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                type="password"
                onChange={({ target: { value } }) => setPassword(value)}
                value={password}
            />
            <Button onClick={onGoBack} size="large" basic icon labelPosition="left">
                Back
                <Icon name="arrow left" />
            </Button>
            <Button onClick={handleSubmit} size="large" primary color="blue" icon labelPosition="right">
                Change password
                <Icon name="arrow right" />
            </Button>
        </Form>
    );
};
