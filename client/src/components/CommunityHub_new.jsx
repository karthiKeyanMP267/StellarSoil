import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChatBubbleOvalLeftEllipsisIcon, 
  AcademicCapIcon,
  ShareIcon,
  HeartIcon,
  PlusIcon,
  SparklesIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';

const CommunityHub = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Farmer Kumar',
      title: 'Natural Pest Control Tips',
      content: 'Here are some effective natural methods I use to control pests in my organic farm. Using neem oil and companion planting has significantly reduced pest damage.',
      likes: 24,
      comments: 8,
      tags: ['organic', 'pestControl', 'sustainable'],
      isLiked: false,
      avatar: '👨‍🌾',
      timeAgo: '2 hours ago'
    },
    {
      id: 2,
      author: 'Priya Farmer',
      title: 'Water Conservation Techniques',
      content: 'Sharing my experience with drip irrigation and rainwater harvesting. These methods have helped me save 40% water this season.',
      likes: 18,
      comments: 5,
      tags: ['waterConservation', 'irrigation', 'sustainability'],
      isLiked: true,
      avatar: '👩‍🌾',
      timeAgo: '4 hours ago'
    },
    {
      id: 3,
      author: 'Green Valley Farms',
      title: 'Soil Health Management',
      content: 'Tips for maintaining healthy soil through composting and crop rotation. Our soil quality has improved dramatically over the past year.',
      likes: 31,
      comments: 12,
      tags: ['soilHealth', 'composting', 'cropRotation'],
      isLiked: false,
      avatar: '🌱',
      timeAgo: '1 day ago'
    }
  ]);

  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    tags: ''
  });

  const [showNewPostForm, setShowNewPostForm] = useState(false);

  const handleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          isLiked: !post.isLiked
        };
      }
      return post;
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const post = {
      id: posts.length + 1,
      author: 'You',
      ...newPost,
      tags: newPost.tags.split(',').map(tag => tag.trim()),
      likes: 0,
      comments: 0,
      isLiked: false,
      avatar: '🧑‍🌾',
      timeAgo: 'Just now'
    };
    setPosts([post, ...posts]);
    setNewPost({ title: '', content: '', tags: '' });
    setShowNewPostForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-beige-50 via-cream-50 to-sage-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-beige-500 to-sage-600 rounded-2xl shadow-2xl mb-6"
            whileHover={{ scale: 1.05, rotate: 2 }}
            animate={{ 
              boxShadow: [
                "0 20px 25px -5px rgba(176, 141, 70, 0.4)",
                "0 25px 30px -5px rgba(74, 115, 74, 0.4)",
                "0 20px 25px -5px rgba(176, 141, 70, 0.4)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <AcademicCapIcon className="h-12 w-12 text-white" />
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-beige-700 via-sage-600 to-earth-700 mb-4"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            🌾 Community Hub
          </motion.h1>
          
          <motion.p 
            className="text-lg text-earth-600 max-w-2xl mx-auto font-medium"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Share knowledge, learn from fellow farmers, and grow together
          </motion.p>
        </motion.div>

        {/* Create Post Button */}
        <motion.div 
          className="mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <motion.button
            onClick={() => setShowNewPostForm(true)}
            className="w-full p-6 bg-white/80 backdrop-blur-sm border-2 border-dashed border-beige-300 rounded-2xl hover:border-beige-400 hover:bg-white/90 transition-all duration-300 group"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-center space-x-3 text-earth-600 group-hover:text-beige-700">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <PlusIcon className="h-8 w-8" />
              </motion.div>
              <span className="text-xl font-bold">Share Your Knowledge</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <SparklesIcon className="h-6 w-6" />
              </motion.div>
            </div>
          </motion.button>
        </motion.div>

        {/* New Post Form Modal */}
        <AnimatePresence>
          {showNewPostForm && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNewPostForm(false)}
            >
              <motion.div
                className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-earth-800">Share Your Knowledge</h3>
                  <button
                    onClick={() => setShowNewPostForm(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  >
                    <XMarkIcon className="h-6 w-6 text-gray-500" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-earth-700 mb-2">
                      Post Title
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your post title"
                      value={newPost.title}
                      onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                      className="w-full px-4 py-3 border border-beige-200 rounded-xl focus:ring-2 focus:ring-beige-400 focus:border-transparent transition-all duration-300"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-earth-700 mb-2">
                      Content
                    </label>
                    <textarea
                      placeholder="Share your farming tips, experiences, or questions..."
                      value={newPost.content}
                      onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                      className="w-full px-4 py-3 border border-beige-200 rounded-xl focus:ring-2 focus:ring-beige-400 focus:border-transparent transition-all duration-300"
                      rows="6"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-earth-700 mb-2">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., organic, sustainable, tips"
                      value={newPost.tags}
                      onChange={(e) => setNewPost({...newPost, tags: e.target.value})}
                      className="w-full px-4 py-3 border border-beige-200 rounded-xl focus:ring-2 focus:ring-beige-400 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                  
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowNewPostForm(false)}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-beige-500 to-sage-600 text-white rounded-xl hover:from-beige-600 hover:to-sage-700 transition-all duration-300 font-bold"
                    >
                      Share Knowledge
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-beige-200/50 overflow-hidden hover:shadow-xl transition-all duration-300"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="p-6">
                {/* Post Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <motion.div 
                      className="text-2xl"
                      whileHover={{ scale: 1.2, rotate: 10 }}
                    >
                      {post.avatar}
                    </motion.div>
                    <div>
                      <h4 className="font-bold text-earth-800">{post.author}</h4>
                      <p className="text-sm text-earth-500">{post.timeAgo}</p>
                    </div>
                  </div>
                  <div className="text-sm text-earth-500">
                    #{post.id}
                  </div>
                </div>

                {/* Post Content */}
                <motion.h3 
                  className="text-xl font-bold text-earth-800 mb-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {post.title}
                </motion.h3>
                
                <motion.p 
                  className="text-earth-600 mb-4 leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {post.content}
                </motion.p>

                {/* Tags */}
                <motion.div 
                  className="flex flex-wrap gap-2 mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {post.tags.map((tag, tagIndex) => (
                    <motion.span
                      key={tagIndex}
                      className="px-3 py-1 bg-gradient-to-r from-beige-100 to-sage-100 text-earth-700 text-sm rounded-full font-medium border border-beige-200"
                      whileHover={{ scale: 1.05 }}
                    >
                      #{tag}
                    </motion.span>
                  ))}
                </motion.div>

                {/* Post Actions */}
                <motion.div 
                  className="flex items-center justify-between pt-4 border-t border-beige-200"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center space-x-6">
                    <motion.button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center space-x-2 transition-colors duration-300 ${
                        post.isLiked ? 'text-red-600' : 'text-earth-500 hover:text-red-600'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {post.isLiked ? (
                        <HeartSolid className="h-5 w-5" />
                      ) : (
                        <HeartIcon className="h-5 w-5" />
                      )}
                      <span className="font-medium">{post.likes}</span>
                    </motion.button>
                    
                    <motion.button
                      className="flex items-center space-x-2 text-earth-500 hover:text-beige-600 transition-colors duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5" />
                      <span className="font-medium">{post.comments}</span>
                    </motion.button>
                    
                    <motion.button
                      className="flex items-center space-x-2 text-earth-500 hover:text-sage-600 transition-colors duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ShareIcon className="h-5 w-5" />
                      <span className="font-medium">Share</span>
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.button
            className="px-8 py-4 bg-gradient-to-r from-beige-500 to-sage-600 text-white rounded-2xl font-bold hover:from-beige-600 hover:to-sage-700 transition-all duration-300 shadow-xl"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Load More Posts
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default CommunityHub;
