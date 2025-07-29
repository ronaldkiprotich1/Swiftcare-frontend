import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';

const RedirectDashboard = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role === 'admin') {
      navigate('/admin/dashboard');
    } else if (user.role === 'doctor') {
      navigate('/doctor/dashboard');
    } else {
      navigate('/user/dashboard');
    }
  }, [user, navigate]);

  return null;
};

export default RedirectDashboard;
