 Finance Dashboard UI

A modern, responsive personal finance dashboard built with React and Vite. Track your income, expenses, and savings with interactive charts and real-time data visualization.

## ✨ Features

- **Overview Dashboard** - Visual summary of total balance, income, expenses, and savings rate
- **Interactive Charts** - Monthly trends, spending breakdown, and cash flow comparisons
- **Transaction Management** - Add, edit, and delete transactions with categorization
- **Role-Based Access** - Admin mode for editing financial data, Viewer mode for read-only access
- **Filtering & Search** - Filter transactions by type, category, or search by description
- **Responsive Design** - Dark-themed UI optimized for desktop viewing
- **Real-time Updates** - All charts and metrics update instantly with data changes

## 🛠️ Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Recharts** - Charting library for data visualization
- **ESLint** - Code linting and quality

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd Finance

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🚀 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build production bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint code checks |

## 📱 Usage

### Dashboard Overview
- View total **Balance**, **Income**, **Expenses**, and **Net Cashflow** at a glance
- Click on stat cards (Admin only) to edit values proportionally
- Monitor monthly trends with interactive line charts
- Analyze spending distribution with pie charts

### Transaction Management
1. Switch to **Admin** role (top-right corner)
2. Click **+ Add Transaction** to create new entries
3. Click any transaction row to edit
4. Use filters to narrow down by type or category
5. Search transactions by description or category name

### Categories
The dashboard supports the following expense categories:
- Housing, Food, Entertainment, Utilities, Health, Education, Transport, Shopping, Income, Other

##  UI Components

- **StatCard** - Editable metric cards with inline editing (Admin only)
- **Badge** - Income/Expense type indicators
- **ChartTooltip** - Custom tooltips for chart data points
- **Transaction Table** - Sortable, filterable transaction list

## 📁 Project Structure

```
Finance/
├── src/
│   ├── App.jsx              # Main app component
│   ├── FinanceDashboard.jsx # Dashboard component (main logic)
│   ├── index.css            # Global styles
│   └── assets/              # Static assets
├── public/
│   ├── favicon.svg          # App icon
│   └── icons.svg            # SVG icons
├── index.html               # HTML entry point
├── package.json             # Dependencies & scripts
└── vite.config.js           # Vite configuration
```

## 🎯 Key Metrics

- **Total Balance** - Current net worth (Income - Expenses)
- **Savings Rate** - Percentage of income saved
- **Monthly Trend** - Income vs Expenses over time
- **Category Breakdown** - Spending distribution by category

##  Role System

| Role | Permissions |
|------|-------------|
| **Viewer** | Read-only access to all data |
| **Admin** | Full CRUD operations on transactions, editable stat cards |

##  Currency

All amounts are displayed in **Indian Rupees (₹/INR)** with formatted abbreviations:
- `₹X.XK` for thousands
- `₹X.XL` for lakhs (100,000)

## License

This project is private and not licensed for public distribution.

## Contributing

This is a private project. For questions or issues, contact the maintainer directly.

---

**Built with**  **using React + Vite + Recharts**
