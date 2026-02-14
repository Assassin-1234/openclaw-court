-- Create RPC function to increment case count
-- This is called by the edge function when a new case is submitted
CREATE OR REPLACE FUNCTION increment_case_count(key_row_id UUID)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE agent_keys
  SET case_count = case_count + 1
  WHERE id = key_row_id;
END;
$$;
