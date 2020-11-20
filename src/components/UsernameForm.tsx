import * as React from 'react';
import { Form, Button, Icon } from 'semantic-ui-react';

interface IProps {
    onSubmit: (username: string) => Promise<unknown>;
    predefinedUsername?: string;
    onGoBack: () => void;
}

export const UsernameForm: React.FC<IProps> = ({ onSubmit, predefinedUsername, onGoBack }) => {
    const [username, setUsername] = React.useState(predefinedUsername || '');

    const handleSubmit = React.useCallback(() => onSubmit(username), [username]);

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
            <Button onClick={onGoBack} size="large" basic icon labelPosition="left">
                Back
                <Icon name="arrow left" />
            </Button>
            <Button onClick={handleSubmit} size="large" primary color="blue" icon labelPosition="right">
                Submit
                <Icon name="arrow right" />
            </Button>
        </Form>
    );
};
