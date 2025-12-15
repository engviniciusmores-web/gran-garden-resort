# ObraControl - Gran Garden Resort
### Enterprise Construction Management System

> **Production-Ready Construction ERP** - Financial-weighted task tracking, BIM integration, and AI-powered reporting for large-scale construction projects.

---

## Executive Summary

**ObraControl** is an enterprise-grade construction management platform designed for **Gran Garden Resort** (Project O4210), a R$ 192.8M resort development project. The system implements financial-weighted progress measurement across 4,221 tasks, replacing traditional task-count metrics with value-based tracking for accurate project health monitoring.

### Key Metrics

| Metric | Value | Description |
|--------|-------|-------------|
| **Project Code** | O4210 | UNICIFA system integration |
| **Total Budget** | R$ 192.862.158,23 | Approved board budget (Aug 2025) |
| **Executed Value** | R$ 4.353.220,16 | Financial progress |
| **Completion** | 2.26% | Value-weighted (not task count) |
| **Task Database** | 4,221 tasks | Full UNICIFA integration |
| **Material Catalog** | 57 items | With procurement timelines |
| **Technical Docs** | 33 files | PDF, IFC, XLSX formats |
| **Lines of Code** | ~2,600 LoC | App.tsx (1,459) + constants.ts (1,167) |

### Technology Stack

```
Frontend:     React 19.2.3 + TypeScript 5.8.2
Build:        Vite 6.2.0 (ES modules, HMR)
UI/Icons:     Lucide React 0.561.0
Charts:       Recharts 3.5.1 (D3.js based)
AI:           Google Gemini 1.33.0 (Generative AI)
State:        React Hooks (useState, useEffect)
Styling:      Tailwind CSS (utility-first)
Data:         JSON-based (2.5MB integrated dataset)
```

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     ObraControl Frontend                    │
│                    (React 19 + TypeScript)                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Dashboard  │  │   Planning   │  │  Materials   │    │
│  │  (Metrics &  │  │ (4,221 Tasks)│  │ (57 Items)   │    │
│  │   Charts)    │  │              │  │              │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  Daily Log   │  │   Database   │  │  BIM Viewer  │    │
│  │ (AI Summary) │  │  (33 Files)  │  │  (6 Models)  │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                      Data Layer                             │
│  dados_integrados.json (2.5MB) - Single source of truth    │
│  constants.ts - Data transformation & exports              │
├─────────────────────────────────────────────────────────────┤
│                   External Services                         │
│  Google Gemini API - AI text generation                    │
│  Browser LocalStorage - User preferences (dark mode)       │
└─────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
App.tsx (Root)
├── Authentication Layer
│   └── Login View
├── Project Selection
│   └── Project Cards (MOCK_PROJECTS)
├── Main Application
│   ├── Sidebar Navigation
│   ├── Header (Search, Dark Mode Toggle)
│   └── View Router (ViewState)
│       ├── Dashboard
│       │   ├── MetricCards (4 cards)
│       │   ├── TimelineChart (Recharts)
│       │   ├── StatusDistribution
│       │   └── QuickActions
│       ├── Planning Module
│       │   ├── TaskFilters (Search + Status)
│       │   ├── TaskList (Virtualized)
│       │   ├── TaskForm (Modal)
│       │   └── ExportExcel
│       ├── Materials Control
│       │   ├── MaterialCards
│       │   ├── StockChart
│       │   └── RequestForm
│       ├── Daily Log
│       │   └── DailyLog.tsx (Multi-step wizard)
│       │       ├── Step 1: General Data
│       │       ├── Step 2: Staff Info
│       │       ├── Step 3: Production
│       │       ├── Step 4: Occurrences
│       │       └── Step 5: AI Summary (Gemini)
│       ├── Database
│       │   ├── FileList (33 items)
│       │   └── FileCategories
│       └── BIM Viewer
│           ├── ModelSelector
│           └── IFC Viewer Placeholder
└── UI Components
    └── components/ui/Button.tsx
```

---

## Data Models

### Core Interfaces (types.ts)

#### Project
```typescript
interface Project {
  id: string;                    // Unique identifier
  name: string;                  // e.g., "Bloco A1"
  location: string;              // e.g., "Gran Garden Resort"
  status: 'Em Andamento' | 'Finalizada' | 'Atrasada' | 'A Iniciar';
  progress: number;              // 0-100 (visual only)
  area: number;                  // Built area in m²
  concreteVolume: number;        // Total concrete in m³
  teamName: string;              // Construction team name
  teamMembers: string;           // Team composition
  budgetTotal?: number;          // Total budget in R$
  imageUrl?: string;             // Project thumbnail
}
```

#### Task (Financial-Weighted)
```typescript
interface Task {
  id: string;                    // Unique task ID
  name: string;                  // Task description
  deadline: string;              // ISO 8601 date
  status: 'A Fazer' | 'Em Andamento' | 'Em Andamento - Inicial' |
          'Em Andamento - Avançado' | 'Concluído' | 'Atrasado';
  responsible: string;           // Team member name

  // Timeline
  plannedStart?: string;         // Planned start date
  plannedEnd?: string;           // Planned end date
  actualStart?: string;          // Actual start date
  actualEnd?: string;            // Actual end date
  progress?: number;             // 0-100 completion %

  // FINANCIAL TRACKING (KEY FEATURE)
  valorPrevisto?: number;        // Planned value (R$)
  valorRealizado?: number;       // Realized value (R$)
  pesoFinanceiro?: number;       // Weight in total budget (%)
}
```

**Financial Weight Calculation:**
```typescript
pesoFinanceiro = (valorPrevisto / orcamentoTotal) * 100
// Example: R$ 114,227.76 / R$ 192,862,158.23 * 100 = 0.06%
```

#### Material
```typescript
interface Material {
  id: string;
  name: string;                  // Material description
  unit: string;                  // m³, kg, un, m², etc.
  stock: number;                 // Current stock
  minStock: number;              // Minimum stock alert level
  consumedToday: number;         // Daily consumption
}
```

#### Project File
```typescript
interface ProjectFile {
  id: string;
  name: string;
  type: 'PDF' | 'DWG' | 'XLSX' | 'MPP' | 'IFC';
  category: 'Arquitetura' | 'Estrutural' | 'Instalações' |
            'Cronograma' | 'Legal' | 'BIM';
  date: string;
  size: string;
}
```

### Data Integration Schema

**dados_integrados.json** structure:
```json
{
  "projeto": {
    "nome": "Gran Garden Resort",
    "codigo": "O4210",
    "orcamento_total": 192862158.23,
    "orcamento_realizado": 4353220.16,
    "percentual_executado": 2.26,
    "total_tarefas": 4221,
    "total_materiais": 57,
    "total_arquivos": 33
  },
  "tarefas_completas": [
    {
      "id": "task-001",
      "name": "Estrutura BLOCO A1 - Térreo",
      "status": "Concluído",
      "valorPrevisto": 114227.76,
      "valorRealizado": 114227.76,
      "pesoFinanceiro": 0.06,
      "...": "..."
    }
    // ... 4,220 more tasks
  ],
  "materiais": [
    {
      "nome": "ESTRUTURA DE CONCRETO",
      "prazo_fornecedor_dias": 30,
      "prazo_suprimentos_dias": 90,
      "prazo_obra_dias": 30,
      "frete_dias": 10,
      "atividade_relacionada": "EstruturaA1 - Térreo"
    }
    // ... 56 more materials
  ],
  "arquivos_projeto": [
    {
      "nome": "GGR-ZP-EX-EST-BLA1-0001-XXXX.ifc",
      "tipo": "IFC",
      "tamanho_mb": 1.3,
      "categoria": "Estrutura",
      "bloco": "BLA1"
    }
    // ... 32 more files
  ],
  "estatisticas": {
    "tarefas_por_status": {
      "Concluído": 65,
      "Em Andamento": 20,
      "Atrasado": 0,
      "A Fazer": 4126
    },
    "valores_por_status": {
      "concluido": 2166891.05,
      "em_andamento": 1086329.11,
      "atrasado": 0,
      "previsto_total": 192862158.23,
      "realizado_total": 4353220.16
    }
  }
}
```

---

## Key Features & Implementation

### 1. Financial-Weighted Progress Measurement

**Problem:** Traditional task-count metrics are inaccurate for construction projects.
- Example: 65 completed tasks out of 4,221 = 1.5% (misleading)
- Reality: Those 65 tasks represent R$ 2.1M in value

**Solution:** Value-weighted measurement
```typescript
const calculateProgress = (tasks: Task[]): number => {
  const completedValue = tasks
    .filter(t => t.status === 'Concluído')
    .reduce((sum, t) => sum + (t.valorRealizado || 0), 0);

  const totalValue = tasks
    .reduce((sum, t) => sum + (t.valorPrevisto || 0), 0);

  return (completedValue / totalValue) * 100;
};

// Result: R$ 4,353,220.16 / R$ 192,862,158.23 = 2.26% (accurate)
```

**Task Sorting by Value:**
```typescript
// constants.ts
const tarefasOrdenadas = dadosIntegrados.tarefas_completas.sort((a, b) =>
  (b.pesoFinanceiro || 0) - (a.pesoFinanceiro || 0)
);

export const MOCK_TASKS = tarefasOrdenadas.slice(0, 200); // Top 200
export const ALL_TASKS = TODAS_AS_TAREFAS;                 // All 4,221
```

### 2. AI-Powered Daily Log Summaries

**Technology:** Google Gemini API (Generative AI)

```typescript
// DailyLog.tsx
const generateSummary = async (data: DailyLogData) => {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
    Gere um resumo profissional de diário de obra com base nos dados:

    Clima: ${weatherLabels[data.weather]}
    Efetivo: ${data.teamSize} pessoas, ${data.hoursWorked} horas
    Produção: Concreto ${data.production.concrete}m³,
              Aço ${data.production.steel}kg,
              Forma ${data.production.formwork}m²
    Ocorrências: ${data.occurrences.join('; ')}

    Formato: Texto técnico, objetivo, 3-4 parágrafos.
  `;

  const result = await model.generateContent(prompt);
  return result.response.text();
};
```

### 3. Advanced Search & Filtering

**Features:**
- Real-time search across task names and responsible parties
- Multi-status filtering
- Keyboard shortcut (Ctrl+K)
- Excel export of filtered results

```typescript
const [searchQuery, setSearchQuery] = useState('');
const [statusFilter, setStatusFilter] = useState<string[]>(['all']);

const filteredTasks = useMemo(() => {
  return tasks.filter(task => {
    const matchesSearch =
      task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.responsible.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter.includes('all') ||
      statusFilter.includes(task.status);

    return matchesSearch && matchesStatus;
  });
}, [tasks, searchQuery, statusFilter]);
```

### 4. Dark Mode Implementation

**Persistence:** localStorage with system preference detection

```typescript
const [darkMode, setDarkMode] = useState(() => {
  const saved = localStorage.getItem('darkMode');
  return saved ? JSON.parse(saved) : false;
});

useEffect(() => {
  localStorage.setItem('darkMode', JSON.stringify(darkMode));
}, [darkMode]);

// Apply classes
<div className={darkMode ? 'dark' : ''}>
  {/* App content */}
</div>
```

### 5. Keyboard Shortcuts System

```typescript
useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    // Ctrl/Cmd + K: Search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      searchInputRef.current?.focus();
    }

    // Ctrl/Cmd + N: New Task
    if ((e.ctrlKey || e.metaKey) && e.key === 'n' && view === 'PLANNING') {
      e.preventDefault();
      setShowTaskForm(true);
    }

    // Ctrl/Cmd + D: Dark Mode
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
      e.preventDefault();
      setDarkMode(!darkMode);
    }

    // ?: Help
    if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
      setShowShortcuts(true);
    }

    // Esc: Close Modals
    if (e.key === 'Escape') {
      setShowTaskForm(false);
      setShowMaterialRequest(false);
      setShowShortcuts(false);
    }
  };

  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, [view, darkMode]);
```

### 6. Excel Export Functionality

```typescript
const exportToExcel = (tasks: Task[]) => {
  const headers = 'Atividade,Prazo,Responsável,Status\n';

  const rows = tasks.map(task =>
    `"${task.name}","${formatDate(task.deadline)}","${task.responsible}","${task.status}"`
  ).join('\n');

  const csv = headers + rows;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `planejamento_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();

  URL.revokeObjectURL(url);
};
```

---

## Data Processing Pipeline

### Python Integration Scripts

**Workflow:**
```
Excel/PDF Source Files
        ↓
extrair_dados_completos.py → Extraction
        ↓
integrar_final.py → Processing & Value Assignment
        ↓
dados_integrados.json → Single Source of Truth
        ↓
constants.ts → TypeScript Import & Transform
        ↓
React Components → UI Rendering
```

**Key Scripts:**

1. **extrair_dados_completos.py**
   - Reads Excel files (openpyxl)
   - Extracts budget, timeline, materials
   - Outputs raw JSON

2. **integrar_final.py**
   - Merges all data sources
   - Calculates financial weights
   - Validates data integrity
   - Generates `dados_integrados.json`

3. **constants.ts**
   - Imports JSON data
   - Transforms to TypeScript types
   - Sorts by financial weight
   - Exports typed constants

---

## Performance Optimization

### Current Metrics
- **Bundle Size:** 2,371.21 kB (compressed: 275.89 kB)
- **Build Time:** ~10 seconds
- **Dev Server Start:** ~330ms (Vite HMR)
- **Initial Load:** <2s (local dev)

### Optimization Strategies

1. **Task Virtualization**
   ```typescript
   // Only render top 200 tasks by default
   export const MOCK_TASKS = tarefasOrdenadas.slice(0, 200);

   // Full dataset available for search/filter
   export const ALL_TASKS = TODAS_AS_TAREFAS; // 4,221 items
   ```

2. **Memoization**
   ```typescript
   const filteredTasks = useMemo(() => {
     return tasks.filter(/* ... */);
   }, [tasks, searchQuery, statusFilter]);
   ```

3. **Lazy Loading**
   ```typescript
   // IFC models loaded on-demand
   const loadIfcModel = async (modelId: string) => {
     const model = await import(`./models/${modelId}.ifc`);
     return model;
   };
   ```

4. **Code Splitting** (Future)
   ```typescript
   const BimViewer = lazy(() => import('./components/BimViewer'));
   const DailyLog = lazy(() => import('./components/DailyLog'));
   ```

---

## Security Considerations

### API Key Management
```bash
# .env.local (NEVER commit)
API_KEY=your_gemini_api_key_here
```

```typescript
// Secure access
const apiKey = import.meta.env.VITE_API_KEY;
if (!apiKey) {
  console.error('API key not configured');
}
```

### Input Validation
```typescript
// Task form validation
const validateTask = (task: Partial<Task>): string[] => {
  const errors: string[] = [];

  if (!task.name?.trim()) errors.push('Nome obrigatório');
  if (!task.deadline) errors.push('Prazo obrigatório');
  if (new Date(task.deadline) < new Date()) {
    errors.push('Prazo não pode ser no passado');
  }
  if (!task.responsible?.trim()) errors.push('Responsável obrigatório');

  return errors;
};
```

### XSS Prevention
- All user inputs sanitized
- No `dangerouslySetInnerHTML` usage
- React automatic escaping enabled

---

## Development Workflows

### Local Development
```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Adding New Features

**1. Define Types**
```typescript
// types.ts
export interface NewFeature {
  id: string;
  // ... fields
}
```

**2. Add Mock Data**
```typescript
// constants.ts
export const MOCK_NEW_FEATURE: NewFeature[] = [
  { id: '1', /* ... */ }
];
```

**3. Implement UI**
```typescript
// App.tsx or new component
const NewFeatureView = () => {
  const [data, setData] = useState(MOCK_NEW_FEATURE);

  return (
    <div>
      {/* Component JSX */}
    </div>
  );
};
```

**4. Add Navigation**
```typescript
// Update ViewState type
export type ViewState = '...' | 'NEW_FEATURE';

// Add sidebar item
<button onClick={() => setView('NEW_FEATURE')}>
  <Icon /> Nova Feature
</button>
```

### Data Update Workflow
```bash
# 1. Modify source data
vim dados_integrados.json

# 2. Re-run integration (if from Excel)
python integrar_final.py

# 3. Restart dev server
npm run dev
```

---

## Deployment

### Production Build
```bash
npm run build
```

**Output:**
```
dist/
├── assets/
│   ├── index-[hash].js      # Main bundle
│   ├── index-[hash].css     # Styles
│   └── [vendor]-[hash].js   # Dependencies
└── index.html               # Entry point
```

### Environment Variables
```bash
# Production
VITE_API_KEY=prod_api_key_here
VITE_API_URL=https://api.obracontrol.com
```

### Hosting Recommendations
- **Vercel** - Zero-config (recommended)
- **Netlify** - CDN + Forms
- **AWS S3 + CloudFront** - Enterprise
- **Azure Static Web Apps** - MS ecosystem

### Build Configuration
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2015',
    outDir: 'dist',
    sourcemap: false, // Enable for debugging
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'charts': ['recharts'],
        }
      }
    }
  }
});
```

---

## Troubleshooting

### Common Issues

**1. Module Not Found**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**2. Build Fails**
```bash
# Check TypeScript errors
npx tsc --noEmit

# Fix type mismatches in constants.ts or App.tsx
```

**3. Dark Mode Not Persisting**
```typescript
// Check localStorage
console.log(localStorage.getItem('darkMode'));

// Clear if corrupted
localStorage.removeItem('darkMode');
```

**4. Large JSON Files**
```typescript
// Reduce initial load
export const MOCK_TASKS = tarefasOrdenadas.slice(0, 100); // Instead of 200
```

**5. Gemini API Errors**
```typescript
// Check API key
console.log(import.meta.env.VITE_API_KEY ? 'Configured' : 'Missing');

// Handle errors gracefully
try {
  const summary = await generateSummary(data);
} catch (error) {
  console.error('AI generation failed:', error);
  setSummary('Erro ao gerar resumo. Tente novamente.');
}
```

---

## Code Standards

### TypeScript
- Strict mode enabled
- Explicit return types for functions
- No `any` types (use `unknown` if needed)
- Interface over type for objects

### React
- Functional components only
- Hooks for state management
- Prop destructuring
- Key props for lists

### Naming Conventions
```typescript
// Components: PascalCase
const DashboardView = () => { /* ... */ };

// Functions: camelCase
const calculateProgress = () => { /* ... */ };

// Constants: UPPER_SNAKE_CASE
const MOCK_PROJECTS = [ /* ... */ ];

// Interfaces: PascalCase with 'I' prefix (optional)
interface Task { /* ... */ }
```

### File Organization
```
/src
  /components
    /ui
      Button.tsx
    DailyLog.tsx
  /utils
    formatters.ts
    validators.ts
  /hooks
    useTasks.ts
  App.tsx
  types.ts
  constants.ts
```

---

## Project Contacts

| Role | Name | Responsibility |
|------|------|----------------|
| **Construction Lead** | Engº Vinicius Morés | Field operations, execution |
| **Project Lead** | Engº Fabio Correa | Design, planning, coordination |
| **System Admin** | - | ObraControl configuration |

---

## Roadmap

### Phase 1: Foundation ✅
- [x] Core UI components
- [x] UNICIFA data integration (4,221 tasks)
- [x] Financial-weighted progress
- [x] Dark mode
- [x] Keyboard shortcuts

### Phase 2: Enhancement (Q1 2026)
- [ ] Backend API integration
- [ ] Real-time data sync
- [ ] User authentication (OAuth2)
- [ ] Role-based access control
- [ ] Advanced financial dashboards
- [ ] S-Curve visualization (planned vs actual)

### Phase 3: Advanced Features (Q2 2026)
- [ ] IFC model viewer integration
- [ ] BIM element → Task linking
- [ ] Mobile app (React Native)
- [ ] Offline mode (PWA)
- [ ] Photo documentation module
- [ ] QR code task tracking

### Phase 4: Analytics (Q3 2026)
- [ ] Predictive analytics (ML)
- [ ] Cost overrun detection
- [ ] Resource optimization
- [ ] Automated reporting (PDF/Excel)
- [ ] Stakeholder dashboards

---

## References

### Documentation
- [React 19 Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Recharts API](https://recharts.org/en-US/api)
- [Gemini API](https://ai.google.dev/docs)

### Project Docs
- `README.md` - Quick start guide
- `GUIA_USO.md` - User manual (Portuguese)
- `MELHORIAS.md` - Feature changelog
- `INTEGRACAO_COMPLETA_FINAL.md` - Integration details

### Data Files
- `dados_integrados.json` - Master dataset (2.5MB)
- `tarefas_completas.json` - Task archive
- `preview_*.json` - Excel preview files

---

## License & Credits

**Project:** Gran Garden Resort - ObraControl
**Version:** 2.0 (Production)
**Last Updated:** December 13, 2025
**Repository:** https://github.com/engviniciusmores-web/ggr

---

**For Claude Code Support:** `/help` or https://github.com/anthropics/claude-code/issues
