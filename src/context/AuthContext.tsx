
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

type UserRole = 'creator' | 'viewer';

type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  profile_picture: string | null;
};

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  userRole: UserRole | null;
  loading: boolean;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  updateUserRole: (role: UserRole) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch user profile and role
  const fetchUserProfile = async (userId: string) => {
    try {
      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;
      
      // Fetch user role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (roleError) throw roleError;

      setProfile(profileData);
      setUserRole(roleData.role);
    } catch (error: any) {
      console.error('Error fetching user data:', error.message);
    }
  };

  // Setup auth state listener
  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // Use setTimeout to avoid potential recursive RLS issues
        setTimeout(() => {
          fetchUserProfile(session.user.id);
        }, 0);
      } else {
        setProfile(null);
        setUserRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sign up a new user
  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName
          }
        }
      });

      if (error) throw error;
      
      toast({
        title: 'Account created!',
        description: 'Please check your email for the confirmation link.',
      });
      
      navigate('/auth/login');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  // Sign in an existing user
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      
      toast({
        title: 'Welcome back!',
        description: 'You have successfully signed in.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      navigate('/');
      
      toast({
        title: 'Signed out',
        description: 'You have been signed out successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  // Update user profile
  const updateProfile = async (data: Partial<Profile>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);
      
      if (error) throw error;

      setProfile(prev => prev ? { ...prev, ...data } : null);
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  // Update user role (admin function)
  const updateUserRole = async (role: UserRole) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role })
        .eq('user_id', user.id);
      
      if (error) throw error;

      setUserRole(role);
      
      toast({
        title: 'Role updated',
        description: `Your role has been updated to ${role}.`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        userRole,
        loading,
        signUp,
        signIn,
        signOut,
        updateProfile,
        updateUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const ProtectedRoute: React.FC<{ 
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}> = ({ children, allowedRoles }) => {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth/login', { replace: true });
    } else if (!loading && user && allowedRoles && !allowedRoles.includes(userRole as UserRole)) {
      navigate('/not-authorized', { replace: true });
    }
  }, [user, userRole, loading, allowedRoles, navigate]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(userRole as UserRole)) {
    return null;
  }

  return <>{children}</>;
};
