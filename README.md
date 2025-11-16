# Deal Simulator - Professional M&A Financial Modeling Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.8-38B2AC)](https://tailwindcss.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-green)](https://web.dev/progressive-web-apps/)

A comprehensive, professional-grade financial modeling tool for mergers & acquisitions (M&A). Model complex deal structures including earn-outs, seller financing, and all-cash scenarios with advanced analytics, risk assessment, and scenario planning.

## ✨ Features

### 🎯 Core Functionality
- **Deal Structure Modeling**: Earn-out, seller financing, and all-cash payment scenarios
- **Financial Projections**: Multi-year cash flow analysis with growth and churn factors
- **Real-time Calculations**: Instant updates as you adjust parameters

### 📊 Advanced Analytics
- **Sensitivity Analysis**: Interactive sliders for real-time parameter testing
- **Financial Metrics**: NPV, IRR, and payback period calculations
- **Monte Carlo Simulations**: Probabilistic risk analysis with 1000+ scenarios
- **Multi-currency Support**: USD, EUR, GBP, JPY, CAD, AUD with inflation adjustments

### 🛠️ Professional Tools
- **Scenario Management**: Save, load, and compare multiple deal scenarios
- **Data Import**: CSV upload for historical revenue trends
- **PDF Reports**: Professional export with charts and detailed summaries
- **Chart Visualization**: Interactive bar charts with export capabilities

### 🎨 User Experience
- **Responsive Design**: Mobile-first approach with touch-friendly interfaces
- **Accessibility**: WCAG compliant with ARIA labels and semantic HTML
- **Progressive Web App**: Offline functionality and installable experience
- **Guided Onboarding**: Tooltips and tutorials for new users

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd deal-simulator
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage Guide

### Basic Deal Modeling

1. **Input Parameters**:
   - **Annual Revenue**: Base revenue figure
   - **Churn Rate**: Annual revenue loss percentage
   - **Growth Rate**: Expected annual revenue increase
   - **Earn-out %**: Percentage of revenue paid as earn-out
   - **Tax Rate**: Applicable tax percentage

2. **Advanced Options**:
   - **Earn-out Years**: Duration of earn-out payments
   - **Seller Financing**: Percentage and interest rate
   - **All Cash**: Upfront payment percentage
   - **Currency**: Deal currency selection
   - **Inflation**: Annual inflation rate

3. **Analysis Features**:
   - Adjust sliders for real-time sensitivity analysis
   - View financial metrics (NPV, IRR, payback period)
   - Run Monte Carlo simulations for risk assessment

### Scenario Management

- **Save Scenarios**: Store current deal parameters for later use
- **Load Scenarios**: Retrieve and modify saved deals
- **Compare Scenarios**: Analyze multiple deal structures side-by-side

### Data Import

Upload CSV files with historical data:
```csv
year,revenue
2020,1000000
2021,1200000
2022,1400000
```

The system will calculate average growth rates automatically.

### Export & Reporting

- **PDF Reports**: Comprehensive deal summaries with charts
- **Chart Export**: PNG images of visualizations
- **Scenario Sharing**: Save and share deal configurations

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4, shadcn/ui components
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form with Zod validation
- **PDF Generation**: @react-pdf/renderer
- **PWA**: next-pwa for offline functionality

### Project Structure
```
deal-simulator/
├── src/
│   ├── app/                 # Next.js app router
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Main deal simulator page
│   │   └── globals.css     # Global styles
│   ├── components/         # React components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── InputForm.tsx  # Deal parameter input
│   │   ├── ChartDisplay.tsx # Data visualization
│   │   ├── SummaryCard.tsx # Results summary
│   │   └── DealSummaryPdf.tsx # PDF generation
│   ├── lib/               # Business logic
│   │   ├── calculations.ts # Financial calculations
│   │   ├── schema.ts      # Input validation
│   │   └── formatter.ts   # Data formatting
│   ├── types/            # TypeScript definitions
│   └── utils/            # Utility functions
├── public/               # Static assets
│   ├── manifest.json     # PWA manifest
│   └── fonts/           # Custom fonts
├── CONTEXT.md           # Project context and roadmap
└── README.md           # This file
```

### Key Components

#### Financial Engine (`src/lib/calculations.ts`)
- Deal scenario calculations
- Financial metrics (NPV, IRR, payback period)
- Monte Carlo simulation engine
- Multi-year cash flow projections

#### Input Validation (`src/lib/schema.ts`)
- Zod schemas for type-safe input validation
- Business logic constraints
- Error message handling

#### UI Components
- **InputForm**: Parameter input with real-time validation
- **ChartDisplay**: Interactive data visualization
- **SummaryCard**: Results presentation with metrics
- **ExportButton**: PDF generation and download

## 🔧 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Code Quality
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting (via ESLint)
- **Git Hooks**: Pre-commit quality checks

### Testing
```bash
# Run tests (when implemented)
npm run test
npm run test:watch
npm run test:coverage
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run quality checks**
   ```bash
   npm run lint
   npm run build
   ```
5. **Commit your changes**
   ```bash
   git commit -m "feat: add amazing feature"
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Development Guidelines
- Follow existing code style and patterns
- Add TypeScript types for new features
- Include comprehensive error handling
- Update documentation for new features
- Test on multiple devices/browsers

## 📋 Roadmap

### Completed ✅
- [x] Basic deal calculations (earn-out, financing, cash)
- [x] Input validation and error handling
- [x] Real-time sensitivity analysis
- [x] Financial metrics (NPV, IRR, payback)
- [x] Monte Carlo simulations
- [x] Scenario management
- [x] Data import/export
- [x] PDF report generation
- [x] PWA functionality
- [x] Accessibility improvements

### Future Enhancements 🚀
- [ ] User accounts and cloud storage
- [ ] Collaboration features
- [ ] Advanced financing structures
- [ ] Industry benchmarking
- [ ] API integrations
- [ ] Mobile app development

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Recharts](https://recharts.org/) - Chart library
- [React Hook Form](https://react-hook-form.com/) - Form handling
- [Zod](https://zod.dev/) - Schema validation

## 📞 Support

For questions, issues, or contributions:
- Open an [issue](https://github.com/your-repo/issues) on GitHub
- Check the [CONTEXT.md](CONTEXT.md) for project details
- Review the codebase for implementation examples

---

**Built with ❤️ for the M&A community**
