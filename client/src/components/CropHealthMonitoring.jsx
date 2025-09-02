import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CameraIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  BeakerIcon,
  ClockIcon,
  ChartBarIcon,
  SparklesIcon as LeafIcon,
  ShieldCheckIcon,
  LightBulbIcon,
  MapPinIcon,
  CalendarIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const CropHealthMonitoring = ({ farmId }) => {
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [healthReports, setHealthReports] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHealthData();
  }, [farmId]);

  const loadHealthData = () => {
    // Simulate crop health data
    const mockReports = [
      {
        id: 'report-1',
        cropType: 'Tomatoes',
        fieldSection: 'Section A',
        healthScore: 92,
        lastScanned: '2025-08-28',
        issues: [],
        recommendations: ['Continue current watering schedule', 'Monitor for pests in 3 days'],
        image: '/api/placeholder/300/200',
        coordinates: { lat: 40.7128, lng: -74.0060 }
      },
      {
        id: 'report-2',
        cropType: 'Lettuce',
        fieldSection: 'Section B',
        healthScore: 78,
        lastScanned: '2025-08-27',
        issues: [
          { type: 'Early Blight', severity: 'Low', confidence: 85 }
        ],
        recommendations: [
          'Apply organic fungicide spray',
          'Increase air circulation',
          'Reduce watering frequency'
        ],
        image: '/api/placeholder/300/200',
        coordinates: { lat: 40.7138, lng: -74.0070 }
      },
      {
        id: 'report-3',
        cropType: 'Carrots',
        fieldSection: 'Section C',
        healthScore: 88,
        lastScanned: '2025-08-26',
        issues: [
          { type: 'Aphid Infestation', severity: 'Medium', confidence: 92 }
        ],
        recommendations: [
          'Introduce beneficial insects',
          'Apply neem oil treatment',
          'Monitor closely for 1 week'
        ],
        image: '/api/placeholder/300/200',
        coordinates: { lat: 40.7148, lng: -74.0080 }
      }
    ];

    const mockAlerts = [
      {
        id: 'alert-1',
        type: 'disease',
        severity: 'medium',
        message: 'Potential fungal disease detected in Lettuce - Section B',
        timestamp: '2025-08-28T10:30:00Z',
        actionRequired: true
      },
      {
        id: 'alert-2',
        type: 'pest',
        severity: 'low',
        message: 'Aphid activity increasing in Carrots - Section C',
        timestamp: '2025-08-28T08:15:00Z',
        actionRequired: false
      }
    ];

    setHealthReports(mockReports);
    setAlerts(mockAlerts);
    setLoading(false);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setScanning(true);
      setUploadedImage(URL.createObjectURL(file));
      
      // Simulate AI analysis
      setTimeout(() => {
        const mockAnalysis = {
          cropType: 'Tomato',
          healthScore: 85,
          detectedIssues: [
            {
              name: 'Early Blight',
              confidence: 78,
              severity: 'Low',
              description: 'Brown spots on leaves indicating early stages of blight',
              treatment: 'Apply copper-based fungicide and improve air circulation'
            }
          ],
          recommendations: [
            'Remove affected leaves immediately',
            'Apply organic fungicide spray every 7-10 days',
            'Ensure proper spacing between plants for air circulation',
            'Monitor soil moisture levels'
          ],
          preventiveMeasures: [
            'Rotate crops annually',
            'Use drip irrigation to avoid wetting leaves',
            'Apply mulch around plants'
          ]
        };
        
        setAnalysisResult(mockAnalysis);
        setScanning(false);
      }, 3000);
    }
  };

  const getHealthScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-beige-200"
      >
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-beige-200 rounded w-1/2"></div>
          <div className="h-4 bg-beige-100 rounded w-3/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map(i => (
              <div key={i} className="h-64 bg-beige-100 rounded-xl"></div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-white/95 to-beige-50/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-beige-200/50"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg"
          >
            <BeakerIcon className="h-8 w-8 text-white" />
          </motion.div>
          <div>
            <h2 className="text-3xl font-bold text-earth-700">Crop Health Monitoring</h2>
            <p className="text-beige-600 font-medium">AI-powered disease detection and plant health analysis</p>
          </div>
        </div>
        
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex items-center space-x-2 bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-2 rounded-full border border-green-200"
        >
          <SparklesIcon className="h-5 w-5 text-green-600" />
          <span className="text-green-700 font-semibold">AI Powered</span>
        </motion.div>
      </div>

      {/* Active Alerts */}
      {alerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-2xl border border-yellow-200 mb-8"
        >
          <h3 className="text-lg font-bold text-yellow-800 mb-4 flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
            Active Health Alerts
          </h3>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <motion.div
                key={alert.id}
                whileHover={{ scale: 1.02 }}
                className="flex items-center justify-between bg-white/60 rounded-xl p-4"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    alert.severity === 'high' ? 'bg-red-500' :
                    alert.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></div>
                  <div>
                    <p className="font-medium text-earth-700">{alert.message}</p>
                    <p className="text-sm text-beige-600">
                      {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                {alert.actionRequired && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-xl font-semibold hover:bg-yellow-600 transition-colors"
                  >
                    Take Action
                  </motion.button>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Quick Scan Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200 mb-8"
      >
        <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
          <CameraIcon className="h-6 w-6 mr-2" />
          Quick Plant Health Scan
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <CameraIcon className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                <p className="text-blue-600 font-semibold">Upload Plant Image</p>
                <p className="text-blue-500 text-sm">Click to select or drag & drop</p>
              </label>
            </div>
            
            {uploadedImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4"
              >
                <img
                  src={uploadedImage}
                  alt="Uploaded plant"
                  className="w-full h-48 object-cover rounded-xl"
                />
              </motion.div>
            )}
          </div>
          
          <div>
            {scanning && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
              >
                <div className="relative mx-auto w-16 h-16 mb-4">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
                  <BeakerIcon className="absolute inset-0 h-8 w-8 m-auto text-blue-600" />
                </div>
                <p className="text-blue-600 font-semibold">Analyzing plant health...</p>
                <p className="text-blue-500 text-sm">AI is examining your crop image</p>
              </motion.div>
            )}
            
            {analysisResult && !scanning && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 rounded-xl p-6"
              >
                <h4 className="font-bold text-earth-700 mb-4">Analysis Results</h4>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-earth-600">Crop Type:</span>
                    <span className="font-semibold text-earth-700">{analysisResult.cropType}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-earth-600">Health Score:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getHealthScoreColor(analysisResult.healthScore)}`}>
                      {analysisResult.healthScore}%
                    </span>
                  </div>
                  
                  {analysisResult.detectedIssues.length > 0 && (
                    <div>
                      <h5 className="font-semibold text-earth-700 mb-2">Detected Issues:</h5>
                      {analysisResult.detectedIssues.map((issue, index) => (
                        <div key={index} className="bg-red-50 p-3 rounded-lg mb-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-red-700">{issue.name}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getSeverityColor(issue.severity)}`}>
                              {issue.severity}
                            </span>
                          </div>
                          <p className="text-red-600 text-sm mb-2">{issue.description}</p>
                          <p className="text-red-700 text-sm font-medium">Treatment: {issue.treatment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold"
                  >
                    Save to Health Records
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Health Reports Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {healthReports.map((report, index) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border border-beige-200 hover:shadow-xl transition-all duration-300 cursor-pointer"
            onClick={() => setSelectedCrop(report)}
          >
            {/* Report Image */}
            <div className="relative h-48 bg-gradient-to-br from-green-100 to-emerald-200">
              <div className="absolute inset-0 flex items-center justify-center">
                <LeafIcon className="h-16 w-16 text-green-400" />
              </div>
              
              {/* Health Score Badge */}
              <div className="absolute top-3 right-3">
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${getHealthScoreColor(report.healthScore)}`}>
                  {report.healthScore}%
                </span>
              </div>
              
              {/* Issue Indicators */}
              {report.issues.length > 0 && (
                <div className="absolute top-3 left-3">
                  <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />
                </div>
              )}
            </div>
            
            {/* Report Content */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-earth-700">{report.cropType}</h3>
                <span className="text-sm text-beige-600">{report.fieldSection}</span>
              </div>
              
              <div className="flex items-center text-sm text-beige-600 mb-4">
                <ClockIcon className="h-4 w-4 mr-1" />
                <span>Last scanned: {new Date(report.lastScanned).toLocaleDateString()}</span>
              </div>
              
              {/* Issues Summary */}
              {report.issues.length > 0 ? (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-earth-700 mb-2">Active Issues:</h4>
                  {report.issues.map((issue, issueIndex) => (
                    <div key={issueIndex} className="flex items-center justify-between text-xs mb-1">
                      <span className="text-earth-600">{issue.type}</span>
                      <span className={`px-2 py-1 rounded-full font-semibold ${getSeverityColor(issue.severity)}`}>
                        {issue.severity}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center text-green-600 mb-4">
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">No issues detected</span>
                </div>
              )}
              
              {/* Recommendations Preview */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-earth-700 mb-2">Recommendations:</h4>
                <p className="text-xs text-beige-600 line-clamp-2">
                  {report.recommendations[0]}
                  {report.recommendations.length > 1 && ` +${report.recommendations.length - 1} more`}
                </p>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-2 bg-gradient-to-r from-earth-500 to-sage-600 text-white rounded-xl font-semibold text-sm"
              >
                View Full Report
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detailed Report Modal */}
      <AnimatePresence>
        {selectedCrop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedCrop(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-earth-700">
                    {selectedCrop.cropType} - {selectedCrop.fieldSection}
                  </h3>
                  <p className="text-beige-600">Health Report Details</p>
                </div>
                <button
                  onClick={() => setSelectedCrop(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Health Overview */}
                <div>
                  <h4 className="text-lg font-semibold text-earth-700 mb-4">Health Overview</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-beige-50 rounded-lg">
                      <span className="text-earth-600">Overall Health Score:</span>
                      <span className={`px-3 py-1 rounded-full font-bold ${getHealthScoreColor(selectedCrop.healthScore)}`}>
                        {selectedCrop.healthScore}%
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-beige-50 rounded-lg">
                      <span className="text-earth-600">Last Inspection:</span>
                      <span className="font-semibold text-earth-700">
                        {new Date(selectedCrop.lastScanned).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-beige-50 rounded-lg">
                      <span className="text-earth-600">Location:</span>
                      <div className="flex items-center text-earth-700">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        <span className="font-semibold">{selectedCrop.fieldSection}</span>
                      </div>
                    </div>
                  </div>

                  {/* Issues */}
                  {selectedCrop.issues.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold text-earth-700 mb-4">Detected Issues</h4>
                      <div className="space-y-3">
                        {selectedCrop.issues.map((issue, index) => (
                          <div key={index} className="p-4 bg-red-50 rounded-lg border border-red-200">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-semibold text-red-700">{issue.type}</h5>
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getSeverityColor(issue.severity)}`}>
                                {issue.severity}
                              </span>
                            </div>
                            <p className="text-red-600 text-sm">Confidence: {issue.confidence}%</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Recommendations */}
                <div>
                  <h4 className="text-lg font-semibold text-earth-700 mb-4">Recommendations</h4>
                  <div className="space-y-3">
                    {selectedCrop.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                        <LightBulbIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-green-700 text-sm">{rec}</p>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold"
                    >
                      Schedule Treatment
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold"
                    >
                      Export Report
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full py-3 bg-beige-100 text-earth-700 rounded-xl font-semibold hover:bg-beige-200 transition-colors"
                    >
                      Set Monitoring Alert
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CropHealthMonitoring;
