import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import API from '../api/api';
import {
  Cog6ToothIcon,
  BellIcon,
  ShieldCheckIcon,
  PaintBrushIcon,
  GlobeAltIcon,
  CreditCardIcon,
  UserGroupIcon,
  ChartBarIcon,
  KeyIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  SunIcon,
  MoonIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowPathIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const Settings = () => {
  const { i18n } = useTranslation();
  const [activeSection, setActiveSection] = useState('general');
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      sms: false,
      push: true,
      marketing: true,
      orders: true,
      security: true
    },
    privacy: {
      profileVisibility: 'friends',
      dataSharing: false,
      analytics: true,
      cookies: true,
      location: false
    },
    appearance: {
      theme: 'light',
      language: 'en',
      fontSize: 'medium',
      animations: true
    },
    security: {
      twoFactor: false,
      loginAlerts: true,
      sessionTimeout: 30,
      passwordExpiry: 90
    }
  });

  const [showConfirmDialog, setShowConfirmDialog] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);

  // Region Defaults state and effects
  const [regionForm, setRegionForm] = useState({ state: '', district: '', market: '', variety: '' });
  const [regionSaving, setRegionSaving] = useState(false);
  const [regionMessage, setRegionMessage] = useState(null);


  const sections = [
    { id: 'general', name: '⚙️ General', icon: Cog6ToothIcon },
    { id: 'notifications', name: '🔔 Notifications', icon: BellIcon },
    { id: 'privacy', name: '🔒 Privacy', icon: ShieldCheckIcon },
    { id: 'appearance', name: '🎨 Appearance', icon: PaintBrushIcon },
    { id: 'security', name: '🛡️ Security', icon: KeyIcon },
    { id: 'billing', name: '💳 Billing', icon: CreditCardIcon },
    { id: 'advanced', name: '🔧 Advanced', icon: ChartBarIcon }
  ];

  const handleToggle = (section, key) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: !prev[section][key]
      }
    }));
  };

  const handleSelect = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
    
    // If language is being changed, update i18n
    if (section === 'appearance' && key === 'language') {
      i18n.changeLanguage(value);
    }
  };

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    }, 1500);
  };

  // Load initial region defaults from server if authenticated
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const me = await API.get('/auth/me');
        const r = me?.data?.user?.defaultRegion || me?.data?.region;
        if (r) {
          setRegionForm({
            state: r.state || '',
            district: r.district || '',
            market: r.market || '',
            variety: r.variety || ''
          });
        }
      } catch (e) {
        // Non-fatal: keep fields empty
      }
    })();
  }, []);

  const saveRegionDefaults = async () => {
    setRegionSaving(true);
    setRegionMessage(null);
    try {
      await API.put('/auth/profile', { defaultRegion: regionForm });
      setRegionMessage({ type: 'success', text: 'Region defaults saved.' });
      // Optionally refresh
      try { 
        await API.get('/auth/me');
        // Notify other components (e.g., LiveMarketPriceWidget) to refresh region
        window.dispatchEvent(new CustomEvent('region-defaults-updated'));
      } catch {}
    } catch (err) {
      const msg = err?.response?.data?.msg || err?.message || 'Failed to save region';
      setRegionMessage({ type: 'error', text: msg });
    } finally {
      setRegionSaving(false);
      setTimeout(() => setRegionMessage(null), 3000);
    }
  };

  const confirmAction = (action) => {
    setShowConfirmDialog(null);
    // Handle the confirmed action
    console.log(`Confirmed action: ${action}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-beige-50 via-cream-50 to-sage-50 pt-20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-beige-400/10 to-cream-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-r from-sage-400/10 to-earth-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-gradient-to-r from-cream-400/10 to-beige-400/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-8">
              <div className="p-8 bg-gradient-to-r from-beige-500 to-sage-600 rounded-full shadow-2xl animate-bounce-gentle">
                <Cog6ToothIcon className="h-20 w-20 text-white drop-shadow-lg" />
              </div>
            </div>
            <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-beige-700 via-sage-600 to-earth-700 mb-6 tracking-tight drop-shadow-2xl">
              ⚙️ Settings
            </h1>
            <p className="text-2xl text-earth-700 max-w-4xl mx-auto font-bold tracking-wide leading-relaxed">
              ✨ Customize your StellarSoil experience to your preferences
            </p>
          </div>

          {/* Save Status */}
          {saveStatus && (
            <div className="fixed top-24 right-6 z-50">
              <div className={`p-4 rounded-2xl shadow-xl flex items-center space-x-3 ${
                saveStatus === 'saving' ? 'bg-gradient-to-r from-beige-500 to-sage-600' :
                saveStatus === 'success' ? 'bg-gradient-to-r from-sage-400 to-earth-500' :
                'bg-gradient-to-r from-red-500 to-pink-600'
              } text-white animate-bounce`}>
                {saveStatus === 'saving' && <SparklesIcon className="h-6 w-6 animate-spin" />}
                {saveStatus === 'success' && <CheckCircleIcon className="h-6 w-6" />}
                {saveStatus === 'error' && <XCircleIcon className="h-6 w-6" />}
                <span className="font-bold">
                  {saveStatus === 'saving' && '⏳ Saving settings...'}
                  {saveStatus === 'success' && '✅ Settings saved successfully!'}
                  {saveStatus === 'error' && '❌ Failed to save settings'}
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-amber-200/50 p-6 sticky top-28">
                <h2 className="text-2xl font-black text-amber-900 mb-6 tracking-wide">📋 Categories</h2>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center px-4 py-4 rounded-2xl font-bold transition-all duration-300 text-left ${
                        activeSection === section.id
                          ? 'bg-gradient-to-r from-amber-600 to-orange-700 text-white shadow-xl scale-105'
                          : 'text-amber-800 hover:bg-amber-100/80 hover:scale-105'
                      }`}
                    >
                      <section.icon className="h-6 w-6 mr-3" />
                      {section.name}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-amber-200/50 p-8">
                
                {/* General Settings */}
                {activeSection === 'general' && (
                  <div>
                    <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-orange-700 mb-8 tracking-wide">⚙️ General Settings</h2>
                    
                    <div className="space-y-8">
                      {/* Region Defaults (structured) */}
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200/60 p-6">
                        <h3 className="text-2xl font-black text-green-900 mb-2">📍 Region Defaults</h3>
                        <p className="text-green-800 font-medium mb-4">Used by live market prices and recommendations. Leave blank to auto-detect from your address.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-green-900 font-bold mb-1">State</label>
                            <input
                              type="text"
                              value={regionForm.state}
                              onChange={(e) => setRegionForm((p) => ({ ...p, state: e.target.value }))}
                              className="w-full px-4 py-3 bg-white border border-green-200 rounded-xl text-green-900 font-medium"
                              placeholder="e.g., Tamil Nadu"
                            />
                          </div>
                          <div>
                            <label className="block text-green-900 font-bold mb-1">District</label>
                            <input
                              type="text"
                              value={regionForm.district}
                              onChange={(e) => setRegionForm((p) => ({ ...p, district: e.target.value }))}
                              className="w-full px-4 py-3 bg-white border border-green-200 rounded-xl text-green-900 font-medium"
                              placeholder="e.g., Coimbatore"
                            />
                          </div>
                          <div>
                            <label className="block text-green-900 font-bold mb-1">Market</label>
                            <input
                              type="text"
                              value={regionForm.market}
                              onChange={(e) => setRegionForm((p) => ({ ...p, market: e.target.value }))}
                              className="w-full px-4 py-3 bg-white border border-green-200 rounded-xl text-green-900 font-medium"
                              placeholder="e.g., Coimbatore"
                            />
                          </div>
                          <div>
                            <label className="block text-green-900 font-bold mb-1">Variety (optional)</label>
                            <input
                              type="text"
                              value={regionForm.variety}
                              onChange={(e) => setRegionForm((p) => ({ ...p, variety: e.target.value }))}
                              className="w-full px-4 py-3 bg-white border border-green-200 rounded-xl text-green-900 font-medium"
                              placeholder="e.g., Hybrid"
                            />
                          </div>
                        </div>
                        <div className="mt-4 flex items-center gap-3">
                          <button
                            onClick={saveRegionDefaults}
                            disabled={regionSaving}
                            className={`px-6 py-3 rounded-xl font-bold text-white transition-all duration-300 shadow ${regionSaving ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                          >
                            {regionSaving ? 'Saving…' : 'Save Region Defaults'}
                          </button>
                          {regionMessage && (
                            <span className={`text-sm font-semibold ${regionMessage.type === 'success' ? 'text-green-700' : 'text-red-600'}`}>
                              {regionMessage.text}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Data Usage */}
                      <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border-2 border-orange-200/50 p-6">
                        <h3 className="text-2xl font-black text-orange-900 mb-6 flex items-center">
                          <ChartBarIcon className="h-8 w-8 mr-3" />
                          📊 Data & Storage
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-white/80 rounded-xl border border-orange-200/50">
                            <div>
                              <div className="text-orange-900 font-bold text-lg">💾 Auto-save drafts</div>
                              <div className="text-orange-700 font-medium">Automatically save your work</div>
                            </div>
                            <div className="w-14 h-8 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full p-1 cursor-pointer">
                              <div className="w-6 h-6 bg-white rounded-full translate-x-6 transition-all duration-300"></div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between p-4 bg-white/80 rounded-xl border border-orange-200/50">
                            <div>
                              <div className="text-orange-900 font-bold text-lg">🗑️ Auto-delete old data</div>
                              <div className="text-orange-700 font-medium">Remove data older than 1 year</div>
                            </div>
                            <div className="w-14 h-8 bg-gray-300 rounded-full p-1 cursor-pointer">
                              <div className="w-6 h-6 bg-white rounded-full transition-all duration-300"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications */}
                {activeSection === 'notifications' && (
                  <div>
                    <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-orange-700 mb-8 tracking-wide">🔔 Notification Settings</h2>
                    
                    <div className="space-y-6">
                      {[
                        { key: 'email', label: '📧 Email Notifications', desc: 'Receive updates via email' },
                        { key: 'sms', label: '📱 SMS Notifications', desc: 'Get text messages for important updates' },
                        { key: 'push', label: '🔔 Push Notifications', desc: 'Browser and mobile push notifications' },
                        { key: 'marketing', label: '🎯 Marketing Communications', desc: 'Promotional offers and newsletters' },
                        { key: 'orders', label: '📦 Order Updates', desc: 'Status updates for your orders' },
                        { key: 'security', label: '🔒 Security Alerts', desc: 'Important security notifications' }
                      ].map((item) => (
                        <div key={item.key} className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200/50 p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h3 className="text-xl font-black text-amber-900 mb-2">{item.label}</h3>
                              <p className="text-amber-700 font-medium">{item.desc}</p>
                            </div>
                            <div 
                              onClick={() => handleToggle('notifications', item.key)}
                              className={`w-16 h-9 rounded-full p-1 cursor-pointer transition-all duration-300 ${
                                settings.notifications[item.key] 
                                  ? 'bg-gradient-to-r from-amber-500 to-orange-600' 
                                  : 'bg-gray-300'
                              }`}
                            >
                              <div className={`w-7 h-7 bg-white rounded-full transition-all duration-300 ${
                                settings.notifications[item.key] ? 'translate-x-7' : 'translate-x-0'
                              }`}></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Privacy */}
                {activeSection === 'privacy' && (
                  <div>
                    <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-orange-700 mb-8 tracking-wide">🔒 Privacy Settings</h2>
                    
                    <div className="space-y-8">
                      {/* Profile Visibility */}
                      <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border-2 border-orange-200/50 p-6">
                        <h3 className="text-2xl font-black text-orange-900 mb-6 flex items-center">
                          <EyeIcon className="h-8 w-8 mr-3" />
                          👁️ Profile Visibility
                        </h3>
                        <div className="space-y-4">
                          {[...
                            { value: 'public', label: '🌐 Public', desc: 'Anyone can see your profile' },
                            { value: 'friends', label: '👥 Friends Only', desc: 'Only your connections can see' },
                            { value: 'private', label: '🔒 Private', desc: 'Only you can see your profile' }
                          ].map((option) => (
                            <label key={option.value} className="flex items-center p-4 bg-white/80 rounded-xl border border-orange-200/50 cursor-pointer hover:scale-105 transition-all duration-300">
                              <input
                                type="radio"
                                name="profileVisibility"
                                value={option.value}
                                checked={settings.privacy.profileVisibility === option.value}
                                onChange={(e) => handleSelect('privacy', 'profileVisibility', e.target.value)}
                                className="sr-only"
                              />
                              <div className={`w-6 h-6 rounded-full border-4 mr-4 transition-all duration-300 ${
                                settings.privacy.profileVisibility === option.value
                                  ? 'bg-orange-600 border-orange-600'
                                  : 'border-gray-300'
                              }`}>
                                {settings.privacy.profileVisibility === option.value && (
                                  <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1"></div>
                                )}
                              </div>
                              <div>
                                <div className="text-orange-900 font-bold text-lg">{option.label}</div>
                                <div className="text-orange-700 font-medium">{option.desc}</div>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Data Sharing */}
                      <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl border-2 border-red-200/50 p-6">
                        <h3 className="text-2xl font-black text-red-900 mb-6 flex items-center">
                          <ShieldCheckIcon className="h-8 w-8 mr-3" />
                          🛡️ Data Sharing Preferences
                        </h3>
                        <div className="space-y-4">
                          {[
                            { key: 'dataSharing', label: '📤 Share data with partners', desc: 'Allow sharing anonymized data' },
                            { key: 'analytics', label: '📊 Usage analytics', desc: 'Help improve our services' },
                            { key: 'cookies', label: '🍪 Accept cookies', desc: 'Enable personalized experience' },
                            { key: 'location', label: '📍 Location tracking', desc: 'For location-based features' }
                          ].map((item) => (
                            <div key={item.key} className="flex items-center justify-between p-4 bg-white/80 rounded-xl border border-red-200/50">
                              <div className="flex-1">
                                <div className="text-red-900 font-bold text-lg">{item.label}</div>
                                <div className="text-red-700 font-medium">{item.desc}</div>
                              </div>
                              <div 
                                onClick={() => handleToggle('privacy', item.key)}
                                className={`w-16 h-9 rounded-full p-1 cursor-pointer transition-all duration-300 ${
                                  settings.privacy[item.key] 
                                    ? 'bg-gradient-to-r from-red-500 to-pink-600' 
                                    : 'bg-gray-300'
                                }`}
                              >
                                <div className={`w-7 h-7 bg-white rounded-full transition-all duration-300 ${
                                  settings.privacy[item.key] ? 'translate-x-7' : 'translate-x-0'
                                }`}></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Appearance */}
                {activeSection === 'appearance' && (
                  <div>
                    <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-orange-700 mb-8 tracking-wide">🎨 Appearance Settings</h2>
                    
                    <div className="space-y-8">
                      {/* Theme Selection */}
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200/50 p-6">
                        <h3 className="text-2xl font-black text-purple-900 mb-6 flex items-center">
                          <PaintBrushIcon className="h-8 w-8 mr-3" />
                          🌈 Theme Selection
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {[
                            { value: 'light', label: '☀️ Light', icon: SunIcon, bg: 'from-yellow-400 to-orange-500' },
                            { value: 'dark', label: '🌙 Dark', icon: MoonIcon, bg: 'from-gray-600 to-gray-800' },
                            { value: 'auto', label: '🔄 Auto', icon: ComputerDesktopIcon, bg: 'from-blue-500 to-cyan-600' }
                          ].map((theme) => (
                            <button
                              key={theme.value}
                              onClick={() => handleSelect('appearance', 'theme', theme.value)}
                              className={`p-6 rounded-2xl border-4 transition-all duration-300 hover:scale-105 ${
                                settings.appearance.theme === theme.value
                                  ? 'border-purple-600 shadow-xl'
                                  : 'border-purple-200 hover:border-purple-400'
                              }`}
                            >
                              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${theme.bg} mx-auto mb-4 flex items-center justify-center shadow-xl`}>
                                <theme.icon className="h-10 w-10 text-white" />
                              </div>
                              <div className="text-purple-900 font-black text-lg">{theme.label}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Font Size */}
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200/50 p-6">
                        <h3 className="text-2xl font-black text-green-900 mb-6">📏 Font Size</h3>
                        <div className="space-y-4">
                          {[
                            { value: 'small', label: '📝 Small', size: 'text-sm' },
                            { value: 'medium', label: '📄 Medium', size: 'text-base' },
                            { value: 'large', label: '📋 Large', size: 'text-lg' },
                            { value: 'xlarge', label: '📊 Extra Large', size: 'text-xl' }
                          ].map((size) => (
                            <label key={size.value} className="flex items-center p-4 bg-white/80 rounded-xl border border-green-200/50 cursor-pointer hover:scale-105 transition-all duration-300">
                              <input
                                type="radio"
                                name="fontSize"
                                value={size.value}
                                checked={settings.appearance.fontSize === size.value}
                                onChange={(e) => handleSelect('appearance', 'fontSize', e.target.value)}
                                className="sr-only"
                              />
                              <div className={`w-6 h-6 rounded-full border-4 mr-4 transition-all duration-300 ${
                                settings.appearance.fontSize === size.value
                                  ? 'bg-green-600 border-green-600'
                                  : 'border-gray-300'
                              }`}>
                                {settings.appearance.fontSize === size.value && (
                                  <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1"></div>
                                )}
                              </div>
                              <span className={`text-green-900 font-bold ${size.size}`}>{size.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security */}
                {activeSection === 'security' && (
                  <div>
                    <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-orange-700 mb-8 tracking-wide">🛡️ Security Settings</h2>
                    
                    <div className="space-y-8">
                      {/* Two-Factor Authentication */}
                      <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl border-2 border-red-200/50 p-6">
                        <h3 className="text-2xl font-black text-red-900 mb-6 flex items-center">
                          <KeyIcon className="h-8 w-8 mr-3" />
                          🔐 Two-Factor Authentication
                        </h3>
                        <div className="flex items-center justify-between p-6 bg-white/80 rounded-xl border border-red-200/50">
                          <div>
                            <div className="text-red-900 font-bold text-xl mb-2">🛡️ Enable 2FA</div>
                            <div className="text-red-700 font-medium">Add an extra layer of security to your account</div>
                          </div>
                          <button 
                            onClick={() => handleToggle('security', 'twoFactor')}
                            className={`px-8 py-4 rounded-2xl font-black text-lg transition-all duration-300 hover:scale-105 ${
                              settings.security.twoFactor
                                ? 'bg-gradient-to-r from-amber-600 to-orange-700 text-white'
                                : 'bg-gradient-to-r from-red-600 to-pink-700 text-white'
                            }`}
                          >
                            {settings.security.twoFactor ? '✅ Enabled' : '❌ Disabled'}
                          </button>
                        </div>
                      </div>

                      {/* Session Management */}
                      <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border-2 border-orange-200/50 p-6">
                        <h3 className="text-2xl font-black text-orange-900 mb-6 flex items-center">
                          <DevicePhoneMobileIcon className="h-8 w-8 mr-3" />
                          📱 Session Management
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-white/80 rounded-xl border border-orange-200/50">
                            <div>
                              <div className="text-orange-900 font-bold text-lg">🚨 Login alerts</div>
                              <div className="text-orange-700 font-medium">Get notified of new logins</div>
                            </div>
                            <div 
                              onClick={() => handleToggle('security', 'loginAlerts')}
                              className={`w-16 h-9 rounded-full p-1 cursor-pointer transition-all duration-300 ${
                                settings.security.loginAlerts 
                                  ? 'bg-gradient-to-r from-amber-500 to-orange-600' 
                                  : 'bg-gray-300'
                              }`}
                            >
                              <div className={`w-7 h-7 bg-white rounded-full transition-all duration-300 ${
                                settings.security.loginAlerts ? 'translate-x-7' : 'translate-x-0'
                              }`}></div>
                            </div>
                          </div>
                          
                          <div className="p-4 bg-white/80 rounded-xl border border-orange-200/50">
                            <div className="text-orange-900 font-bold text-lg mb-3">⏰ Session timeout</div>
                            <select 
                              value={settings.security.sessionTimeout}
                              onChange={(e) => handleSelect('security', 'sessionTimeout', parseInt(e.target.value))}
                              className="w-full px-4 py-3 bg-white border border-orange-200 rounded-xl text-orange-900 font-medium"
                            >
                              <option value={15}>15 minutes</option>
                              <option value={30}>30 minutes</option>
                              <option value={60}>1 hour</option>
                              <option value={120}>2 hours</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Danger Zone */}
                      <div className="bg-gradient-to-br from-red-100 to-pink-100 rounded-2xl border-4 border-red-300/50 p-6">
                        <h3 className="text-2xl font-black text-red-900 mb-6 flex items-center">
                          <ExclamationTriangleIcon className="h-8 w-8 mr-3" />
                          ⚠️ Danger Zone
                        </h3>
                        <div className="space-y-4">
                          <button 
                            onClick={() => setShowConfirmDialog('reset')}
                            className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-orange-600 to-red-700 text-white font-black rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-105 text-lg"
                          >
                            <ArrowPathIcon className="h-6 w-6 mr-3" />
                            🔄 Reset All Settings
                          </button>
                          <button 
                            onClick={() => setShowConfirmDialog('delete')}
                            className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-red-700 to-pink-800 text-white font-black rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-105 text-lg"
                          >
                            <TrashIcon className="h-6 w-6 mr-3" />
                            🗑️ Delete Account
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Other sections can be added here */}
                {activeSection === 'billing' && (
                  <div className="text-center py-16">
                    <CreditCardIcon className="h-24 w-24 text-amber-600 mx-auto mb-6" />
                    <h2 className="text-4xl font-black text-amber-900 mb-4">💳 Billing Settings</h2>
                    <p className="text-xl text-amber-700 font-medium">Coming soon! Manage your payment methods and billing preferences.</p>
                  </div>
                )}

                {activeSection === 'advanced' && (
                  <div className="text-center py-16">
                    <ChartBarIcon className="h-24 w-24 text-amber-600 mx-auto mb-6" />
                    <h2 className="text-4xl font-black text-amber-900 mb-4">🔧 Advanced Settings</h2>
                    <p className="text-xl text-amber-700 font-medium">Power user features and advanced configurations coming soon!</p>
                  </div>
                )}

                {/* Save Button */}
                <div className="flex justify-center mt-12 pt-8 border-t border-amber-200/50">
                  <button 
                    onClick={handleSave}
                    disabled={saveStatus === 'saving'}
                    className="flex items-center px-12 py-5 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white font-black rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 text-xl tracking-wide disabled:opacity-50"
                  >
                    {saveStatus === 'saving' ? (
                      <>
                        <SparklesIcon className="h-7 w-7 mr-3 animate-spin" />
                        💾 Saving Settings...
                      </>
                    ) : (
                      <>
                        <CheckCircleIcon className="h-7 w-7 mr-3" />
                        💾 Save All Settings
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Dialog */}
        {showConfirmDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl border-4 border-red-500/50 p-8 max-w-md w-full">
              <div className="text-center">
                <ExclamationTriangleIcon className="h-16 w-16 text-red-600 mx-auto mb-4" />
                <h3 className="text-2xl font-black text-red-900 mb-4">
                  {showConfirmDialog === 'reset' ? '🔄 Reset Settings?' : '🗑️ Delete Account?'}
                </h3>
                <p className="text-red-700 font-medium mb-8 leading-relaxed">
                  {showConfirmDialog === 'reset' 
                    ? 'This will reset all your settings to default values. This action cannot be undone.'
                    : 'This will permanently delete your account and all associated data. This action cannot be undone.'
                  }
                </p>
                <div className="flex space-x-4">
                  <button 
                    onClick={() => setShowConfirmDialog(null)}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300"
                  >
                    ❌ Cancel
                  </button>
                  <button 
                    onClick={() => confirmAction(showConfirmDialog)}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-700 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300"
                  >
                    {showConfirmDialog === 'reset' ? '🔄 Reset' : '🗑️ Delete'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
