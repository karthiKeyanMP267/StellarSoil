import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  variant = 'default',
  animation = 'hover',
  className = '',
  onClick,
  hover = true,
  padding = 'normal',
  ...props 
}) => {
  const baseClasses = "bg-white/90 backdrop-blur-sm border border-beige-200/50 transition-all duration-300";
  
  const variants = {
    default: "rounded-2xl shadow-soft hover:shadow-medium",
    elevated: "rounded-2xl shadow-medium hover:shadow-strong",
    glass: "rounded-2xl bg-white/80 backdrop-blur-lg border-white/20 shadow-medium",
    gradient: "rounded-2xl bg-gradient-to-br from-white via-beige-50 to-cream-50 shadow-soft hover:shadow-medium",
    outlined: "rounded-2xl border-2 border-beige-300 bg-white/95 shadow-soft hover:shadow-medium hover:border-beige-400",
    minimal: "rounded-xl bg-white shadow-soft hover:shadow-medium",
    organic: "rounded-3xl bg-gradient-to-br from-sage-50 via-white to-cream-50 shadow-soft hover:shadow-medium border-sage-200/50",
    earth: "rounded-2xl bg-gradient-to-br from-earth-50 via-white to-beige-50 shadow-soft hover:shadow-medium border-earth-200/50"
  };
  
  const paddings = {
    none: "",
    small: "p-4",
    normal: "p-6",
    large: "p-8",
    xlarge: "p-10"
  };
  
  const animations = {
    none: {},
    hover: hover ? {
      whileHover: { y: -5, scale: 1.02 },
      transition: { duration: 0.2 }
    } : {},
    float: {
      animate: { y: [0, -5, 0] },
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
    },
    scale: hover ? {
      whileHover: { scale: 1.05 },
      whileTap: { scale: 0.98 }
    } : {},
    glow: hover ? {
      whileHover: { 
        boxShadow: "0 0 30px rgba(239, 195, 115, 0.3)",
        y: -5
      }
    } : {},
    tilt: hover ? {
      whileHover: { 
        rotateY: 5,
        rotateX: 5,
        scale: 1.02
      }
    } : {},
    bounce: hover ? {
      whileHover: { 
        y: [-5, -10, -5],
        transition: { duration: 0.4 }
      }
    } : {}
  };
  
  const cardClasses = `${baseClasses} ${variants[variant]} ${paddings[padding]} ${className} ${onClick ? 'cursor-pointer' : ''}`;
  
  return (
    <motion.div
      className={cardClasses}
      onClick={onClick}
      {...animations[animation]}
      {...props}
    >
      {children}
    </motion.div>
  );
};

const ProductCard = ({ 
  image, 
  title, 
  price, 
  originalPrice,
  rating,
  badge,
  onAddToCart,
  onFavorite,
  isFavorite = false,
  className = "",
  ...props 
}) => {
  return (
    <Card 
      variant="elevated" 
      animation="hover" 
      padding="none"
      className={`overflow-hidden group ${className}`}
      {...props}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <motion.img
          src={image}
          alt={title}
          className="w-full h-48 object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Badge */}
        {badge && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-3 left-3 bg-gradient-to-r from-sage-500 to-sage-600 text-white px-3 py-1 rounded-full text-sm font-semibold"
          >
            {badge}
          </motion.div>
        )}
        
        {/* Favorite Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onFavorite}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-colors ${
            isFavorite 
              ? 'bg-red-500 text-white' 
              : 'bg-white/80 text-gray-600 hover:text-red-500'
          }`}
        >
          <HeartIcon className="h-5 w-5" />
        </motion.button>
        
        {/* Overlay on hover */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end justify-center pb-4"
        >
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            whileHover={{ y: 0, opacity: 1 }}
            onClick={onAddToCart}
            className="bg-white text-beige-700 px-6 py-2 rounded-full font-semibold hover:bg-beige-50 transition-colors"
          >
            Quick Add
          </motion.button>
        </motion.div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <motion.h3 
          className="font-bold text-beige-800 mb-2 line-clamp-2"
          whileHover={{ color: '#8f7138' }}
        >
          {title}
        </motion.h3>
        
        {/* Rating */}
        {rating && (
          <div className="flex items-center mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <StarIcon 
                    className={`h-4 w-4 ${
                      i < rating 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }`} 
                  />
                </motion.div>
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">({rating})</span>
          </div>
        )}
        
        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <motion.span 
              className="text-2xl font-bold text-beige-700"
              whileHover={{ scale: 1.05 }}
            >
              ${price}
            </motion.span>
            {originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${originalPrice}
              </span>
            )}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAddToCart}
            className="bg-gradient-to-r from-beige-500 to-cream-500 text-white px-4 py-2 rounded-xl font-semibold hover:from-beige-600 hover:to-cream-600 transition-all duration-300"
          >
            Add to Cart
          </motion.button>
        </div>
      </div>
    </Card>
  );
};

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  color = 'from-beige-400 to-cream-400',
  className = "",
  ...props 
}) => {
  return (
    <Card 
      variant="gradient" 
      animation="hover" 
      className={`text-center group ${className}`}
      {...props}
    >
      <motion.div
        whileHover={{ rotate: 360, scale: 1.1 }}
        transition={{ duration: 0.6 }}
        className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-r ${color} rounded-2xl flex items-center justify-center shadow-medium group-hover:shadow-glow-beige`}
      >
        <Icon className="h-8 w-8 text-white" />
      </motion.div>
      
      <motion.h3 
        className="text-xl font-bold text-beige-800 mb-4"
        whileHover={{ scale: 1.05 }}
      >
        {title}
      </motion.h3>
      
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>
    </Card>
  );
};

const TestimonialCard = ({ 
  quote, 
  author, 
  role, 
  avatar, 
  rating = 5,
  className = "",
  ...props 
}) => {
  return (
    <Card 
      variant="glass" 
      animation="hover" 
      className={`relative ${className}`}
      {...props}
    >
      {/* Quote Icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-r from-beige-500 to-cream-500 rounded-full flex items-center justify-center text-white text-xl font-bold"
      >
        "
      </motion.div>
      
      {/* Rating */}
      <div className="flex items-center mb-4">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <StarIcon 
              className={`h-5 w-5 ${
                i < rating 
                  ? 'text-yellow-400 fill-current' 
                  : 'text-gray-300'
              }`} 
            />
          </motion.div>
        ))}
      </div>
      
      {/* Quote */}
      <motion.blockquote 
        className="text-gray-700 italic mb-6 leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        "{quote}"
      </motion.blockquote>
      
      {/* Author */}
      <motion.div 
        className="flex items-center"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="w-12 h-12 bg-gradient-to-r from-beige-300 to-cream-300 rounded-full flex items-center justify-center text-2xl mr-4"
        >
          {avatar}
        </motion.div>
        <div>
          <h4 className="font-semibold text-beige-800">{author}</h4>
          <p className="text-sm text-beige-600">{role}</p>
        </div>
      </motion.div>
    </Card>
  );
};

const StatCard = ({ 
  value, 
  label, 
  icon: Icon, 
  trend,
  trendValue,
  color = 'text-beige-700',
  className = "",
  ...props 
}) => {
  return (
    <Card 
      variant="gradient" 
      animation="scale" 
      className={`text-center ${className}`}
      {...props}
    >
      {Icon && (
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="flex justify-center mb-4"
        >
          <Icon className={`h-12 w-12 ${color}`} />
        </motion.div>
      )}
      
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.8 }}
        className={`text-4xl font-black ${color} mb-2`}
      >
        {value}
      </motion.div>
      
      <p className="text-beige-600 font-medium mb-2">{label}</p>
      
      {trend && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-sm flex items-center justify-center ${
            trend === 'up' ? 'text-green-600' : 'text-red-600'
          }`}
        >
          <span className="mr-1">
            {trend === 'up' ? '↗' : '↘'}
          </span>
          {trendValue}
        </motion.div>
      )}
    </Card>
  );
};

const ImageCard = ({ 
  image, 
  title, 
  description, 
  overlay = true,
  className = "",
  ...props 
}) => {
  return (
    <Card 
      variant="minimal" 
      animation="hover" 
      padding="none"
      className={`overflow-hidden group ${className}`}
      {...props}
    >
      <div className="relative">
        <motion.img
          src={image}
          alt={title}
          className="w-full h-64 object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
        
        {overlay && (
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end"
          >
            <div className="p-6 text-white">
              <motion.h3 
                className="text-xl font-bold mb-2"
                initial={{ y: 20, opacity: 0 }}
                whileHover={{ y: 0, opacity: 1 }}
              >
                {title}
              </motion.h3>
              <motion.p 
                className="text-sm opacity-90"
                initial={{ y: 20, opacity: 0 }}
                whileHover={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {description}
              </motion.p>
            </div>
          </motion.div>
        )}
      </div>
      
      {!overlay && (title || description) && (
        <div className="p-6">
          {title && <h3 className="text-xl font-bold text-beige-800 mb-2">{title}</h3>}
          {description && <p className="text-gray-600">{description}</p>}
        </div>
      )}
    </Card>
  );
};

export {
  Card,
  ProductCard,
  FeatureCard,
  TestimonialCard,
  StatCard,
  ImageCard
};
