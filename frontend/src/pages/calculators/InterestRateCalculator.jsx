import React, { useState } from 'react';

function InterestRateCalculator() {
  const [propertyValue, setPropertyValue] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [creditScore, setCreditScore] = useState('');
  const [employmentType, setEmploymentType] = useState('salaried');
  const [estimatedRate, setEstimatedRate] = useState(null);

  const calculateInterestRate = (e) => {
    e.preventDefault();
    
    // Base rate
    let baseRate = 8.5;
    
    // Adjust based on loan to value ratio
    const loanAmount = propertyValue - downPayment;
    const ltv = (loanAmount / propertyValue) * 100;
    
    if (ltv <= 60) baseRate -= 0.25;
    else if (ltv > 80) baseRate += 0.25;
    
    // Adjust based on credit score
    const score = parseInt(creditScore);
    if (score >= 800) baseRate -= 0.5;
    else if (score >= 750) baseRate -= 0.25;
    else if (score < 650) baseRate += 0.5;
    
    // Adjust based on employment type
    if (employmentType === 'self-employed') baseRate += 0.25;
    
    setEstimatedRate(baseRate.toFixed(2));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Interest Rate Calculator</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <form onSubmit={calculateInterestRate} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Value (₹)
            </label>
            <input
              type="number"
              value={propertyValue}
              onChange={(e) => setPropertyValue(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Down Payment (₹)
            </label>
            <input
              type="number"
              value={downPayment}
              onChange={(e) => setDownPayment(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Credit Score (300-900)
            </label>
            <input
              type="number"
              min="300"
              max="900"
              value={creditScore}
              onChange={(e) => setCreditScore(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Employment Type
            </label>
            <select
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="salaried">Salaried</option>
              <option value="self-employed">Self Employed</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors"
          >
            Calculate Interest Rate
          </button>
        </form>

        {estimatedRate && (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Estimated Interest Rate</h2>
            <p className="text-3xl font-bold text-blue-600">{estimatedRate}%</p>
            <p className="mt-2 text-sm text-gray-600">
              Note: This is an estimated rate. Actual rates may vary based on additional factors and lender policies.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default InterestRateCalculator;