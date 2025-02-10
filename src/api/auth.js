import { supabase } from '../lib/supabase';

export const login = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
  return data;
};

export const register = async ({ email, password, username }) => {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password
  });

  if (authError) throw authError;

  // Create user profile
  const { error: profileError } = await supabase
    .from('users')
    .insert([
      {
        id: authData.user.id,
        email,
        username
      }
    ]);

  if (profileError) throw profileError;

  return authData;
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};