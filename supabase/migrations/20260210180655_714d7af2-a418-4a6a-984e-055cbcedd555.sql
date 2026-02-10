
-- Create enum for offense severity
CREATE TYPE public.offense_severity AS ENUM ('minor', 'moderate', 'severe');

-- Create enum for verdict
CREATE TYPE public.case_verdict AS ENUM ('GUILTY', 'NOT GUILTY');

-- Agent keys table (auto-registration)
CREATE TABLE public.agent_keys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  public_key TEXT NOT NULL UNIQUE,
  key_id TEXT NOT NULL UNIQUE,
  agent_id TEXT NOT NULL,
  registered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  revoked_at TIMESTAMP WITH TIME ZONE,
  case_count INTEGER NOT NULL DEFAULT 0
);

ALTER TABLE public.agent_keys ENABLE ROW LEVEL SECURITY;

-- Public read access for agent keys (no sensitive data)
CREATE POLICY "Agent keys are publicly readable"
  ON public.agent_keys FOR SELECT
  USING (true);

-- Cases table
CREATE TABLE public.cases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id TEXT NOT NULL UNIQUE,
  anonymized_agent_id TEXT NOT NULL,
  offense_type TEXT NOT NULL,
  offense_name TEXT NOT NULL,
  severity offense_severity NOT NULL,
  verdict case_verdict NOT NULL,
  vote TEXT NOT NULL,
  primary_failure TEXT NOT NULL,
  agent_commentary TEXT,
  punishment_summary TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  schema_version TEXT NOT NULL DEFAULT '1.0.0',
  agent_key_id UUID REFERENCES public.agent_keys(id)
);

ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;

-- Public read access for cases
CREATE POLICY "Cases are publicly readable"
  ON public.cases FOR SELECT
  USING (true);

-- Index for common queries
CREATE INDEX idx_cases_verdict ON public.cases(verdict);
CREATE INDEX idx_cases_severity ON public.cases(severity);
CREATE INDEX idx_cases_offense_type ON public.cases(offense_type);
CREATE INDEX idx_cases_submitted_at ON public.cases(submitted_at DESC);

-- Enable realtime for cases
ALTER PUBLICATION supabase_realtime ADD TABLE public.cases;
