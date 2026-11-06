import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaWhatsapp } from "react-icons/fa";
import { productService } from '../../services/productService';
import logo from '../../assets/logo.png';
import {
  ShoppingBag,
  Menu,
  X,
  Search,
  User,
  ChevronDown,
  Phone
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const topBarRef = useRef(null);
  const navRowRef = useRef(null);

  // Publish the fixed header's height (announcement bar + nav row, excluding the
  // mobile search dropdown) as --header-h so pages can offset content exactly.
  // The announcement bar wraps to two lines at some widths, so it can't be hard-coded.
  useLayoutEffect(() => {
    const update = () => {
      const h = (topBarRef.current?.offsetHeight || 0) + (navRowRef.current?.offsetHeight || 0) + 1;
      document.documentElement.style.setProperty('--header-h', `${h}px`);
    };
    update();
    const ro = new ResizeObserver(update);
    [topBarRef.current, navRowRef.current].forEach(el => el && ro.observe(el));
    return () => ro.disconnect();
  }, []);

  // Close the mobile menu on navigation (state adjusted during render, not in an effect).
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setIsMobileMenuOpen(false);
  }

  // While the menu is open: lock page scroll, close on Escape or when resized to desktop.
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && setIsMobileMenuOpen(false);
    const mq = window.matchMedia('(min-width: 768px)');
    const onMq = (e) => e.matches && setIsMobileMenuOpen(false);
    window.addEventListener('keydown', onKey);
    mq.addEventListener('change', onMq);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onMq);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    productService.getCategories()
      .then(data => {
        if (Array.isArray(data)) {
          setCategories(data);
        }
      })
      .catch(err => console.error("Error fetching categories:", err));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const cart = useStore((state) => state.cart);
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop All', path: '/shop' },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-[#FAF7F0]/95 backdrop-blur-md border-b border-[#E5DACB]/80 shadow-[0_2px_15px_rgba(59,20,78,0.04)]">
      {/* Top Announcement Banner */}
      <div ref={topBarRef} className="bg-gradient-to-r from-[#3B144E] via-[#55236F] to-[#087E83] text-white text-xs sm:text-sm py-2 px-4">
        <div className="container mx-auto flex flex-wrap justify-between items-center gap-2">
          <p className="hidden sm:inline-block font-serif tracking-wider text-[11px] sm:text-xs text-[#DFC488]">
            Sri Laxmi Venkateshwara Selections • Mirdoddi, Siddipet
          </p>
          <div className="flex items-center justify-center sm:justify-end gap-4 w-full sm:w-auto text-xs">
            <a
              href="https://wa.me/919848439181"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-[#DFC488] transition-colors"
            >
              <FaWhatsapp className="w-3.5 h-3.5 text-[#25D366]" />
              <span>WhatsApp: <strong>+91 9848439181</strong></span>
            </a>
            <span className="opacity-40">|</span>
            <a
              href="tel:8074254030"
              className="flex items-center gap-1 hover:text-[#DFC488] transition-colors"
            >
              <Phone size={12} className="text-[#DFC488]" />
              <span>+91 8074254030</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar Row */}
      <div className="container mx-auto px-4 md:px-6">
        <div ref={navRowRef} className="flex items-center justify-between py-3 sm:py-3.5">
          {/* Mobile Menu Button – toggles the drawer */}
          <button
            type="button"
            className="md:hidden text-[#3B144E] p-2 -ml-2 rounded-lg hover:bg-[#EFE6D8]/60 transition-colors"
            onClick={() => { setIsMobileMenuOpen(open => !open); setIsSearchOpen(false); }}
            aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo & Brand Name */}
          <Link
            to="/"
            className="flex items-center gap-2.5 sm:gap-3 group"
          >
            <img
              src={logo}
              alt="Sri Laxmi Venkateshwara Selections Logo"
              className="h-10 sm:h-12 lg:h-14 w-auto object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="font-serif font-bold text-lg sm:text-xl lg:text-2xl text-[#3B144E] tracking-tight leading-tight whitespace-nowrap group-hover:text-[#55236F] transition-colors">
                <span className="hidden sm:inline">Sri Laxmi Venkateshwara</span>
                <span className="sm:hidden">SLV</span>
              </span>
              <span className="text-[10px] sm:text-xs font-medium tracking-[0.2em] uppercase text-[#087E83] -mt-0.5">
                Selections
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-5 lg:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-[#3B144E] hover:text-[#55236F] font-medium tracking-wide text-sm lg:text-base whitespace-nowrap relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#C6A15B] hover:after:w-full after:transition-all after:duration-300"
              >
                {link.name}
              </Link>
            ))}

            {/* Category Dropdown */}
            {categories.length > 0 && (
              <div
                className="relative"
                onMouseEnter={() => setIsCategoryOpen(true)}
                onMouseLeave={() => setIsCategoryOpen(false)}
              >
                <button className="flex items-center gap-1.5 text-[#3B144E] hover:text-[#55236F] font-medium tracking-wide text-sm lg:text-base whitespace-nowrap py-1">
                  <span>Categories</span>
                  <ChevronDown size={16} className={`transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isCategoryOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.18 }}
                      className="absolute top-full left-0 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_12px_40px_rgba(59,20,78,0.12)] border border-[#E5DACB] overflow-hidden py-2"
                    >
                      {categories.map((category) => (
                        <Link
                          key={category.id || category.name}
                          to={`/category/${category.slug || category.name.toLowerCase().replace(/\s+/g, '-')}`}
                          className="block px-5 py-2.5 text-sm font-medium text-[#3B144E] hover:bg-[#FAF7F0] hover:text-[#55236F] transition-all"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </nav>

          {/* Icons Side */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            {/* Desktop Search */}
            <div className="relative flex items-center">
              {isSearchOpen ? (
                <form 
                  onSubmit={handleSearch} 
                  className="hidden md:flex absolute right-0 items-center bg-white border border-[#C6A15B] rounded-full px-3.5 py-1.5 shadow-md w-72"
                >
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search sarees, dresses..." 
                    className="w-full outline-none text-xs sm:text-sm text-[#3B144E] bg-transparent"
                    autoFocus
                  />
                  <button type="button" onClick={() => setIsSearchOpen(false)} className="text-[#685A6E] hover:text-[#3B144E] ml-2">
                    <X size={16} />
                  </button>
                </form>
              ) : null}

              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)} 
                className={`${isSearchOpen ? 'md:hidden' : 'block'} text-[#3B144E] hover:text-[#55236F] p-1.5 rounded-full hover:bg-[#EFE6D8]/50 transition-all`}
                aria-label="Search"
              >
                {isSearchOpen ? <X size={20} /> : <Search size={20} />}
              </button>
            </div>

            <Link
              to="/profile"
              className="text-[#3B144E] hover:text-[#55236F] p-1.5 rounded-full hover:bg-[#EFE6D8]/50 transition-all"
              aria-label="User Profile"
            >
              <User size={20} />
            </Link>

            <Link
              to="/cart"
              className="relative text-[#3B144E] hover:text-[#55236F] p-1.5 rounded-full hover:bg-[#EFE6D8]/50 transition-all"
              aria-label="Shopping Cart"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#55236F] text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-[#FAF7F0] shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Search Dropdown */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden"
            >
              <form onSubmit={handleSearch} className="flex items-center bg-white border border-[#C6A15B] rounded-full px-4 py-2 shadow-inner w-full mb-3">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search sarees, dresses..." 
                  className="w-full outline-none text-sm text-[#3B144E] bg-transparent"
                  autoFocus
                />
                <button type="submit" className="text-[#55236F] ml-2">
                  <Search size={18} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Drawer Menu – portalled to <body>: the header's backdrop-filter makes it
          the containing block for fixed descendants, which squashed the drawer to the
          header's height. It sits below the header so the hamburger stays usable. */}
      {createPortal(
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden fixed inset-x-0 bottom-0 top-[var(--header-h,97px)] bg-black/50 backdrop-blur-sm z-40"
            />

            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              id="mobile-menu"
              className="md:hidden fixed left-0 bottom-0 top-[var(--header-h,97px)] w-[85%] max-w-sm bg-[#FAF7F0] z-40 p-6 pt-2 shadow-2xl flex flex-col overflow-y-auto overscroll-contain"
            >
              <nav className="flex flex-col space-y-4 py-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-base font-semibold text-[#3B144E] hover:text-[#55236F] border-b border-[#E5DACB]/50 pb-2.5 transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}

                {categories.length > 0 && (
                  <div className="pt-2">
                    <h3 className="text-xs uppercase tracking-widest font-semibold text-[#087E83] mb-3">Categories</h3>
                    <div className="flex flex-col space-y-2.5 pl-2">
                      {categories.map((category) => (
                        <Link
                          key={category.id || category.name}
                          to={`/category/${category.slug || category.name.toLowerCase().replace(/\s+/g, '-')}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="text-sm font-medium text-[#3B144E] hover:text-[#55236F] transition-colors"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </nav>

              <div className="mt-auto pt-6 border-t border-[#E5DACB] space-y-3">
                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 text-sm font-medium text-[#3B144E] hover:text-[#55236F]"
                >
                  <User size={18} />
                  <span>My Account</span>
                </Link>
                <a
                  href="https://wa.me/919848439181"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-[#087E83] font-semibold pt-2"
                >
                  <FaWhatsapp className="w-4 h-4 text-[#25D366]" />
                  <span>Order via WhatsApp (+91 9848439181)</span>
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>,
      document.body
      )}
    </header>
  );
};
