-- Database Schema for Gen Z Financial Literacy Survey

-- Create responses table
CREATE TABLE IF NOT EXISTS public.survey_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Demographics (Section A)
    age_group TEXT NOT NULL,
    gender TEXT NOT NULL,
    current_status TEXT NOT NULL,
    district TEXT NOT NULL,
    city_town TEXT,
    residence_type TEXT NOT NULL,
    income_status TEXT NOT NULL,
    monthly_income TEXT,
    
    -- Budgeting and Saving (Section B)
    budgeting_frequency TEXT NOT NULL,
    saving_status TEXT NOT NULL,
    saving_amount TEXT,
    emergency_fund_status TEXT NOT NULL,
    emergency_fund_duration TEXT,
    
    -- UPI and Digital Spending (Section C)
    upi_frequency TEXT NOT NULL,
    upi_spending_impact TEXT,
    
    -- Quick-Commerce Spending (Section D)
    qc_frequency TEXT NOT NULL,
    qc_reason TEXT,
    qc_impulsive_spending TEXT,
    
    -- Loans, Credit and BNPL (Section E)
    credit_facilities_used TEXT[] NOT NULL,
    loan_awareness TEXT,
    credit_related_stress TEXT,
    
    -- Investment Behaviour (Section F)
    investment_status TEXT NOT NULL,
    investment_amount TEXT,
    investment_types TEXT[],
    investment_platform TEXT,
    barriers_to_investing TEXT[],
    
    -- Financial Mindset & Knowledge (Section G & H)
    inflation_awareness TEXT NOT NULL,
    financial_mindset TEXT NOT NULL,
    financial_information_source TEXT NOT NULL,
    financial_confidence TEXT NOT NULL,
    opinion_financial_education TEXT NOT NULL,
    optional_learning_topic TEXT,
    
    -- Raw answers for Literacy calculation
    literacy_q14_answer TEXT NOT NULL,
    literacy_q15_answer TEXT NOT NULL,
    literacy_q16_answer TEXT NOT NULL,
    
    -- Calculated Score
    literacy_score INTEGER NOT NULL,
    literacy_category TEXT NOT NULL,
    
    consent_status BOOLEAN NOT NULL DEFAULT true
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (anyone can submit a survey)
CREATE POLICY "Allow anonymous inserts" ON public.survey_responses
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Allow authenticated users (admins) to select all responses
CREATE POLICY "Allow authenticated read access" ON public.survey_responses
    FOR SELECT
    TO authenticated
    USING (true);

-- Allow authenticated users to delete responses
CREATE POLICY "Allow authenticated delete access" ON public.survey_responses
    FOR DELETE
    TO authenticated
    USING (true);

-- Note: Admin users are managed via Supabase Auth (auth.users)
