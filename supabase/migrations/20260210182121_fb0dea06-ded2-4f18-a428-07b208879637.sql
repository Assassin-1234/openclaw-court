
-- Add proceedings JSONB column for detailed hearing data
ALTER TABLE public.cases ADD COLUMN proceedings jsonb DEFAULT NULL;

-- Comment explaining the expected shape
COMMENT ON COLUMN public.cases.proceedings IS 'JSON: { judge_statement, jury_deliberations: [{role, vote, reasoning}], evidence_summary, punishment_detail }';
