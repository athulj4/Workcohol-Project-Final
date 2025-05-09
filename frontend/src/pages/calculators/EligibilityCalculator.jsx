import React, { useState } from 'react';

function EligibilityCalculator() {
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [existingEmi, setExistingEmi] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [eligibleAmount, setEligibleAmount] = useState(null);

  const calculateEligibility = (e) => {
    e.preventDefault();
    
    const income = parseFloat(monthlyIncome);
    const emi = parseFloat(existingEmi) || 0;
    const rate = parseFloat(interestRate);
    const years = parseFloat(loanTerm);

    // Using 50% of net income (after existing EMIs) as eligible EMI
    const eligibleEmi = (income * 0.5) - emi;
    const ratePerMonth = (rate / 12) / 100;
    const months = years * 12;

    // Calculate loan eligibility using EMI formula
    const eligibleLoan = (eligibleEmi * (Math.pow(1 + ratePerMonth, months) - 1)) / (ratePerMonth * Math.pow(1 + ratePerMonth, months));
    
    setEligibleAmount(eligibleLoan.toFixed(0));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Loan Eligibility Calculator</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <form onSubmit={calculateEligibility} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Income (₹)
            </label>
            <input
              type="number"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Existing EMI (if any) (₹)
            </label>
            <input
              type="number"
              value={existingEmi}
              onChange={(e) => setExistingEmi(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expected Interest Rate (% per annum)
            </label>
            <input
              type="number"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loan Term (Years)
            </label>
            <input
              type="number"
              value={loanTerm}
              onChange={(e) => setLoanTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors"
          >
            Calculate Eligibility
          </button>
        </form>

        {eligibleAmount && (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Loan Eligibility</h2>
            <p className="text-3xl font-bold text-blue-600">₹ {parseInt(eligibleAmount).toLocaleString('en-IN')}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default EligibilityCalculator;