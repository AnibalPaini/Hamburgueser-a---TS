import type { AuthState, AuthAction } from "./auth.type";

export const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false, 
  loading: true,
};
export const authReducer = (
    state: AuthState,
    action: AuthAction
): AuthState => {
    switch (action.type) {
        case "SET_USER":
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
                loading: false,
            };
        case "LOGOUT":
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                loading: false,
            };
        case "SET_LOADING":
            return {
                ...state,
                loading: action.payload,
            };
        default:
            return state;
    }
}