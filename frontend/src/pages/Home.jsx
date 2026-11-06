import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Truck, ShieldCheck, Clock, Sparkles, Phone, Store } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { productService } from '../services/productService';
import { ProductCard } from '../components/ui/ProductCard';
import { Button } from '../components/ui/Button';
import heroBannerWebp from '../assets/hero_banner.webp';
import heroBannerPng from '../assets/hero_banner.png';

const HERO_TRUST = [
  { icon: Star, color: '#C6A15B', title: 'Authentic Weaves', desc: 'Pure silks & festive wear' },
  { icon: Store, color: '#55236F', title: 'Trusted Showroom', desc: 'Mirdoddi, Siddipet' },
  { icon: Truck, color: '#087E83', title: 'Doorstep Delivery', desc: 'All over India' },
];

/* ─────────────────────────────────────────────
   SKELETON CARD – shown while products load
───────────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-[#E5DACB]/80 p-3 sm:p-3.5 animate-pulse">
    <div className="aspect-[3/4] bg-[#EFE6D8] rounded-xl mb-3.5" />
    <div className="h-3 bg-[#EFE6D8] rounded w-1/3 mb-2" />
    <div className="h-4 bg-[#EFE6D8] rounded w-3/4 mb-2" />
    <div className="h-4 bg-[#EFE6D8] rounded w-1/4" />
  </div>
);

/* ─────────────────────────────────────────────
   PRODUCT SECTION – reusable section block
   Receives: title, subtitle, eyebrow, products,
   loading, linkTo, linkLabel, accentColor
───────────────────────────────────────────── */
const ProductSection = ({
  eyebrow,
  title,
  subtitle,
  products,
  loading,
  linkTo = '/shop',
  linkLabel = 'View All',
  skeletonCount = 4,
  bgClass = 'bg-white',
  borderClass = 'border-t border-[#E5DACB]/80',
}) => (
  <section className={`py-12 md:py-16 ${bgClass} ${borderClass}`}>
    <div className="container mx-auto px-4 md:px-6">
      <div className="flex justify-between items-end mb-8 md:mb-12">
        <div>
          {eyebrow && (
            <span className="text-xs uppercase tracking-widest font-semibold text-[#C6A15B]">{eyebrow}</span>
          )}
          <h2 className="text-2xl md:text-4xl font-serif font-bold text-[#3B144E] mt-1">{title}</h2>
          {subtitle && (
            <p className="text-xs md:text-sm text-[#685A6E] max-w-xl mt-1">{subtitle}</p>
          )}
        </div>
        <Link
          to={linkTo}
          className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-[#55236F] hover:text-[#087E83] transition-colors shrink-0 ml-4"
        >
          {linkLabel} <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        {loading
          ? Array.from({ length: skeletonCount }).map((_, i) => <SkeletonCard key={i} />)
          : products.length > 0
            ? products.slice(0, 8).map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            : (
              <div className="col-span-2 sm:col-span-4 py-12 flex flex-col items-center text-center text-[#685A6E]">
                <Sparkles className="w-10 h-10 text-[#E5DACB] mb-3" />
                <p className="text-sm font-medium">No products in this collection yet.</p>
                <p className="text-xs mt-1">Tag products in the admin panel to display them here.</p>
              </div>
            )
        }
      </div>

      {/* Mobile "View All" button */}
      <div className="sm:hidden text-center mt-8">
        <Link to={linkTo}>
          <Button variant="secondary" size="md">{linkLabel}</Button>
        </Link>
      </div>
    </div>
  </section>
);

/* ─────────────────────────────────────────────
   HOME PAGE
───────────────────────────────────────────── */
export const Home = () => {
  const [categories, setCategories] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [loadingLatest, setLoadingLatest] = useState(true);
  const [loadingPopular, setLoadingPopular] = useState(true);

  useEffect(() => {
    // Fetch categories
    productService.getCategories()
      .then(data => { if (Array.isArray(data)) setCategories(data); })
      .catch(err => console.error('Categories fetch error:', err));

    // Fetch "Latest" tagged products
    productService.getProductsByTag('Latest')
      .then(data => {
        setLatestProducts(Array.isArray(data) ? data : []);
        setLoadingLatest(false);
      })
      .catch(err => {
        console.error('Latest products fetch error:', err);
        setLoadingLatest(false);
      });

    // Fetch "Popular" tagged products
    productService.getProductsByTag('Popular')
      .then(data => {
        setPopularProducts(Array.isArray(data) ? data : []);
        setLoadingPopular(false);
      })
      .catch(err => {
        console.error('Popular products fetch error:', err);
        setLoadingPopular(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF7F0] flex flex-col overflow-x-hidden">

      {/* ═══════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════ */}
      {/* Top padding = fixed Navbar height, measured and published by Navbar as --header-h */}
      <section className="relative w-full pt-[var(--header-h,97px)] overflow-hidden bg-[#FAF7F0]">

        {/* DESKTOP / TABLET HERO (≥768px) – text left, framed portrait image right.
            The source image is square with the model in its right ~40%, so the
            frame is portrait-shaped and anchored right to keep her head-to-hem. */}
        <div className="hidden md:block">
          <div className="container mx-auto px-6 lg:px-12 py-10 lg:py-12 grid grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-center gap-8 lg:gap-14">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="max-w-xl"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#55236F]/10 border border-[#C6A15B]/40 mb-5 lg:mb-6">
                <Sparkles className="w-3.5 h-3.5 text-[#C6A15B] shrink-0" />
                <span className="text-[10px] lg:text-xs font-semibold tracking-[0.2em] text-[#55236F] uppercase">
                  TRADITION • ELEGANCE • CELEBRATION
                </span>
              </div>
              <h1 className="text-4xl lg:text-5xl xl:text-[3.5rem] font-serif font-bold text-[#3B144E] leading-[1.1] mb-5 tracking-tight text-balance">
                Elegance Woven in Every Tradition
              </h1>
              <p className="text-base lg:text-lg text-[#685A6E] leading-relaxed mb-8 max-w-lg font-light">
                Discover beautiful sarees and dresses that celebrate Indian heritage, timeless craftsmanship, and your individual style.
              </p>
              <div className="flex flex-wrap items-center gap-3 lg:gap-4">
                <Link to="/shop">
                  <Button variant="primary" size="md" className="lg:px-8 lg:py-3.5 lg:text-lg">
                    Explore Collection <ArrowRight size={18} className="ml-2" />
                  </Button>
                </Link>
                <Link to="/shop">
                  <Button variant="secondary" size="md" className="lg:px-8 lg:py-3.5 lg:text-lg">Shop Sarees</Button>
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-4 lg:gap-6 pt-7 mt-8 lg:mt-10 border-t border-[#E5DACB]">
                {HERO_TRUST.map(({ icon: Icon, color, title, desc }) => (
                  <div key={title} className="flex flex-col lg:flex-row items-start gap-2 lg:gap-3">
                    <span className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center" style={{ backgroundColor: `${color}1a` }}>
                      <Icon className="w-4 h-4" style={{ color }} />
                    </span>
                    <div>
                      <p className="font-serif font-bold text-sm text-[#3B144E] leading-snug">{title}</p>
                      <p className="text-xs text-[#685A6E] mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: 'easeOut', delay: 0.1 }}
              className="relative w-full max-w-[500px] ml-auto"
            >
              <div className="absolute inset-0 translate-x-3 translate-y-3 lg:translate-x-4 lg:translate-y-4 rounded-[2rem] border border-[#C6A15B]/60" />
              <div className="relative h-[440px] lg:h-[clamp(480px,calc(100svh-230px),620px)] rounded-[2rem] overflow-hidden bg-[#F3EBDE] ring-1 ring-[#E5DACB] shadow-[0_30px_60px_-25px_rgba(59,20,78,0.35)]">
                <picture>
                  <source srcSet={heroBannerWebp} type="image/webp" />
                  <img
                    src={heroBannerPng}
                    alt="Sri Laxmi Venkateshwara Selections – Luxury Indian Ethnic Fashion"
                    className="absolute inset-0 w-full h-full object-cover object-[88%_50%]"
                    fetchPriority="high"
                  />
                </picture>
              </div>
            </motion.div>
          </div>
        </div>

        {/* MOBILE HERO (<768px) – compact full-width banner, text over the left negative space.
            hero_banner is a 1024² square whose left ~55% is empty backdrop; the model spans
            x≈600–950. The image box is portrait (~0.55:1) and right-anchored, so object-cover
            trims only that empty left backdrop. It is also 110% of the banner height so the
            model reads larger; that trims just the floor below her feet. */}
        <div className="md:hidden relative w-full h-[clamp(340px,105vw,460px)] overflow-hidden bg-gradient-to-b from-[#F4ECDF] via-[#F2E6D2] to-[#E4D6C0]">
          <picture>
            <source srcSet={heroBannerWebp} type="image/webp" />
            <img
              src={heroBannerPng}
              alt="Sri Laxmi Venkateshwara Selections – Luxury Indian Ethnic Fashion"
              className="absolute right-0 top-[-1%] h-[110%] w-[64%] sm:w-[52%] object-cover object-[92%_0%] [mask-image:linear-gradient(to_right,transparent,black_30%)]"
              fetchPriority="high"
            />
          </picture>
          <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#FAF7F0] to-transparent" />

          <div className="relative z-10 h-full w-[54%] sm:w-[50%] pl-4 sm:pl-8 pr-1 py-5 flex flex-col justify-center">
            <span className="self-start inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/85 text-[9px] sm:text-[10px] font-semibold tracking-wider text-[#55236F] shadow-sm uppercase">
              <Sparkles size={10} className="text-[#C6A15B]" /> SLV Selections
            </span>
            <p className="mt-3 text-[9px] sm:text-[11px] font-semibold tracking-[0.2em] leading-[1.8] text-[#087E83] uppercase">
              Tradition <span className="text-[#C6A15B]">•</span> Elegance <span className="text-[#C6A15B]">•</span><br />
              Celebration
            </p>
            <div className="w-10 h-px bg-[#C6A15B] my-3" />
            <h1 className="text-[clamp(1.3rem,6vw,2.1rem)] font-serif font-bold text-[#3B144E] leading-[1.15] tracking-tight text-balance">
              Elegance Woven in Every Tradition
            </h1>
            <Link to="/shop" className="self-start mt-4">
              <Button variant="primary" size="sm" className="px-4 py-2.5 text-xs sm:text-sm">
                Explore Collection <ArrowRight size={14} className="ml-1.5 shrink-0" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          FEATURE STRIP (desktop only – on mobile the hero's
          trust row covers this, so categories follow the hero)
      ═══════════════════════════════════════════════ */}
      <section className="hidden md:block py-5 bg-white border-y border-[#E5DACB]/80">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-y-0 md:divide-x divide-[#E5DACB]/60">
            <div className="flex items-center justify-center gap-2.5 p-2">
              <Star className="w-4 h-4 text-[#C6A15B] shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-[#3B144E]">Handcrafted Silk Sarees</span>
            </div>
            <div className="flex items-center justify-center gap-2.5 p-2">
              <Truck className="w-4 h-4 text-[#087E83] shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-[#3B144E]">Pan-India Delivery</span>
            </div>
            <div className="flex items-center justify-center gap-2.5 p-2">
              <ShieldCheck className="w-4 h-4 text-[#55236F] shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-[#3B144E]">100% Quality Guaranteed</span>
            </div>
            <div className="flex items-center justify-center gap-2.5 p-2">
              <Clock className="w-4 h-4 text-[#C6A15B] shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-[#3B144E]">Showroom Open 7 Days</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          TRENDING CATEGORIES
      ═══════════════════════════════════════════════ */}
      {categories.length > 0 && (
        <section className="pt-6 pb-12 md:py-16 bg-[#FAF7F0]">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex justify-between items-end mb-8 md:mb-10">
              <div>
                <span className="text-xs uppercase tracking-widest font-semibold text-[#087E83]">Curated Catalog</span>
                <h2 className="text-2xl md:text-4xl font-serif font-bold text-[#3B144E] mt-1">Trending Categories</h2>
                <p className="text-xs md:text-sm text-[#685A6E] mt-1">Explore our signature traditional weaves and modern silhouettes</p>
              </div>
              <Link to="/shop" className="hidden sm:flex items-center text-sm font-semibold text-[#55236F] hover:text-[#087E83] transition-colors">
                View All <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-5">
              {categories.map((cat, index) => (
                <motion.div
                  key={cat.id || cat.slug || index}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.35 }}
                >
                  <Link
                    to={`/category/${cat.slug || cat.name?.toLowerCase().replace(/\s+/g, '-')}`}
                    className="group block text-center"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-full bg-[#EFE6D8] mb-3 p-1.5 border-2 border-transparent group-hover:border-[#C6A15B] transition-all duration-300 max-w-[130px] sm:max-w-[150px] mx-auto shadow-sm group-hover:shadow-md">
                      <img
                        src={cat.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80'}
                        alt={cat.name}
                        className="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <h3 className="font-serif text-xs sm:text-sm font-semibold text-[#3B144E] group-hover:text-[#55236F] transition-colors line-clamp-1">
                      {cat.name}
                    </h3>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════
          LATEST ARRIVALS  (tag = "Latest")
      ═══════════════════════════════════════════════ */}
      <ProductSection
        eyebrow="New In Store"
        title="Latest Arrivals"
        subtitle="Freshly added handpicked silk weaves, festive dresses, and contemporary ethnic styles."
        products={latestProducts}
        loading={loadingLatest}
        linkTo="/shop"
        linkLabel="Browse All"
        bgClass="bg-white"
        borderClass="border-t border-[#E5DACB]/80"
      />

      {/* ═══════════════════════════════════════════════
          POPULAR COLLECTION  (tag = "Popular")
      ═══════════════════════════════════════════════ */}
      <ProductSection
        eyebrow="Customer Favourites"
        title="Popular Collection"
        subtitle="Our best-loved styles combining elegance, comfort, and timeless ethnic tradition."
        products={popularProducts}
        loading={loadingPopular}
        linkTo="/shop"
        linkLabel="Shop All"
        bgClass="bg-[#FAF7F0]"
        borderClass="border-t border-[#E5DACB]/60"
      />

      {/* ═══════════════════════════════════════════════
          BOUTIQUE VISIT CALLOUT
      ═══════════════════════════════════════════════ */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-[#3B144E] via-[#55236F] to-[#087E83] text-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-[#DFC488] text-xs font-semibold tracking-widest uppercase">
              Visit Our Boutique Showroom
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold">
              Experience the Touch of Pure Luxury
            </h2>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed font-light">
              Visit Sri Laxmi Venkateshwara Selections beside Ramalayam Temple in Mirdoddi, Siddipet. Our warm staff will guide you through authentic silk sarees and custom wedding selections.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-3">
              <a
                href="https://wa.me/919848439181"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] text-white px-5 py-2.5 rounded-full font-semibold text-xs sm:text-sm hover:brightness-105 transition-all shadow-md"
              >
                <FaWhatsapp className="w-4 h-4" />
                WhatsApp Video Call / Enquiry
              </a>
              <a
                href="tel:9848439181"
                className="inline-flex items-center gap-2 bg-white/15 hover:bg-white text-white hover:text-[#3B144E] px-5 py-2.5 rounded-full font-semibold text-xs sm:text-sm transition-all border border-white/20"
              >
                <Phone size={14} /> Call +91 9848439181
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          WHY CHOOSE SLV
      ═══════════════════════════════════════════════ */}
      <section className="py-14 md:py-20 bg-[#FAF7F0]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-10 md:mb-14">
            <span className="text-xs uppercase tracking-widest font-semibold text-[#087E83]">The SLV Standard</span>
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-[#3B144E] mt-1">
              Why Choose Sri Laxmi Venkateshwara Selections
            </h2>
            <p className="text-xs md:text-sm text-[#685A6E] max-w-xl mx-auto mt-1">
              Honoring your special moments with pure craftsmanship, transparent pricing, and trusted service.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              { icon: Star, color: '#55236F', bg: '#55236F/10', title: 'Authentic Weaves', desc: 'Directly sourced silk and handloom designs honoring age-old weaving traditions.' },
              { icon: Truck, color: '#087E83', bg: '#087E83/10', title: 'Doorstep Dispatch', desc: 'Prompt and secure courier delivery across India with verified tracking.' },
              { icon: ShieldCheck, color: '#C6A15B', bg: '#C6A15B/15', title: 'Safe & Easy Payments', desc: 'Protected Razorpay checkout supporting UPI, cards, net banking and EMI.' },
              { icon: Clock, color: '#55236F', bg: '#55236F/10', title: 'Open 7 Days a Week', desc: 'Visit our Mirdoddi showroom from 9:00 AM to 9:00 PM throughout the year.' },
            ].map(({ icon: Icon, color, bg, title, desc }) => (
              <div key={title} className="bg-white p-6 rounded-2xl text-center border border-[#E5DACB] shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center`} style={{ backgroundColor: `${color}1a` }}>
                  <Icon className="w-7 h-7" style={{ color }} />
                </div>
                <h3 className="text-base sm:text-lg font-serif font-bold text-[#3B144E] mb-2">{title}</h3>
                <p className="text-xs sm:text-sm text-[#685A6E] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
