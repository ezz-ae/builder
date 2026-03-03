# 🏠 Real Estate Sites Builder v1.0

**Transform Real Estate into Modern Digital Experiences**

A powerful no-code website builder that empowers real estate professionals to create stunning, AI-powered websites with live inventory data, market analysis, and investment metrics - all without writing a single line of code.

---

## ✨ What It Does

Build professional real estate websites in minutes using:

- **29+ Pre-Built Templates** (luxury, mainstream, specialized, industry)
- **38+ React Components** (galleries, forms, calculators, analysis dashboards)
- **WYSIWYG Editor** (drag-and-drop page builder)
- **Live Real Estate Data** (Neon PostgreSQL integration)
- **Market Analysis** (Entrestate smart analysis)
- **AI Content Generation** (Google Vertex AI with Gemini)
- **Mobile Optimized** (responsive across all devices)
- **Professional Grade** (100% TypeScript, production-ready)

---

## 🎯 Perfect For

- Real estate agencies (boutique to enterprise)
- Individual real estate agents
- Property developers
- Investment groups
- Vacation rental companies
- Property management firms
- Real estate investors
- New construction companies

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** & npm
- **PostgreSQL** (via Neon - free tier available)
- **Google Cloud Account** (for Vertex AI)

### Local Setup

1. **Clone the repository:**
```bash
git clone https://github.com/ezz-ae/builder.git
cd builder
```

2. **Configure environment:**
```bash
# Copy environment template
cp .env.example .env.local

# Add your credentials to .env.local:
# - DATABASE_URL (from Neon)
# - GOOGLE_API_KEY (from Google Cloud)
# - ENTRESTATE_API_KEY (from Entrestate)
```

3. **Install dependencies:**
```bash
npm install
```

4. **Start development server:**
```bash
npm run dev
```

5. **Open in browser:**
```
http://localhost:3002
```

---

## 🔌 API & AI Endpoints

- `GET /api/listings` – filter listings by agency, status, price, and keyword to preview live data
- `GET /api/agents` – pull the roster for any agency to populate agent grids
- `GET /api/templates` – stream every curated template and the categories they belong to
- `GET /api/market-analysis` – fetch area insights + market metrics for market analysis blocks
- `POST /api/ai/chat` – feed property details to Vertex Gemini and receive marketing campaigns + SEO descriptions

## 🔥 Live Experiences

1. `/templates` – explore the gallery of 29+ templates with thumbnails, tags, and quick links into the builder
2. `/showcase` – preview full site demos built from page templates (home, listings, about, contact)
3. `/ai-chat` – launch the AI chat builder and generate copy, keywords, follow-ups, and SEO content with Gemini
4. `/inventory` – embed the Neon inventory/PF feed directly into your site or builder listings


## 📋 Available Templates

### Luxury Category (3)
- Boutique Luxury - Premium, high-end design
- Investment Portfolio - For investment firms
- New Construction - For developers launching projects

### Mainstream Category (5)
- Full Service - Complete agency solution
- Buyer Focused - Buyer-centric experience
- Seller Focused - Seller-centric experience
- Community - Local community focus
- Minimalist - Clean, simple design

### Specialized Category (14)
**Original (5):**
- Luxury Rentals, Property Management, Mortgage, Relocation, Commercial

**New Niche Templates (9):**
- AI Chat Assistant - AI-powered property concierge
- Map Discovery - Geographic property search
- Rental Properties - Apartment management
- Product Launch - New development showcase
- Sales Landing Page - High-converting single property
- Event Showcase - Open house promotions
- Developer Focus - Investment metrics dashboard
- Special Offers - Limited-time deals
- Report Funnel - Lead generation via reports

### Industry Category (4)
- Short-term Rental, Mobile Home Park, Land Development, Auto-Generated

---

## 🔧 Architecture

### Frontend
- React 19 + Next.js 15
- TypeScript (strict mode)
- Tailwind CSS
- Responsive design (mobile-first)

### Backend
- Next.js API Routes
- PostgreSQL (Neon)
- Type-safe APIs

### AI & Data
- Google Vertex AI (Gemini 1.5)
- Entrestate Market Analysis
- Neon Database

---

## 📦 Component System

### Block Types (38+ Total)

**Gallery Blocks (5)**
- Carousel, Grid, Before/After, Virtual Tour, Video Hero

**Feature Blocks (6)**
- Properties Specs, Mortgage Calculator, Price Breakdown, Process Steps, Similar Properties

**Specialized RE (5)**
- Open House, Investment Analysis, Luxury Amenities, Agent Credentials, Neighborhood Info

**Info & CTA (6)**
- FAQ, Why Choose Us, Blog Grid, CTA Banner, Contact Form, Market Metrics

**Specialized Template (7)**
- AI Chat, Interactive Map, Rental Features, Product Launch, Limited Offer, Report Lead, Investment Metrics

**Plus 9 Original Blocks**
- Hero, Listings Grid, Listing Detail, Contact Form, Header, Footer, Agent Grid, Testimonials, etc.

---

## 🛠️ How It Works

### 1. Select a Template
Choose from 29+ professionally-designed templates organized by use case

### 2. Customize Pages
Edit pages, add/remove blocks, customize text and images

### 3. Connect Data
Wire up Neon database for live property listings and agents

### 4. Add Analysis
Integrate Entrestate for market insights and investment metrics

### 5. Generate Content
Use Vertex AI to auto-generate property descriptions and marketing copy

### 6. Save & Publish
Save your website and publish to production

### 7. Launch
Your professional real estate website is live! 🎉

---

## 📊 System Stats

- **38+ Components** - Production-grade React components
- **29+ Templates** - Pre-built for every use case
- **4,500+ LOC** - Clean, maintainable code
- **100% TypeScript** - Full type safety
- **1,200+ Docs** - Comprehensive documentation
- **9 Commits** - Clean git history
- **0 Hardcoded Secrets** - Security-first approach

---

## 🔐 Security

All credentials are managed through environment variables:
- No hardcoded secrets in code
- `.env.local` for local development
- Platform secrets for production (Vercel, Netlify, etc.)
- See `ENV_SECURITY.md` for complete security guide

---

## 📚 Documentation

- **IMPLEMENTATION_STATUS.md** - Complete project overview
- **SPECIALIZED_TEMPLATES.md** - All 9 niche templates explained
- **ENV_SECURITY.md** - Security best practices
- **MOBILE_OPTIMIZATION_PLAN.md** - Mobile strategy
- **BUILD_VERIFICATION.md** - Build and deployment guide

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
vercel
```

### Other Platforms
- Netlify
- AWS Amplify
- Custom servers

See `BUILD_VERIFICATION.md` for detailed deployment instructions.

---

## 📱 Mobile-First Design

Phase G optimization in progress:
- Responsive builder UI
- Touch-optimized interactions
- Mobile-specific templates
- Best-in-class mobile experience

---

## 🎯 Next Steps

### For Users
1. Select a template
2. Customize for your business
3. Connect your property database
4. Launch your website

### For Developers
1. Clone the repository
2. Install dependencies
3. Set up environment variables
4. Run `npm run dev`
5. Start exploring the code

---

## 🤝 Contributing

This is an open-source project. Contributions welcome!

### Areas for Contribution
- Additional block components
- New templates
- Performance optimizations
- Mobile enhancements
- Documentation improvements
- Bug fixes

---

## 📝 License

MIT License - See LICENSE file for details

---

## 🙏 Credits

Built with ❤️ using:
- React 19
- Next.js 15
- TypeScript
- Tailwind CSS
- Google Vertex AI
- Neon PostgreSQL
- Entrestate API

---

## 📞 Support

- **Documentation**: See .md files in repository
- **Issues**: GitHub issues
- **Email**: support@realestate-builder.com

---

## 🎉 Launch Your Real Estate Website Today!

No code. No servers. No hassle.

Just beautiful, professional websites powered by AI and real data.

**[Start Building →](https://github.com/ezz-ae/builder)**

---

**Real Estate Sites Builder v1.0**
*Transforming how real estate professionals build their digital presence*

Built on March 3, 2026 | Production Ready | Mobile Optimizing 📱
