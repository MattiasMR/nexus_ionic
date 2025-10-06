# Phase 2: Architecture Restructure - Implementation Plan

**Date**: October 6, 2025  
**Status**: 📋 PLANNING  
**Estimated Time**: 4-6 hours

---

## 🎯 Objectives

Transform the flat tab-based structure into a scalable feature-first architecture while maintaining full functionality.

### Success Criteria
- ✅ All tabs work exactly as before
- ✅ Code organized by feature (domain)
- ✅ Services properly scoped to features
- ✅ Reusable components extracted
- ✅ Clean imports (barrel exports)
- ✅ Zero compilation errors

---

## 📂 Target Structure

```
src/app/
├── core/                          # App-wide singletons
│   ├── services/
│   │   ├── auth.service.ts        # TODO: Phase 3
│   │   └── theme.service.ts       # TODO: Phase 3
│   └── guards/                    # TODO: Phase 3
│
├── features/                      # Feature modules (NEW)
│   ├── dashboard/
│   │   ├── data/
│   │   │   └── dashboard.service.ts
│   │   ├── components/
│   │   │   ├── stats-card/
│   │   │   │   ├── stats-card.component.ts
│   │   │   │   ├── stats-card.component.html
│   │   │   │   └── stats-card.component.scss
│   │   │   └── alert-panel/
│   │   │       ├── alert-panel.component.ts
│   │   │       ├── alert-panel.component.html
│   │   │       └── alert-panel.component.scss
│   │   └── pages/
│   │       └── dashboard.page.ts
│   │
│   ├── pacientes/
│   │   ├── data/
│   │   │   └── pacientes.service.ts
│   │   ├── components/
│   │   │   ├── patient-card/
│   │   │   ├── patient-search/
│   │   │   └── patient-form/
│   │   └── pages/
│   │       ├── patient-list.page.ts
│   │       └── patient-detail.page.ts (optional)
│   │
│   ├── consultas/
│   │   ├── data/
│   │   │   └── consultas.service.ts
│   │   ├── components/
│   │   │   ├── ficha-header/
│   │   │   ├── consultation-card/
│   │   │   └── evolution-timeline/
│   │   └── pages/
│   │       └── consultas.page.ts
│   │
│   ├── medicamentos/
│   │   ├── data/
│   │   │   └── medicamentos.service.ts
│   │   ├── components/
│   │   │   ├── medication-card/
│   │   │   └── medication-form/
│   │   └── pages/
│   │       └── medicamentos.page.ts
│   │
│   └── examenes/
│       ├── data/
│       │   └── examenes.service.ts
│       ├── components/
│       │   ├── exam-card/
│       │   └── exam-upload/
│       └── pages/
│           └── examenes.page.ts
│
├── shared/                        # Reusable dumb components
│   ├── components/
│   │   ├── empty-state/
│   │   ├── loading-spinner/
│   │   └── back-button/
│   ├── pipes/
│   │   ├── rut-format.pipe.ts
│   │   └── timestamp-date.pipe.ts
│   └── directives/
│
├── models/                        # Keep as-is (already good)
│   └── index.ts
│
└── tabs/                          # Keep for navigation
    ├── tabs.page.ts
    ├── tabs.page.html
    ├── tabs.page.scss
    └── tabs.routes.ts             # Update imports
```

---

## 📝 Step-by-Step Implementation

### Step 1: Create Feature Folders ✅ START HERE
**Duration**: 15 minutes

1. Create base folder structure:
   ```powershell
   # Features
   mkdir src\app\features
   mkdir src\app\features\dashboard
   mkdir src\app\features\pacientes
   mkdir src\app\features\consultas
   mkdir src\app\features\medicamentos
   mkdir src\app\features\examenes
   
   # Subdirectories for each feature
   mkdir src\app\features\dashboard\data
   mkdir src\app\features\dashboard\components
   mkdir src\app\features\dashboard\pages
   
   mkdir src\app\features\pacientes\data
   mkdir src\app\features\pacientes\components
   mkdir src\app\features\pacientes\pages
   
   mkdir src\app\features\consultas\data
   mkdir src\app\features\consultas\components
   mkdir src\app\features\consultas\pages
   
   mkdir src\app\features\medicamentos\data
   mkdir src\app\features\medicamentos\components
   mkdir src\app\features\medicamentos\pages
   
   mkdir src\app\features\examenes\data
   mkdir src\app\features\examenes\components
   mkdir src\app\features\examenes\pages
   
   # Shared
   mkdir src\app\shared
   mkdir src\app\shared\components
   mkdir src\app\shared\pipes
   mkdir src\app\shared\directives
   
   # Core (for Phase 3)
   mkdir src\app\core
   mkdir src\app\core\services
   mkdir src\app\core\guards
   ```

---

### Step 2: Move Tab Pages to Features
**Duration**: 30 minutes

#### 2.1 Dashboard (tab1 → features/dashboard)
```powershell
# Move page files
Move-Item src\app\tab1\tab1.page.ts src\app\features\dashboard\pages\dashboard.page.ts
Move-Item src\app\tab1\tab1.page.html src\app\features\dashboard\pages\dashboard.page.html
Move-Item src\app\tab1\tab1.page.scss src\app\features\dashboard\pages\dashboard.page.scss
Move-Item src\app\tab1\tab1.page.spec.ts src\app\features\dashboard\pages\dashboard.page.spec.ts
```

**Then update files**:
- Rename selector: `app-tab1` → `app-dashboard`
- Update class name: `Tab1Page` → `DashboardPage`
- Update imports/exports

#### 2.2 Pacientes (tab2 → features/pacientes)
```powershell
Move-Item src\app\tab2\tab2.page.ts src\app\features\pacientes\pages\patient-list.page.ts
Move-Item src\app\tab2\tab2.page.html src\app\features\pacientes\pages\patient-list.page.html
Move-Item src\app\tab2\tab2.page.scss src\app\features\pacientes\pages\patient-list.page.scss
Move-Item src\app\tab2\tab2.page.spec.ts src\app\features\pacientes\pages\patient-list.page.spec.ts
```

**Update**:
- Rename selector: `app-tab2` → `app-patient-list`
- Update class: `Tab2Page` → `PatientListPage`
- Move service: `src\app\services\paciente.service.ts` → `features\pacientes\data\pacientes.service.ts`

#### 2.3 Consultas (tab3 → features/consultas)
```powershell
Move-Item src\app\tab3\tab3.page.ts src\app\features\consultas\pages\consultas.page.ts
Move-Item src\app\tab3\tab3.page.html src\app\features\consultas\pages\consultas.page.html
Move-Item src\app\tab3\tab3.page.scss src\app\features\consultas\pages\consultas.page.scss
Move-Item src\app\tab3\tab3.page.spec.ts src\app\features\consultas\pages\consultas.page.spec.ts
```

**Update**:
- Rename selector: `app-tab3` → `app-consultas`
- Update class: `Tab3Page` → `ConsultasPage`

#### 2.4 Medicamentos (tab4 → features/medicamentos)
```powershell
Move-Item src\app\tab4\tab4.page.ts src\app\features\medicamentos\pages\medicamentos.page.ts
Move-Item src\app\tab4\tab4.page.html src\app\features\medicamentos\pages\medicamentos.page.html
Move-Item src\app\tab4\tab4.page.scss src\app\features\medicamentos\pages\medicamentos.page.scss
Move-Item src\app\tab4\tab4.page.spec.ts src\app\features\medicamentos\pages\medicamentos.page.spec.ts
```

**Update**:
- Rename selector: `app-tab4` → `app-medicamentos`
- Update class: `Tab4Page` → `MedicamentosPage`

#### 2.5 Examenes (tab5 → features/examenes)
```powershell
Move-Item src\app\tab5\tab5.page.ts src\app\features\examenes\pages\examenes.page.ts
Move-Item src\app\tab5\tab5.page.html src\app\features\examenes\pages\examenes.page.html
Move-Item src\app\tab5\tab5.page.scss src\app\features\examenes\pages\examenes.page.scss
```

**Update**:
- Rename selector: `app-tab5` → `app-examenes`
- Update class: `Tab5Page` → `ExamenesPage`

---

### Step 3: Update Routing
**Duration**: 20 minutes

**File**: `src/app/tabs/tabs.routes.ts`

Update imports to use new paths:
```typescript
// Before
loadComponent: () => import('../tab1/tab1.page').then(m => m.Tab1Page)

// After
loadComponent: () => import('../features/dashboard/pages/dashboard.page').then(m => m.DashboardPage)
```

**Optional**: Rename route paths:
```typescript
// Before
{ path: 'tab1', loadComponent: ... }

// After
{ path: 'dashboard', loadComponent: ... }
```

**If renaming routes**, also update:
- `tabs.page.html` - tab attribute values
- Any `routerLink` references in templates

---

### Step 4: Move Services to Feature Data Folders
**Duration**: 30 minutes

#### 4.1 Pacientes Service
```powershell
Move-Item src\app\services\paciente.service.ts src\app\features\pacientes\data\pacientes.service.ts
```

**Update imports** in `PatientListPage`:
```typescript
// Before
import { PacienteService } from '../../services/paciente.service';

// After
import { PacientesService } from '../data/pacientes.service';
```

#### 4.2 Create Placeholder Services
Create empty services for other features (implement in Phase 3):

**`features/dashboard/data/dashboard.service.ts`**:
```typescript
import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private firestore = inject(Firestore);

  // TODO: Implement dashboard KPIs and stats
  getStats(): Observable<any> {
    // Placeholder
    return new Observable();
  }
}
```

Repeat for:
- `features/consultas/data/consultas.service.ts`
- `features/medicamentos/data/medicamentos.service.ts`
- `features/examenes/data/examenes.service.ts`

---

### Step 5: Extract Reusable Components (Optional - Can defer)
**Duration**: 1-2 hours (DEFER to Phase 2.1)

This is time-consuming. Can be done in a follow-up session:
- Extract `stats-card` from dashboard
- Extract `patient-card` from patient list
- Extract `alert-panel` from dashboard
- Extract `back-button` (used in multiple tabs)

**Recommendation**: Skip for now, mark as "Phase 2.1 - Component Extraction"

---

### Step 6: Delete Old Tab Folders
**Duration**: 5 minutes

After confirming everything works:
```powershell
Remove-Item -Recurse src\app\tab1
Remove-Item -Recurse src\app\tab2
Remove-Item -Recurse src\app\tab3
Remove-Item -Recurse src\app\tab4
Remove-Item -Recurse src\app\tab5
Remove-Item -Recurse src\app\tab6  # Unused tab
Remove-Item -Recurse src\app\services  # Moved to features
```

---

### Step 7: Clean Up and Test
**Duration**: 30 minutes

1. **Fix all imports** (TypeScript will show errors)
2. **Run compilation**: `npm run build`
3. **Test app**: `npm start`
4. **Verify all tabs work**

---

## 🚨 Potential Issues & Solutions

### Issue: "Cannot find module" errors
**Cause**: Import paths outdated after moving files  
**Fix**: Update imports to new paths

### Issue: Tab navigation broken
**Cause**: Route paths changed but `tabs.page.html` not updated  
**Fix**: Update tab attributes in `tabs.page.html`

### Issue: Services not found
**Cause**: Service moved but injection not updated  
**Fix**: Update import path in page component

### Issue: Circular dependencies
**Cause**: Services importing from pages or vice versa  
**Fix**: Use barrel exports (`index.ts`) to manage exports

---

## 📊 Progress Tracking

### Core Restructure (Must Do)
- [ ] Create feature folder structure
- [ ] Move tab1 → features/dashboard/pages
- [ ] Move tab2 → features/pacientes/pages
- [ ] Move tab3 → features/consultas/pages
- [ ] Move tab4 → features/medicamentos/pages
- [ ] Move tab5 → features/examenes/pages
- [ ] Update tabs.routes.ts imports
- [ ] Move paciente.service.ts → features/pacientes/data
- [ ] Create placeholder services for other features
- [ ] Fix all import errors
- [ ] Test all tabs
- [ ] Delete old tab folders

### Component Extraction (Optional - Phase 2.1)
- [ ] Extract stats-card component
- [ ] Extract patient-card component
- [ ] Extract alert-panel component
- [ ] Extract back-button component
- [ ] Extract empty-state component
- [ ] Create shared pipes (rut-format, timestamp-date)

---

## 🎯 Milestones

### Milestone 1: Folder Structure Created ✅
**Output**: Empty feature folders ready

### Milestone 2: Pages Moved ✅
**Output**: All pages in features/[feature]/pages/

### Milestone 3: Routing Updated ✅
**Output**: App navigates correctly with new paths

### Milestone 4: Services Organized ✅
**Output**: Services in features/[feature]/data/

### Milestone 5: Zero Errors ✅
**Output**: App compiles and runs perfectly

### Milestone 6: Old Code Deleted ✅
**Output**: Clean codebase without tab1-6 folders

---

## 📈 Expected Outcomes

### Before (Flat Structure)
```
src/app/
├── tab1/ (431 lines CSS)
├── tab2/ (240 lines CSS)
├── tab3/ (937 lines CSS)
├── tab4/ (722 lines CSS)
├── tab5/
├── tab6/ (unused)
└── services/
    └── paciente.service.ts
```

### After (Feature Structure)
```
src/app/
├── features/
│   ├── dashboard/
│   ├── pacientes/
│   ├── consultas/
│   ├── medicamentos/
│   └── examenes/
├── shared/
├── core/
└── models/
```

**Benefits**:
- ✅ Clear domain boundaries
- ✅ Services co-located with features
- ✅ Easier to find code
- ✅ Scalable structure
- ✅ Better separation of concerns

---

## ⏱️ Time Estimates

| Task | Duration | Priority |
|------|----------|----------|
| Create folders | 15 min | HIGH |
| Move pages | 30 min | HIGH |
| Update routing | 20 min | HIGH |
| Move services | 30 min | HIGH |
| Fix imports | 30 min | HIGH |
| Test & verify | 30 min | HIGH |
| Delete old code | 5 min | HIGH |
| **Component extraction** | **2 hours** | **MEDIUM** |

**Total (Core)**: ~2.5 hours  
**Total (With Components)**: ~4.5 hours

---

## 🚀 Ready to Start?

**Recommendation**: Do core restructure now (2.5 hours), defer component extraction to "Phase 2.1"

**Start with**: Step 1 - Create feature folders

**Order**:
1. Create all folders first (safe operation)
2. Move one tab at a time (dashboard → pacientes → etc.)
3. Update routing after all pages moved
4. Test thoroughly before deleting old code

---

**Next Command**: 
```powershell
# Create feature folders
mkdir src\app\features
```

Would you like me to start with Step 1?
