/*
  # Fix user registration and RLS policies

  1. Changes
    - Drop existing RLS policies for users table
    - Add new policies to allow user registration
    - Update users table to handle registration properly

  2. Security
    - Enable RLS on users table
    - Add policies for:
      - Public insert during registration
      - Authenticated users can read/update their own data
*/

-- First, ensure RLS is enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies for users table
DROP POLICY IF EXISTS "Users can read their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;

-- Create new policies
-- Allow public registration
CREATE POLICY "Enable insert for public registration"
ON users
FOR INSERT
TO public
WITH CHECK (true);

-- Allow users to read their own data
CREATE POLICY "Users can read own data"
ON users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Allow users to update their own data
CREATE POLICY "Users can update own data"
ON users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);