import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CameraIcon,
  EyeIcon,
  CubeIcon,
  SparklesIcon,
  AdjustmentsHorizontalIcon,
  InformationCircleIcon,
  PlayIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const ARCropVisualizer = () => {
  const [isARActive, setIsARActive] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [cropModels, setCropModels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const cropTypes = [
    {
      id: 'tomato',
      name: 'Tomato Plants',
      color: '#ef4444',
      growthStages: ['Seedling', 'Flowering', 'Fruiting', 'Harvest'],
      spacing: '60cm apart',
      height: '1.5-2m',
      icon: '🍅'
    },
    {
      id: 'lettuce',
      name: 'Lettuce',
      color: '#22c55e',
      growthStages: ['Germination', 'Leafing', 'Head Formation', 'Harvest'],
      spacing: '30cm apart',
      height: '20-30cm',
      icon: '🥬'
    },
    {
      id: 'carrots',
      name: 'Carrots',
      color: '#f97316',
      growthStages: ['Germination', 'Root Development', 'Top Growth', 'Harvest'],
      spacing: '5cm apart',
      height: '25cm',
      icon: '🥕'
    },
    {
      id: 'peppers',
      name: 'Bell Peppers',
      color: '#eab308',
      growthStages: ['Seedling', 'Flowering', 'Fruit Set', 'Harvest'],
      spacing: '45cm apart',
      height: '60-90cm',
      icon: '🌶️'
    }
  ];

  useEffect(() => {
    // Cleanup camera stream on unmount
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      setIsLoading(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraPermission(true);
        setIsARActive(true);
      }
    } catch (error) {
      console.error('Camera access denied:', error);
      setCameraPermission(false);
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsARActive(false);
    setSelectedCrop(null);
    setCropModels([]);
  };

  const placeCrop = (event) => {
    if (!selectedCrop || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newCropModel = {
      id: Date.now(),
      crop: selectedCrop,
      x,
      y,
      scale: 1,
      rotation: 0,
      growthStage: 0
    };

    setCropModels(prev => [...prev, newCropModel]);
  };

  const removeCropModel = (id) => {
    setCropModels(prev => prev.filter(model => model.id !== id));
  };

  const updateCropGrowth = (id, stage) => {
    setCropModels(prev => 
      prev.map(model => 
        model.id === id ? { ...model, growthStage: stage } : model
      )
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-beige-200/50 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="p-3 bg-white/20 rounded-xl backdrop-blur-sm"
            >
              <CubeIcon className="h-8 w-8" />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold">AR Crop Visualizer</h2>
              <p className="text-purple-100">See how crops will grow in your space</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsARActive(!isARActive)}
            className="p-2 bg-white/20 rounded-xl backdrop-blur-sm hover:bg-white/30 transition-colors"
          >
            <InformationCircleIcon className="h-6 w-6" />
          </motion.button>
        </div>
      </div>

      <div className="p-6">
        {!isARActive ? (
          <div className="space-y-6">
            {/* Getting Started */}
            <div className="text-center py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="p-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl mx-auto w-fit mb-6"
              >
                <CameraIcon className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-purple-800 mb-2">Start AR Experience</h3>
                <p className="text-purple-600 max-w-md mx-auto">
                  Use your camera to visualize how different crops will look and grow in your space
                </p>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(147, 51, 234, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                onClick={startCamera}
                disabled={isLoading}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-2xl shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="h-5 w-5 border-2 border-white border-t-transparent rounded-full inline-block mr-2"
                  />
                ) : (
                  <PlayIcon className="h-5 w-5 mr-2 inline" />
                )}
                {isLoading ? 'Starting Camera...' : 'Start AR Visualization'}
              </motion.button>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: EyeIcon, title: 'AR Vision', desc: 'See crops in real space' },
                { icon: SparklesIcon, title: 'Growth Stages', desc: 'Visualize crop timeline' },
                { icon: AdjustmentsHorizontalIcon, title: 'Spacing Guide', desc: 'Optimal plant spacing' },
                { icon: CubeIcon, title: '3D Models', desc: 'Realistic crop models' }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-gradient-to-br from-beige-50 to-cream-50 rounded-xl border border-beige-200/50"
                >
                  <feature.icon className="h-8 w-8 text-purple-600 mb-3" />
                  <h4 className="font-semibold text-gray-800 mb-1">{feature.title}</h4>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* AR Camera View */}
            <div className="relative bg-black rounded-2xl overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-80 object-cover"
              />
              
              {/* AR Canvas Overlay */}
              <canvas
                ref={canvasRef}
                onClick={placeCrop}
                className="absolute inset-0 w-full h-full cursor-crosshair"
              />

              {/* AR Crop Models */}
              <AnimatePresence>
                {cropModels.map((model) => (
                  <motion.div
                    key={model.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: model.scale, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    style={{
                      position: 'absolute',
                      left: model.x - 25,
                      top: model.y - 25,
                      transform: `rotate(${model.rotation}deg)`
                    }}
                    className="w-12 h-12 bg-green-500/80 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white/50"
                  >
                    <span className="text-lg">{model.crop.icon}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeCropModel(model.id);
                      }}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Controls Overlay */}
              <div className="absolute top-4 right-4 space-y-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={stopCamera}
                  className="p-3 bg-red-500/80 text-white rounded-full backdrop-blur-sm hover:bg-red-600/80"
                >
                  <XMarkIcon className="h-5 w-5" />
                </motion.button>
              </div>
            </div>

            {/* Crop Selection */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800">Select Crop to Place:</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {cropTypes.map((crop) => (
                  <motion.button
                    key={crop.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCrop(crop)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      selectedCrop?.id === crop.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 bg-white hover:border-purple-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">{crop.icon}</div>
                    <div className="text-sm font-medium text-gray-800">{crop.name}</div>
                    <div className="text-xs text-gray-500">{crop.height}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Selected Crop Info */}
            {selectedCrop && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200"
              >
                <h5 className="font-semibold text-purple-800 mb-2">
                  {selectedCrop.icon} {selectedCrop.name}
                </h5>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-purple-600 font-medium">Height:</span>
                    <span className="ml-2 text-gray-700">{selectedCrop.height}</span>
                  </div>
                  <div>
                    <span className="text-purple-600 font-medium">Spacing:</span>
                    <span className="ml-2 text-gray-700">{selectedCrop.spacing}</span>
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-purple-600 font-medium">Growth Stages:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedCrop.growthStages.map((stage, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                      >
                        {stage}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-purple-600 mt-2">
                  Tap on the camera view to place crops in your space
                </p>
              </motion.div>
            )}
          </div>
        )}

        {cameraPermission === false && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl"
          >
            <div className="flex items-center space-x-2 text-red-600">
              <XMarkIcon className="h-5 w-5" />
              <span className="font-medium">Camera access denied</span>
            </div>
            <p className="text-sm text-red-500 mt-1">
              Please allow camera access to use the AR visualizer feature.
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ARCropVisualizer;
