import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { BilingualText } from '../components/BilingualText';
import { LanguageToggle } from '../components/LanguageToggle';
import { SingleChoice, MultiChoice } from '../components/FormFields';
import { initialSurveyState } from '../types/survey';
import type { SurveyResponses } from '../types/survey';
import * as Q from '../data/questions';

export const Survey: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<SurveyResponses>(initialSurveyState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = (field: keyof SurveyResponses, value: any) => {
    setData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Handle conditional logic - clear hidden fields
      if (field === 'income_status' && value === 'No') {
        newData.monthly_income = '';
      }
      if (field === 'saving_status' && value === 'No') {
        newData.saving_amount = '';
      }
      if (field === 'emergency_fund_status' && value !== 'Yes') {
        newData.emergency_fund_duration = '';
      }
      if (field === 'upi_frequency' && value === 'Never') {
        newData.upi_spending_impact = '';
      }
      if (field === 'qc_frequency' && value === 'Never') {
        newData.qc_reason = '';
        newData.qc_impulsive_spending = '';
      }
      if (field === 'credit_facilities_used') {
        if (value.includes('None of the above') || value.length === 0) {
          newData.loan_awareness = '';
          newData.credit_related_stress = '';
        }
      }
      if (field === 'investment_status') {
        if (value !== 'Yes') {
          newData.investment_amount = '';
          newData.investment_types = [];
          newData.investment_platform = '';
        } else {
          newData.barriers_to_investing = [];
        }
      }

      return newData;
    });
  };

  const calculateScore = () => {
    let score = 0;
    if (data.literacy_q14_answer === 'It decreases') score++;
    if (data.literacy_q15_answer === '2%') score++;
    if (data.literacy_q16_answer === 'Interest is earned on the original amount and previously earned interest') score++;
    
    let category = '';
    if (score === 0) category = 'Very low financial literacy';
    else if (score === 1) category = 'Low financial literacy';
    else if (score === 2) category = 'Moderate financial literacy';
    else if (score === 3) category = 'High financial literacy';

    return { score, category };
  };

  const isFormValid = () => {
    // Basic validation check - just making sure required visible fields are filled
    // (A real app might have more exhaustive validation here, simplified for now)
    if (!data.age_group || !data.gender || !data.current_status || !data.district || !data.residence_type) return false;
    if (!data.income_status) return false;
    if (data.income_status !== 'No' && !data.monthly_income) return false;
    // Section B
    if (!data.budgeting_frequency || !data.saving_status || !data.emergency_fund_status) return false;
    if (data.saving_status !== 'No' && !data.saving_amount) return false;
    if (data.emergency_fund_status === 'Yes' && !data.emergency_fund_duration) return false;
    // Section C & D
    if (!data.upi_frequency) return false;
    if (data.upi_frequency !== 'Never' && !data.upi_spending_impact) return false;
    if (!data.qc_frequency) return false;
    if (data.qc_frequency !== 'Never' && (!data.qc_reason || !data.qc_impulsive_spending)) return false;
    // Section E
    if (data.credit_facilities_used.length === 0) return false;
    if (!data.credit_facilities_used.includes('None of the above') && (!data.loan_awareness || !data.credit_related_stress)) return false;
    // Section F
    if (!data.investment_status) return false;
    if (data.investment_status === 'Yes' && (!data.investment_amount || data.investment_types.length === 0 || !data.investment_platform)) return false;
    if (data.investment_status !== 'Yes' && data.barriers_to_investing.length === 0) return false;
    // Section G & H
    if (!data.inflation_awareness || !data.literacy_q14_answer || !data.literacy_q15_answer || !data.literacy_q16_answer) return false;
    if (!data.financial_mindset || !data.financial_information_source || !data.financial_confidence || !data.opinion_financial_education) return false;
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      setError('Please fill all required fields correctly.');
      window.scrollTo(0, 0);
      return;
    }

    setLoading(true);
    setError(null);
    const { score, category } = calculateScore();

    try {
      const { error: dbError } = await supabase.from('survey_responses').insert([{
        ...data,
        literacy_score: score,
        literacy_category: category,
        consent_status: true
      }]);

      if (dbError) throw dbError;
      navigate('/success');
    } catch (err) {
      console.error(err);
      setError('We could not save your response. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container survey-container animate-fade-in">
      <div className="header mb-8 flex justify-between items-center rounded-xl px-6 py-4 shadow-sm" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
        <div className="logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          Gen Z Finance
        </div>
        <LanguageToggle />
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-700 border border-red-200">
          <BilingualText 
            en={error.includes('internet') ? error : "Please complete all required fields before submitting."}
            ml={error.includes('internet') ? "Ningalude response save cheyyan kazhinjilla. Internet connection check cheythu veendum try cheyyuka." : "Dayavayi ellam required fields purippikkuka."}
          />
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Section A: Demographics */}
        <div className="survey-section">
          <h2 className="section-title">
            <BilingualText en="Section A: Basic Information" ml="Section A: Adisthana Vivarangal" />
          </h2>
          
          <SingleChoice name="age_group" enQuestion="What is your age group?" mlQuestion="Ningalude age group ethaanu?" options={Q.AGE_OPTIONS} value={data.age_group} onChange={(v) => updateField('age_group', v)} />
          <SingleChoice name="gender" enQuestion="What is your gender?" mlQuestion="Ningalude gender ethaanu?" options={Q.GENDER_OPTIONS} value={data.gender} onChange={(v) => updateField('gender', v)} />
          <SingleChoice name="current_status" enQuestion="What is your current status?" mlQuestion="Ningalude ippozhathe status enthaanu?" options={Q.STATUS_OPTIONS} value={data.current_status} onChange={(v) => updateField('current_status', v)} />

          <div className="form-group mb-4">
            <label className="form-label">
              <BilingualText en="Which district do you currently live in?" ml="Ningal ippo eth district-il aanu thamasikkunnath?" enClassName="" mlClassName="form-label-manglish" />
              <span className="text-red-500 ml-1" style={{ color: 'var(--error)' }}>*</span>
            </label>
            <select className="form-select" value={data.district} onChange={(e) => updateField('district', e.target.value)}>
              <option value="">Select District</option>
              {Q.DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="form-group mb-4">
            <label className="form-label">
              <BilingualText en="Enter your current city or town." ml="Ningalude current city allenkil town enter cheyyuka." enClassName="" mlClassName="form-label-manglish" />
            </label>
            <input type="text" className="form-input" value={data.city_town} onChange={(e) => updateField('city_town', e.target.value)} placeholder="City / Town" />
          </div>

          <SingleChoice name="residence_type" enQuestion="Which type of area do you live in?" mlQuestion="Ningal thamasikkunna area ethu type aanu?" options={Q.RESIDENCE_OPTIONS} value={data.residence_type} onChange={(v) => updateField('residence_type', v)} />
          <SingleChoice name="income_status" enQuestion="Do you currently have a regular source of income?" mlQuestion="Ningalkku ippol regular income source undo?" options={Q.INCOME_STATUS_OPTIONS} value={data.income_status} onChange={(v) => updateField('income_status', v)} />
          
          {data.income_status && data.income_status !== 'No' && (
            <div className="animate-fade-in mt-6 border-l-2 pl-4" style={{ borderColor: 'var(--accent-primary)' }}>
              <SingleChoice name="monthly_income" enQuestion="What is your approximate monthly income?" mlQuestion="Ningalude approximate monthly income ethra aanu?" options={Q.INCOME_RANGE_OPTIONS} value={data.monthly_income} onChange={(v) => updateField('monthly_income', v)} />
            </div>
          )}
        </div>

        {/* Section B: Budgeting and Saving */}
        <div className="survey-section">
          <h2 className="section-title">
            <BilingualText en="Section B: Budgeting and Saving" ml="Section B: Budgeting-um Saving-um" />
          </h2>
          <SingleChoice name="budgeting_frequency" enQuestion="How often do you prepare or follow a monthly budget?" mlQuestion="Ningal ethra frequently monthly budget prepare cheyyukayo follow cheyyukayo cheyyunnu?" options={Q.BUDGETING_OPTIONS} value={data.budgeting_frequency} onChange={(v) => updateField('budgeting_frequency', v)} />
          <SingleChoice name="saving_status" enQuestion="Do you save a portion of your income or pocket money?" mlQuestion="Ningal income-il ninnum allenkil pocket money-il ninnum oru bhagam save cheyyarundo?" options={Q.SAVING_STATUS_OPTIONS} value={data.saving_status} onChange={(v) => updateField('saving_status', v)} />
          
          {data.saving_status && data.saving_status !== 'No' && (
            <div className="animate-fade-in mt-6 border-l-2 pl-4" style={{ borderColor: 'var(--accent-primary)' }}>
              <SingleChoice name="saving_amount" enQuestion="Approximately how much do you save each month?" mlQuestion="Oru masam approximately ethra amount aanu save cheyyunnath?" options={Q.SAVING_AMOUNT_OPTIONS} value={data.saving_amount} onChange={(v) => updateField('saving_amount', v)} />
            </div>
          )}
          
          <SingleChoice name="emergency_fund_status" enQuestion="Do you have an emergency fund?" mlQuestion="Ningalkku emergency fund undo?" options={Q.EFUND_STATUS_OPTIONS} value={data.emergency_fund_status} onChange={(v) => updateField('emergency_fund_status', v)} />
          
          {data.emergency_fund_status === 'Yes' && (
            <div className="animate-fade-in mt-6 border-l-2 pl-4" style={{ borderColor: 'var(--accent-primary)' }}>
              <SingleChoice name="emergency_fund_duration" enQuestion="For how many months can your emergency fund cover your expenses?" mlQuestion="Ningalude emergency fund ethra masathe expenses cover cheyyan kazhiyum?" options={Q.EFUND_DURATION_OPTIONS} value={data.emergency_fund_duration} onChange={(v) => updateField('emergency_fund_duration', v)} />
            </div>
          )}
        </div>

        {/* Section C: UPI */}
        <div className="survey-section">
          <h2 className="section-title">
            <BilingualText en="Section C: UPI and Digital Spending" ml="Section C: UPI-um Digital Spending-um" />
          </h2>
          <SingleChoice name="upi_frequency" enQuestion="How frequently do you use UPI or digital payment applications?" mlQuestion="Ningal ethra frequently UPI allenkil digital payment apps use cheyyunnu?" options={Q.UPI_FREQ_OPTIONS} value={data.upi_frequency} onChange={(v) => updateField('upi_frequency', v)} />
          
          {data.upi_frequency && data.upi_frequency !== 'Never' && (
            <div className="animate-fade-in mt-6 border-l-2 pl-4" style={{ borderColor: 'var(--accent-primary)' }}>
              <SingleChoice name="upi_spending_impact" enQuestion="Do you feel UPI payments make you spend more because the payment feels easier and less noticeable?" mlQuestion="UPI payment valare easy aayath kond ningal kooduthal spend cheyyunnu ennu thonnarundo?" options={Q.UPI_IMPACT_OPTIONS} value={data.upi_spending_impact} onChange={(v) => updateField('upi_spending_impact', v)} />
            </div>
          )}
        </div>

        {/* Section D: Quick-Commerce */}
        <div className="survey-section">
          <h2 className="section-title">
            <BilingualText en="Section D: Quick-Commerce Spending" ml="Section D: Quick-Commerce Spending" />
          </h2>
          <SingleChoice name="qc_frequency" enQuestion="How frequently do you use quick-commerce applications such as Blinkit, Zepto, Instamart or similar apps?" mlQuestion="Blinkit, Zepto, Instamart poleulla quick-commerce apps ethra frequently use cheyyunnu?" options={Q.QC_FREQ_OPTIONS} value={data.qc_frequency} onChange={(v) => updateField('qc_frequency', v)} />
          
          {data.qc_frequency && data.qc_frequency !== 'Never' && (
            <div className="animate-fade-in mt-6 border-l-2 pl-4 space-y-6" style={{ borderColor: 'var(--accent-primary)' }}>
              <SingleChoice name="qc_reason" enQuestion="What is the main reason you use quick-commerce apps?" mlQuestion="Quick-commerce apps use cheyyunnathinte main reason enthaanu?" options={Q.QC_REASON_OPTIONS} value={data.qc_reason} onChange={(v) => updateField('qc_reason', v)} />
              <SingleChoice name="qc_impulsive_spending" enQuestion="Have quick-commerce apps increased your unplanned or impulsive spending?" mlQuestion="Quick-commerce apps ningalude unplanned allenkil impulsive spending increase cheythittundo?" options={Q.QC_IMPULSIVE_OPTIONS} value={data.qc_impulsive_spending} onChange={(v) => updateField('qc_impulsive_spending', v)} />
            </div>
          )}
        </div>

        {/* Section E: Loans */}
        <div className="survey-section">
          <h2 className="section-title">
            <BilingualText en="Section E: Loans, Credit and BNPL" ml="Section E: Loans, Credit, BNPL" />
          </h2>
          <MultiChoice name="credit_facilities_used" enQuestion="Have you ever used any of the following credit facilities?" mlQuestion="Thazhe koduthittulla credit facilities-il ethenkilum ningal use cheythittundo?" options={Q.CREDIT_FACILITIES_OPTIONS} values={data.credit_facilities_used} onChange={(v) => updateField('credit_facilities_used', v)} exclusiveNone="None of the above" />
          
          {data.credit_facilities_used.length > 0 && !data.credit_facilities_used.includes('None of the above') && (
            <div className="animate-fade-in mt-6 border-l-2 pl-4 space-y-6" style={{ borderColor: 'var(--accent-primary)' }}>
              <SingleChoice name="loan_awareness" enQuestion="Before taking the loan or credit facility, did you clearly understand the interest rate, repayment period and extra charges?" mlQuestion="Loan allenkil credit facility edukkunathinu munpu interest rate, repayment period, extra charges enniva clear aayi manassilayirunno?" options={Q.LOAN_AWARENESS_OPTIONS} value={data.loan_awareness} onChange={(v) => updateField('loan_awareness', v)} />
              <SingleChoice name="credit_related_stress" enQuestion="Have loan or credit repayments ever caused financial stress?" mlQuestion="Loan allenkil credit repayment ningalkku financial stress undakkiyittundo?" options={Q.CREDIT_STRESS_OPTIONS} value={data.credit_related_stress} onChange={(v) => updateField('credit_related_stress', v)} />
            </div>
          )}
        </div>

        {/* Section F: Investment */}
        <div className="survey-section">
          <h2 className="section-title">
            <BilingualText en="Section F: Investment Behaviour" ml="Section F: Investment Behaviour" />
          </h2>
          <SingleChoice name="investment_status" enQuestion="Do you currently invest money?" mlQuestion="Ningal ippol money invest cheyyunnundo?" options={Q.INVEST_STATUS_OPTIONS} value={data.investment_status} onChange={(v) => updateField('investment_status', v)} />
          
          {data.investment_status === 'Yes' && (
            <div className="animate-fade-in mt-6 border-l-2 pl-4 space-y-6" style={{ borderColor: 'var(--accent-primary)' }}>
              <SingleChoice name="investment_amount" enQuestion="Approximately how much do you invest per month?" mlQuestion="Oru masam approximately ethra amount invest cheyyunnu?" options={Q.SAVING_AMOUNT_OPTIONS} value={data.investment_amount} onChange={(v) => updateField('investment_amount', v)} />
              <MultiChoice name="investment_types" enQuestion="Where do you invest?" mlQuestion="Ningal evidokkeyaanu invest cheyyunnath?" options={Q.INVEST_TYPES_OPTIONS} values={data.investment_types} onChange={(v) => updateField('investment_types', v)} />
              <SingleChoice name="investment_platform" enQuestion="Which platform or method do you mainly use for investing?" mlQuestion="Investment cheyyan ningal mainly use cheyyunna platform allenkil method ethaanu?" options={Q.INVEST_PLATFORM_OPTIONS} value={data.investment_platform} onChange={(v) => updateField('investment_platform', v)} />
            </div>
          )}

          {(data.investment_status === 'No' || data.investment_status === 'Planning to start') && (
            <div className="animate-fade-in mt-6 border-l-2 pl-4" style={{ borderColor: 'var(--accent-primary)' }}>
              <MultiChoice name="barriers_to_investing" enQuestion="What is preventing you from starting an investment?" mlQuestion="Investment start cheyyathirikkanulla main reasons enthokkeyaanu?" options={Q.BARRIERS_OPTIONS} values={data.barriers_to_investing} onChange={(v) => updateField('barriers_to_investing', v)} />
            </div>
          )}
        </div>

        {/* Section G: Knowledge */}
        <div className="survey-section">
          <h2 className="section-title">
            <BilingualText en="Section G: Inflation and Financial Knowledge" ml="Section G: Inflation-um Financial Knowledge-um" />
          </h2>
          <SingleChoice name="inflation_awareness" enQuestion="How well do you understand inflation?" mlQuestion="Inflation-ne kurichu ningalkku ethra understanding undu?" options={Q.INFLATION_AWARENESS_OPTIONS} value={data.inflation_awareness} onChange={(v) => updateField('inflation_awareness', v)} />
          <SingleChoice name="literacy_q14_answer" enQuestion="When the prices of goods and services increase, what usually happens to the purchasing power of money?" mlQuestion="Goods-um services-um price increase aakumbol money-yude purchasing power-inu saadharanam enthu sambhavikkum?" options={Q.Q14_OPTIONS} value={data.literacy_q14_answer} onChange={(v) => updateField('literacy_q14_answer', v)} />
          <SingleChoice name="literacy_q15_answer" enQuestion="If an investment gives an 8% return while inflation is 6%, what is the approximate real return before tax?" mlQuestion="Oru investment 8% return tharunnu, inflation 6% aanu. Taxinu munpu approximate real return ethra aanu?" options={Q.Q15_OPTIONS} value={data.literacy_q15_answer} onChange={(v) => updateField('literacy_q15_answer', v)} />
          <SingleChoice name="literacy_q16_answer" enQuestion="Which statement best describes compound interest?" mlQuestion="Compound interest-ne best aayi explain cheyyunna statement ethaanu?" options={Q.Q16_OPTIONS} value={data.literacy_q16_answer} onChange={(v) => updateField('literacy_q16_answer', v)} />
        </div>

        {/* Section H: Mindset */}
        <div className="survey-section">
          <h2 className="section-title">
            <BilingualText en="Section H: Financial Mindset" ml="Section H: Financial Mindset" />
          </h2>
          <SingleChoice name="financial_mindset" enQuestion="Which statement best describes your financial mindset?" mlQuestion="Ningalude financial mindset-ne best aayi describe cheyyunna statement ethaanu?" options={Q.MINDSET_OPTIONS} value={data.financial_mindset} onChange={(v) => updateField('financial_mindset', v)} />
          <SingleChoice name="financial_information_source" enQuestion="What is your main source of financial information?" mlQuestion="Financial information labhikkunna ningalude main source ethaanu?" options={Q.INFO_SOURCE_OPTIONS} value={data.financial_information_source} onChange={(v) => updateField('financial_information_source', v)} />
          <SingleChoice name="financial_confidence" enQuestion="How confident are you in making financial decisions independently?" mlQuestion="Swanthamayi financial decisions edukkunathil ningal ethra confident aanu?" options={Q.CONFIDENCE_OPTIONS} value={data.financial_confidence} onChange={(v) => updateField('financial_confidence', v)} />
          <SingleChoice name="opinion_financial_education" enQuestion="Do you think financial literacy should be taught as a compulsory subject in schools and colleges?" mlQuestion="Financial literacy school-ilum college-ilum compulsory subject aayi padippikkanam ennu ningal karuthunnundo?" options={Q.EDUCATION_OPINION_OPTIONS} value={data.opinion_financial_education} onChange={(v) => updateField('opinion_financial_education', v)} />

          <div className="form-group mb-4">
            <label className="form-label">
              <BilingualText en="What financial topic would you most like to learn about? (Optional)" ml="Eth financial topic-ne kurichaanu ningalkku kooduthal padikkan thalparyam? (Optional)" enClassName="" mlClassName="form-label-manglish" />
            </label>
            <textarea className="form-input" rows={3} value={data.optional_learning_topic} onChange={(e) => updateField('optional_learning_topic', e.target.value)} placeholder="Type here..."></textarea>
          </div>
        </div>

        <div className="flex justify-center mb-12">
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ padding: '1rem 4rem', fontSize: '1.2rem' }}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
                Submitting...
              </span>
            ) : (
              <BilingualText en="Submit Survey" ml="Submit Cheyyuka" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
