import { getDefaultHomeContent, type HomeContent } from '@/lib/site-data';

export interface TemplateCategory {
  name: string;
  slug: string;
  description: string;
  image: string;
}

export interface TemplateProduct {
  name: string;
  slug: string;
  model: string;
  price: string;
  main_image: string;
  short_description: string;
  description: string;
  specifications: { name: string; value: string }[];
  is_featured: boolean;
}

export interface TemplateBanner {
  image: string;
  title: string;
  subtitle: string;
  button_text: string;
  button_link: string;
}

export interface TemplateNews {
  title: string;
  slug: string;
  category: string;
  cover_image: string;
  summary: string;
  content: string;
}

export interface TemplateData {
  hero_title: string;
  hero_subtitle: string;
  hero_image: string;
  seo_title: string;
  seo_description: string;
  home_content: HomeContent;
  categories: TemplateCategory[];
  products: TemplateProduct[];
  banners: TemplateBanner[];
  news: TemplateNews[];
}

export interface TemplateMeta {
  key: string;
  label: string;
  icon: string;
  description: string;
}

export const TEMPLATES: TemplateMeta[] = [
  { key: 'plastic', label: '塑料包装', icon: 'Package', description: '塑料制品、包装袋、薄膜等外贸工厂' },
  { key: 'electronics', label: '电子产品', icon: 'Cpu', description: '消费电子、配件、智能设备' },
  { key: 'home', label: '家居用品', icon: 'Sofa', description: '家居、厨具、生活用品' },
  { key: 'general', label: '通用外贸', icon: 'Globe', description: '任意行业通用企业官网' },
];

const daysAgo = (n: number) =>
  new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();

function base(keyword: string): HomeContent {
  const d = getDefaultHomeContent();
  return { ...d, heroTag: keyword };
}

function plasticHome(): HomeContent {
  const d = getDefaultHomeContent();
  return {
    ...d,
    heroTag: 'Premium Plastic Packaging · Direct Factory',
    heroTags: ['Custom OEM', 'Biodegradable Options', 'Fast Delivery', 'Global Export'],
    aboutTitle: 'Leading Plastic Packaging Manufacturer',
    aboutDesc:
      'We specialize in custom plastic bags, packaging films and advanced material solutions, exported to over 50 countries with strict quality control.',
    aboutFeatures: ['Premium raw materials', 'Custom size & printing', 'Quality control', 'Competitive price'],
  };
}

function electronicsHome(): HomeContent {
  const d = getDefaultHomeContent();
  return {
    ...d,
    heroTag: 'Consumer Electronics · Factory Direct',
    heroTags: ['Smart Devices', 'Custom OEM', 'Quality Guaranteed', 'Global Export'],
    aboutTitle: 'Innovative Electronics for Everyday Life',
    aboutDesc:
      'We design and manufacture consumer electronics, mobile accessories and smart devices, delivering factory-direct quality to global buyers.',
    aboutFeatures: ['Advanced technology', 'Strict QC', 'Fast delivery', 'OEM / ODM'],
  };
}

function homeGoodsHome(): HomeContent {
  const d = getDefaultHomeContent();
  return {
    ...d,
    heroTag: 'Quality Home Goods · Direct Factory',
    heroTags: ['Premium Materials', 'Custom Branding', 'Fast Delivery', 'Global Export'],
    aboutTitle: 'Thoughtful Products for a Better Home',
    aboutDesc:
      'We produce home, kitchen and daily-life products with a focus on quality materials, ergonomic design and export-grade standards.',
    aboutFeatures: ['Healthy materials', 'Ergonomic design', 'Custom OEM', 'Strict QC'],
  };
}

export function getTemplateData(template: string): TemplateData {
  switch (template) {
    case 'plastic':
      return {
        hero_title: 'Premium Plastic Solutions for Global Brands',
        hero_subtitle:
          'Professional manufacturer with 20+ years of experience in custom plastic packaging. Quality guaranteed, worldwide delivery.',
        hero_image: 'https://images.unsplash.com/photo-1581093458791-9c790a526b84?w=1600&h=700&fit=crop',
        seo_title: 'Custom Plastic Packaging Manufacturer',
        seo_description: 'Professional manufacturer of custom plastic bags, packaging films and material solutions.',
        home_content: plasticHome(),
        categories: [
          { name: 'Plastic Bags', slug: 'plastic-bags', description: 'Custom plastic bags for packaging and retail', image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400&h=300&fit=crop' },
          { name: 'Packaging Films', slug: 'packaging-films', description: 'Flexible packaging films for every industry', image: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=400&h=300&fit=crop' },
          { name: 'Advanced Materials', slug: 'advanced-materials', description: 'Innovative material solutions', image: 'https://images.unsplash.com/photo-1581093458791-9c790a526b84?w=400&h=300&fit=crop' },
        ],
        banners: [
          { image: 'https://images.unsplash.com/photo-1581093458791-9c790a526b84?w=1600&h=600&fit=crop', title: 'Custom Plastic Packaging', subtitle: 'High quality plastic bags for your business needs', button_text: 'Learn More', button_link: 'products' },
          { image: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=1600&h=600&fit=crop', title: 'Eco-Friendly Materials', subtitle: 'Sustainable solutions for the modern world', button_text: 'View Catalog', button_link: 'products' },
        ],
        products: [
          { name: 'Custom T-Shirt Bags', slug: 'custom-tshirt-bags', model: 'PB-001', price: '0.05', main_image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=600&h=600&fit=crop', short_description: 'Custom printed t-shirt bags for retail stores', description: 'Premium plastic t-shirt bags with custom printing, perfect for retail and supermarkets.', specifications: [{ name: 'Material', value: 'HDPE / LDPE' }, { name: 'Size', value: 'Customizable' }, { name: 'Printing', value: 'Up to 8 colors' }], is_featured: true },
          { name: 'Zip Lock Bags', slug: 'zip-lock-bags', model: 'PB-002', price: '0.03', main_image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop', short_description: 'Reusable zip lock bags for storage and packaging', description: 'Reusable zip lock bags with secure seal for food, electronics and general storage.', specifications: [{ name: 'Material', value: 'LDPE' }, { name: 'Seal', value: 'Zip Lock' }], is_featured: true },
          { name: 'Stretch Film', slug: 'stretch-film', model: 'PF-003', price: '1.20', main_image: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=600&h=600&fit=crop', short_description: 'Industrial stretch film for pallet wrapping', description: 'High-performance stretch film for industrial pallet wrapping and shipping protection.', specifications: [{ name: 'Material', value: 'LLDPE' }, { name: 'Thickness', value: '20-30 micron' }], is_featured: true },
          { name: 'Biodegradable Film', slug: 'biodegradable-film', model: 'AM-004', price: '2.50', main_image: 'https://images.unsplash.com/photo-1581093458791-9c790a526b84?w=600&h=600&fit=crop', short_description: 'Eco-friendly biodegradable plastic film', description: 'Biodegradable film that breaks down naturally for sustainable packaging.', specifications: [{ name: 'Material', value: 'PLA + PBAT' }, { name: 'Degradation', value: '180 days' }], is_featured: true },
        ],
        news: [
          { title: 'New Biodegradable Packaging Line', slug: 'biodegradable-packaging-line', category: 'Company', cover_image: 'https://images.unsplash.com/photo-1581093458791-9c790a526b84?w=600&h=400&fit=crop', summary: 'We launched a new eco-friendly packaging line to meet growing demand.', content: 'Our new biodegradable packaging line is now operational, offering sustainable alternatives for global clients.' },
          { title: 'Exhibition Recap: Canton Fair 2026', slug: 'canton-fair-2026', category: 'Events', cover_image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop', summary: 'Thank you for visiting our booth at Canton Fair.', content: 'We met hundreds of partners and showcased our latest packaging solutions.' },
          { title: 'How to Choose the Right Packaging Film', slug: 'choose-packaging-film', category: 'Guide', cover_image: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=600&h=400&fit=crop', summary: 'A practical guide to selecting packaging film for your product.', content: 'Consider material, thickness, clarity and barrier properties when choosing film.' },
        ],
      } satisfies TemplateData;

    case 'electronics':
      return {
        hero_title: 'Innovative Electronics for Everyday Life',
        hero_subtitle: 'Leading manufacturer of consumer electronics and smart devices. Factory direct quality and pricing.',
        hero_image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&h=700&fit=crop',
        seo_title: 'Consumer Electronics Manufacturer',
        seo_description: 'Leading manufacturer of consumer electronics, mobile accessories and smart devices.',
        home_content: electronicsHome(),
        categories: [
          { name: 'Mobile Accessories', slug: 'mobile-accessories', description: 'Chargers, cables, earphones and more', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop' },
          { name: 'Smart Devices', slug: 'smart-devices', description: 'Wearables and smart home devices', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop' },
          { name: 'Audio', slug: 'audio', description: 'Earbuds, headphones and speakers', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=300&fit=crop' },
        ],
        banners: [
          { image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&h=600&fit=crop', title: 'Smart Electronics', subtitle: 'Innovative technology for modern living', button_text: 'Shop Now', button_link: 'products' },
        ],
        products: [
          { name: 'Wireless Earbuds Pro', slug: 'wireless-earbuds-pro', model: 'EL-001', price: '29.99', main_image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop', short_description: 'Premium wireless earbuds with noise cancellation', description: 'Crystal-clear audio with active noise cancellation and 30-hour battery life.', specifications: [{ name: 'Bluetooth', value: '5.3' }, { name: 'Battery', value: '30 hours' }, { name: 'ANC', value: 'Yes' }], is_featured: true },
          { name: 'Fast Charging Cable', slug: 'fast-charging-cable', model: 'EL-002', price: '5.99', main_image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop', short_description: 'USB-C braided cable with 100W fast charging', description: 'Durable braided USB-C cable supporting 100W fast charging.', specifications: [{ name: 'Type', value: 'USB-C' }, { name: 'Power', value: '100W' }], is_featured: true },
          { name: 'Smart Watch', slug: 'smart-watch', model: 'EL-003', price: '49.99', main_image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop', short_description: 'Fitness tracking smart watch', description: 'Track your health and stay connected with this feature-rich smart watch.', specifications: [{ name: 'Display', value: 'AMOLED' }, { name: 'Battery', value: '10 days' }], is_featured: true },
          { name: 'Portable Speaker', slug: 'portable-speaker', model: 'EL-004', price: '19.99', main_image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=600&fit=crop', short_description: 'Compact Bluetooth speaker with deep bass', description: 'Take your music anywhere with this waterproof portable speaker.', specifications: [{ name: 'Bluetooth', value: '5.0' }, { name: 'Waterproof', value: 'IPX6' }], is_featured: true },
        ],
        news: [
          { title: 'Launching Our New Smart Watch Series', slug: 'new-smart-watch', category: 'Product', cover_image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop', summary: 'Introducing our most advanced smart watch yet.', content: 'The new smart watch series features AMOLED display, health tracking and long battery life.' },
          { title: 'Factory Tour: How We Build Quality', slug: 'factory-tour', category: 'Company', cover_image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop', summary: 'A behind-the-scenes look at our production line.', content: 'From SMT assembly to final QA, our process ensures every product meets global standards.' },
          { title: 'Top 5 Mobile Accessories in 2026', slug: 'top-mobile-accessories', category: 'Guide', cover_image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=400&fit=crop', summary: 'Trending accessories every phone user needs.', content: 'From fast chargers to wireless earbuds, here are the must-have accessories this year.' },
        ],
      } satisfies TemplateData;

    case 'home':
      return {
        hero_title: 'Quality Home Goods, Factory Direct',
        hero_subtitle: 'Premium home, kitchen and daily-life products designed for modern living. Custom OEM and global delivery.',
        hero_image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&h=700&fit=crop',
        seo_title: 'Home Goods Manufacturer & Wholesale',
        seo_description: 'Manufacturer of premium home, kitchen and daily-life products for global wholesale.',
        home_content: homeGoodsHome(),
        categories: [
          { name: 'Kitchen & Dining', slug: 'kitchen-dining', description: 'Cookware, utensils and dining essentials', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop' },
          { name: 'Home Storage', slug: 'home-storage', description: 'Organizing and storage solutions', image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400&h=300&fit=crop' },
          { name: 'Daily Essentials', slug: 'daily-essentials', description: 'Everyday products for the whole family', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop' },
        ],
        banners: [
          { image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&h=600&fit=crop', title: 'A Better Everyday', subtitle: 'Thoughtful home products built to last', button_text: 'Browse Products', button_link: 'products' },
        ],
        products: [
          { name: 'Stainless Steel Cookware Set', slug: 'cookware-set', model: 'HG-001', price: '39.99', main_image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=600&fit=crop', short_description: 'Durable stainless steel cookware set', description: 'Premium stainless steel cookware set with non-stick coating for healthy cooking.', specifications: [{ name: 'Material', value: 'Stainless Steel' }, { name: 'Pieces', value: '10' }], is_featured: true },
          { name: 'Stackable Storage Boxes', slug: 'storage-boxes', model: 'HG-002', price: '12.99', main_image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=600&h=600&fit=crop', short_description: 'Stackable organizers for every room', description: 'Space-saving stackable boxes to keep your home tidy and organized.', specifications: [{ name: 'Material', value: 'PP' }, { name: 'Capacity', value: '30L' }], is_featured: true },
          { name: 'Insulated Water Bottle', slug: 'water-bottle', model: 'HG-003', price: '9.99', main_image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop', short_description: 'Vacuum insulated stainless bottle', description: 'Keep drinks hot or cold for 24 hours with this durable double-wall bottle.', specifications: [{ name: 'Capacity', value: '500ml' }, { name: 'Insulation', value: '24 hours' }], is_featured: true },
          { name: 'Multi-purpose Organizer', slug: 'organizer', model: 'HG-004', price: '7.99', main_image: 'https://images.unsplash.com/photo-1581093458791-9c790a526b84?w=600&h=600&fit=crop', short_description: 'Versatile organizer for daily use', description: 'A versatile organizer for kitchen, bathroom and office essentials.', specifications: [{ name: 'Material', value: 'Bamboo / PP' }, { name: 'Sizes', value: 'Multiple' }], is_featured: true },
        ],
        news: [
          { title: 'New Season Home Collection', slug: 'new-home-collection', category: 'Product', cover_image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop', summary: 'Introducing our latest home collection.', content: 'Explore our new season collection featuring modern and functional home products.' },
          { title: 'Sustainable Materials in Home Goods', slug: 'sustainable-materials', category: 'Guide', cover_image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=600&h=400&fit=crop', summary: 'Why eco-friendly materials matter.', content: 'We are increasing the use of sustainable materials across our product range.' },
          { title: 'Meet Our Design Team', slug: 'design-team', category: 'Company', cover_image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop', summary: 'The people behind our thoughtful designs.', content: 'Our design team combines ergonomics and aesthetics for everyday products.' },
        ],
      } satisfies TemplateData;

    default:
      return {
        hero_title: 'Your Trusted Global Partner',
        hero_subtitle: 'Quality products, professional service and reliable delivery — built for international buyers.',
        hero_image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&h=700&fit=crop',
        seo_title: 'Quality Manufacturer & Wholesale Supplier',
        seo_description: 'Trusted manufacturer and wholesale supplier serving global clients with quality products.',
        home_content: base('Premium Manufacturer · Direct Factory'),
        categories: [
          { name: 'Product Category A', slug: 'category-a', description: 'Our featured product category', image: 'https://images.unsplash.com/photo-1581093458791-9c790a526b84?w=400&h=300&fit=crop' },
          { name: 'Product Category B', slug: 'category-b', description: 'Our featured product category', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop' },
          { name: 'Product Category C', slug: 'category-c', description: 'Our featured product category', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop' },
        ],
        banners: [
          { image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&h=600&fit=crop', title: 'Quality You Can Trust', subtitle: 'Professional manufacturing and export services', button_text: 'Learn More', button_link: 'products' },
        ],
        products: [
          { name: 'Featured Product One', slug: 'product-one', model: 'GP-001', price: '—', main_image: 'https://images.unsplash.com/photo-1581093458791-9c790a526b84?w=600&h=600&fit=crop', short_description: 'High quality product with reliable performance', description: 'A versatile, high-quality product exported worldwide with strict quality control.', specifications: [{ name: 'Material', value: 'Premium' }, { name: 'MOQ', value: '100 pcs' }], is_featured: true },
          { name: 'Featured Product Two', slug: 'product-two', model: 'GP-002', price: '—', main_image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop', short_description: 'Customizable product for global markets', description: 'A customizable product supporting OEM and ODM services for international buyers.', specifications: [{ name: 'Material', value: 'Premium' }, { name: 'MOQ', value: '100 pcs' }], is_featured: true },
          { name: 'Featured Product Three', slug: 'product-three', model: 'GP-003', price: '—', main_image: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=600&h=600&fit=crop', short_description: 'Durable product, factory direct pricing', description: 'A durable product offered at factory-direct prices with fast delivery.', specifications: [{ name: 'Material', value: 'Premium' }, { name: 'MOQ', value: '200 pcs' }], is_featured: true },
        ],
        news: [
          { title: 'Welcome to Our New Website', slug: 'welcome', category: 'Company', cover_image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop', summary: 'We are excited to launch our new official website.', content: 'Our new website showcases our products, capabilities and company news.' },
          { title: 'Why Choose Us as Your Partner', slug: 'why-choose-us', category: 'Guide', cover_image: 'https://images.unsplash.com/photo-1581093458791-9c790a526b84?w=600&h=400&fit=crop', summary: 'The advantages of working with a professional manufacturer.', content: 'Quality, price, delivery and service — the four pillars of our partnership.' },
          { title: 'Upcoming Exhibition Announcement', slug: 'exhibition', category: 'Events', cover_image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop', summary: 'Meet us at the upcoming international trade fair.', content: 'Visit our booth to explore our latest products and discuss cooperation.' },
        ],
      } satisfies TemplateData;
  }
}