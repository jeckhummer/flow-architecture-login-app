import { delay } from '../utils';
import { AuthFactor1Result, IAuthService, PasswordResetStep1Result } from './models';

export class AuthServiceMock implements IAuthService {
    public async login(username: string, password: string): Promise<AuthFactor1Result> {
        await delay(500);

        if (username === 'user') {
            if (password === 'password') {
                return {
                    result: 'success',
                    submitOtp: async otp => {
                        await delay(500);

                        if (otp === '1234') {
                            return { result: 'success' };
                        } else if (otp === '4321') {
                            return { result: 'failure', reason: 'code_expired' };
                        } else {
                            return { result: 'failure', reason: 'invalid_code' };
                        }
                    },
                    otpDestination: '+994 55 *** ** 39',
                };
            } else {
                return {
                    result: 'failure',
                    reason: 'password_expired',
                    changePassword: async (password: string) => {
                        await delay(500);

                        if (password === 'password') {
                            return {
                                result: 'failure',
                                reason: 'same_password',
                            };
                        } else if (password.length < 5) {
                            return {
                                result: 'failure',
                                reason: 'too_short',
                            };
                        } else {
                            return { result: 'success' };
                        }
                    },
                };
            }
        } else {
            return {
                result: 'failure',
                reason: 'invalid_credentials',
            };
        }
    }

    public async resetPassword(username: string): Promise<PasswordResetStep1Result> {
        await delay(500);

        if (username === 'user') {
            return {
                result: 'success',
                submitOtp: async otp => {
                    await delay(500);

                    if (otp === '1234') {
                        return {
                            result: 'success',
                            submitPassword: async (password: string) => {
                                await delay(500);

                                if (password === 'password') {
                                    return {
                                        result: 'failure',
                                        reason: 'old_password',
                                    };
                                } else if (password.length < 5) {
                                    return {
                                        result: 'failure',
                                        reason: 'too_short',
                                    };
                                } else {
                                    return { result: 'success' };
                                }
                            },
                        };
                    } else if (otp === '4321') {
                        return { result: 'failure', reason: 'code_expired' };
                    } else {
                        return { result: 'failure', reason: 'invalid_code' };
                    }
                },
                otpDestination: 'vas***im93@gmail.com',
            };
        } else {
            return {
                result: 'failure',
                reason: 'invalid_username',
            };
        }
    }
}
