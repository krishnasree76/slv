import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';

export const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const toggleWishlist = useStore(state => state.toggleWishlist);
  const wishlist = useStore(state => state.wishlist);
  
  const isWishlisted = wishlist.some(item => item.id === product.id);

  // Helper normalization utility to handle string vs nested object structures safely
  const getProductImageSrc = (imgObj) => {
    if (!imgObj) return null;
    if (typeof imgObj === 'string') return imgObj;
    return imgObj.image || imgObj.url || imgObj.imageUrl || imgObj.src;
  };

  const fallbackPlaceholder = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80';
  const mainImage = getProductImageSrc(product.images?.[0]) || product.image || fallbackPlaceholder;
  const hoverImage = getProductImageSrc(product.images?.[1]) || mainImage;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/product/${product.id}`);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <motion.div 
      className="group flex flex-col relative bg-white p-3 sm:p-3.5 rounded-2xl border border-[#E5DACB]/80 shadow-[0_4px_20px_rgba(59,20,78,0.03)] hover:shadow-[0_12px_32px_rgba(59,20,78,0.09)] hover:border-[#C6A15B]/50 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      {/* Badges */}
      <div className="absolute top-5 left-5 z-10 flex flex-col gap-1.5 pointer-events-none">
        {product.discount_percentage > 0 && (
          <span className="bg-[#55236F] text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-sm">
            {product.discount_percentage}% OFF
          </span>
        )}
        {product.is_sold_out && (
          <span className="bg-[#3B144E] text-[#FAF7F0] text-[11px] font-bold px-2 py-0.5 rounded-md shadow-sm">
            Sold Out
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleWishlist}
        className="absolute top-5 right-5 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#55236F] hover:bg-white hover:text-red-500 shadow-sm transition-all"
        aria-label="Wishlist"
      >
        <Heart size={16} className={isWishlisted ? "fill-red-500 text-red-500" : ""} />
      </button>

      {/* Image Container */}
      <Link 
        to={`/product/${product.id}`}
        className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[#FAF7F0] mb-3.5 block"
      >
        <img 
          src={isHovered ? hoverImage : mainImage} 
          alt={product.name}
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Quick Actions overlay */}
        <div className={`absolute bottom-3 left-0 right-0 flex justify-center px-3 transition-all duration-300 ${
          isHovered ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
        }`}>
          <button 
            onClick={handleQuickAdd}
            disabled={product.is_sold_out}
            className="w-full h-10 rounded-full bg-[#55236F] text-white flex items-center justify-center shadow-lg hover:bg-[#3B144E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm font-semibold tracking-wide"
          >
            <ShoppingBag size={16} className="mr-1.5" />
            {product.has_sizes ? 'Select Options' : 'View Details'}
          </button>
        </div>
      </Link>

      {/* Product Info */}
      <div className="flex flex-col flex-grow px-1">
        <div className="flex justify-between items-start mb-1">
          <span className="text-[11px] text-[#087E83] font-semibold uppercase tracking-wider">
            {product.category_name || 'Traditional Silk'}
          </span>
        </div>
        <Link 
          to={`/product/${product.id}`} 
          className="text-sm sm:text-base font-serif font-semibold text-[#3B144E] leading-snug mb-2 hover:text-[#55236F] transition-colors line-clamp-1"
        >
          {product.name}
        </Link>
        <div className="mt-auto flex items-center gap-2">
          <span className="text-base sm:text-lg font-bold text-[#3B144E]">₹{product.price}</span>
          
          {product.original_price && Number(product.original_price) > Number(product.price) && (
            <span className="text-xs text-[#685A6E] line-through">₹{product.original_price}</span>
          )}
        </div>
        
        {/* Color Dots */}
        {product.available_colors && product.available_colors.length > 0 && (
          <div className="flex items-center gap-1.5 mt-2.5">
            {product.available_colors.slice(0, 4).map(color => (
              <div 
                key={color.id}
                className="w-3.5 h-3.5 rounded-full border border-gray-300 shadow-2xs"
                style={{ backgroundColor: color.color }}
                title={color.name}
              />
            ))}
            {product.available_colors.length > 4 && (
              <span className="text-[10px] text-[#685A6E] font-medium ml-0.5">
                +{product.available_colors.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
