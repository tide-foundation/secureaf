import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTideCloak } from '@tidecloak/react';

export default function AuthRedirect() {
  const navigate = useNavigate();
  const { authenticated } = useTideCloak();

  useEffect(() => {
    if (authenticated) {
      navigate('/vault');
    } else {
      navigate('/');
    }
  }, [authenticated, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  );
}