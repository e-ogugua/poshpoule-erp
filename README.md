# PoshPOULE Farms Ltd

A modern, responsive website for PoshPOULE Farms Ltd, showcasing organic poultry, fresh eggs, and farm-fresh produce with multi-currency support.

## 🌟 Key Features

- **Multi-Currency Support**: Seamlessly switch between NGN, USD, and GBP with static conversion rates
- **Responsive Design**: Mobile-first approach with TailwindCSS
- **Product Showcase**: Beautiful display of farm products with pricing
- **Contact Forms**: Easy customer inquiries
- **Performance Optimized**: Fast loading with Next.js static generation
- **No External Dependencies**: Works without API keys or external services

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/poshpoule-farms.git
   cd poshpoule-farms
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to a GitHub repository
2. Import the repository to Vercel
3. Deploy! No environment variables needed for the demo

### Other Platforms
Build the project and deploy the static files:
```bash
npm run build
```

## 💰 Currency System
- Supports NGN (₦), USD ($), and GBP (£)
- Static conversion rates for demo purposes
- Currency preference is saved in local storage

## 📦 Dependencies
- Next.js 14
- React 18
- TypeScript
- TailwindCSS
- Framer Motion (for animations)

Visit `/admin` to access the admin dashboard.

## 📁 Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── admin/             # Admin dashboard pages
│   │   ├── api/               # API routes
│   │   ├── products/[slug]/   # Product detail pages
│   │   └── ...                # Public pages
│   ├── components/            # Reusable React components
│   ├── contexts/              # React contexts (currency, auth)
│   └── lib/                   # Utility functions and database
├── db/
│   └── data.json              # File-based database
├── public/
│   └── images/                # Product and farm images
└── package.json               # Dependencies and scripts
```

## 🎨 Design System

### Colors
- **Primary**: `#1F6E3A` (Earthy Green)
- **Secondary**: `#D4AF37` (Gold Accent)
- **Neutral**: Various shades of gray
- **Body Text**: `#64748B`

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)
- **Weights**: 300, 400, 500, 600, 700

### Brand Slogan
*"Pure Goodness — eat fresh, eat healthy"*

## 🛠️ Customization

### Adding Products

1. Open `db/data.json`
2. Add new product to the `products` array:
   ```json
   {
     "id": "your-product-id",
     "name": "Product Name",
     "slug": "product-slug",
     "description": "Product description",
     "priceNaira": 5000,
     "basePriceNaira": 5000,
     "category": "Category Name",
     "stock": 100,
     "image": "/images/product-image.jpg",
     "images": ["/images/product-1.jpg", "/images/product-2.jpg"],
     "featured": true,
     "available": true,
     "createdAt": "2024-01-01T00:00:00.000Z"
   }
   ```

### Updating Currency Rates

1. Go to Admin Dashboard → Settings
2. Update the conversion rates for USD and GBP
3. Changes apply immediately across the site

### Managing Images

- Place product images in `/public/images/`
- Use descriptive filenames (e.g., `fresh-eggs-hero.jpg`)
- Supported formats: JPG, PNG, WebP
- Recommended dimensions: 800x600px for product images

## 🔧 API Endpoints

### Public APIs
- `GET /api/products` - Fetch all products
- `GET /api/currencies` - Get currency conversion rates
- `POST /api/orders` - Submit new order
- `POST /api/leads` - Submit contact form

### Admin APIs
- `GET /api/orders` - Fetch all orders (admin only)
- `PUT /api/orders/[id]` - Update order status
- `POST /api/products` - Create new product
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Automatic deployment** will trigger on push
3. **No build configuration** required
4. **Environment variables**: None required for basic functionality

### Netlify

1. **Build command**: `npm run build`
2. **Publish directory**: `.next`
3. **Node version**: 18 or higher

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm run start
```

## 🔒 Security Features

- **File-based authentication** with session cookies
- **Input validation** on all forms and API endpoints
- **CSRF protection** via Next.js built-in security
- **Database backup** system for data integrity
- **No sensitive data** stored in client-side code

## 📱 Mobile Optimization

- **Responsive design** works on all screen sizes
- **Touch-friendly** interface elements
- **Optimized images** with Next.js Image component
- **Fast loading** with code splitting and lazy loading

## 🔄 Data Management

### Database
- **File**: `db/data.json`
- **Format**: JSON with structured data
- **Backup**: Automatic backup on every write operation
- **Reset**: Delete `data.json` and restart (will recreate with seed data)

### Seed Data
The application includes realistic demo data:
- 5 sample products with pricing
- 10 demo orders with various statuses
- 5 customer testimonials
- 4 blog posts
- User accounts for admin and staff

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**:
   ```bash
   # Kill process on port 3000
   npx kill-port 3000
   npm run dev
   ```

2. **Module not found errors**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Database corruption**:
   ```bash
   # Restore from backup
   cp db/data.json.backup db/data.json
   ```

### Development Tips

- Use browser developer tools to debug client-side issues
- Check server console for API errors
- Database changes require server restart in development
- Images should be placed in `/public/images/` directory

## 📞 Support

For technical support or questions:
- **Email**: support@poshpoule.com
- **Phone**: +234 800 000 0000

## 📄 License

This project is created for PoshPOULE Farms Ltd. All rights reserved.

---

**Built with ❤️ for sustainable farming and healthy living**
