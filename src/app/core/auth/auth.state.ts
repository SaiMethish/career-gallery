import { CurrentUser } from '../models/auth.model';
import { ApiError } from '../models/api-error.model';

/** Shape of the auth feature slice in the NgRx store */
export interface AuthState {
  currentUser: CurrentUser | null;
  accessToken: string | null;
  isLoading: boolean;
  isRefreshing: boolean;
  sessionRestored: boolean;
  error: ApiError | null;
}

export const initialAuthState: AuthState = {
  currentUser: null,
  accessToken: null,
  isLoading: false,
  isRefreshing: false,
  sessionRestored: false,
  error: null,
};
