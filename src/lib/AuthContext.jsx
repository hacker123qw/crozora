import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { supabase } from '@/lib/supabase';

const AuthContext = createContext(null);

function inferAuthErrorType(error) {
  const message = String(error?.message || '').toLowerCase();
  const code = String(error?.code || '').toLowerCase();
  const status = Number(error?.status || 0);

  const userMissing = [
    'user not found',
    'user from sub claim in jwt does not exist',
    'account no longer exists',
    'account is no longer available',
    'jwt user does not exist',
  ].some((pattern) => message.includes(pattern));

  if (userMissing) {
    return 'user_not_registered';
  }

  if (code === 'invalid_credentials' || message.includes('invalid login credentials')) {
    return 'invalid_credentials';
  }

  if (status === 401 || code === 'jwt_expired' || message.includes('jwt expired')) {
    return 'session_expired';
  }

  return 'unknown';
}

const getAuthErrorMessage = (error, fallbackMessage) => ({
  type: inferAuthErrorType(error),
  message: error?.message || fallbackMessage,
});

const clearClientAuthArtifacts = () => {
  sessionStorage.removeItem('crozora_biz');
  localStorage.removeItem('crozora_pending_verification_email');
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [appPublicSettings, setAppPublicSettings] = useState(null);

  const applySession = useCallback((nextSession) => {
    const nextUser = nextSession?.user ?? null;
    setSession(nextSession ?? null);
    setUser(nextUser);
    setIsAuthenticated(Boolean(nextUser));
    setAuthChecked(true);
    setIsLoadingAuth(false);
  }, []);

  const clearAuthState = useCallback(() => {
    clearClientAuthArtifacts();
    setSession(null);
    setUser(null);
    setIsAuthenticated(false);
    setAuthChecked(true);
    setIsLoadingAuth(false);
  }, []);

  const validateSession = useCallback(async (nextSession) => {
    if (!nextSession) {
      return null;
    }

    const { data, error } = await supabase.auth.getUser(nextSession.access_token);
    if (error || !data?.user) {
      throw error || new Error('This account no longer exists.');
    }

    return {
      ...nextSession,
      user: data.user,
    };
  }, []);

  const checkUserAuth = useCallback(async () => {
    try {
      setIsLoadingAuth(true);
      setAuthError(null);

      const { data, error } = await supabase.auth.getSession();
      if (error) {
        throw error;
      }

      const validSession = await validateSession(data.session);
      applySession(validSession);
      return validSession;
    } catch (error) {
      console.error('User auth check failed:', error);
      await supabase.auth.signOut().catch(() => {});
      clearAuthState();
      setAuthError(getAuthErrorMessage(error, 'Your account session is no longer valid. Please sign in again.'));
      return null;
    }
  }, [applySession, clearAuthState, validateSession]);

  const checkAppState = useCallback(async () => {
    setIsLoadingPublicSettings(true);
    setAuthError(null);
    setAppPublicSettings(null);
    await checkUserAuth();
    setIsLoadingPublicSettings(false);
  }, [checkUserAuth]);

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          throw error;
        }

        if (!mounted) {
          return;
        }

        setAuthError(null);
        setAppPublicSettings(null);
        setIsLoadingPublicSettings(false);
        const validSession = await validateSession(data.session);
        applySession(validSession);
      } catch (error) {
        if (!mounted) {
          return;
        }

        console.error('Auth bootstrap failed:', error);
        await supabase.auth.signOut().catch(() => {});
        clearAuthState();
        setIsLoadingPublicSettings(false);
        setAuthError(getAuthErrorMessage(error, 'Your saved session is no longer valid. Please sign in again.'));
      }
    };

    bootstrap();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      if (!mounted) {
        return;
      }

      try {
        setAuthError(null);
        const validSession = await validateSession(nextSession);
        applySession(validSession);
      } catch (error) {
        console.error('Auth state change validation failed:', error);
        await supabase.auth.signOut().catch(() => {});
        clearAuthState();
        setAuthError(getAuthErrorMessage(error, 'This account is no longer available. Please sign in again.'));
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [applySession, clearAuthState]);

  const signIn = useCallback(async ({ email, password }) => {
    setIsLoadingAuth(true);
    setAuthError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setIsLoadingAuth(false);
      setAuthError(getAuthErrorMessage(error, 'Failed to sign in'));
      return { data: null, error };
    }

    applySession(data.session);
    return { data, error: null };
  }, [applySession]);

  const signUp = useCallback(async ({ email, password, name, redirectTo }) => {
    setIsLoadingAuth(true);
    setAuthError(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo,
        data: {
          name,
        },
      },
    });

    if (error) {
      setIsLoadingAuth(false);
      setAuthError(getAuthErrorMessage(error, 'Failed to create account'));
      return { data: null, error };
    }

    applySession(data.session);
    return { data, error: null };
  }, [applySession]);

  const resetPassword = useCallback(async ({ email, redirectTo }) => {
    setAuthError(null);

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      setAuthError(getAuthErrorMessage(error, 'Failed to send reset email'));
      return { data: null, error };
    }

    return { data, error: null };
  }, []);

  const updatePassword = useCallback(async ({ password }) => {
    setIsLoadingAuth(true);
    setAuthError(null);

    const { data, error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setIsLoadingAuth(false);
      setAuthError(getAuthErrorMessage(error, 'Failed to update password'));
      return { data: null, error };
    }

    const { data: sessionData } = await supabase.auth.getSession();
    applySession(sessionData.session);
    return { data, error: null };
  }, [applySession]);

  const resendVerificationEmail = useCallback(async ({ email, redirectTo }) => {
    setAuthError(null);

    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    if (error) {
      setAuthError(getAuthErrorMessage(error, 'Failed to resend verification email'));
      return { data: null, error };
    }

    return { data, error: null };
  }, []);

  const logout = useCallback(async (shouldRedirect = true) => {
    try {
      setIsLoadingAuth(true);
      setAuthError(null);

      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }

      clearAuthState();
      if (shouldRedirect) {
        window.location.assign('/login');
      }
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoadingAuth(false);
      setAuthError(getAuthErrorMessage(error, 'Failed to sign out'));
    }
  }, [clearAuthState]);

  const navigateToLogin = useCallback(() => {
    window.location.assign('/login');
  }, []);

  const value = useMemo(() => ({
    user,
    session,
    isAuthenticated,
    isLoadingAuth,
    isLoadingPublicSettings,
    authError,
    appPublicSettings,
    authChecked,
    logout,
    navigateToLogin,
    checkUserAuth,
    checkAppState,
    signIn,
    signUp,
    resetPassword,
    updatePassword,
    resendVerificationEmail,
  }), [
    user,
    session,
    isAuthenticated,
    isLoadingAuth,
    isLoadingPublicSettings,
    authError,
    appPublicSettings,
    authChecked,
    logout,
    navigateToLogin,
    checkUserAuth,
    checkAppState,
    signIn,
    signUp,
    resetPassword,
    updatePassword,
    resendVerificationEmail,
  ]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
