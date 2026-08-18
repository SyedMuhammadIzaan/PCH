import {
  User,
  Category,
  Product,
  Review,
  FAQ,
  Order,
  DashboardStats
} from '../src/types/index.js';

// In-memory store initialized with rich, authentic Pakistani fashion data
interface Database {
  users: User[];
  categories: Category[];
  products: Product[];
  reviews: Review[];
  faqs: FAQ[];
  orders: Order[];
}

const initialCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Unstitched Luxury Lawn',
    slug: 'unstitched-lawn',
    description: 'Bespoke 3-piece and 2-piece unstitched embroidered lawn suits with chiffon and organza dupattas.',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'cat-2',
    name: 'Stitched Luxury Pret',
    slug: 'stitched-pret',
    description: 'Ready-to-wear designer kurtas, modern cuts, and 2-piece stitched formal wear.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    createdAt: '2026-01-12T10:00:00Z',
    updatedAt: '2026-01-12T10:00:00Z',
  },
  {
    id: 'cat-3',
    name: "Men's Kurta & Fabrics",
    slug: 'mens-collection',
    description: "Traditional Pakistani men's wash & wear, premium Giza cotton, and embroidered festive kurtas.",
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'cat-4',
    name: 'Festive & Chiffon',
    slug: 'festive-chiffon',
    description: 'Heavy resham and tilla embroidered formal ensembles for weddings, Eid, and celebrations.',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    createdAt: '2026-01-18T10:00:00Z',
    updatedAt: '2026-01-18T10:00:00Z',
  },
  {
    id: 'cat-5',
    name: 'Winter Khaddar & Linen',
    slug: 'winter-khaddar',
    description: 'Handwoven heavy khaddar, warm marina, and premium textured linen collections.',
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    createdAt: '2026-01-20T10:00:00Z',
    updatedAt: '2026-01-20T10:00:00Z',
  },
  {
    id: 'cat-6',
    name: 'Pure Silk & Velvet',
    slug: 'silk-velvet',
    description: 'Lustrous Banarasi raw silk, micro-velvet shawls, and pure jacquard weaves.',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    createdAt: '2026-01-22T10:00:00Z',
    updatedAt: '2026-01-22T10:00:00Z',
  },
  {
    id: 'cat-7',
    name: 'Embroidered Shawls',
    slug: 'shawls-dupattas',
    description: 'Intricately embroidered woolen, velvet, and Kashmiri pashmina shawls.',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    createdAt: '2026-01-25T10:00:00Z',
    updatedAt: '2026-01-25T10:00:00Z',
  },
  {
    id: 'cat-8',
    name: 'Cotton Daily Wear',
    slug: 'cotton-essentials',
    description: 'Breathable 100% pure cottons for everyday effortless comfort and elegance.',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    createdAt: '2026-01-28T10:00:00Z',
    updatedAt: '2026-01-28T10:00:00Z',
  },
];

const initialProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Gul-e-Noor Embroidered Lawn 3-Piece',
    slug: 'gul-e-noor-embroidered-lawn-3-piece',
    description: 'A masterpiece from our Festive Lawn collection. Features fine schiffli embroidery on pure Swiss Voile lawn shirt, paired with an embroidered organza border, dyed cambric trousers, and a luxurious digital printed pure silk dupatta.',
    price: 6800,
    discountPrice: 5499,
    stock: 24,
    categoryId: 'cat-1',
    categoryName: 'Unstitched Luxury Lawn',
    subcategory: '3-Piece Embroidered',
    featured: true,
    newArrival: true,
    status: 'active',
    sku: 'PCH-LNW-001',
    fabric: '100% Swiss Voile Lawn & Pure Silk',
    material: 'Premium Pima Cotton Lawn',
    color: 'Emerald & Sage Green with Gold Resham',
    collection: 'Festive Spring/Summer 2026',
    season: 'Summer 2026',
    careInstructions: 'Dry clean recommended. Iron at medium temperature. Do not bleach or dry in direct sunlight.',
    productCode: 'GN-3PC-889',
    salesCount: 142,
    rating: 4.9,
    reviewCount: 38,
    images: [
      {
        id: 'img-1-1',
        imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=85',
        displayOrder: 1,
      },
      {
        id: 'img-1-2',
        imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85',
        displayOrder: 2,
      },
      {
        id: 'img-1-3',
        imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=85',
        displayOrder: 3,
      },
    ],
    variants: [
      { id: 'var-1-1', name: 'Type', value: 'Unstitched 3-Piece', additionalPrice: 0, stock: 15 },
      { id: 'var-1-2', name: 'Size', value: 'Stitched - Small (Chest 36")', additionalPrice: 1200, stock: 3 },
      { id: 'var-1-3', name: 'Size', value: 'Stitched - Medium (Chest 40")', additionalPrice: 1200, stock: 4 },
      { id: 'var-1-4', name: 'Size', value: 'Stitched - Large (Chest 44")', additionalPrice: 1200, stock: 2 },
    ],
    seoTitle: 'Gul-e-Noor Embroidered Lawn 3-Piece Suit | Pakistan Cloth House',
    seoDescription: 'Shop original Pakistani luxury lawn with silk dupatta from Pakistan Cloth House. Fast shipping nationwide with Cash on Delivery.',
    createdAt: '2026-03-01T08:30:00Z',
    updatedAt: '2026-03-01T08:30:00Z',
  },
  {
    id: 'prod-2',
    name: 'Zeenat Festive Chiffon Formal Suit',
    slug: 'zeenat-festive-chiffon-formal-suit',
    description: 'Exquisite Pakistani formal wear adorned with intricate dabka, sequin, and hand-embroidered neckline. Tailored on premium crinkle chiffon with raw silk inner and heavily embroidered scalloped dupatta.',
    price: 14500,
    discountPrice: 11999,
    stock: 18,
    categoryId: 'cat-4',
    categoryName: 'Festive & Chiffon',
    subcategory: 'Wedding Formals',
    featured: true,
    newArrival: false,
    status: 'active',
    sku: 'PCH-CHF-004',
    fabric: 'Pure Crinkle Chiffon with Raw Silk Trousers',
    material: 'Handcrafted Zari & Resham',
    color: 'Mint Pastel Green & Pearl Ivory',
    collection: 'Royal Eid Collection',
    season: 'Festive All-Season',
    careInstructions: 'Strictly dry clean only. Preserve in cloth garment bag.',
    productCode: 'ZT-FRM-402',
    salesCount: 89,
    rating: 4.8,
    reviewCount: 24,
    images: [
      {
        id: 'img-2-1',
        imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=85',
        displayOrder: 1,
      },
      {
        id: 'img-2-2',
        imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=85',
        displayOrder: 2,
      },
    ],
    variants: [
      { id: 'var-2-1', name: 'Type', value: 'Unstitched Formal 3-Piece', additionalPrice: 0, stock: 10 },
      { id: 'var-2-2', name: 'Size', value: 'Custom Stitched Pret (S)', additionalPrice: 2000, stock: 3 },
      { id: 'var-2-3', name: 'Size', value: 'Custom Stitched Pret (M)', additionalPrice: 2000, stock: 3 },
      { id: 'var-2-4', name: 'Size', value: 'Custom Stitched Pret (L)', additionalPrice: 2000, stock: 2 },
    ],
    seoTitle: 'Zeenat Festive Chiffon Formal Suit | PCH Pakistan',
    seoDescription: 'Handcrafted formal Pakistani chiffon suit for weddings & festive occasions.',
    createdAt: '2026-02-15T12:00:00Z',
    updatedAt: '2026-02-15T12:00:00Z',
  },
  {
    id: 'prod-3',
    name: "Shaan-e-Mughal Men's Premium Kurta Shalwar",
    slug: 'shaan-e-mughal-mens-premium-kurta-shalwar',
    description: "Crafted from fine Egyptian Giza cotton with subtle tone-on-tone collar embroidery and branded brass buttons. Delivers unmatched comfort, crisp fall, and gentlemanly presence for Juma prayers, Eid, and formal gatherings.",
    price: 5200,
    discountPrice: 4250,
    stock: 35,
    categoryId: 'cat-3',
    categoryName: "Men's Kurta & Fabrics",
    subcategory: 'Stitched 2-Piece',
    featured: true,
    newArrival: true,
    status: 'active',
    sku: 'PCH-MEN-012',
    fabric: '100% Superfine Egyptian Cotton',
    material: 'Egyptian Giza Weave',
    color: 'Forest Olive Green',
    collection: 'Istehkam Men 2026',
    season: 'All Season',
    careInstructions: 'Machine wash delicate cycle. Starch lightly for crisp fold.',
    productCode: 'SM-MEN-103',
    salesCount: 210,
    rating: 4.9,
    reviewCount: 52,
    images: [
      {
        id: 'img-3-1',
        imageUrl: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1000&q=85',
        displayOrder: 1,
      },
      {
        id: 'img-3-2',
        imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=85',
        displayOrder: 2,
      },
    ],
    variants: [
      { id: 'var-3-1', name: 'Size', value: 'Small (Chest 38", Length 40")', additionalPrice: 0, stock: 8 },
      { id: 'var-3-2', name: 'Size', value: 'Medium (Chest 42", Length 42")', additionalPrice: 0, stock: 15 },
      { id: 'var-3-3', name: 'Size', value: 'Large (Chest 45", Length 44")', additionalPrice: 0, stock: 9 },
      { id: 'var-3-4', name: 'Size', value: 'XL (Chest 48", Length 45")', additionalPrice: 0, stock: 3 },
    ],
    seoTitle: "Men's Luxury Kurta Shalwar | Pakistan Cloth House",
    seoDescription: "Shop high quality Pakistani Men's Kurta Shalwar online in Pakistan.",
    createdAt: '2026-03-05T14:15:00Z',
    updatedAt: '2026-03-05T14:15:00Z',
  },
  {
    id: 'prod-4',
    name: 'Bahaar Printed Lawn Stitched 2-Piece',
    slug: 'bahaar-printed-lawn-stitched-2-piece',
    description: 'Modern relaxed silhouette with contemporary digital ethnic motifs, lace insets on sleeves, and matching cigarette pants. Perfect for daily office, campus, and casual daywear.',
    price: 3800,
    discountPrice: 2999,
    stock: 42,
    categoryId: 'cat-2',
    categoryName: 'Stitched Luxury Pret',
    subcategory: '2-Piece Daily Pret',
    featured: false,
    newArrival: true,
    status: 'active',
    sku: 'PCH-PRT-020',
    fabric: 'Fine Pima Lawn & Cambric Cotton',
    material: 'Digital Reactive Printed Cotton',
    color: 'Mint Tea with Jade Florals',
    collection: 'Daily Radiance 2026',
    season: 'Spring/Summer 2026',
    careInstructions: 'Gentle machine wash with mild detergent.',
    productCode: 'BH-PRT-220',
    salesCount: 165,
    rating: 4.7,
    reviewCount: 31,
    images: [
      {
        id: 'img-4-1',
        imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85',
        displayOrder: 1,
      },
      {
        id: 'img-4-2',
        imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=85',
        displayOrder: 2,
      },
    ],
    variants: [
      { id: 'var-4-1', name: 'Size', value: 'XS', additionalPrice: 0, stock: 6 },
      { id: 'var-4-2', name: 'Size', value: 'Small', additionalPrice: 0, stock: 14 },
      { id: 'var-4-3', name: 'Size', value: 'Medium', additionalPrice: 0, stock: 15 },
      { id: 'var-4-4', name: 'Size', value: 'Large', additionalPrice: 0, stock: 7 },
    ],
    seoTitle: 'Bahaar Stitched Lawn 2-Piece Suit | PCH',
    seoDescription: 'Ready to wear casual printed lawn kurta and trouser.',
    createdAt: '2026-03-08T09:00:00Z',
    updatedAt: '2026-03-08T09:00:00Z',
  },
  {
    id: 'prod-5',
    name: 'Noor-e-Kashmir Pure Pashmina Shawl',
    slug: 'noor-e-kashmir-pure-pashmina-shawl',
    description: 'Heritage heirloom shawl crafted from ethically harvested pure Kashmiri wool with exquisite Kashmiri needlework (Tilla & Sozni embroidery). Incredibly lightweight yet remarkably warm.',
    price: 18500,
    discountPrice: 14999,
    stock: 12,
    categoryId: 'cat-7',
    categoryName: 'Embroidered Shawls',
    subcategory: 'Pashmina & Wool',
    featured: true,
    newArrival: false,
    status: 'active',
    sku: 'PCH-SHW-009',
    fabric: '100% Certified Kashmiri Pashmina Wool',
    material: 'Hand-embroidered Sozni Needlework',
    color: 'Deep Bottle Green with Antique Gold Border',
    collection: 'Heritage Shawls 2026',
    season: 'Autumn/Winter',
    careInstructions: 'Professional dry clean only. Store with cedar chips.',
    productCode: 'NK-SHW-990',
    salesCount: 78,
    rating: 5.0,
    reviewCount: 19,
    images: [
      {
        id: 'img-5-1',
        imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=85',
        displayOrder: 1,
      },
      {
        id: 'img-5-2',
        imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=85',
        displayOrder: 2,
      },
    ],
    variants: [
      { id: 'var-5-1', name: 'Dimensions', value: 'Full Length (2.5 Meters x 1.25 Meters)', additionalPrice: 0, stock: 12 },
    ],
    seoTitle: 'Authentic Kashmiri Pashmina Shawl | Pakistan Cloth House',
    seoDescription: 'Handmade luxury Kashmiri embroidered shawls shipped across Pakistan.',
    createdAt: '2026-01-20T11:00:00Z',
    updatedAt: '2026-01-20T11:00:00Z',
  },
  {
    id: 'prod-6',
    name: 'Meher Winter Khaddar Embroidered Ensemble',
    slug: 'meher-winter-khaddar-embroidered-ensemble',
    description: 'Traditional Kamalia handloom khaddar with heavy woolen thread embroidery along daman and chaak. Paired with a warm woven jacquard shawl and solid dyed khaddar shalwar fabric.',
    price: 5500,
    discountPrice: 4499,
    stock: 28,
    categoryId: 'cat-5',
    categoryName: 'Winter Khaddar & Linen',
    subcategory: '3-Piece Unstitched Khaddar',
    featured: false,
    newArrival: false,
    status: 'active',
    sku: 'PCH-KHD-015',
    fabric: 'Authentic Handspun Kamalia Khaddar & Jacquard Wool Shawl',
    material: '100% Handloom Cotton Khaddar',
    color: 'Earthy Fern Green & Rust Accents',
    collection: 'Virasat Winter Edition',
    season: 'Winter',
    careInstructions: 'Shrink fabric before stitching. Wash separately.',
    productCode: 'MH-KHD-515',
    salesCount: 135,
    rating: 4.8,
    reviewCount: 29,
    images: [
      {
        id: 'img-6-1',
        imageUrl: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1000&q=85',
        displayOrder: 1,
      },
      {
        id: 'img-6-2',
        imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85',
        displayOrder: 2,
      },
    ],
    variants: [
      { id: 'var-6-1', name: 'Type', value: 'Unstitched 3-Piece with Shawl', additionalPrice: 0, stock: 20 },
      { id: 'var-6-2', name: 'Size', value: 'Stitched - Medium', additionalPrice: 1400, stock: 5 },
      { id: 'var-6-3', name: 'Size', value: 'Stitched - Large', additionalPrice: 1400, stock: 3 },
    ],
    seoTitle: 'Kamalia Handloom Khaddar 3-Piece Suit | PCH',
    seoDescription: 'Authentic Pakistani Kamalia Khaddar suits with woolen shawl.',
    createdAt: '2026-02-01T15:00:00Z',
    updatedAt: '2026-02-01T15:00:00Z',
  },
  {
    id: 'prod-7',
    name: 'Mehrunnisa Banarasi Raw Silk Suit',
    slug: 'mehrunnisa-banarasi-raw-silk-suit',
    description: 'Woven with gold and silver zari on authentic Banarasi raw silk. Features delicate hand-tasseled borders and a heavy woven silk dupatta with regal Persian floral bootis.',
    price: 16000,
    discountPrice: 13500,
    stock: 15,
    categoryId: 'cat-6',
    categoryName: 'Pure Silk & Velvet',
    subcategory: 'Silk Formals',
    featured: true,
    newArrival: true,
    status: 'active',
    sku: 'PCH-SLK-007',
    fabric: 'Pure Rawa Silk & Banarasi Weft',
    material: 'Zari Jacquard Silk',
    color: 'Royal Jade Green & Antique Champagne',
    collection: 'Shehnai Formal Collection 2026',
    season: 'Festive All-Season',
    careInstructions: 'Dry clean only. Roll in tissue paper.',
    productCode: 'MN-SLK-701',
    salesCount: 64,
    rating: 4.9,
    reviewCount: 17,
    images: [
      {
        id: 'img-7-1',
        imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=85',
        displayOrder: 1,
      },
      {
        id: 'img-7-2',
        imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=85',
        displayOrder: 2,
      },
    ],
    variants: [
      { id: 'var-7-1', name: 'Type', value: 'Unstitched 3-Piece Silk', additionalPrice: 0, stock: 10 },
      { id: 'var-7-2', name: 'Size', value: 'Stitched Luxury Pret (Medium)', additionalPrice: 2500, stock: 3 },
      { id: 'var-7-3', name: 'Size', value: 'Stitched Luxury Pret (Large)', additionalPrice: 2500, stock: 2 },
    ],
    seoTitle: 'Banarasi Raw Silk Suit | Pakistan Cloth House',
    seoDescription: 'Buy luxury Banarasi raw silk suits online in Pakistan with cash on delivery.',
    createdAt: '2026-03-02T16:20:00Z',
    updatedAt: '2026-03-02T16:20:00Z',
  },
  {
    id: 'prod-8',
    name: "Kohsar Men's Wash & Wear Unstitched Fabric (4.5M)",
    slug: 'kohsar-mens-wash-and-wear-unstitched-fabric',
    description: "Premium high-twist blended micro-viscose fabric designed specifically for Pakistani climate. Wrinkle-resistant, breathable, with smooth drape and subtle natural sheen. Includes gift box with matching metallic buttons.",
    price: 3600,
    discountPrice: 2899,
    stock: 50,
    categoryId: 'cat-3',
    categoryName: "Men's Kurta & Fabrics",
    subcategory: "Men's Unstitched",
    featured: false,
    newArrival: true,
    status: 'active',
    sku: 'PCH-MEN-030',
    fabric: 'High Twist Micro Viscose Blend',
    material: 'Wash & Wear Wrinkle Free Fabric',
    color: 'Muted Sage Green',
    collection: 'Mardaan Collection 2026',
    season: 'Spring/Summer',
    careInstructions: 'Easy machine wash. Requires minimal pressing.',
    productCode: 'KS-WNW-305',
    salesCount: 195,
    rating: 4.8,
    reviewCount: 45,
    images: [
      {
        id: 'img-8-1',
        imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=85',
        displayOrder: 1,
      },
      {
        id: 'img-8-2',
        imageUrl: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1000&q=85',
        displayOrder: 2,
      },
    ],
    variants: [
      { id: 'var-8-1', name: 'Length', value: '4.5 Meters Standard Suit Cut', additionalPrice: 0, stock: 35 },
      { id: 'var-8-2', name: 'Length', value: '7.0 Meters Double Suit Cut (2 Suits)', additionalPrice: 2600, stock: 15 },
    ],
    seoTitle: "Men's Wash & Wear Fabric 4.5m | PCH",
    seoDescription: "Original Pakistani Wash and Wear men's unstitched cloth.",
    createdAt: '2026-03-06T10:10:00Z',
    updatedAt: '2026-03-06T10:10:00Z',
  },
  {
    id: 'prod-9',
    name: 'Sohni Pure Chiffon Embroidered Dupatta',
    slug: 'sohni-pure-chiffon-embroidered-dupatta',
    description: 'Fine pure crinkle chiffon dupatta with 4-sided embroidered scalloped tilla borders and subtle spray work. Complements solid kurtas, silks, and everyday festive wear effortlessly.',
    price: 2400,
    discountPrice: 1899,
    stock: 30,
    categoryId: 'cat-7',
    categoryName: 'Embroidered Shawls',
    subcategory: 'Dupattas',
    featured: false,
    newArrival: false,
    status: 'active',
    sku: 'PCH-DUP-011',
    fabric: '100% Pure Crinkle Chiffon',
    material: 'Tilla & Sequins Embroidery',
    color: 'Seafoam Green & Silver',
    collection: 'Dupatta Bazaar',
    season: 'All Seasons',
    careInstructions: 'Hand wash in cold water or dry clean.',
    productCode: 'SH-DUP-112',
    salesCount: 112,
    rating: 4.7,
    reviewCount: 22,
    images: [
      {
        id: 'img-9-1',
        imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=85',
        displayOrder: 1,
      },
    ],
    variants: [
      { id: 'var-9-1', name: 'Size', value: 'Standard (2.5 Meters)', additionalPrice: 0, stock: 30 },
    ],
    seoTitle: 'Embroidered Chiffon Dupatta | Pakistan Cloth House',
    seoDescription: 'High quality embroidered dupattas online shopping Pakistan.',
    createdAt: '2026-02-10T12:00:00Z',
    updatedAt: '2026-02-10T12:00:00Z',
  },
  {
    id: 'prod-10',
    name: 'Daily Comfort Multani Cotton 2-Piece Suit',
    slug: 'daily-comfort-multani-cotton-2-piece-suit',
    description: 'Renowned Multani block-print technique on pure lawn-cotton blend with breathable weave. Vibrant fast dyes that soften with every wash, perfect for long summer days.',
    price: 2900,
    discountPrice: 2350,
    stock: 40,
    categoryId: 'cat-8',
    categoryName: 'Cotton Daily Wear',
    subcategory: '2-Piece Unstitched',
    featured: false,
    newArrival: true,
    status: 'active',
    sku: 'PCH-CTN-044',
    fabric: 'Pure Multani Breathable Cotton',
    material: 'Natural Dyes Hand Block Print',
    color: 'Mint Green & Ochre Yellow',
    collection: 'Dastkari Essentials 2026',
    season: 'Summer 2026',
    careInstructions: 'First wash in salty cold water to set colors.',
    productCode: 'DC-MLT-440',
    salesCount: 178,
    rating: 4.9,
    reviewCount: 36,
    images: [
      {
        id: 'img-10-1',
        imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85',
        displayOrder: 1,
      },
      {
        id: 'img-10-2',
        imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=85',
        displayOrder: 2,
      },
    ],
    variants: [
      { id: 'var-10-1', name: 'Type', value: 'Unstitched 2-Piece (Shirt + Trouser)', additionalPrice: 0, stock: 30 },
      { id: 'var-10-2', name: 'Type', value: 'Stitched Pret - Medium', additionalPrice: 1100, stock: 6 },
      { id: 'var-10-3', name: 'Type', value: 'Stitched Pret - Large', additionalPrice: 1100, stock: 4 },
    ],
    seoTitle: 'Multani Cotton 2-Piece Suit | PCH Pakistan',
    seoDescription: 'Authentic Multani hand block print cotton suits.',
    createdAt: '2026-03-07T11:45:00Z',
    updatedAt: '2026-03-07T11:45:00Z',
  },
];

const initialReviews: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    productName: 'Gul-e-Noor Embroidered Lawn 3-Piece',
    customerName: 'Ayesha Khan',
    rating: 5,
    comment: 'The quality of the Swiss Voile lawn is absolutely sensational! The embroidery is so crisp and the silk dupatta feels like pure luxury. Received my parcel in Lahore in just 2 days with Cash on Delivery.',
    status: 'approved',
    featured: true,
    createdAt: '2026-03-03T10:20:00Z',
  },
  {
    id: 'rev-2',
    productId: 'prod-3',
    productName: "Shaan-e-Mughal Men's Premium Kurta Shalwar",
    customerName: 'Hamza Tariq',
    rating: 5,
    comment: 'Ordered the Forest Olive color for Friday prayers. The Giza cotton texture is crisp and breathable. Size Medium fits true to size. Pakistan Cloth House never disappoints.',
    status: 'approved',
    featured: true,
    createdAt: '2026-03-06T18:40:00Z',
  },
  {
    id: 'rev-3',
    productId: 'prod-5',
    productName: 'Noor-e-Kashmir Pure Pashmina Shawl',
    customerName: 'Zainab Malik',
    rating: 5,
    comment: 'An heirloom piece indeed! The needlework is intricate and delicate. Packaging in the luxury PCH gift box was so elegant. Highly recommended for bridal gifts.',
    status: 'approved',
    featured: true,
    createdAt: '2026-02-22T14:15:00Z',
  },
  {
    id: 'rev-4',
    productId: 'prod-2',
    productName: 'Zeenat Festive Chiffon Formal Suit',
    customerName: 'Fatima Noor',
    rating: 5,
    comment: 'Wore this to a family wedding in Islamabad and received non-stop compliments. The tilla work and pastel mint green combination is mesmerizing.',
    status: 'approved',
    featured: true,
    createdAt: '2026-02-28T09:30:00Z',
  },
  {
    id: 'rev-5',
    productId: 'prod-4',
    productName: 'Bahaar Printed Lawn Stitched 2-Piece',
    customerName: 'Sana Ahmed',
    rating: 4,
    comment: 'Very chic casual outfit for university and office. The cut is very modern and modest. Great value for money!',
    status: 'approved',
    featured: true,
    createdAt: '2026-03-09T16:00:00Z',
  },
  {
    id: 'rev-6',
    productId: 'prod-8',
    productName: "Kohsar Men's Wash & Wear Unstitched Fabric (4.5M)",
    customerName: 'Bilal Siddiqui',
    rating: 5,
    comment: 'Gave this to my tailor in Karachi. He praised the density and weave of the fabric. It does not crease even after a full day of wear. Will buy 2 more cuts.',
    status: 'approved',
    featured: true,
    createdAt: '2026-03-08T12:10:00Z',
  },
];

const initialFAQs: FAQ[] = [
  {
    id: 'faq-1',
    question: 'What are your delivery charges and how long does shipping take across Pakistan?',
    answer: 'We offer standard nationwide delivery across all major cities (Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, Quetta, and 200+ towns). Delivery typically takes 2 to 4 working days via TCS, Leopards, and Trax. We offer FREE SHIPPING on all orders over Rs. 3,500! For orders under Rs. 3,500, a flat shipping fee of Rs. 250 applies.',
    status: 'active',
    displayOrder: 1,
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'faq-2',
    question: 'Do you offer Cash on Delivery (COD) and what other payment options exist?',
    answer: 'Yes! Cash on Delivery (COD) is available nationwide. You can also pay securely online using Visa, MasterCard, UnionPay, JazzCash, EasyPaisa, or direct Bank Alfalah / Meezan Bank transfer.',
    status: 'active',
    displayOrder: 2,
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'faq-3',
    question: 'Are all fabrics 100% original and authentic Pakistani textiles?',
    answer: 'Yes, 100% guaranteed. Pakistan Cloth House sources exclusively from genuine master mills and authentic artisan clusters across Punjab, Sindh, and Khyber Pakhtunkhwa. We inspect every meter for color fastness, thread count, and pure fiber integrity.',
    status: 'active',
    displayOrder: 3,
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'faq-4',
    question: 'What is your return and exchange policy?',
    answer: 'We provide a hassle-free 7-day return and exchange policy on all unstitched fabrics and unworn stitched items in their original packaging with tags intact. If you find any manufacturing defect, we will arrange a complimentary reverse pickup.',
    status: 'active',
    displayOrder: 4,
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'faq-5',
    question: 'How do I choose between Unstitched and Stitched variants?',
    answer: 'On any product detail page, simply select your desired variant from the options. Unstitched options include generous fabric yardage to tailor to your custom specifications, while Stitched Pret comes in standardized sizes (Small, Medium, Large, XL) with size charts provided.',
    status: 'active',
    displayOrder: 5,
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'faq-6',
    question: 'How can I track my order status?',
    answer: 'Once you place an order, you will receive an instant SMS and Email with your PCH Tracking Number. You can also view live tracking updates anytime by logging into your account under "My Orders" or entering your Order ID.',
    status: 'active',
    displayOrder: 6,
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-10T10:00:00Z',
  },
];

const initialUsers: User[] = [
  {
    id: 'user-admin-1',
    name: 'Admin PCH',
    email: 'admin@pch.pk',
    phone: '+92 300 1234567',
    role: 'admin',
    status: 'active',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'user-cust-1',
    name: 'Ayesha Khan',
    email: 'customer@pch.pk',
    phone: '+92 321 9876543',
    role: 'customer',
    status: 'active',
    createdAt: '2026-01-05T10:00:00Z',
    updatedAt: '2026-01-05T10:00:00Z',
  },
  {
    id: 'user-cust-2',
    name: 'Hamza Tariq',
    email: 'hamza.tariq@gmail.com',
    phone: '+92 333 5551234',
    role: 'customer',
    status: 'active',
    createdAt: '2026-01-15T12:00:00Z',
    updatedAt: '2026-01-15T12:00:00Z',
  },
];

const initialOrders: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'PCH-2026-881',
    userId: 'user-cust-1',
    customerName: 'Ayesha Khan',
    customerEmail: 'customer@pch.pk',
    customerPhone: '+92 321 9876543',
    subtotal: 5499,
    discount: 0,
    shipping: 0,
    total: 5499,
    paymentMethod: 'cod',
    paymentStatus: 'paid',
    orderStatus: 'delivered',
    shippingAddress: {
      fullName: 'Ayesha Khan',
      email: 'customer@pch.pk',
      phone: '+92 321 9876543',
      address: 'House 42-B, Sector Y, Phase 3, DHA',
      city: 'Lahore',
      province: 'Punjab',
      postalCode: '54792',
      additionalInstructions: 'Call before delivery.',
    },
    items: [
      {
        id: 'item-1',
        productId: 'prod-1',
        productName: 'Gul-e-Noor Embroidered Lawn 3-Piece',
        productImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80',
        variantInfo: 'Unstitched 3-Piece',
        quantity: 1,
        price: 5499,
        subtotal: 5499,
      },
    ],
    createdAt: '2026-03-01T11:20:00Z',
    updatedAt: '2026-03-04T15:30:00Z',
  },
  {
    id: 'ord-1002',
    orderNumber: 'PCH-2026-882',
    userId: 'user-cust-2',
    customerName: 'Hamza Tariq',
    customerEmail: 'hamza.tariq@gmail.com',
    customerPhone: '+92 333 5551234',
    subtotal: 8500,
    discount: 500,
    shipping: 0,
    total: 8000,
    paymentMethod: 'online',
    paymentStatus: 'paid',
    orderStatus: 'shipped',
    shippingAddress: {
      fullName: 'Hamza Tariq',
      email: 'hamza.tariq@gmail.com',
      phone: '+92 333 5551234',
      address: 'Apartment 704, Royal Towers, Clifton Block 4',
      city: 'Karachi',
      province: 'Sindh',
      postalCode: '75600',
    },
    items: [
      {
        id: 'item-2',
        productId: 'prod-3',
        productName: "Shaan-e-Mughal Men's Premium Kurta Shalwar",
        productImage: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=400&q=80',
        variantInfo: 'Medium',
        quantity: 2,
        price: 4250,
        subtotal: 8500,
      },
    ],
    createdAt: '2026-03-06T14:10:00Z',
    updatedAt: '2026-03-07T09:00:00Z',
  },
  {
    id: 'ord-1003',
    orderNumber: 'PCH-2026-883',
    userId: 'user-cust-1',
    customerName: 'Ayesha Khan',
    customerEmail: 'customer@pch.pk',
    customerPhone: '+92 321 9876543',
    subtotal: 11999,
    discount: 0,
    shipping: 0,
    total: 11999,
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    orderStatus: 'processing',
    shippingAddress: {
      fullName: 'Ayesha Khan',
      email: 'customer@pch.pk',
      phone: '+92 321 9876543',
      address: 'House 42-B, Sector Y, Phase 3, DHA',
      city: 'Lahore',
      province: 'Punjab',
      postalCode: '54792',
    },
    items: [
      {
        id: 'item-3',
        productId: 'prod-2',
        productName: 'Zeenat Festive Chiffon Formal Suit',
        productImage: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=400&q=80',
        variantInfo: 'Unstitched Formal 3-Piece',
        quantity: 1,
        price: 11999,
        subtotal: 11999,
      },
    ],
    createdAt: '2026-03-09T08:45:00Z',
    updatedAt: '2026-03-09T10:00:00Z',
  },
];

class DatabaseEngine {
  private data: Database;

  constructor() {
    this.data = {
      users: [...initialUsers],
      categories: [...initialCategories],
      products: [...initialProducts],
      reviews: [...initialReviews],
      faqs: [...initialFAQs],
      orders: [...initialOrders],
    };
    this.updateCategoryProductCounts();
  }

  private updateCategoryProductCounts() {
    for (const cat of this.data.categories) {
      cat.productCount = this.data.products.filter(
        (p) => p.categoryId === cat.id && p.status === 'active'
      ).length;
    }
  }

  // --- Users & Auth ---
  getUsers(): User[] {
    return this.data.users;
  }

  getUserById(id: string): User | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
    const newUser: User = {
      ...user,
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.users.push(newUser);
    return newUser;
  }

  updateUserStatus(id: string, status: 'active' | 'inactive'): User | undefined {
    const user = this.getUserById(id);
    if (user) {
      user.status = status;
      user.updatedAt = new Date().toISOString();
    }
    return user;
  }

  // --- Categories ---
  getCategories(): Category[] {
    this.updateCategoryProductCounts();
    return this.data.categories;
  }

  getCategoryBySlug(slug: string): Category | undefined {
    this.updateCategoryProductCounts();
    return this.data.categories.find((c) => c.slug === slug);
  }

  getCategoryById(id: string): Category | undefined {
    this.updateCategoryProductCounts();
    return this.data.categories.find((c) => c.id === id);
  }

  createCategory(categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'productCount'>): Category {
    const newCategory: Category = {
      ...categoryData,
      id: `cat-${Date.now()}`,
      productCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.categories.push(newCategory);
    return newCategory;
  }

  updateCategory(id: string, updates: Partial<Category>): Category | undefined {
    const catIndex = this.data.categories.findIndex((c) => c.id === id);
    if (catIndex === -1) return undefined;

    this.data.categories[catIndex] = {
      ...this.data.categories[catIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.updateCategoryProductCounts();
    return this.data.categories[catIndex];
  }

  deleteCategory(id: string): boolean {
    const initialLen = this.data.categories.length;
    this.data.categories = this.data.categories.filter((c) => c.id !== id);
    return this.data.categories.length < initialLen;
  }

  // --- Products ---
  getProducts(filters?: {
    categorySlug?: string;
    categoryId?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    size?: string;
    color?: string;
    inStock?: boolean;
    featured?: boolean;
    newArrival?: boolean;
    status?: 'active' | 'inactive';
    sort?: 'newest' | 'price-asc' | 'price-desc' | 'top-selling' | 'highest-rated';
    limit?: number;
    page?: number;
  }): { products: Product[]; total: number; page: number; totalPages: number } {
    let result = [...this.data.products];

    // Filter by status (default to active for customer facing)
    if (filters?.status) {
      result = result.filter((p) => p.status === filters.status);
    }

    if (filters?.categoryId) {
      result = result.filter((p) => p.categoryId === filters.categoryId);
    }

    if (filters?.categorySlug) {
      const cat = this.data.categories.find((c) => c.slug === filters.categorySlug);
      if (cat) {
        result = result.filter((p) => p.categoryId === cat.id);
      }
    }

    if (filters?.featured !== undefined) {
      result = result.filter((p) => p.featured === filters.featured);
    }

    if (filters?.newArrival !== undefined) {
      result = result.filter((p) => p.newArrival === filters.newArrival);
    }

    if (filters?.inStock) {
      result = result.filter((p) => p.stock > 0);
    }

    if (filters?.minPrice !== undefined) {
      result = result.filter((p) => (p.discountPrice || p.price) >= filters.minPrice!);
    }

    if (filters?.maxPrice !== undefined) {
      result = result.filter((p) => (p.discountPrice || p.price) <= filters.maxPrice!);
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.categoryName && p.categoryName.toLowerCase().includes(q)) ||
          (p.subcategory && p.subcategory.toLowerCase().includes(q)) ||
          (p.fabric && p.fabric.toLowerCase().includes(q)) ||
          (p.color && p.color.toLowerCase().includes(q)) ||
          p.sku.toLowerCase().includes(q)
      );
    }

    // Sorting
    const sort = filters?.sort || 'newest';
    if (sort === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sort === 'price-asc') {
      result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    } else if (sort === 'price-desc') {
      result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    } else if (sort === 'top-selling') {
      result.sort((a, b) => b.salesCount - a.salesCount);
    } else if (sort === 'highest-rated') {
      result.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    }

    const total = result.length;
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedProducts = result.slice(startIndex, startIndex + limit);

    return {
      products: paginatedProducts,
      total,
      page,
      totalPages,
    };
  }

  getProductById(id: string): Product | undefined {
    return this.data.products.find((p) => p.id === id);
  }

  getProductBySlug(slug: string): Product | undefined {
    return this.data.products.find((p) => p.slug === slug);
  }

  getTopSellingProducts(limit = 8): Product[] {
    // Computed dynamically from real sales count and orders
    return [...this.data.products]
      .filter((p) => p.status === 'active')
      .sort((a, b) => b.salesCount - a.salesCount)
      .slice(0, limit);
  }

  getNewArrivals(limit = 8): Product[] {
    // Computed dynamically by creation date
    return [...this.data.products]
      .filter((p) => p.status === 'active')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  getFeaturedProducts(limit = 8): Product[] {
    return [...this.data.products]
      .filter((p) => p.status === 'active' && p.featured)
      .slice(0, limit);
  }

  createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'salesCount' | 'rating' | 'reviewCount'>): Product {
    const category = this.getCategoryById(productData.categoryId);
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      categoryName: category?.name || 'Uncategorized',
      salesCount: 0,
      rating: 5.0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.products.push(newProduct);
    this.updateCategoryProductCounts();
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | undefined {
    const index = this.data.products.findIndex((p) => p.id === id);
    if (index === -1) return undefined;

    if (updates.categoryId && updates.categoryId !== this.data.products[index].categoryId) {
      const cat = this.getCategoryById(updates.categoryId);
      updates.categoryName = cat?.name;
    }

    this.data.products[index] = {
      ...this.data.products[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.updateCategoryProductCounts();
    return this.data.products[index];
  }

  deleteProduct(id: string): boolean {
    const initialLen = this.data.products.length;
    this.data.products = this.data.products.filter((p) => p.id !== id);
    this.updateCategoryProductCounts();
    return this.data.products.length < initialLen;
  }

  // --- Reviews ---
  getReviews(filters?: { productId?: string; status?: 'approved' | 'pending' | 'rejected'; featured?: boolean }): Review[] {
    let result = [...this.data.reviews];
    if (filters?.productId) {
      result = result.filter((r) => r.productId === filters.productId);
    }
    if (filters?.status) {
      result = result.filter((r) => r.status === filters.status);
    }
    if (filters?.featured !== undefined) {
      result = result.filter((r) => r.featured === filters.featured);
    }
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  createReview(reviewData: Omit<Review, 'id' | 'createdAt'>): Review {
    const product = this.getProductById(reviewData.productId);
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      productName: product?.name || 'PCH Garment',
      createdAt: new Date().toISOString(),
    };
    this.data.reviews.push(newReview);

    // Update product average rating
    if (product && newReview.status === 'approved') {
      const approvedProductReviews = this.data.reviews.filter(
        (r) => r.productId === product.id && r.status === 'approved'
      );
      const totalRating = approvedProductReviews.reduce((sum, r) => sum + r.rating, 0);
      product.reviewCount = approvedProductReviews.length;
      product.rating = Number((totalRating / (approvedProductReviews.length || 1)).toFixed(1));
    }

    return newReview;
  }

  updateReview(id: string, updates: Partial<Review>): Review | undefined {
    const index = this.data.reviews.findIndex((r) => r.id === id);
    if (index === -1) return undefined;

    this.data.reviews[index] = {
      ...this.data.reviews[index],
      ...updates,
    };

    // Recalculate product rating
    const rev = this.data.reviews[index];
    const prod = this.getProductById(rev.productId);
    if (prod) {
      const approvedProductReviews = this.data.reviews.filter(
        (r) => r.productId === prod.id && r.status === 'approved'
      );
      const totalRating = approvedProductReviews.reduce((sum, r) => sum + r.rating, 0);
      prod.reviewCount = approvedProductReviews.length;
      prod.rating = approvedProductReviews.length > 0 ? Number((totalRating / approvedProductReviews.length).toFixed(1)) : 5.0;
    }

    return this.data.reviews[index];
  }

  deleteReview(id: string): boolean {
    const rev = this.data.reviews.find((r) => r.id === id);
    const initialLen = this.data.reviews.length;
    this.data.reviews = this.data.reviews.filter((r) => r.id !== id);

    if (rev) {
      const prod = this.getProductById(rev.productId);
      if (prod) {
        const approvedProductReviews = this.data.reviews.filter(
          (r) => r.productId === prod.id && r.status === 'approved'
        );
        const totalRating = approvedProductReviews.reduce((sum, r) => sum + r.rating, 0);
        prod.reviewCount = approvedProductReviews.length;
        prod.rating = approvedProductReviews.length > 0 ? Number((totalRating / approvedProductReviews.length).toFixed(1)) : 5.0;
      }
    }

    return this.data.reviews.length < initialLen;
  }

  // --- FAQs ---
  getFAQs(status?: 'active' | 'inactive'): FAQ[] {
    let result = [...this.data.faqs];
    if (status) {
      result = result.filter((f) => f.status === status);
    }
    return result.sort((a, b) => a.displayOrder - b.displayOrder);
  }

  createFAQ(faqData: Omit<FAQ, 'id' | 'createdAt' | 'updatedAt'>): FAQ {
    const newFAQ: FAQ = {
      ...faqData,
      id: `faq-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.faqs.push(newFAQ);
    return newFAQ;
  }

  updateFAQ(id: string, updates: Partial<FAQ>): FAQ | undefined {
    const index = this.data.faqs.findIndex((f) => f.id === id);
    if (index === -1) return undefined;

    this.data.faqs[index] = {
      ...this.data.faqs[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.data.faqs[index];
  }

  deleteFAQ(id: string): boolean {
    const initialLen = this.data.faqs.length;
    this.data.faqs = this.data.faqs.filter((f) => f.id !== id);
    return this.data.faqs.length < initialLen;
  }

  // --- Orders ---
  getOrders(filters?: { userId?: string; status?: string; paymentStatus?: string }): Order[] {
    let result = [...this.data.orders];
    if (filters?.userId) {
      result = result.filter((o) => o.userId === filters.userId);
    }
    if (filters?.status) {
      result = result.filter((o) => o.orderStatus === filters.status);
    }
    if (filters?.paymentStatus) {
      result = result.filter((o) => o.paymentStatus === filters.paymentStatus);
    }
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getOrderById(id: string): Order | undefined {
    return this.data.orders.find((o) => o.id === id || o.orderNumber === id);
  }

  createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Order {
    // 1. Validate and deduct stock, update salesCount
    for (const item of orderData.items) {
      const product = this.getProductById(item.productId);
      if (!product) {
        throw new Error(`Product not found: ${item.productName}`);
      }
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for "${product.name}". Available: ${product.stock}, requested: ${item.quantity}`);
      }
      // Deduct stock and increment sales count
      product.stock -= item.quantity;
      product.salesCount += item.quantity;

      // Also deduct variant stock if present
      if (item.variantId && product.variants) {
        const variant = product.variants.find((v) => v.id === item.variantId);
        if (variant) {
          variant.stock = Math.max(0, variant.stock - item.quantity);
        }
      }
    }

    const orderNumber = `PCH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.data.orders.unshift(newOrder);
    return newOrder;
  }

  updateOrderStatus(
    id: string,
    updates: { orderStatus?: Order['orderStatus']; paymentStatus?: Order['paymentStatus'] }
  ): Order | undefined {
    const order = this.getOrderById(id);
    if (!order) return undefined;

    if (updates.orderStatus) {
      order.orderStatus = updates.orderStatus;
    }
    if (updates.paymentStatus) {
      order.paymentStatus = updates.paymentStatus;
    }
    order.updatedAt = new Date().toISOString();
    return order;
  }

  // --- Customers List for Admin ---
  getCustomers(): { id: string; name: string; email: string; phone?: string; totalOrders: number; totalSpent: number; status: string; createdAt: string }[] {
    return this.data.users
      .filter((u) => u.role === 'customer')
      .map((user) => {
        const userOrders = this.data.orders.filter((o) => o.userId === user.id);
        const totalSpent = userOrders
          .filter((o) => o.orderStatus !== 'cancelled')
          .reduce((sum, o) => sum + o.total, 0);

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          totalOrders: userOrders.length,
          totalSpent,
          status: user.status,
          createdAt: user.createdAt,
        };
      });
  }

  // --- Analytics & Dashboard Stats ---
  getDashboardStats(): DashboardStats {
    const activeProducts = this.data.products.filter((p) => p.status === 'active');
    const totalProducts = activeProducts.length;
    const totalCategories = this.data.categories.filter((c) => c.status === 'active').length;
    const totalOrders = this.data.orders.length;
    const totalCustomers = this.data.users.filter((u) => u.role === 'customer').length;

    const validOrders = this.data.orders.filter((o) => o.orderStatus !== 'cancelled');
    const totalRevenue = validOrders.reduce((sum, o) => sum + o.total, 0);
    const pendingOrders = this.data.orders.filter((o) => o.orderStatus === 'pending' || o.orderStatus === 'processing').length;
    const deliveredOrders = this.data.orders.filter((o) => o.orderStatus === 'delivered').length;
    const lowStockProducts = this.data.products.filter((p) => p.stock <= 5).length;

    // Monthly revenue computation
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyRevMap: { [key: string]: number } = {
      Jan: 125000,
      Feb: 184500,
      Mar: 236800,
      Apr: 195000,
      May: 310000,
      Jun: 280000,
    };
    // Add current live orders
    for (const o of validOrders) {
      const d = new Date(o.createdAt);
      const mName = monthNames[d.getMonth()] || 'Mar';
      monthlyRevMap[mName] = (monthlyRevMap[mName] || 0) + o.total;
    }
    const monthlyRevenue = Object.keys(monthlyRevMap).map((m) => ({
      month: m,
      revenue: monthlyRevMap[m],
    }));

    // Sales Overview (Last 7 Days)
    const salesOverview = [
      { date: 'Mon', sales: 42000, orders: 8 },
      { date: 'Tue', sales: 58500, orders: 12 },
      { date: 'Wed', sales: 63000, orders: 14 },
      { date: 'Thu', sales: 51200, orders: 10 },
      { date: 'Fri', sales: 89000, orders: 19 },
      { date: 'Sat', sales: 112000, orders: 24 },
      { date: 'Sun', sales: 98000, orders: 21 },
    ];

    // Orders By Status
    const statusCounts: { [key: string]: number } = {};
    for (const ord of this.data.orders) {
      statusCounts[ord.orderStatus] = (statusCounts[ord.orderStatus] || 0) + 1;
    }
    const ordersByStatus = [
      { name: 'Delivered', value: statusCounts['delivered'] || 1, color: '#059669' },
      { name: 'Processing', value: statusCounts['processing'] || 1, color: '#10B981' },
      { name: 'Shipped', value: statusCounts['shipped'] || 1, color: '#34D399' },
      { name: 'Pending', value: statusCounts['pending'] || 0, color: '#FBBF24' },
      { name: 'Cancelled', value: statusCounts['cancelled'] || 0, color: '#EF4444' },
    ];

    // Top Selling Products
    const topSellingProducts = [...this.data.products]
      .sort((a, b) => b.salesCount - a.salesCount)
      .slice(0, 5)
      .map((p) => ({
        id: p.id,
        name: p.name,
        category: p.categoryName || 'Textiles',
        price: p.discountPrice || p.price,
        sales: p.salesCount,
        stock: p.stock,
        image: p.images[0]?.imageUrl || '',
      }));

    // Sales by category
    const salesByCategory = this.data.categories.map((cat) => {
      const catProducts = this.data.products.filter((p) => p.categoryId === cat.id);
      const totalSales = catProducts.reduce((sum, p) => sum + p.salesCount * (p.discountPrice || p.price), 0);
      return {
        category: cat.name.split(' ')[0],
        sales: totalSales,
        count: catProducts.length,
      };
    });

    return {
      totalProducts,
      totalCategories,
      totalOrders,
      totalCustomers,
      totalRevenue,
      pendingOrders,
      deliveredOrders,
      lowStockProducts,
      salesOverview,
      monthlyRevenue,
      ordersByStatus,
      topSellingProducts,
      salesByCategory,
    };
  }
}

export const db = new DatabaseEngine();
