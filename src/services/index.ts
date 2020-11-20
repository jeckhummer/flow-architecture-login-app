import { AuthServiceMock } from './authService';
import { ForgotPasswordFlowService } from './forgotPasswordFlowService';
import { LoginFlowService } from './loginFlowService';

export function buildServices() {
    const authService = new AuthServiceMock();
    const loginFlowService = new LoginFlowService(authService);
    const forgotPasswordFlowService = new ForgotPasswordFlowService(authService);

    return { forgotPasswordFlowService, loginFlowService, authService };
}
