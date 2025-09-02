import React from 'react';
import { motion } from 'framer-motion';

/**
 * Comprehensive Focus Test Component
 * This component contains various elements that typically show focus rings
 * Use this to verify that ALL focus removal techniques are working properly
 */
const FocusTestComponent = () => {
  return (
    <div className="fixed bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 z-50 max-w-sm">
      <h3 className="text-sm font-bold text-gray-800 mb-3">🧪 Focus Test Panel</h3>
      <div className="space-y-2 text-xs">
        
        {/* Test Buttons */}
        <div className="space-y-1">
          <p className="font-semibold text-gray-700">Buttons:</p>
          <div className="flex gap-2">
            <button className="px-2 py-1 bg-blue-500 text-white rounded text-xs">Primary</button>
            <button className="px-2 py-1 border border-gray-300 rounded text-xs">Secondary</button>
            <button className="px-2 py-1 bg-red-500 text-white rounded text-xs">Danger</button>
          </div>
        </div>

        {/* Test Links */}
        <div className="space-y-1">
          <p className="font-semibold text-gray-700">Links:</p>
          <div className="flex gap-2">
            <a href="#" className="text-blue-600 underline text-xs">Test Link 1</a>
            <a href="#" className="text-green-600 underline text-xs">Test Link 2</a>
          </div>
        </div>

        {/* Test Inputs */}
        <div className="space-y-1">
          <p className="font-semibold text-gray-700">Inputs:</p>
          <input 
            type="text" 
            placeholder="Text input" 
            className="w-full px-2 py-1 border rounded text-xs"
          />
          <textarea 
            placeholder="Textarea" 
            className="w-full px-2 py-1 border rounded text-xs h-12 resize-none"
          />
          <select className="w-full px-2 py-1 border rounded text-xs">
            <option>Option 1</option>
            <option>Option 2</option>
          </select>
        </div>

        {/* Test Navigation Elements */}
        <div className="space-y-1">
          <p className="font-semibold text-gray-700">Nav Elements:</p>
          <nav className="flex gap-2">
            <a href="#" className="px-2 py-1 bg-gray-100 rounded text-xs">Nav Item 1</a>
            <a href="#" className="px-2 py-1 bg-gray-100 rounded text-xs">Nav Item 2</a>
          </nav>
        </div>

        {/* Test Interactive Elements */}
        <div className="space-y-1">
          <p className="font-semibold text-gray-700">Interactive:</p>
          <div className="flex gap-2">
            <label className="flex items-center text-xs">
              <input type="checkbox" className="mr-1" />
              Checkbox
            </label>
            <label className="flex items-center text-xs">
              <input type="radio" name="test" className="mr-1" />
              Radio
            </label>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-3 p-2 bg-yellow-50 rounded text-xs">
          <p className="font-semibold text-yellow-800">Test Instructions:</p>
          <ul className="text-yellow-700 mt-1 space-y-1">
            <li>• Click all elements above</li>
            <li>• Try Tab navigation</li>
            <li>• Look for ANY focus rings/boxes</li>
            <li>• All should be invisible! 🎯</li>
          </ul>
        </div>

        {/* Status Indicator */}
        <motion.div 
          className="flex items-center justify-center py-2 bg-green-50 rounded"
          animate={{ 
            backgroundColor: ['#f0fdf4', '#dcfce7', '#f0fdf4'],
            scale: [1, 1.02, 1]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-green-700 font-semibold text-xs">
            ✅ Focus Removal Active
          </span>
        </motion.div>
      </div>
    </div>
  );
};

export default FocusTestComponent;
