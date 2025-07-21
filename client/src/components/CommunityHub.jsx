import React, { useState } from 'react';
import { 
  ChatBubbleOvalLeftEllipsisIcon, 
  AcademicCapIcon,
  ShareIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';

const CommunityHub = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Farmer Kumar',
      title: 'Natural Pest Control Tips',
      content: 'Here are some effective natural methods I use to control pests...',
      likes: 24,
      comments: 8,
      tags: ['organic', 'pestControl', 'sustainable'],
      isLiked: false
    },
    // Add more sample posts
  ]);

  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    tags: ''
  });

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
      author: 'Current User',
      ...newPost,
      tags: newPost.tags.split(',').map(tag => tag.trim()),
      likes: 0,
      comments: 0,
      isLiked: false
    };
    setPosts([post, ...posts]);
    setNewPost({ title: '', content: '', tags: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Create Post Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center mb-6">
          <AcademicCapIcon className="h-8 w-8 text-green-600 mr-3" />
          <h2 className="text-2xl font-semibold text-gray-900">Share Your Knowledge</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Post Title"
              value={newPost.title}
              onChange={(e) => setNewPost({...newPost, title: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <textarea
              placeholder="Share your farming tips, experiences, or questions..."
              value={newPost.content}
              onChange={(e) => setNewPost({...newPost, content: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows="4"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Tags (comma-separated)"
              value={newPost.tags}
              onChange={(e) => setNewPost({...newPost, tags: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-colors"
          >
            Share Knowledge
          </button>
        </form>
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.map(post => (
          <div key={post.id} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{post.title}</h3>
                <p className="text-sm text-gray-600">Posted by {post.author}</p>
              </div>
              <div className="flex space-x-2">
                {post.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-gray-700 mb-4">{post.content}</p>

            <div className="flex items-center justify-between border-t pt-4">
              <div className="flex items-center space-x-6">
                <button
                  onClick={() => handleLike(post.id)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-green-600"
                >
                  {post.isLiked ? (
                    <HeartSolid className="h-5 w-5 text-green-600" />
                  ) : (
                    <HeartIcon className="h-5 w-5" />
                  )}
                  <span>{post.likes}</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-green-600">
                  <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5" />
                  <span>{post.comments}</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-green-600">
                  <ShareIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityHub;
