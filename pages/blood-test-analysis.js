import { useState } from 'react';
import Link from 'next/link';

// Helper function to determine status color
const getStatusColor = (value, min, max) => {
  if (value < min) return 'bg-red-500';
  if (value > max) return 'bg-red-500';
  if (value < min * 1.1 || value > max * 0.9) return 'bg-yellow-500';
  return 'bg-green-500';
};

// Helper function to calculate percentage for status bar
const calculatePercentage = (value, min, max) => {
  const range = max - min;
  const position = value - min;
  return Math.min(Math.max((position / range) * 100, 0), 100);
};

export default function BloodTestAnalysis() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    inputMethod: 'manual',
    bloodTestResults: null,
    analysisResult: null,
    loading: false,
    error: null,
    cbc: {
      hb: '',
      hct: '',
      rbc: '',
      wbc: '',
      plt: '',
      mcv: '',
      mch: ''
    }
  });

  // Reference ranges for CBC parameters
  const referenceRanges = {
    hb: { min: 13.2, max: 16.6, unit: 'g/dL' },
    hct: { min: 38.3, max: 48.6, unit: '%' },
    rbc: { min: 4.35, max: 5.65, unit: '×10⁶/µL' },
    wbc: { min: 4.5, max: 11.0, unit: '×10³/µL' },
    plt: { min: 150, max: 450, unit: '×10³/µL' },
    mcv: { min: 80, max: 100, unit: 'fL' },
    mch: { min: 27, max: 32, unit: 'pg' }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('cbc.')) {
      const param = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        cbc: {
          ...prev.cbc,
          [param]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        bloodTestResults: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormData(prev => ({ ...prev, loading: true, error: null }));

    try {
      if (formData.inputMethod === 'manual') {
        // Send CBC data as JSON
        const response = await fetch('https://poorialakzian.app.n8n.cloud/webhook-test/9845f4f5-73e2-4cd2-ace8-ac5c4c256aa9', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            age: formData.age,
            email: formData.email,
            bloodTestResults: formData.cbc,
            inputMethod: formData.inputMethod
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to analyze blood test results');
        }

        const result = await response.json();
        console.log('Response from server:', JSON.stringify(result, null, 2));
        
        // Check if the response has the expected structure
        if (!Array.isArray(result) || !result[0]?.content) {
          console.error('Unexpected response structure:', result);
          throw new Error('Invalid response format from analysis service');
        }

        const analysis = result[0].content;
        
        setFormData(prev => ({
          ...prev,
          analysisResult: {
            analysis: analysis
          },
          loading: false
        }));
      } else {
        // Send image as FormData
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('age', formData.age);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('inputMethod', formData.inputMethod);
        formDataToSend.append('bloodTestResults', formData.bloodTestResults);

        const response = await fetch('https://poorialakzian.app.n8n.cloud/webhook-test/9845f4f5-73e2-4cd2-ace8-ac5c4c256aa9', {
          method: 'POST',
          body: formDataToSend,
        });

        if (!response.ok) {
          throw new Error('Failed to analyze blood test results');
        }

        const result = await response.json();
        console.log('Response from server:', JSON.stringify(result, null, 2));
        
        // Check if the response has the expected structure
        if (!Array.isArray(result) || !result[0]?.content) {
          console.error('Unexpected response structure:', result);
          throw new Error('Invalid response format from analysis service');
        }

        const analysis = result[0].content;
        
        setFormData(prev => ({
          ...prev,
          analysisResult: {
            analysis: analysis
          },
          loading: false
        }));
      }
    } catch (error) {
      console.error('Error processing response:', error);
      setFormData(prev => ({
        ...prev,
        error: error.message,
        loading: false
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <Link href="/" className="text-sky-600 hover:text-sky-700">
              ← Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Blood Test Analysis</h1>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all bg-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Input Method</label>
                <select
                  name="inputMethod"
                  value={formData.inputMethod}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all bg-white"
                >
                  <option value="manual">Manual Entry</option>
                  <option value="upload">Upload Image</option>
                </select>
              </div>

              {formData.inputMethod === 'manual' ? (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Complete Blood Count (CBC) Parameters</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(referenceRanges).map(([param, range]) => (
                      <div key={param} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="block text-sm font-medium text-gray-700">
                            {param.toUpperCase()} ({range.unit})
                          </label>
                          <span className="text-sm text-gray-500">
                            Range: {range.min}-{range.max}
                          </span>
                        </div>
                        <input
                          type="number"
                          step={param === 'rbc' ? '0.01' : '0.1'}
                          name={`cbc.${param}`}
                          value={formData.cbc[param]}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all bg-white"
                        />
                        {formData.cbc[param] && (
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${getStatusColor(
                                parseFloat(formData.cbc[param]),
                                range.min,
                                range.max
                              )}`}
                              style={{
                                width: `${calculatePercentage(
                                  parseFloat(formData.cbc[param]),
                                  range.min,
                                  range.max
                                )}%`
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Blood Test Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all bg-white"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={formData.loading}
                className="w-full bg-sky-600 text-white py-3 px-6 rounded-lg hover:bg-sky-700 disabled:bg-sky-300 transition-all transform hover:scale-[1.02] focus:scale-[0.98]"
              >
                {formData.loading ? 'Analyzing...' : 'Analyze Results'}
              </button>
            </form>
          </div>

          {formData.error && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
              {formData.error}
            </div>
          )}

          {formData.analysisResult && (
            <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Analysis Results</h2>
              <div className="prose prose-sky max-w-none">
                <div className="whitespace-pre-line text-right font-medium leading-relaxed text-gray-700 bg-gray-50 p-6 rounded-lg">
                  {formData.analysisResult.analysis}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 