import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HeartIcon,
  ChatBubbleLeftIcon,
  ShareIcon,
  UserGroupIcon,
  StarIcon,
  CameraIcon,
  MapPinIcon,
  ClockIcon,
  FireIcon,
  TrophyIcon,
  GiftIcon,
  ShoppingCartIcon,
  EyeIcon,
  HandThumbUpIcon
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartSolidIcon,
  StarIcon as StarSolidIcon
} from '@heroicons/react/24/solid';

const SocialCommerceIntegration = () => {
  const [activeTab, setActiveTab] = useState('feed');
  const [posts, setPosts] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [userStats, setUserStats] = useState({});

  useEffect(() => {
    // Initialize mock data
    initializeMockData();
  }, []);

  const initializeMockData = () => {
    setPosts([
      {
        id: 1,
        user: { name: 'Sarah Chen', avatar: '👩‍🌾', verified: true, level: 'Master Farmer' },
        content: 'Just harvested these beautiful heirloom tomatoes! 🍅 Using companion planting with basil - the flavor is incredible!',
        images: ['🍅', '🌿'],
        location: 'California, USA',
        timestamp: '2 hours ago',
        likes: 127,
        comments: 23,
        shares: 8,
        isLiked: false,
        products: [
          { name: 'Heirloom Tomatoes', price: 8.99, quantity: '2 lbs', inStock: true }
        ],
        tags: ['organic', 'heirloom', 'companion-planting']
      },
      {
        id: 2,
        user: { name: 'Farm Fresh Co-op', avatar: '🏢', verified: true, level: 'Community Leader' },
        content: 'New seasonal box is ready! 📦 Features 12 local farms and supports our community challenge. Every box sold helps plant trees! 🌳',
        images: ['📦', '🥕', '🥬', '🌶️'],
        location: 'Portland, OR',
        timestamp: '4 hours ago',
        likes: 89,
        comments: 15,
        shares: 12,
        isLiked: true,
        products: [
          { name: 'Seasonal Farm Box', price: 49.99, quantity: '12 items', inStock: true },
          { name: 'Tree Planting Donation', price: 5.00, quantity: '1 tree', inStock: true }
        ],
        tags: ['seasonal', 'community', 'sustainability']
      },
      {
        id: 3,
        user: { name: 'Miguel Rodriguez', avatar: '👨‍🌾', verified: false, level: 'Rising Star' },
        content: 'Participating in the #30DayHarvest challenge! Day 15: These peppers are coming along nicely 🌶️ Thanks for all the tips from the community!',
        images: ['🌶️', '📊'],
        location: 'Texas, USA',
        timestamp: '6 hours ago',
        likes: 64,
        comments: 31,
        shares: 5,
        isLiked: false,
        challenge: '30-Day Harvest Challenge',
        products: [
          { name: 'Organic Bell Peppers', price: 6.50, quantity: '1 lb', inStock: false }
        ],
        tags: ['challenge', 'peppers', 'community-support']
      }
    ]);

    setChallenges([
      {
        id: 1,
        title: '30-Day Harvest Challenge',
        description: 'Document your daily harvest and share growing tips',
        participants: 1247,
        prize: '🏆 $500 + Farm Equipment',
        daysLeft: 15,
        myProgress: 15,
        totalDays: 30,
        trending: true
      },
      {
        id: 2,
        title: 'Sustainable Farming Practices',
        description: 'Share your eco-friendly farming innovations',
        participants: 834,
        prize: '🌱 Eco-Certification + $300',
        daysLeft: 7,
        myProgress: 0,
        totalDays: 21,
        trending: false
      },
      {
        id: 3,
        title: 'Recipe Creation Contest',
        description: 'Create unique recipes using local produce',
        participants: 456,
        prize: '👨‍🍳 Cookbook Feature + $200',
        daysLeft: 3,
        myProgress: 8,
        totalDays: 14,
        trending: true
      }
    ]);

    setCommunities([
      {
        id: 1,
        name: 'Organic Growers United',
        members: 12847,
        avatar: '🌱',
        description: 'Passionate about chemical-free farming',
        isJoined: true,
        recentActivity: '23 new posts today'
      },
      {
        id: 2,
        name: 'Urban Farmers Network',
        members: 8934,
        avatar: '🏙️',
        description: 'Growing food in city spaces',
        isJoined: false,
        recentActivity: '15 new posts today'
      },
      {
        id: 3,
        name: 'Heirloom Variety Enthusiasts',
        members: 5621,
        avatar: '🍅',
        description: 'Preserving traditional plant varieties',
        isJoined: true,
        recentActivity: '8 new posts today'
      }
    ]);

    setUserStats({
      followers: 1234,
      following: 567,
      posts: 89,
      sales: 45,
      rating: 4.8,
      level: 'Master Farmer',
      badges: ['🌟', '🏆', '🌱', '👥']
    });
  };

  const toggleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const joinChallenge = (challengeId) => {
    setChallenges(challenges.map(challenge =>
      challenge.id === challengeId
        ? { ...challenge, participants: challenge.participants + 1 }
        : challenge
    ));
  };

  const joinCommunity = (communityId) => {
    setCommunities(communities.map(community =>
      community.id === communityId
        ? { ...community, isJoined: !community.isJoined, members: community.isJoined ? community.members - 1 : community.members + 1 }
        : community
    ));
  };

  const addToCart = (product) => {
    // Simulate adding to cart
    console.log('Added to cart:', product);
  };

  const PostCard = ({ post }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-6"
    >
      {/* Post Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{post.user.avatar}</div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-800">{post.user.name}</span>
                {post.user.verified && <StarSolidIcon className="h-4 w-4 text-yellow-500" />}
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  {post.user.level}
                </span>
                <MapPinIcon className="h-3 w-3" />
                <span>{post.location}</span>
                <ClockIcon className="h-3 w-3" />
                <span>{post.timestamp}</span>
              </div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ShareIcon className="h-5 w-5 text-gray-600" />
          </motion.button>
        </div>
      </div>

      {/* Post Content */}
      <div className="p-4">
        <p className="text-gray-800 leading-relaxed mb-4">{post.content}</p>
        
        {/* Challenge Badge */}
        {post.challenge && (
          <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
            <div className="flex items-center space-x-2">
              <TrophyIcon className="h-5 w-5 text-purple-600" />
              <span className="text-purple-800 font-medium">{post.challenge}</span>
            </div>
          </div>
        )}

        {/* Images */}
        {post.images && (
          <div className="grid grid-cols-2 gap-2 mb-4">
            {post.images.map((image, index) => (
              <div key={index} className="aspect-square bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center text-4xl">
                {image}
              </div>
            ))}
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
              #{tag}
            </span>
          ))}
        </div>

        {/* Products */}
        {post.products && (
          <div className="space-y-2 mb-4">
            <h4 className="text-sm font-semibold text-gray-800">🛒 Available Products:</h4>
            {post.products.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{product.name}</p>
                  <p className="text-sm text-gray-600">{product.quantity}</p>
                  <p className="text-lg font-bold text-green-600">${product.price}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addToCart(product)}
                  disabled={!product.inStock}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    product.inStock 
                      ? 'bg-green-500 text-white hover:bg-green-600' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {product.inStock ? (
                    <>
                      <ShoppingCartIcon className="h-4 w-4 mr-1 inline" />
                      Add
                    </>
                  ) : (
                    'Sold Out'
                  )}
                </motion.button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => toggleLike(post.id)}
              className="flex items-center space-x-2"
            >
              {post.isLiked ? (
                <HeartSolidIcon className="h-5 w-5 text-red-500" />
              ) : (
                <HeartIcon className="h-5 w-5 text-gray-600" />
              )}
              <span className="text-sm font-medium text-gray-700">{post.likes}</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center space-x-2"
            >
              <ChatBubbleLeftIcon className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">{post.comments}</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center space-x-2"
            >
              <ShareIcon className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">{post.shares}</span>
            </motion.button>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <EyeIcon className="h-4 w-4" />
            <span>{post.likes * 3 + post.comments * 2 + 150} views</span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-beige-200/50 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="p-3 bg-white/20 rounded-xl backdrop-blur-sm"
            >
              <UserGroupIcon className="h-8 w-8" />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold">Social Commerce</h2>
              <p className="text-rose-100">Connect, share, and sell with the farming community</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-rose-100">Your Community</div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold">{userStats.followers}</span>
              <span className="text-sm">followers</span>
              <span className="mx-2">•</span>
              <span className="text-lg font-bold">{userStats.following}</span>
              <span className="text-sm">following</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex space-x-8 px-6">
          {[
            { id: 'feed', name: 'Community Feed', icon: FireIcon },
            { id: 'challenges', name: 'Challenges', icon: TrophyIcon },
            { id: 'communities', name: 'Communities', icon: UserGroupIcon }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-rose-500 text-rose-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{tab.name}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'feed' && (
            <motion.div
              key="feed"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Create Post */}
              <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl p-4 border border-rose-200">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">👩‍🌾</div>
                  <input
                    type="text"
                    placeholder="Share your farming journey..."
                    className="flex-1 bg-white rounded-xl px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 bg-rose-500 text-white rounded-xl hover:bg-rose-600"
                  >
                    <CameraIcon className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>

              {/* Posts Feed */}
              <div>
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'challenges' && (
            <motion.div
              key="challenges"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Community Challenges</h3>
                <p className="text-gray-600">Join challenges to grow, learn, and win prizes!</p>
              </div>

              <div className="grid gap-6">
                {challenges.map((challenge) => (
                  <motion.div
                    key={challenge.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="text-lg font-bold text-gray-800">{challenge.title}</h4>
                            {challenge.trending && (
                              <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                                <FireIcon className="h-3 w-3 mr-1" />
                                Trending
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 mb-3">{challenge.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>👥 {challenge.participants} participants</span>
                            <span>⏰ {challenge.daysLeft} days left</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl mb-2">{challenge.prize.split(' ')[0]}</div>
                          <div className="text-sm font-medium text-gray-800">
                            {challenge.prize.split(' ').slice(1).join(' ')}
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      {challenge.myProgress > 0 && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Your Progress</span>
                            <span>{challenge.myProgress}/{challenge.totalDays} days</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(challenge.myProgress / challenge.totalDays) * 100}%` }}
                              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                            />
                          </div>
                        </div>
                      )}

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => joinChallenge(challenge.id)}
                        className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                          challenge.myProgress > 0
                            ? 'bg-green-100 text-green-800 border border-green-200'
                            : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                        }`}
                      >
                        {challenge.myProgress > 0 ? 'Continue Challenge' : 'Join Challenge'}
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'communities' && (
            <motion.div
              key="communities"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Farming Communities</h3>
                <p className="text-gray-600">Connect with like-minded farmers and enthusiasts</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {communities.map((community) => (
                  <motion.div
                    key={community.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="text-3xl">{community.avatar}</div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-800">{community.name}</h4>
                          <p className="text-sm text-gray-600">{community.description}</p>
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Members</span>
                          <span className="font-medium">{community.members.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Activity</span>
                          <span className="font-medium text-green-600">{community.recentActivity}</span>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => joinCommunity(community.id)}
                        className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                          community.isJoined
                            ? 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'
                            : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                        }`}
                      >
                        {community.isJoined ? 'Joined ✓' : 'Join Community'}
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SocialCommerceIntegration;
