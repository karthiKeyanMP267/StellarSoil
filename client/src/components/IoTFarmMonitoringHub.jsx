import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CpuChipIcon,
  SignalIcon,
  BoltIcon,
  BeakerIcon as DropletIcon,
  SunIcon,
  BeakerIcon,
  FireIcon as ThermometerIcon,
  CloudIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  AdjustmentsHorizontalIcon,
  PlayIcon,
  StopIcon,
  CogIcon
} from '@heroicons/react/24/outline';

const IoTFarmMonitoringHub = () => {
  const [sensors, setSensors] = useState([]);
  const [automationRules, setAutomationRules] = useState([]);
  const [selectedZone, setSelectedZone] = useState('zone1');
  const [realTimeData, setRealTimeData] = useState({});
  const [systemStatus, setSystemStatus] = useState('online');

  useEffect(() => {
    initializeSensors();
    initializeAutomation();
    startRealTimeUpdates();

    return () => {
      // Cleanup any intervals
    };
  }, []);

  const initializeSensors = () => {
    const mockSensors = [
      {
        id: 'temp_01',
        name: 'Temperature Sensor',
        type: 'temperature',
        zone: 'zone1',
        status: 'online',
        value: 72.5,
        unit: '°F',
        min: 60,
        max: 85,
        optimal: [68, 78],
        battery: 87,
        lastUpdate: new Date(),
        icon: ThermometerIcon,
        color: 'text-red-500'
      },
      {
        id: 'humid_01',
        name: 'Humidity Sensor',
        type: 'humidity',
        zone: 'zone1',
        status: 'online',
        value: 65,
        unit: '%',
        min: 40,
        max: 80,
        optimal: [50, 70],
        battery: 92,
        lastUpdate: new Date(),
        icon: DropletIcon,
        color: 'text-blue-500'
      },
      {
        id: 'soil_01',
        name: 'Soil Moisture',
        type: 'soil_moisture',
        zone: 'zone1',
        status: 'online',
        value: 68,
        unit: '%',
        min: 30,
        max: 90,
        optimal: [60, 75],
        battery: 78,
        lastUpdate: new Date(),
        icon: BeakerIcon,
        color: 'text-green-500'
      },
      {
        id: 'light_01',
        name: 'Light Intensity',
        type: 'light',
        zone: 'zone1',
        status: 'online',
        value: 850,
        unit: 'lux',
        min: 200,
        max: 2000,
        optimal: [500, 1500],
        battery: 95,
        lastUpdate: new Date(),
        icon: SunIcon,
        color: 'text-yellow-500'
      },
      {
        id: 'ph_01',
        name: 'Soil pH',
        type: 'ph',
        zone: 'zone1',
        status: 'warning',
        value: 5.8,
        unit: 'pH',
        min: 5.5,
        max: 8.0,
        optimal: [6.0, 7.0],
        battery: 45,
        lastUpdate: new Date(),
        icon: BeakerIcon,
        color: 'text-purple-500'
      },
      {
        id: 'co2_01',
        name: 'CO2 Level',
        type: 'co2',
        zone: 'zone1',
        status: 'online',
        value: 420,
        unit: 'ppm',
        min: 300,
        max: 800,
        optimal: [350, 500],
        battery: 88,
        lastUpdate: new Date(),
        icon: CloudIcon,
        color: 'text-gray-500'
      }
    ];
    setSensors(mockSensors);
  };

  const initializeAutomation = () => {
    const mockRules = [
      {
        id: 'auto_01',
        name: 'Smart Irrigation',
        description: 'Auto-water when soil moisture drops below 55%',
        trigger: { sensor: 'soil_01', condition: '<', value: 55 },
        action: { type: 'irrigation', duration: 15, zone: 'zone1' },
        isActive: true,
        lastTriggered: new Date(Date.now() - 2 * 60 * 60 * 1000),
        executionCount: 23
      },
      {
        id: 'auto_02',
        name: 'Climate Control',
        description: 'Activate cooling when temperature exceeds 80°F',
        trigger: { sensor: 'temp_01', condition: '>', value: 80 },
        action: { type: 'ventilation', intensity: 'high', duration: 30 },
        isActive: true,
        lastTriggered: null,
        executionCount: 7
      },
      {
        id: 'auto_03',
        name: 'pH Balance Alert',
        description: 'Send alert when pH falls outside optimal range',
        trigger: { sensor: 'ph_01', condition: 'outside', value: [6.0, 7.0] },
        action: { type: 'notification', priority: 'high', message: 'pH adjustment needed' },
        isActive: true,
        lastTriggered: new Date(Date.now() - 30 * 60 * 1000),
        executionCount: 3
      },
      {
        id: 'auto_04',
        name: 'Supplemental Lighting',
        description: 'Turn on grow lights when natural light is insufficient',
        trigger: { sensor: 'light_01', condition: '<', value: 400 },
        action: { type: 'lighting', intensity: 75, duration: 120 },
        isActive: false,
        lastTriggered: new Date(Date.now() - 24 * 60 * 60 * 1000),
        executionCount: 15
      }
    ];
    setAutomationRules(mockRules);
  };

  const startRealTimeUpdates = () => {
    // Use requestAnimationFrame for better performance
    let animationFrameId;
    let lastUpdate = 0;
    const updateInterval = 3000; // 3 seconds
    
    const updateSensors = (timestamp) => {
      // Only update if enough time has passed
      if (timestamp - lastUpdate >= updateInterval) {
        // Use a callback with requestAnimationFrame for better performance
        window.requestAnimationFrame(() => {
          setSensors(prevSensors => 
            prevSensors.map(sensor => ({
              ...sensor,
              value: generateRealisticValue(sensor),
              lastUpdate: new Date(),
              status: Math.random() < 0.95 ? 'online' : 'warning'
            }))
          );
        });
        lastUpdate = timestamp;
      }
      
      animationFrameId = requestAnimationFrame(updateSensors);
    };
    
    animationFrameId = requestAnimationFrame(updateSensors);
    
    // Return cleanup function
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  };

  const generateRealisticValue = (sensor) => {
    const variance = sensor.value * 0.05; // 5% variance
    const newValue = sensor.value + (Math.random() - 0.5) * variance;
    
    // Keep within reasonable bounds
    return Math.max(sensor.min, Math.min(sensor.max, Number(newValue.toFixed(1))));
  };

  const getSensorStatus = (sensor) => {
    const { value, optimal } = sensor;
    if (value >= optimal[0] && value <= optimal[1]) return 'optimal';
    if (value < optimal[0] - (optimal[1] - optimal[0]) * 0.2 || 
        value > optimal[1] + (optimal[1] - optimal[0]) * 0.2) return 'critical';
    return 'warning';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'optimal': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      case 'offline': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const toggleAutomation = (ruleId) => {
    setAutomationRules(rules =>
      rules.map(rule =>
        rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
      )
    );
  };

  const triggerManualAction = (action) => {
    console.log('Manual action triggered:', action);
    // Simulate action execution
  };

  const zones = [
    { id: 'zone1', name: 'Greenhouse A', sensors: 6, status: 'optimal' },
    { id: 'zone2', name: 'Greenhouse B', sensors: 4, status: 'warning' },
    { id: 'zone3', name: 'Outdoor Field', sensors: 8, status: 'optimal' }
  ];

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
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="p-3 bg-white/20 rounded-xl backdrop-blur-sm"
            >
              <CpuChipIcon className="h-8 w-8" />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold">IoT Farm Monitoring</h2>
              <p className="text-emerald-100">Real-time sensor data and smart automation</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-emerald-100">System Status</div>
            <div className="flex items-center space-x-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className={`w-3 h-3 rounded-full ${
                  systemStatus === 'online' ? 'bg-green-400' : 'bg-red-400'
                }`}
              />
              <span className="text-lg font-bold capitalize">{systemStatus}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Zone Selection */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">Select Zone</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {zones.map((zone) => (
              <motion.button
                key={zone.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedZone(zone.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedZone === zone.id
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 bg-white hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-800">{zone.name}</h4>
                  <div className={`w-3 h-3 rounded-full ${
                    zone.status === 'optimal' ? 'bg-green-500' : 'bg-yellow-500'
                  }`} />
                </div>
                <p className="text-sm text-gray-600">{zone.sensors} sensors active</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Real-time Sensor Grid */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Live Sensor Data</h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sensors.map((sensor) => {
              const Icon = sensor.icon;
              const sensorStatus = getSensorStatus(sensor);
              
              return (
                <motion.div
                  key={sensor.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-gray-100 ${sensor.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">{sensor.name}</h4>
                        <p className="text-xs text-gray-500">{sensor.id.toUpperCase()}</p>
                      </div>
                    </div>
                    
                    <div className={`p-1 rounded-full ${
                      sensor.status === 'online' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        sensor.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                    </div>
                  </div>
                  
                  {/* Current Value */}
                  <div className="mb-3">
                    <div className="text-2xl font-bold text-gray-900">
                      {sensor.value} {sensor.unit}
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full inline-block ${getStatusColor(sensorStatus)}`}>
                      {sensorStatus.toUpperCase()}
                    </div>
                  </div>
                  
                  {/* Optimal Range Indicator */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Range</span>
                      <span>{sensor.optimal[0]} - {sensor.optimal[1]} {sensor.unit}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full relative"
                        style={{ 
                          width: `${((sensor.optimal[1] - sensor.optimal[0]) / (sensor.max - sensor.min)) * 100}%`,
                          marginLeft: `${((sensor.optimal[0] - sensor.min) / (sensor.max - sensor.min)) * 100}%`
                        }}
                      >
                        <div 
                          className="absolute w-1 h-4 bg-blue-600 rounded-full -top-1"
                          style={{ 
                            left: `${((sensor.value - sensor.optimal[0]) / (sensor.optimal[1] - sensor.optimal[0])) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Battery and Last Update */}
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <BoltIcon className="h-3 w-3" />
                      <span>{sensor.battery}%</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="h-3 w-3" />
                      <span>{sensor.lastUpdate.toLocaleTimeString()}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Automation Rules */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Automation Rules</h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              <CogIcon className="h-4 w-4 mr-2 inline" />
              Add Rule
            </motion.button>
          </div>
          
          <div className="space-y-3">
            {automationRules.map((rule) => (
              <motion.div
                key={rule.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  rule.isActive 
                    ? 'border-emerald-300 bg-emerald-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleAutomation(rule.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        rule.isActive 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      {rule.isActive ? <PlayIcon className="h-4 w-4" /> : <StopIcon className="h-4 w-4" />}
                    </motion.button>
                    
                    <div>
                      <h4 className="font-medium text-gray-800">{rule.name}</h4>
                      <p className="text-sm text-gray-600">{rule.description}</p>
                    </div>
                  </div>
                  
                  <div className="text-right text-sm text-gray-600">
                    <div>Executed {rule.executionCount} times</div>
                    {rule.lastTriggered && (
                      <div>Last: {rule.lastTriggered.toLocaleTimeString()}</div>
                    )}
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <div className="font-medium text-gray-800 mb-1">Trigger</div>
                    <div className="text-gray-600">
                      {rule.trigger.sensor} {rule.trigger.condition} {
                        Array.isArray(rule.trigger.value) 
                          ? `${rule.trigger.value[0]}-${rule.trigger.value[1]}`
                          : rule.trigger.value
                      }
                    </div>
                  </div>
                  
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <div className="font-medium text-gray-800 mb-1">Action</div>
                    <div className="text-gray-600 capitalize">
                      {rule.action.type}
                      {rule.action.duration && ` for ${rule.action.duration}min`}
                      {rule.action.intensity && ` at ${rule.action.intensity}%`}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Manual Controls */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Manual Controls</h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Irrigation', icon: DropletIcon, color: 'blue', action: 'irrigation' },
              { name: 'Ventilation', icon: CloudIcon, color: 'gray', action: 'ventilation' },
              { name: 'Lighting', icon: SunIcon, color: 'yellow', action: 'lighting' },
              { name: 'Fertilizer', icon: BeakerIcon, color: 'green', action: 'fertilizer' }
            ].map((control) => {
              const Icon = control.icon;
              return (
                <motion.button
                  key={control.action}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => triggerManualAction(control.action)}
                  className={`p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-${control.color}-300 transition-all duration-200 group`}
                >
                  <Icon className={`h-8 w-8 text-${control.color}-500 mx-auto mb-2 group-hover:scale-110 transition-transform`} />
                  <div className="font-medium text-gray-800">{control.name}</div>
                  <div className="text-xs text-gray-600">Manual Control</div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* System Health */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">System Health</h3>
          
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <SignalIcon className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">98%</div>
              <div className="text-sm text-gray-600">Network Uptime</div>
            </div>
            
            <div className="text-center">
              <CpuChipIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">12</div>
              <div className="text-sm text-gray-600">Active Sensors</div>
            </div>
            
            <div className="text-center">
              <CheckCircleIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">4</div>
              <div className="text-sm text-gray-600">Active Rules</div>
            </div>
            
            <div className="text-center">
              <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">1</div>
              <div className="text-sm text-gray-600">Alerts</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default IoTFarmMonitoringHub;
