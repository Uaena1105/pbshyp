import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { hashPassword } from '@/lib/admin-auth';

export async function GET() {
  const client = getSupabaseClient();
  
  try {
    // 检查是否已有管理员
    const { count: adminCount } = await client.from('admins').select('*', { count: 'exact', head: true });
    
    if ((adminCount ?? 0) === 0) {
      await client.from('admins').insert({
        username: 'admin',
        password_hash: hashPassword('admin123'),
        is_super: true,
      });
    }

    // 检查是否已有默认站点
    const { count: siteCount } = await client.from('sites').select('*', { count: 'exact', head: true });
    
    if ((siteCount ?? 0) === 0) {
      // 创建默认站点 (slug = 1)
      const { data: site1Arr } = await client.from('sites').insert({
        slug: '1',
        name: '示例站点1 - 塑料制品',
        is_active: true,
      }).select();
      const site1 = site1Arr![0];

      // 创建站点设置
      await client.from('site_settings').insert({
        site_id: site1.id,
        company_name: 'Shandong Licheng Advanced Material Technology Co., Ltd.',
        logo_url: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=200&h=80&fit=crop',
        whatsapp: '+86 197 0985 2239',
        phone: '+86 197 0985 2239',
        email: 'info@lichengplastic.com',
        address: 'No. 88 Industrial Park, Jinan, Shandong, China',
        seo_title: 'Custom Plastic Bag Manufacturer | Licheng Plastic',
        seo_description: 'Professional manufacturer of custom plastic bags, packaging bags, and advanced material solutions. High quality, competitive price, fast delivery.',
        seo_keywords: 'plastic bags, custom packaging, manufacturer, wholesale',
        footer_text: '© 2024 Licheng Advanced Material Technology Co., Ltd. All rights reserved.',
        primary_color: '#1e40af',
        hero_title: 'Premium Plastic Solutions for Global Brands',
        hero_subtitle: 'Professional manufacturer with 20+ years of experience in custom plastic packaging and advanced materials. Quality guaranteed, worldwide delivery.',
        hero_image: 'https://images.unsplash.com/photo-1581093458791-9c790a526b84?w=1600&h=700&fit=crop',
        hero_button_text: 'Explore Products',
        hero_button_link: 'products',
      });

      // 创建导航菜单
      await client.from('nav_links').insert([
        { site_id: site1.id, label: 'Home', href: '', sort_order: 1 },
        { site_id: site1.id, label: 'About Us', href: 'about', sort_order: 2 },
        { site_id: site1.id, label: 'Products', href: 'products', sort_order: 3 },
        { site_id: site1.id, label: 'Contact', href: 'contact', sort_order: 4 },
      ]);

      // 创建Banner
      await client.from('banners').insert([
        {
          site_id: site1.id,
          image: 'https://images.unsplash.com/photo-1581093458791-9c790a526b84?w=1600&h=600&fit=crop',
          title: 'Custom Plastic Packaging',
          subtitle: 'High quality plastic bags for your business needs',
          button_text: 'Learn More',
          button_link: 'products',
          sort_order: 1,
        },
        {
          site_id: site1.id,
          image: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=1600&h=600&fit=crop',
          title: 'Eco-Friendly Materials',
          subtitle: 'Sustainable solutions for the modern world',
          button_text: 'View Catalog',
          button_link: 'products',
          sort_order: 2,
        },
      ]);

      // 创建分类
      const { data: cat1Arr } = await client.from('categories').insert({
        site_id: site1.id, name: 'Plastic Bags', slug: 'plastic-bags',
        description: 'Various types of plastic bags for packaging and retail',
        image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400&h=300&fit=crop',
        sort_order: 1,
      }).select();
      const cat1 = cat1Arr![0];

      const { data: cat2Arr } = await client.from('categories').insert({
        site_id: site1.id, name: 'Packaging Films', slug: 'packaging-films',
        description: 'Flexible packaging films for various industries',
        image: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=400&h=300&fit=crop',
        sort_order: 2,
      }).select();
      const cat2 = cat2Arr![0];

      const { data: cat3Arr } = await client.from('categories').insert({
        site_id: site1.id, name: 'Advanced Materials', slug: 'advanced-materials',
        description: 'Innovative advanced material solutions',
        image: 'https://images.unsplash.com/photo-1581093458791-9c790a526b84?w=400&h=300&fit=crop',
        sort_order: 3,
      }).select();
      const cat3 = cat3Arr![0];

      // 创建产品
      await client.from('products').insert([
        {
          site_id: site1.id, category_id: cat1.id, name: 'Custom T-Shirt Bags', slug: 'custom-tshirt-bags',
          model: 'LC-TSB-001', price: '0.05',
          main_image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=600&h=600&fit=crop',
          images: [],
          short_description: 'High quality custom printed t-shirt bags for retail stores',
          description: 'Our custom t-shirt bags are made from premium grade plastic materials, perfect for retail stores, supermarkets, and boutiques. Available in various sizes, colors, and custom printing options.',
          specifications: [
            { name: 'Material', value: 'HDPE / LDPE' },
            { name: 'Size', value: 'Customizable' },
            { name: 'Thickness', value: '0.02-0.1mm' },
            { name: 'Printing', value: 'Up to 8 colors' },
          ],
          sort_order: 1, is_featured: true,
        },
        {
          site_id: site1.id, category_id: cat1.id, name: 'Zip Lock Bags', slug: 'zip-lock-bags',
          model: 'LC-ZLB-002', price: '0.03',
          main_image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop',
          images: [],
          short_description: 'Reusable zip lock bags for storage and packaging',
          description: 'Premium quality zip lock bags with secure seal, ideal for food storage, electronics packaging, and general storage needs.',
          specifications: [
            { name: 'Material', value: 'LDPE' },
            { name: 'Seal Type', value: 'Zip Lock' },
            { name: 'Size', value: 'Customizable' },
            { name: 'Clear', value: 'Transparent' },
          ],
          sort_order: 2, is_featured: true,
        },
        {
          site_id: site1.id, category_id: cat2.id, name: 'Stretch Film', slug: 'stretch-film',
          model: 'LC-SF-003', price: '1.20',
          main_image: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=600&h=600&fit=crop',
          images: [],
          short_description: 'Industrial grade stretch film for pallet wrapping',
          description: 'High-performance stretch film designed for industrial pallet wrapping and shipping protection. Excellent load retention and puncture resistance.',
          specifications: [
            { name: 'Material', value: 'LLDPE' },
            { name: 'Width', value: '500mm (standard)' },
            { name: 'Length', value: '1500m' },
            { name: 'Thickness', value: '20-30 micron' },
          ],
          sort_order: 3, is_featured: true,
        },
        {
          site_id: site1.id, category_id: cat3.id, name: 'Biodegradable Film', slug: 'biodegradable-film',
          model: 'LC-BIO-004', price: '2.50',
          main_image: 'https://images.unsplash.com/photo-1581093458791-9c790a526b84?w=600&h=600&fit=crop',
          images: [],
          short_description: 'Eco-friendly biodegradable plastic film',
          description: 'Our biodegradable film breaks down naturally in the environment, offering a sustainable alternative to traditional plastic materials.',
          specifications: [
            { name: 'Material', value: 'PLA + PBAT' },
            { name: 'Degradation Time', value: '180 days' },
            { name: 'Thickness', value: '15-50 micron' },
            { name: 'Certification', value: 'EN13432' },
          ],
          sort_order: 4, is_featured: true,
        },
        {
          site_id: site1.id, category_id: cat1.id, name: 'Garbage Bags', slug: 'garbage-bags',
          model: 'LC-GB-005', price: '0.10',
          main_image: 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=600&h=600&fit=crop',
          images: [],
          short_description: 'Heavy duty garbage bags for industrial and household use',
          description: 'Strong and durable garbage bags available in multiple sizes and thicknesses for various waste management needs.',
          specifications: [
            { name: 'Material', value: 'HDPE / LDPE' },
            { name: 'Size', value: '30L - 240L' },
            { name: 'Color', value: 'Black / Green / Custom' },
            { name: 'Type', value: 'Flat / Drawstring' },
          ],
          sort_order: 5, is_featured: false,
        },
        {
          site_id: site1.id, category_id: cat2.id, name: 'Shrink Wrap Film', slug: 'shrink-wrap-film',
          model: 'LC-SW-006', price: '1.80',
          main_image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop',
          images: [],
          short_description: 'PVC shrink wrap film for product packaging',
          description: 'Crystal clear shrink wrap film perfect for product packaging, gift wrapping, and tamper-evident sealing.',
          specifications: [
            { name: 'Material', value: 'PVC / POF' },
            { name: 'Thickness', value: '12-30 micron' },
            { name: 'Width', value: 'Customizable' },
            { name: 'Clarity', value: 'High transparency' },
          ],
          sort_order: 6, is_featured: false,
        },
      ]);

      // 创建页面
      await client.from('pages').insert([
        {
          site_id: site1.id, slug: 'home', title: 'Home',
          content: { sections: ['hero', 'featured', 'categories', 'about_preview'] },
          is_published: true,
        },
        {
          site_id: site1.id, slug: 'about', title: 'About Us',
          banner_image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&h=400&fit=crop',
          content: {
            title: 'About Our Company',
            paragraphs: [
              'Shandong Licheng Advanced Material Technology Co., Ltd. is a leading manufacturer of plastic packaging solutions with over 20 years of industry experience.',
              'Our state-of-the-art production facilities are equipped with the latest technology, allowing us to deliver high-quality products that meet international standards.',
              'We are committed to innovation, quality, and customer satisfaction. Our team of experts works closely with clients to provide customized solutions for their specific needs.',
            ],
            facts: [
              { label: 'Years Experience', value: '20+' },
              { label: 'Happy Clients', value: '500+' },
              { label: 'Products', value: '200+' },
              { label: 'Countries', value: '50+' },
            ],
          },
          is_published: true,
        },
        {
          site_id: site1.id, slug: 'contact', title: 'Contact Us',
          banner_image: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1600&h=400&fit=crop',
          content: {
            title: 'Get in Touch',
            description: 'Have questions? We would love to hear from you. Send us a message and we will respond as soon as possible.',
          },
          is_published: true,
        },
      ]);

      // 创建第二个示例站点
      const { data: site2Arr } = await client.from('sites').insert({
        slug: '2',
        name: '示例站点2 - 电子产品',
        is_active: true,
      }).select();
      const site2 = site2Arr![0];

      await client.from('site_settings').insert({
        site_id: site2.id,
        company_name: 'Tech Electronics Co., Ltd.',
        logo_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=80&fit=crop',
        whatsapp: '+86 138 0000 8888',
        phone: '+86 138 0000 8888',
        email: 'sales@techelectronics.com',
        address: 'Tech Park, Shenzhen, Guangdong, China',
        seo_title: 'Tech Electronics - Wholesale Electronics Manufacturer',
        seo_description: 'Leading manufacturer of consumer electronics, mobile accessories, and smart devices. Factory direct pricing.',
        seo_keywords: 'electronics, wholesale, manufacturer, consumer electronics',
        footer_text: '© 2024 Tech Electronics Co., Ltd. All rights reserved.',
        primary_color: '#0f172a',
        hero_title: 'Innovative Electronics for Everyday Life',
        hero_subtitle: 'Leading manufacturer of consumer electronics and smart devices. Quality products at factory direct prices.',
        hero_image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&h=700&fit=crop',
        hero_button_text: 'View Products',
        hero_button_link: 'products',
      });

      await client.from('nav_links').insert([
        { site_id: site2.id, label: 'Home', href: '', sort_order: 1 },
        { site_id: site2.id, label: 'About Us', href: 'about', sort_order: 2 },
        { site_id: site2.id, label: 'Products', href: 'products', sort_order: 3 },
        { site_id: site2.id, label: 'Contact', href: 'contact', sort_order: 4 },
      ]);

      await client.from('banners').insert([
        {
          site_id: site2.id,
          image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&h=600&fit=crop',
          title: 'Smart Electronics',
          subtitle: 'Innovative technology for modern living',
          button_text: 'Shop Now',
          button_link: 'products',
          sort_order: 1,
        },
      ]);

      const { data: ecat1Arr } = await client.from('categories').insert({
        site_id: site2.id, name: 'Mobile Accessories', slug: 'mobile-accessories',
        description: 'Chargers, cables, earphones and more',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
        sort_order: 1,
      }).select();
      const ecat1 = ecat1Arr![0];

      await client.from('products').insert([
        {
          site_id: site2.id, category_id: ecat1.id, name: 'Wireless Earbuds Pro', slug: 'wireless-earbuds-pro',
          model: 'TE-WE-001', price: '29.99',
          main_image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop',
          images: [],
          short_description: 'Premium wireless earbuds with noise cancellation',
          description: 'Enjoy crystal clear audio with our premium wireless earbuds featuring active noise cancellation and 30-hour battery life.',
          specifications: [
            { name: 'Bluetooth', value: '5.3' },
            { name: 'Battery', value: '30 hours total' },
            { name: 'ANC', value: 'Active Noise Cancellation' },
            { name: 'Waterproof', value: 'IPX5' },
          ],
          sort_order: 1, is_featured: true,
        },
        {
          site_id: site2.id, category_id: ecat1.id, name: 'Fast Charging Cable', slug: 'fast-charging-cable',
          model: 'TE-FC-002', price: '5.99',
          main_image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop',
          images: [],
          short_description: 'USB-C fast charging cable braided design',
          description: 'High-speed USB-C cable with braided nylon jacket for maximum durability. Supports 100W fast charging.',
          specifications: [
            { name: 'Type', value: 'USB-C to USB-C' },
            { name: 'Power', value: '100W' },
            { name: 'Length', value: '1m / 2m' },
            { name: 'Material', value: 'Braided Nylon' },
          ],
          sort_order: 2, is_featured: true,
        },
      ]);

      await client.from('pages').insert([
        { site_id: site2.id, slug: 'home', title: 'Home', content: { sections: ['hero', 'featured', 'categories'] }, is_published: true },
        {
          site_id: site2.id, slug: 'about', title: 'About Us',
          banner_image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&h=400&fit=crop',
          content: {
            title: 'About Tech Electronics',
            paragraphs: [
              'Tech Electronics is a leading manufacturer of consumer electronics based in Shenzhen, China.',
              'With 15+ years of experience, we specialize in mobile accessories, smart devices, and innovative electronic products.',
              'Our products are exported to over 60 countries worldwide, trusted by thousands of satisfied customers.',
            ],
            facts: [
              { label: 'Years Experience', value: '15+' },
              { label: 'Global Clients', value: '1000+' },
              { label: 'Products', value: '500+' },
              { label: 'Countries', value: '60+' },
            ],
          },
          is_published: true,
        },
        {
          site_id: site2.id, slug: 'contact', title: 'Contact Us',
          banner_image: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1600&h=400&fit=crop',
          content: { title: 'Contact Us', description: 'Get in touch with our team for inquiries and quotes.' },
          is_published: true,
        },
      ]);
    }

    return NextResponse.json({ success: true, message: '初始化数据完成' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
