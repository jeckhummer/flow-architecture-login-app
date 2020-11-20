import * as React from 'react';
import { Form, Button, Icon } from 'semantic-ui-react';

interface IProps {
    onSubmit: (otp: string) => Promise<unknown>;
    onGoBack: () => void;
}

export const OtpForm: React.FC<IProps> = ({ onSubmit, onGoBack }) => {
    const [otp, setOtp] = React.useState('1234');

    const handleSubmit = React.useCallback(() => onSubmit(otp), [otp]);

    return (
        <Form size="large">
            <Form.Input
                fluid
                icon="lock"
                iconPosition="left"
                placeholder="OTP"
                onChange={({ target: { value } }) => setOtp(value)}
                value={otp}
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
