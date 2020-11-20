import { SemanticCOLORS } from 'semantic-ui-react/dist/commonjs/generic';
import { History } from 'history';

export interface IFlowService {
    runFlow(
        setView: (params: { body: React.ReactNode; header: React.ReactNode; accentColor?: SemanticCOLORS }) => void,
        setMessage: (text: string, color: SemanticCOLORS) => void,
        setLoading: <T>(promise: Promise<T>) => Promise<T>,
        history: History,
    ): void;
}

export type AuthFactor1Result =
    | { result: 'success'; submitOtp: (otp: string) => Promise<AuthFactor2Result>; otpDestination: string }
    | { result: 'failure'; reason: 'invalid_credentials' }
    | {
          result: 'failure';
          reason: 'password_expired';
          changePassword: (password: string) => Promise<PasswordChangeResult>;
      };
export type PasswordChangeResult = { result: 'success' } | { result: 'failure'; reason: 'same_password' | 'too_short' };
export type AuthFactor2Result = { result: 'success' } | { result: 'failure'; reason: 'invalid_code' | 'code_expired' };
export type PasswordResetStep1Result =
    | { result: 'success'; submitOtp: (otp: string) => Promise<PasswordResetStep2Result>; otpDestination: string }
    | { result: 'failure'; reason: 'invalid_username' };
export type PasswordResetStep2Result =
    | { result: 'success'; submitPassword: (password: string) => Promise<PasswordResetStep3Result> }
    | { result: 'failure'; reason: 'invalid_code' | 'code_expired' };
export type PasswordResetStep3Result =
    | { result: 'success' }
    | { result: 'failure'; reason: 'old_password' | 'too_short' };

export interface IAuthService {
    login(username: string, password: string): Promise<AuthFactor1Result>;
    resetPassword(username: string): Promise<PasswordResetStep1Result>;
}
