import * as React from 'react';
import { SemanticCOLORS } from 'semantic-ui-react/dist/commonjs/generic';
import { History } from 'history';
import * as qs from 'qs';

import { OtpForm } from '../components/OtpForm';

import { IAuthService, IFlowService } from './models';
import { UsernameForm } from '../components/UsernameForm';
import { PasswordForm } from '../components/PasswordForm';
import { Message } from '../components/Message';

export class ForgotPasswordFlowService implements IFlowService {
    public constructor(private readonly authService: IAuthService) {}

    public runFlow = (
        setView: (params: { body: React.ReactNode; header: React.ReactNode; accentColor?: SemanticCOLORS }) => void,
        setMessage: (text: string, color: SemanticCOLORS) => void,
        setLoading: <T>(promise: Promise<T>) => Promise<T>,
        history: History,
    ): void => {
        const goToLogin = () => history.push('/');
        const username = qs.parse(history.location.search, { ignoreQueryPrefix: true }).username?.toString();

        setView({
            body: (
                <UsernameForm
                    onGoBack={goToLogin}
                    predefinedUsername={username}
                    onSubmit={async username => {
                        const step1Response = await setLoading(this.authService.resetPassword(username));

                        if (step1Response.result === 'success') {
                            setView({
                                body: (
                                    <OtpForm
                                        onGoBack={goToLogin}
                                        onSubmit={async otp => {
                                            const step2Response = await setLoading(step1Response.submitOtp(otp));

                                            if (step2Response.result === 'success') {
                                                setView({
                                                    body: (
                                                        <PasswordForm
                                                            onGoBack={goToLogin}
                                                            onSubmit={async password => {
                                                                const step3Response = await setLoading(
                                                                    step2Response.submitPassword(password),
                                                                );

                                                                if (step3Response.result === 'failure') {
                                                                    if (step3Response.reason === 'old_password') {
                                                                        setMessage(
                                                                            'You entered the old password. Please provide a new one.',
                                                                            'red',
                                                                        );
                                                                    } else if (step3Response.reason === 'too_short') {
                                                                        setMessage(
                                                                            'Password you entered is too short. It should be at least 5 characters long.',
                                                                            'red',
                                                                        );
                                                                    }
                                                                } else {
                                                                    setView({
                                                                        body: (
                                                                            <Message
                                                                                onClick={goToLogin}
                                                                                buttonLabel="Login again"
                                                                                icon={{ name: 'check' }}
                                                                            />
                                                                        ),
                                                                        header: 'Password was successfully changed',
                                                                        accentColor: 'green',
                                                                    });
                                                                }
                                                            }}
                                                        />
                                                    ),
                                                    accentColor: 'yellow',
                                                    header: 'Enter new password',
                                                });
                                            } else if (step2Response.result === 'failure') {
                                                if (step2Response.reason === 'code_expired') {
                                                    setMessage(
                                                        'OTP has expired. Please reload this page and log in again.',
                                                        'yellow',
                                                    );
                                                } else if (step2Response.reason === 'invalid_code') {
                                                    setMessage('OTP you entered is incorrect.', 'red');
                                                }
                                            }
                                        }}
                                    />
                                ),
                                header: `OTP was sent to ${step1Response.otpDestination}`,
                                accentColor: 'yellow',
                            });
                        } else if (step1Response.result === 'failure') {
                            setMessage('Username you entered is incorrect.', 'red');
                        }
                    }}
                />
            ),
            header: 'Enter username',
            accentColor: 'yellow',
        });
    };
}
