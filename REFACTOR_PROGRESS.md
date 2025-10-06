# Nexus Refactor Progress Tracker

**Start Date**: October 5, 2025
**Current Phase**: Phase 1 - OLDservices → Firestore Migration

---

## Phase 1: OLDservices → Firestore Migration

### Status: 🟡 IN PROGRESS

### 1.1 Remove Tab 6 (Unused)
- [ ] Remove tab6 route from `tabs.routes.ts`
- [ ] Remove tab6 button from `tabs.page.html`
- [ ] Delete `src/app/tab6/` folder

### 1.2 Create Core Firestore Services
Services to be created in `src/app/features/[feature]/data/`:

#### Dashboard Service
- [ ] Create `features/dashboard/data/dashboard.service.ts`
- [ ] Implement KPI aggregations (daily consultations, active patients)
- [ ] Implement alerts aggregation from multiple collections
- [ ] Implement recent actions feed

#### Patients Service
- [ ] Create `features/pacientes/data/pacientes.service.ts`
- [ ] Implement search by RUT, name, medical record number
- [ ] Implement CRUD operations (create, read, update, delete)
- [ ] Implement pagination
- [ ] Implement medical alerts retrieval

#### Medical Records Service
- [ ] Create `features/fichas-medicas/data/fichas-medicas.service.ts`
- [ ] Implement get by patient ID
- [ ] Implement medical history retrieval
- [ ] Implement antecedents CRUD
- [ ] Implement problem list (allergies, chronic diseases)

#### Consultations Service
- [ ] Create `features/consultas/data/consultas.service.ts`
- [ ] Implement get all consultations by patient
- [ ] Implement chronological timeline query
- [ ] Implement quick notes CRUD (nested in consultation)
- [ ] Implement consultation CRUD

#### Exams Service
- [ ] Create `features/examenes/data/examenes.service.ts`
- [ ] Implement get exams by patient (ordered by date)
- [ ] Implement exam CRUD operations
- [ ] Implement file upload to Firebase Storage
- [ ] Implement critical alerts detection (out-of-range values)
- [ ] Implement exam order management

#### Medications Service
- [ ] Create `features/medicamentos/data/medicamentos.service.ts`
- [ ] Implement prescription CRUD
- [ ] Implement medication tracking
- [ ] Implement notes on medications
- [ ] Implement active prescriptions query

### 1.3 Migrate Pages to New Services
- [ ] Migrate Tab1 (Dashboard) from OLDservices to new dashboard.service.ts
- [ ] Migrate Tab2 (Patients) from OLDservices to new pacientes.service.ts
- [ ] Migrate Tab3 (Medical Records) from OLDservices to new services
- [ ] Migrate Tab4 (Medications) from OLDservices to new medicamentos.service.ts
- [ ] Migrate Tab5 (Exams) from OLDservices to new examenes.service.ts

### 1.4 Delete OLDservices
- [ ] Verify all pages use new Firestore services
- [ ] Delete `src/app/OLDservices/` directory
- [ ] Remove any remaining imports from OLDservices

---

## Phase 2: Architecture Restructure

### Status: ⚪ NOT STARTED

### 2.1 Extract Reusable Components (Identified from tabs)
Based on analysis of tabs 1-5, create these shared components:

#### Cards
- [ ] `shared/components/stat-card/` - Dashboard KPI cards
- [ ] `shared/components/alert-card/` - Alert/notification cards
- [ ] `shared/components/patient-card/` - Patient summary card
- [ ] `shared/components/exam-card/` - Exam result card
- [ ] `shared/components/medication-card/` - Medication card
- [ ] `shared/components/consultation-card/` - Consultation summary card

#### Forms & Inputs
- [ ] `shared/components/search-bar/` - Reusable search with filters
- [ ] `shared/components/patient-search/` - Patient-specific search
- [ ] `shared/components/form-input/` - Standardized form input wrapper
- [ ] `shared/components/date-picker/` - Date selection component

#### Lists & Data Display
- [ ] `shared/components/timeline/` - Chronological evolution timeline
- [ ] `shared/components/problem-list/` - Allergies/chronic diseases display
- [ ] `shared/components/data-row/` - Key-value data display row
- [ ] `shared/components/empty-state/` - "No data" placeholder
- [ ] `shared/components/loading-spinner/` - Consistent loading indicator

#### Badges & Indicators
- [ ] `shared/components/badge/` - Status badges (critical, warning, info)
- [ ] `shared/components/severity-indicator/` - Medical severity indicator
- [ ] `shared/components/avatar/` - Patient/professional avatar

#### Actions
- [ ] `shared/components/action-button/` - Styled action buttons
- [ ] `shared/components/quick-actions/` - Dashboard quick actions panel

### 2.2 Create Feature-Based Structure
- [ ] Create `src/app/features/` directory
- [ ] Create `features/dashboard/` with data/, components/, pages/
- [ ] Create `features/pacientes/` with data/, components/, pages/
- [ ] Create `features/consultas/` with data/, components/, pages/
- [ ] Create `features/medicamentos/` with data/, components/, pages/
- [ ] Create `features/examenes/` with data/, components/, pages/

### 2.3 Move Services to Features
- [ ] Move dashboard.service.ts to features/dashboard/data/
- [ ] Move pacientes.service.ts to features/pacientes/data/
- [ ] Move consultas.service.ts to features/consultas/data/
- [ ] Move medicamentos.service.ts to features/medicamentos/data/
- [ ] Move examenes.service.ts to features/examenes/data/
- [ ] Move fichas-medicas.service.ts to features/pacientes/data/ (related to patients)

### 2.4 Create Shared Utilities
- [ ] Create `shared/pipes/rut-format.pipe.ts` - Format RUT (XX.XXX.XXX-X)
- [ ] Create `shared/pipes/timestamp-date.pipe.ts` - Firestore Timestamp to Date
- [ ] Create `shared/pipes/time-ago.pipe.ts` - Relative time display
- [ ] Create `shared/directives/` as needed

### 2.5 Migrate Tab Pages to Feature Pages
- [ ] Migrate tab1 content to features/dashboard/pages/dashboard.page.ts
- [ ] Migrate tab2 content to features/pacientes/pages/patient-list.page.ts
- [ ] Migrate tab3 content to features/consultas/pages/medical-record.page.ts
- [ ] Migrate tab4 content to features/medicamentos/pages/medications.page.ts
- [ ] Migrate tab5 content to features/examenes/pages/exams.page.ts

### 2.6 Update Routing
- [ ] Update tabs.routes.ts to point to new feature pages
- [ ] Consider renaming routes from tab1/tab2 to dashboard/patients
- [ ] Test all navigation paths

---

## Phase 3: Theme System Overhaul

### Status: ⚪ NOT STARTED

### 3.1 Extract Hard-Coded Colors
Colors identified from SCSS analysis:
- Primary: `#3880ff`, `#52a6ff`, `#1f88ff`, `#176fdb`
- Danger: `#d32f2f`, `#b71c1c`
- Warning: `#f57c00`
- Success: (needs identification)
- Text: `#333`, `#0f1c2e`, `#708299`
- Background: `#f7fbff`, `#ffffff`, `#f1f6ff`
- Border: `#dbe8f7`, `#e0e0e0`
- Shadows: Various rgba values

### 3.2 Create Centralized Theme Variables
- [ ] Create `src/theme/variables.scss` with all color tokens
- [ ] Create `src/theme/_typography.scss` for font styles
- [ ] Create `src/theme/_elevations.scss` for box shadows
- [ ] Create `src/theme/_spacing.scss` for margins/padding
- [ ] Create `src/theme/_mixins.scss` for reusable patterns

### 3.3 Define Light Theme
- [ ] Map all hard-coded colors to CSS variables in `:root`
- [ ] Define semantic color names (--nexus-primary, --nexus-danger, etc.)
- [ ] Define elevation levels (--elev-1, --elev-2, --elev-3)
- [ ] Define spacing scale (--spacing-xs, --spacing-sm, etc.)

### 3.4 Define Dark Theme
- [ ] Create `@media (prefers-color-scheme: dark)` block
- [ ] Adjust all colors for dark mode
- [ ] Test contrast ratios for accessibility
- [ ] Adjust shadows/elevations for dark background

### 3.5 Replace Hard-Coded Colors in Components
- [ ] Update tab1.page.scss (31+ hard-coded colors)
- [ ] Update tab2.page.scss
- [ ] Update tab3.page.scss
- [ ] Update tab4.page.scss
- [ ] Update tab5.page.scss (25+ hard-coded colors)
- [ ] Update tab6.page.scss (if not deleted yet)
- [ ] Update all shared components

### 3.6 Create Theme Toggle Service
- [ ] Create `core/services/theme.service.ts`
- [ ] Implement manual dark/light mode toggle
- [ ] Persist preference to localStorage
- [ ] Add toggle UI to app (settings page or header)

---

## Phase 4: Authentication (Future)

### Status: ⚪ NOT STARTED

- [ ] Create `core/services/auth.service.ts`
- [ ] Implement Firebase Authentication
- [ ] Create login page
- [ ] Implement role-based access (médico, enfermería)
- [ ] Create auth guards for routes
- [ ] Add user profile management

---

## Completed Tasks

### Initial Setup
- ✅ Created `.github/copilot-instructions.md` with comprehensive guidelines
- ✅ Created `REFACTOR_PROGRESS.md` tracker
- ✅ Analyzed existing codebase for reusable components
- ✅ Identified hard-coded colors across all tabs

---

## Notes
- File uploads in exams will use Firebase Storage, integrated into examenes.service.ts
- Theme colors based on existing hard-coded values (#3880ff as primary)
- Reusable components identified: 17 shared components needed
- Hard-coded colors found: 60+ instances across 5 tabs
