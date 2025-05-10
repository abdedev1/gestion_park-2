import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '../features/auth/authSlice';
import Auth from '../services/Auth';
import Cookies from 'js-cookie';

export default function useAuth() {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    const initializeAuth = async () => {
      const tokenFromCookie = Cookies.get('token');
      
      if (tokenFromCookie) {
        try {
          Auth.setBearerToken(tokenFromCookie);
          
          const response = await Auth.GetUser();
          
          if (response.success) {
            dispatch(login({
              user: response.user,
              token: tokenFromCookie
            }));
          } else {
            dispatch(logout());
            Cookies.remove('token');
          }
        } catch (error) {
          console.error('Failed to load user:', error);
          dispatch(logout());
          Cookies.remove('token');
        }
      } else {
        dispatch(logout());
      }
    };

    initializeAuth();
  }, [dispatch]);

  return {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading: !user && !!Cookies.get('token')
  };
}