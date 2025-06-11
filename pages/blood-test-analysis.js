import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

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

// Helper function to get status text
const getStatusText = (value, min, max) => {
  if (value < min) return 'کمتر از حد نرمال';
  if (value > max) return 'بیشتر از حد نرمال';
  if (value < min * 1.1 || value > max * 0.9) return 'در مرز نرمال';
  return 'نرمال';
};

// Helper function to get status icon
const getStatusIcon = (value, min, max) => {
  if (value < min || value > max) return '⚠️';
  if (value < min * 1.1 || value > max * 0.9) return '⚡';
  return '✅';
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
    bloodChemistry: {
      fbg: '', // Fasting Blood Glucose
      tg: '', // Triglycerides
      chol: '', // Cholesterol
      urea: '', // Urea
      bun: '', // BUN
      cr: '', // Creatinine
      hdl: '', // HDL
      ldl: '', // LDL
      vldl: '', // VLDL
    },
    hematology: {
      cbc: '', // Complete Blood Count
      wbc: '', // White Blood Cells
      rbc: '', // Red Blood Cells
      hgb: '', // Hemoglobin
      hct: '', // Hematocrit
      mcv: '', // Mean Corpuscular Volume
      mch: '', // Mean Corpuscular Hemoglobin
      mchc: '', // Mean Corpuscular Hemoglobin Concentration
      plt: '', // Platelets
      rdw: '', // Red Cell Distribution Width
      bloodGroup: '', // Blood Group
      rhFactor: '', // RH Factor
    }
  });

  // Reference ranges for parameters
  const referenceRanges = {
    // Blood Chemistry
    fbg: { min: 70, max: 100, unit: 'mg/dL' },
    tg: { min: 50, max: 150, unit: 'mg/dL' },
    chol: { min: 125, max: 200, unit: 'mg/dL' },
    urea: { min: 7, max: 20, unit: 'mg/dL' },
    bun: { min: 7, max: 20, unit: 'mg/dL' },
    cr: { min: 0.6, max: 1.2, unit: 'mg/dL' },
    hdl: { min: 40, max: 60, unit: 'mg/dL' },
    ldl: { min: 0, max: 100, unit: 'mg/dL' },
    vldl: { min: 5, max: 40, unit: 'mg/dL' },
    
    // Hematology
    wbc: { min: 4.5, max: 11.0, unit: '×10³/µL' },
    rbc: { min: 4.35, max: 5.65, unit: '×10⁶/µL' },
    hgb: { min: 13.2, max: 16.6, unit: 'g/dL' },
    hct: { min: 38.3, max: 48.6, unit: '%' },
    mcv: { min: 80, max: 100, unit: 'fL' },
    mch: { min: 27, max: 32, unit: 'pg' },
    mchc: { min: 32, max: 36, unit: 'g/dL' },
    plt: { min: 150, max: 450, unit: '×10³/µL' },
    rdw: { min: 11.5, max: 14.5, unit: '%' },
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('bloodChemistry.')) {
      const param = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        bloodChemistry: {
          ...prev.bloodChemistry,
          [param]: value
        }
      }));
    } else if (name.startsWith('hematology.')) {
      const param = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        hematology: {
          ...prev.hematology,
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
        const response = await fetch('https://pourialakzian.app.n8n.cloud/webhook/9845f4f5-73e2-4cd2-ace8-ac5c4c256aa9', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            age: formData.age,
            email: formData.email,
            bloodTestResults: {
              ...formData.bloodChemistry,
              ...formData.hematology
            },
            inputMethod: formData.inputMethod
          }),
        });

        if (!response.ok) {
          throw new Error('خطا در تحلیل نتایج آزمایش');
        }

        const result = await response.json();
        console.log('Response from server:', JSON.stringify(result, null, 2));
        
        let analysis;
        if (Array.isArray(result)) {
          // Handle new format
          if (result[0]?.message?.content) {
            analysis = result[0].message.content;
          } else if (result[0]?.content) {
            // Handle old format
            analysis = result[0].content;
          } else {
            console.error('Unexpected response structure:', result);
            throw new Error('فرمت پاسخ نامعتبر است');
          }
        } else {
          console.error('Unexpected response structure:', result);
          throw new Error('فرمت پاسخ نامعتبر است');
        }
        
        setFormData(prev => ({
          ...prev,
          analysisResult: {
            analysis: analysis
          },
          loading: false
        }));
      } else {
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('age', formData.age);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('inputMethod', formData.inputMethod);
        formDataToSend.append('bloodTestResults', formData.bloodTestResults);

        const response = await fetch('https://pourialakzian.app.n8n.cloud/webhook/9845f4f5-73e2-4cd2-ace8-ac5c4c256aa9', {
          method: 'POST',
          body: formDataToSend,
        });

        if (!response.ok) {
          throw new Error('خطا در تحلیل نتایج آزمایش');
        }

        const result = await response.json();
        console.log('Response from server:', JSON.stringify(result, null, 2));
        
        let analysis;
        if (Array.isArray(result)) {
          // Handle new format
          if (result[0]?.message?.content) {
            analysis = result[0].message.content;
          } else if (result[0]?.content) {
            // Handle old format
            analysis = result[0].content;
          } else {
            console.error('Unexpected response structure:', result);
            throw new Error('فرمت پاسخ نامعتبر است');
          }
        } else {
          console.error('Unexpected response structure:', result);
          throw new Error('فرمت پاسخ نامعتبر است');
        }
        
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

  // Add reset form function
  const resetForm = () => {
    setFormData({
      name: '',
      age: '',
      email: '',
      inputMethod: 'manual',
      bloodTestResults: null,
      analysisResult: null,
      loading: false,
      error: null,
      bloodChemistry: {
        fbg: '',
        tg: '',
        chol: '',
        urea: '',
        bun: '',
        cr: '',
        hdl: '',
        ldl: '',
        vldl: '',
      },
      hematology: {
        cbc: '',
        wbc: '',
        rbc: '',
        hgb: '',
        hct: '',
        mcv: '',
        mch: '',
        mchc: '',
        plt: '',
        rdw: '',
        bloodGroup: '',
        rhFactor: '',
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white font-vazirmatn">
      <div className="container mx-auto px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <div className="flex justify-between items-center mb-8">
            <Link href="/" className="text-sky-600 hover:text-sky-700 transition-colors">
              ← بازگشت به صفحه اصلی
            </Link>
            <h1 className="text-3xl font-bold text-sky-900">تحلیل آزمایش خون</h1>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-sky-900 mb-2">نام</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all bg-white text-sky-900"
                    dir="rtl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-sky-900 mb-2">سن</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all bg-white text-sky-900"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-sky-900 mb-2">ایمیل</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all bg-white text-sky-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-sky-900 mb-2">روش ورود اطلاعات</label>
                <select
                  name="inputMethod"
                  value={formData.inputMethod}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all bg-white text-sky-900"
                  dir="rtl"
                >
                  <option value="manual">ورود دستی</option>
                  <option value="upload">آپلود تصویر</option>
                </select>
              </div>

              {formData.inputMethod === 'manual' ? (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  {/* Blood Chemistry Section */}
                  <div>
                    <h3 className="text-lg font-medium text-sky-900 mb-4">پارامترهای بیوشیمی خون</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {Object.entries(referenceRanges)
                        .filter(([param]) => Object.keys(formData.bloodChemistry).includes(param))
                        .map(([param, range]) => (
                          <motion.div 
                            key={param}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            className="space-y-2"
                          >
                            <div className="flex justify-between items-center">
                              <label className="block text-sm font-medium text-sky-900">
                                {param.toUpperCase()} ({range.unit})
                              </label>
                              <span className="text-sm text-sky-600">
                                محدوده: {range.min}-{range.max}
                              </span>
                            </div>
                            <input
                              type="number"
                              step="0.1"
                              name={`bloodChemistry.${param}`}
                              value={formData.bloodChemistry[param]}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all bg-white text-sky-900"
                            />
                            {formData.bloodChemistry[param] && (
                              <div className="h-2 bg-sky-100 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${calculatePercentage(
                                    parseFloat(formData.bloodChemistry[param]),
                                    range.min,
                                    range.max
                                  )}%` }}
                                  transition={{ duration: 0.5 }}
                                  className={`h-full ${getStatusColor(
                                    parseFloat(formData.bloodChemistry[param]),
                                    range.min,
                                    range.max
                                  )}`}
                                />
                              </div>
                            )}
                          </motion.div>
                        ))}
                    </div>
                  </div>

                  {/* Hematology Section */}
                  <div>
                    <h3 className="text-lg font-medium text-sky-900 mb-4">پارامترهای هماتولوژی</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {Object.entries(referenceRanges)
                        .filter(([param]) => Object.keys(formData.hematology).includes(param))
                        .map(([param, range]) => (
                          <motion.div 
                            key={param}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            className="space-y-2"
                          >
                            <div className="flex justify-between items-center">
                              <label className="block text-sm font-medium text-sky-900">
                                {param.toUpperCase()} ({range.unit})
                              </label>
                              <span className="text-sm text-sky-600">
                                محدوده: {range.min}-{range.max}
                              </span>
                            </div>
                            <input
                              type="number"
                              step="0.1"
                              name={`hematology.${param}`}
                              value={formData.hematology[param]}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all bg-white text-sky-900"
                            />
                            {formData.hematology[param] && (
                              <div className="h-2 bg-sky-100 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${calculatePercentage(
                                    parseFloat(formData.hematology[param]),
                                    range.min,
                                    range.max
                                  )}%` }}
                                  transition={{ duration: 0.5 }}
                                  className={`h-full ${getStatusColor(
                                    parseFloat(formData.hematology[param]),
                                    range.min,
                                    range.max
                                  )}`}
                                />
                              </div>
                            )}
                          </motion.div>
                        ))}
                    </div>

                    {/* Blood Group and RH Factor */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div>
                        <label className="block text-sm font-medium text-sky-900 mb-2">
                          گروه خونی
                        </label>
                        <select
                          name="hematology.bloodGroup"
                          value={formData.hematology.bloodGroup}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all bg-white text-sky-900"
                        >
                          <option value="">انتخاب کنید</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-sky-900 mb-2">
                          فاکتور RH
                        </label>
                        <select
                          name="hematology.rhFactor"
                          value={formData.hematology.rhFactor}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all bg-white text-sky-900"
                        >
                          <option value="">انتخاب کنید</option>
                          <option value="positive">مثبت</option>
                          <option value="negative">منفی</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-sm font-medium text-sky-900 mb-2">آپلود تصویر آزمایش خون</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    required
                    className="w-full p-3 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all bg-white text-sky-900"
                  />
                </motion.div>
              )}

              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={formData.loading}
                  className="flex-1 bg-sky-600 text-white py-3 px-6 rounded-lg hover:bg-sky-700 disabled:bg-sky-300 transition-all"
                >
                  {formData.loading ? 'در حال تحلیل...' : 'تحلیل نتایج'}
                </motion.button>

                {formData.analysisResult && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-sky-100 text-sky-600 py-3 px-6 rounded-lg hover:bg-sky-200 transition-all"
                  >
                    شروع مجدد
                  </motion.button>
                )}
              </div>
            </form>
          </motion.div>

          {formData.error && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200"
            >
              {formData.error}
            </motion.div>
          )}

          {formData.analysisResult && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-8 bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold mb-6 text-sky-900 text-center">نتایج تحلیل</h2>
              
              {/* Test Parameters Visualization - Only show for manual input */}
              {formData.inputMethod === 'manual' && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-sky-900 mb-4 text-center">وضعیت پارامترها</h3>
                  <div className="space-y-6">
                    {Object.entries(referenceRanges).map(([param, range]) => {
                      const value = parseFloat(formData.bloodChemistry[param] || formData.hematology[param]);
                      if (!value) return null;
                      
                      const percentage = calculatePercentage(value, range.min, range.max);
                      const statusColor = getStatusColor(value, range.min, range.max);
                      const statusText = getStatusText(value, range.min, range.max);
                      const statusIcon = getStatusIcon(value, range.min, range.max);
                      
                      return (
                        <motion.div 
                          key={param}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="bg-sky-50 rounded-lg p-4"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                              <span className="text-lg mr-2">{statusIcon}</span>
                              <span className="font-medium text-sky-900">{param.toUpperCase()}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-sky-900 font-medium">{value} {range.unit}</span>
                              <span className="text-sm text-sky-600 mr-2">({statusText})</span>
                            </div>
                          </div>
                          
                          <div className="relative h-2 bg-sky-200 rounded-full overflow-hidden">
                            <div className="absolute left-0 top-0 h-full w-0.5 bg-sky-400" style={{ left: '10%' }}></div>
                            <div className="absolute left-0 top-0 h-full w-0.5 bg-sky-400" style={{ left: '90%' }}></div>
                            
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 0.5 }}
                              className={`h-full ${statusColor}`}
                            />
                          </div>
                          
                          <div className="flex justify-between text-xs text-sky-600 mt-1">
                            <span>{range.min} {range.unit}</span>
                            <span>{range.max} {range.unit}</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Analysis Text */}
              <div className="prose prose-sky max-w-none">
                <div 
                  className="whitespace-pre-line text-right font-medium leading-relaxed text-sky-900 bg-sky-50 p-6 rounded-lg"
                  dir="rtl"
                >
                  {formData.analysisResult.analysis}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
} 
