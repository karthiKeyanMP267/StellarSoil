import React, { useState } from 'react';
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon, 
  ClockIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  PaperAirplaneIcon,
  UserIcon,
  ExclamationCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    category: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const contactMethods = [
    {
      icon: PhoneIcon,
      title: "📞 Call Us",
      info: "+91 98765 43210",
      description: "Available 24/7 for urgent inquiries",
      action: "tel:+919876543210",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      icon: EnvelopeIcon,
      title: "✉️ Email Us",
      info: "support@stellarsoil.com",
      description: "We'll respond within 2 hours",
      action: "mailto:support@stellarsoil.com",
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: "💬 Live Chat",
      info: "Chat with our team",
      description: "Instant support for quick questions",
      action: "#",
      gradient: "from-purple-500 to-pink-600"
    },
    {
      icon: MapPinIcon,
      title: "📍 Visit Us",
      info: "123 Agriculture Hub, Delhi",
      description: "Monday - Saturday, 9 AM - 6 PM",
      action: "#",
      gradient: "from-orange-500 to-red-600"
    }
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        category: 'general'
      });
      
      // Reset status after 3 seconds
      setTimeout(() => setSubmitStatus(null), 3000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-25 to-orange-50 pt-20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-yellow-400/10 to-amber-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-r from-orange-400/10 to-yellow-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-gradient-to-r from-amber-400/10 to-orange-400/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-20">
            <div className="flex justify-center mb-8">
              <div className="p-8 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full shadow-2xl animate-bounce-gentle">
                <ChatBubbleLeftRightIcon className="h-20 w-20 text-white drop-shadow-lg" />
              </div>
            </div>
            <h1 className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-orange-600 to-amber-700 mb-8 tracking-tight drop-shadow-2xl animate-pulse">
              📞 Get in Touch
            </h1>
            <p className="text-3xl text-amber-700 max-w-5xl mx-auto font-bold tracking-wide leading-relaxed mb-12">
              ✨ We're here to help! Reach out with any questions, concerns, or feedback
            </p>
          </div>

          {/* Contact Methods */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {contactMethods.map((method, index) => (
              <a
                key={index}
                href={method.action}
                className="group bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-amber-200/50 p-8 hover:shadow-2xl transition-all duration-500 hover:scale-105 text-center block"
              >
                <div className={`p-6 bg-gradient-to-r ${method.gradient} rounded-3xl mb-6 group-hover:scale-110 transition-all duration-500 shadow-2xl mx-auto w-fit`}>
                  <method.icon className="h-12 w-12 text-white drop-shadow-lg" />
                </div>
                <h3 className="text-2xl font-black text-amber-900 mb-3 tracking-wide">{method.title}</h3>
                <p className="text-xl font-bold text-amber-700 mb-3">{method.info}</p>
                <p className="text-amber-600 font-medium">{method.description}</p>
              </a>
            ))}
          </div>

          {/* Contact Form and Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-amber-200/50 p-10">
              <div className="flex items-center space-x-4 mb-8">
                <div className="p-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl shadow-xl">
                  <PaperAirplaneIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-4xl font-black text-amber-900 tracking-wide">📝 Send us a Message</h2>
                  <p className="text-amber-700 font-medium">We'll get back to you as soon as possible</p>
                </div>
              </div>

              {/* Success/Error Messages */}
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300/50 rounded-2xl flex items-center animate-bounce">
                  <CheckCircleIcon className="h-6 w-6 text-green-600 mr-3" />
                  <span className="text-green-800 font-bold">Message sent successfully! We'll be in touch soon. 🎉</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-amber-900 font-bold mb-3 text-lg">👤 Full Name</label>
                    <div className="relative">
                      <UserIcon className="h-6 w-6 absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-600" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-amber-200 rounded-2xl text-amber-900 placeholder-amber-600 focus:ring-4 focus:ring-amber-400/50 focus:border-amber-400 transition-all text-lg font-medium"
                        placeholder="Your name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-amber-900 font-bold mb-3 text-lg">📧 Email Address</label>
                    <div className="relative">
                      <EnvelopeIcon className="h-6 w-6 absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-600" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-amber-200 rounded-2xl text-amber-900 placeholder-amber-600 focus:ring-4 focus:ring-amber-400/50 focus:border-amber-400 transition-all text-lg font-medium"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-amber-900 font-bold mb-3 text-lg">📱 Phone Number</label>
                    <div className="relative">
                      <PhoneIcon className="h-6 w-6 absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-600" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-amber-200 rounded-2xl text-amber-900 placeholder-amber-600 focus:ring-4 focus:ring-amber-400/50 focus:border-amber-400 transition-all text-lg font-medium"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-amber-900 font-bold mb-3 text-lg">📂 Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 bg-white/80 backdrop-blur-sm border border-amber-200 rounded-2xl text-amber-900 focus:ring-4 focus:ring-amber-400/50 focus:border-amber-400 transition-all text-lg font-medium"
                    >
                      <option value="general">🤔 General Inquiry</option>
                      <option value="support">🛠️ Technical Support</option>
                      <option value="partnership">🤝 Partnership</option>
                      <option value="feedback">💭 Feedback</option>
                      <option value="complaint">❗ Complaint</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-amber-900 font-bold mb-3 text-lg">📋 Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-4 bg-white/80 backdrop-blur-sm border border-amber-200 rounded-2xl text-amber-900 placeholder-amber-600 focus:ring-4 focus:ring-amber-400/50 focus:border-amber-400 transition-all text-lg font-medium"
                    placeholder="Brief subject line"
                  />
                </div>

                <div>
                  <label className="block text-amber-900 font-bold mb-3 text-lg">💬 Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-4 bg-white/80 backdrop-blur-sm border border-amber-200 rounded-2xl text-amber-900 placeholder-amber-600 focus:ring-4 focus:ring-amber-400/50 focus:border-amber-400 transition-all text-lg font-medium resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex items-center justify-center px-8 py-5 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white font-black rounded-2xl shadow-2xl hover:from-amber-700 hover:via-orange-700 hover:to-red-700 transition-all duration-300 hover:scale-105 text-xl tracking-wide group ${isSubmitting ? 'animate-pulse' : ''}`}
                >
                  {isSubmitting ? (
                    <>
                      <SparklesIcon className="h-7 w-7 mr-3 animate-spin" />
                      ✨ Sending Message...
                    </>
                  ) : (
                    <>
                      <PaperAirplaneIcon className="h-7 w-7 mr-3 group-hover:animate-bounce" />
                      🚀 Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Office Hours */}
              <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-amber-200/50 p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="p-4 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl shadow-xl">
                    <ClockIcon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-black text-amber-900 tracking-wide">🕒 Office Hours</h3>
                </div>
                <div className="space-y-4 text-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-amber-800">Monday - Friday:</span>
                    <span className="text-amber-700 font-medium">9:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-amber-800">Saturday:</span>
                    <span className="text-amber-700 font-medium">10:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-amber-800">Sunday:</span>
                    <span className="text-amber-700 font-medium">Emergency Support Only</span>
                  </div>
                  <div className="mt-6 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl border border-green-400/30">
                    <p className="text-green-800 font-bold text-center">✅ 24/7 Emergency Support Available</p>
                  </div>
                </div>
              </div>

              {/* FAQ Link */}
              <div className="bg-gradient-to-br from-amber-100/80 to-orange-100/80 backdrop-blur-xl rounded-3xl shadow-xl border border-amber-200/50 p-8">
                <div className="text-center">
                  <div className="p-6 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mx-auto mb-6 w-fit shadow-2xl">
                    <ExclamationCircleIcon className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-3xl font-black text-amber-900 mb-4 tracking-wide">❓ Quick Answers</h3>
                  <p className="text-amber-800 text-lg font-medium mb-6 leading-relaxed">
                    Check out our FAQ section for instant answers to common questions
                  </p>
                  <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black rounded-2xl shadow-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-110 text-lg tracking-wide">
                    📖 View FAQ
                  </button>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-gradient-to-br from-red-50/80 to-orange-50/80 backdrop-blur-xl rounded-3xl shadow-xl border border-red-200/50 p-8">
                <div className="text-center">
                  <div className="p-6 bg-gradient-to-r from-red-500 to-orange-600 rounded-full mx-auto mb-6 w-fit shadow-2xl animate-pulse">
                    <PhoneIcon className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-3xl font-black text-red-800 mb-4 tracking-wide">🚨 Emergency Contact</h3>
                  <p className="text-red-700 text-lg font-medium mb-4">For urgent issues or time-sensitive matters:</p>
                  <a href="tel:+911800123456" className="text-2xl font-black text-red-600 hover:text-red-800 transition-colors">
                    📞 1800-123-456
                  </a>
                  <p className="text-red-600 font-medium mt-2">Available 24/7</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
