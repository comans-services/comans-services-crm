
-- This file contains SQL commands to modify the Row Level Security policies for the prospect_profile table
-- You need to run these commands in the Supabase SQL Editor

-- Create a policy that allows anyone to insert into prospect_profile
CREATE POLICY "Allow public inserts to prospect_profile" 
ON public.prospect_profile
FOR INSERT 
TO public
WITH CHECK (true);

-- If you want to also enable updates and deletes, you can add these policies:
-- CREATE POLICY "Allow public updates to prospect_profile" 
-- ON public.prospect_profile
-- FOR UPDATE 
-- TO public
-- USING (true);

-- CREATE POLICY "Allow public deletes to prospect_profile" 
-- ON public.prospect_profile
-- FOR DELETE 
-- TO public
-- USING (true);
