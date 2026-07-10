export interface SurveyResponses {
  // Section A: Demographics
  age_group: string;
  gender: string;
  current_status: string;
  district: string;
  city_town: string;
  residence_type: string;
  income_status: string;
  monthly_income: string; // Conditional

  // Section B: Budgeting & Saving
  budgeting_frequency: string;
  saving_status: string;
  saving_amount: string; // Conditional
  emergency_fund_status: string;
  emergency_fund_duration: string; // Conditional

  // Section C: UPI
  upi_frequency: string;
  upi_spending_impact: string; // Conditional

  // Section D: Quick-Commerce
  qc_frequency: string;
  qc_reason: string; // Conditional
  qc_impulsive_spending: string; // Conditional

  // Section E: Loans
  credit_facilities_used: string[];
  loan_awareness: string; // Conditional
  credit_related_stress: string; // Conditional

  // Section F: Investment
  investment_status: string;
  investment_amount: string; // Conditional
  investment_types: string[]; // Conditional
  investment_platform: string; // Conditional
  barriers_to_investing: string[]; // Conditional

  // Section G: Knowledge
  inflation_awareness: string;
  literacy_q14_answer: string;
  literacy_q15_answer: string;
  literacy_q16_answer: string;

  // Section H: Mindset
  financial_mindset: string;
  financial_information_source: string;
  financial_confidence: string;
  opinion_financial_education: string;
  optional_learning_topic: string; // Optional
}

export const initialSurveyState: SurveyResponses = {
  age_group: '',
  gender: '',
  current_status: '',
  district: '',
  city_town: '',
  residence_type: '',
  income_status: '',
  monthly_income: '',
  
  budgeting_frequency: '',
  saving_status: '',
  saving_amount: '',
  emergency_fund_status: '',
  emergency_fund_duration: '',
  
  upi_frequency: '',
  upi_spending_impact: '',
  
  qc_frequency: '',
  qc_reason: '',
  qc_impulsive_spending: '',
  
  credit_facilities_used: [],
  loan_awareness: '',
  credit_related_stress: '',
  
  investment_status: '',
  investment_amount: '',
  investment_types: [],
  investment_platform: '',
  barriers_to_investing: [],
  
  inflation_awareness: '',
  literacy_q14_answer: '',
  literacy_q15_answer: '',
  literacy_q16_answer: '',
  
  financial_mindset: '',
  financial_information_source: '',
  financial_confidence: '',
  opinion_financial_education: '',
  optional_learning_topic: ''
};
