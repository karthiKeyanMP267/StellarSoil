import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheckIcon,
  CubeTransparentIcon,
  DocumentCheckIcon,
  ClockIcon,
  LinkIcon,
  QrCodeIcon,
  CheckBadgeIcon,
  ExclamationTriangleIcon,
  GlobeAltIcon,
  FingerPrintIcon
} from '@heroicons/react/24/outline';

const BlockchainFarmVerification = () => {
  const [verificationStep, setVerificationStep] = useState(0);
  const [farmData, setFarmData] = useState({
    name: '',
    location: '',
    certifications: [],
    practices: []
  });
  const [blockchainData, setBlockchainData] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [qrCode, setQrCode] = useState(null);

  const verificationSteps = [
    {
      title: 'Farm Registration',
      description: 'Register your farm on the blockchain',
      icon: DocumentCheckIcon,
      status: 'completed'
    },
    {
      title: 'Identity Verification',
      description: 'Verify farmer identity and credentials',
      icon: FingerPrintIcon,
      status: 'current'
    },
    {
      title: 'Certification Upload',
      description: 'Upload organic and quality certifications',
      icon: CheckBadgeIcon,
      status: 'pending'
    },
    {
      title: 'Blockchain Recording',
      description: 'Record farm data on immutable ledger',
      icon: CubeTransparentIcon,
      status: 'pending'
    },
    {
      title: 'QR Code Generation',
      description: 'Generate unique farm verification code',
      icon: QrCodeIcon,
      status: 'pending'
    }
  ];

  const mockBlockchainData = {
    transactionHash: '0x8e2f7a5b9c3d4e6f8a9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f',
    blockNumber: 15432789,
    gasUsed: '0.0023 ETH',
    timestamp: new Date(),
    networkId: 'StellarSoil-Chain',
    contractAddress: '0x742d35Cc6634C0532925a3b8D0129dDF24B8E134',
    validatorNodes: 12,
    consensusReached: true
  };

  const certificationTypes = [
    { id: 'organic', name: 'USDA Organic', verified: true, icon: '🌱' },
    { id: 'gmo-free', name: 'Non-GMO', verified: true, icon: '🚫' },
    { id: 'fair-trade', name: 'Fair Trade', verified: false, icon: '🤝' },
    { id: 'sustainable', name: 'Sustainable Farming', verified: true, icon: '♻️' },
    { id: 'pesticide-free', name: 'Pesticide Free', verified: true, icon: '🐛' },
    { id: 'carbon-neutral', name: 'Carbon Neutral', verified: false, icon: '🌍' }
  ];

  const farmingPractices = [
    { id: 'crop-rotation', name: 'Crop Rotation', implemented: true },
    { id: 'water-conservation', name: 'Water Conservation', implemented: true },
    { id: 'soil-health', name: 'Soil Health Management', implemented: true },
    { id: 'biodiversity', name: 'Biodiversity Protection', implemented: false },
    { id: 'renewable-energy', name: 'Renewable Energy Use', implemented: true },
    { id: 'waste-reduction', name: 'Waste Reduction', implemented: true }
  ];

  const startVerification = async () => {
    setIsVerifying(true);
    
    // Simulate blockchain verification process
    for (let i = 0; i <= 4; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setVerificationStep(i);
      
      if (i === 4) {
        setBlockchainData(mockBlockchainData);
        generateQRCode();
      }
    }
    
    setIsVerifying(false);
  };

  const generateQRCode = () => {
    // Simulate QR code generation
    const qrData = `https://stellarsoil.com/verify/${mockBlockchainData.transactionHash}`;
    setQrCode(qrData);
  };

  const getStepStatus = (index) => {
    if (index < verificationStep) return 'completed';
    if (index === verificationStep) return 'current';
    return 'pending';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-beige-200/50 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="p-3 bg-white/20 rounded-xl backdrop-blur-sm"
            >
              <ShieldCheckIcon className="h-8 w-8" />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold">Blockchain Farm Verification</h2>
              <p className="text-emerald-100">Immutable farm credentials & traceability</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-emerald-100">Network Status</div>
            <div className="flex items-center space-x-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 bg-green-400 rounded-full"
              />
              <span className="text-sm font-medium">Online</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Verification Progress */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Verification Progress</h3>
          
          <div className="space-y-3">
            {verificationSteps.map((step, index) => {
              const status = getStepStatus(index);
              const StepIcon = step.icon;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center space-x-4 p-4 rounded-xl border-2 transition-all duration-300 ${
                    status === 'completed' 
                      ? 'border-green-200 bg-green-50' 
                      : status === 'current'
                      ? 'border-blue-200 bg-blue-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    status === 'completed' 
                      ? 'bg-green-500 text-white' 
                      : status === 'current'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {status === 'completed' ? (
                      <CheckBadgeIcon className="h-5 w-5" />
                    ) : (
                      <StepIcon className="h-5 w-5" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{step.title}</h4>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                  
                  {status === 'current' && isVerifying && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
          
          {!isVerifying && verificationStep === 0 && (
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(5, 150, 105, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={startVerification}
              className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-300"
            >
              <ShieldCheckIcon className="h-5 w-5 mr-2 inline" />
              Start Blockchain Verification
            </motion.button>
          )}
        </div>

        {/* Certifications Grid */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Farm Certifications</h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {certificationTypes.map((cert) => (
              <motion.div
                key={cert.id}
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  cert.verified 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-orange-200 bg-orange-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{cert.icon}</span>
                  {cert.verified ? (
                    <CheckBadgeIcon className="h-5 w-5 text-green-600" />
                  ) : (
                    <ClockIcon className="h-5 w-5 text-orange-600" />
                  )}
                </div>
                <h4 className="font-medium text-gray-800">{cert.name}</h4>
                <p className={`text-xs mt-1 ${
                  cert.verified ? 'text-green-600' : 'text-orange-600'
                }`}>
                  {cert.verified ? 'Verified on blockchain' : 'Pending verification'}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Blockchain Data */}
        {blockchainData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-gray-800">Blockchain Record</h3>
            
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 text-white font-mono text-sm">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="text-green-400 mb-1">Transaction Hash:</div>
                  <div className="break-all text-xs">{blockchainData.transactionHash}</div>
                </div>
                <div>
                  <div className="text-blue-400 mb-1">Block Number:</div>
                  <div>{blockchainData.blockNumber.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-yellow-400 mb-1">Gas Used:</div>
                  <div>{blockchainData.gasUsed}</div>
                </div>
                <div>
                  <div className="text-purple-400 mb-1">Network:</div>
                  <div>{blockchainData.networkId}</div>
                </div>
                <div>
                  <div className="text-pink-400 mb-1">Validators:</div>
                  <div>{blockchainData.validatorNodes} nodes</div>
                </div>
                <div>
                  <div className="text-cyan-400 mb-1">Timestamp:</div>
                  <div>{blockchainData.timestamp.toLocaleString()}</div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex items-center space-x-2">
                  <CheckBadgeIcon className="h-5 w-5 text-green-400" />
                  <span className="text-green-400 font-semibold">Consensus Reached</span>
                  <span className="text-gray-400">- Farm verification immutably recorded</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* QR Code */}
        {qrCode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4"
          >
            <h3 className="text-lg font-semibold text-gray-800">Verification QR Code</h3>
            
            <div className="bg-white p-6 rounded-xl border-2 border-emerald-200 inline-block">
              <div className="w-48 h-48 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center mb-4">
                <QrCodeIcon className="h-32 w-32 text-emerald-600" />
              </div>
              <p className="text-sm text-gray-600 max-w-xs">
                Scan to verify farm authenticity and view blockchain record
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                <LinkIcon className="h-4 w-4 mr-2 inline" />
                Copy Link
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
              >
                <GlobeAltIcon className="h-4 w-4 mr-2 inline" />
                Share
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Farming Practices */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Sustainable Practices</h3>
          
          <div className="grid md:grid-cols-2 gap-3">
            {farmingPractices.map((practice) => (
              <div
                key={practice.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  practice.implemented 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <span className="text-sm font-medium text-gray-800">
                  {practice.name}
                </span>
                {practice.implemented ? (
                  <CheckBadgeIcon className="h-5 w-5 text-green-600" />
                ) : (
                  <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BlockchainFarmVerification;
