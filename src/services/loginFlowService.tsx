import * as React from 'react';
import { SemanticCOLORS } from 'semantic-ui-react/dist/commonjs/generic';
import { History } from 'history';

import { LoginForm } from '../components/LoginForm';
import { OtpForm } from '../components/OtpForm';
import { PasswordForm } from '../components/PasswordForm';

import { IAuthService, IFlowService } from './models';
import { Message } from '../components/Message';

export class LoginFlowService implements IFlowService {
    private readonly context: { username: string } = { username: '' };

    public constructor(private readonly authService: IAuthService) {}

    public runFlow = (
        setView: (params: { body: React.ReactNode; header: React.ReactNode; accentColor?: SemanticCOLORS }) => void,
        setMessage: (text: string, color: SemanticCOLORS) => void,
        setLoading: <T>(promise: Promise<T>) => Promise<T>,
        history: History,
    ): void => {
        const hereWeGoAgain = () => this.runFlow(setView, setMessage, setLoading, history);

        setView({
            body: (
                <LoginForm
                    predefinedUsername={this.context.username}
                    onSubmit={async (username, password) => {
                        this.context.username = username;
                        const factor1Response = await setLoading(this.authService.login(username, password));

                        if (factor1Response.result === 'success') {
                            setView({
                                body: (
                                    <OtpForm
                                        onGoBack={hereWeGoAgain}
                                        onSubmit={async otp => {
                                            const factor2Response = await setLoading(factor1Response.submitOtp(otp));

                                            if (factor2Response.result === 'success') {
                                                setView({
                                                    body: (
                                                        <Message
                                                            onClick={hereWeGoAgain}
                                                            buttonLabel="Run login flow again"
                                                            icon={{ name: 'hand peace outline' }}
                                                        />
                                                    ),
                                                    accentColor: 'green',
                                                    header: 'You have successfully logged in!',
                                                });
                                            } else if (factor2Response.result === 'failure') {
                                                if (factor2Response.reason === 'code_expired') {
                                                    setMessage(
                                                        'OTP has expired. Please reload this page and log in again.',
                                                        'yellow',
                                                    );
                                                } else if (factor2Response.reason === 'invalid_code') {
                                                    setMessage('OTP you entered is incorrect.', 'red');
                                                }
                                            }
                                        }}
                                    />
                                ),
                                header: `OTP was sent to ${factor1Response.otpDestination}`,
                            });
                        } else if (factor1Response.result === 'failure') {
                            if (factor1Response.reason === 'invalid_credentials') {
                                setMessage('Invalid credentials. Try again!', 'red');
                            } else if (factor1Response.reason === 'password_expired') {
                                setView({
                                    body: (
                                        <PasswordForm
                                            onGoBack={hereWeGoAgain}
                                            onSubmit={async password => {
                                                const changePasswordResponse = await setLoading(
                                                    factor1Response.changePassword(password),
                                                );

                                                if (changePasswordResponse.result === 'success') {
                                                    setView({
                                                        body: (
                                                            <Message
                                                                onClick={hereWeGoAgain}
                                                                buttonLabel="Login again"
                                                                icon={{ name: 'check' }}
                                                            />
                                                        ),
                                                        header: 'Password was successfully changed',
                                                        accentColor: 'green',
                                                    });
                                                } else if (changePasswordResponse.result === 'failure') {
                                                    if (changePasswordResponse.reason === 'same_password') {
                                                        setMessage(
                                                            'You entered the old password. Please provide a new one.',
                                                            'red',
                                                        );
                                                    } else if (changePasswordResponse.reason === 'too_short') {
                                                        setMessage(
                                                            'Password you entered is too short. It should be at least 5 characters long.',
                                                            'red',
                                                        );
                                                    }
                                                }
                                            }}
                                        />
                                    ),
                                    accentColor: 'yellow',
                                    header: 'Your password expired!',
                                });
                                setMessage('Please set a new one. It should be at least 5 characters long.', 'yellow');
                            }
                        }
                    }}
                />
            ),
            header: 'Log-in to your account',
            accentColor: 'blue',
        });
    };
}
