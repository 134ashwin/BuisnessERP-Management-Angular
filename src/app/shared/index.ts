/**
 * Shared Index File
 * Central export point for all shared services, models, validators, and utilities
 * Usage: import { AuthService, CustomValidators, StringUtils } from '@shared'
 */

// ============ Services ============
export { AuthService } from './services/auth.service';
export { BaseHttpService } from './services/base-http.service';
export { StorageService } from './services/storage.service';

// ============ Validators ============
export { CustomValidators } from './validators/custom.validators';

// ============ Models & Types ============
export type { User, IUser } from './models/user.model';
export type {
  IAuthResponse,
  IUserData,
  ILoginRequest,
  IForgotPasswordRequest,
  IResetPasswordRequest
} from './models/auth.model';
export type { IApiResponse, IPaginatedResponse } from './models/api.model';
export type {
  HttpMethod,
  IRequestConfig,
  IResponseError,
  IPage,
  ILoadingState,
  LoadingStatus,
  IAsyncState
} from './types/common.types';

// ============ Utilities ============
export { StringUtils, DateUtils, ArrayUtils } from './utils/common.utils';

// ============ Constants ============
export { APP_CONSTANTS, API_ENDPOINTS } from './constants/app.constants';
