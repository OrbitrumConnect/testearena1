-- Add user_type column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS user_type TEXT DEFAULT 'free' CHECK (user_type IN ('free', 'paid', 'vip', 'banned'));

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON profiles(user_type);

-- Update existing users to 'free' if null
UPDATE profiles SET user_type = 'free' WHERE user_type IS NULL;
