# Nexus - Medical Records System (Ionic/Angular/Firebase)

## Project Overview
Nexus is a medical records management system built with **Ionic 8 + Angular 20 (standalone)** and **Firebase Firestore**. The app uses a tab-based architecture to manage patients, consultations, medications, and medical exams.

## Architecture

### Stack
- **Frontend**: Ionic 8 with Angular 20 standalone components
- **Backend**: Firebase Firestore (NoSQL database)
- **Mobile**: Capacitor 7 (cross-platform mobile deployment)
- **State Management**: RxJS Observables with service-based state

### Tab-Based Navigation
The app uses a tab bar structure defined in `src/app/tabs/`:
- **Tab 1 (Dashboard)**: Stats, alerts, KPIs, quick actions
- **Tab 2 (Patients)**: Patient list, search, CRUD operations
- **Tab 3 (Medical Records)**: Consultations, medical history, problem list
- **Tab 4 (Medications)**: Prescription management, medication tracking
- **Tab 5 (Exams)**: Lab results, exam orders, alerts for abnormal results

Routes are lazy-loaded via `tabs.routes.ts` using `loadComponent()` pattern.

⚠️ **TODO**: Tab 6 exists but is unused and should be removed from routing and navigation.

### Data Models
All models are centralized in `src/app/models/` with a barrel export in `index.ts`. Key entities:
- **Paciente** (Patient): RUT, demographics, allergies, chronic diseases, medical alerts
- **FichaMedica** (Medical Record): Linked to patient, contains medical history
- **Consulta** (Consultation): Medical visit with notes, linked to patient/professional/ficha
- **Medicamento/Receta**: Medication prescriptions
- **Examen/OrdenExamen**: Medical exam orders and results
- **Diagnostico**: Medical diagnoses
- **Hospitalizacion**: Hospital admissions

All Firestore models use `Timestamp` from `@angular/fire/firestore` for dates, not native JS `Date`.

## Development Conventions

### Component Architecture (Standalone Only)
**Always use Angular standalone components** (not NgModules). Components import Ionic components directly:

```typescript
import { Component } from '@angular/core';
import { IonContent, IonButton, IonCard } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [IonContent, IonButton, FormsModule, NgFor, NgIf],
  templateUrl: './example.page.html'
})
export class ExamplePage {}
```

**Component Types**:
- **Smart Components (Pages)**: Located in `features/[feature]/pages/`, handle data fetching, inject services
- **Dumb Components (Shared)**: Located in `shared/components/`, receive `@Input()`, emit `@Output()`, NO service injection
- **Feature Components**: Located in `features/[feature]/components/`, feature-specific reusable UI

### Service Pattern (Firestore + Repository)
Services use Angular's modern `inject()` function and follow repository pattern:

```typescript
import { Injectable, inject } from '@angular/core';
import { 
  Firestore, 
  collection, 
  collectionData, 
  doc,
  addDoc, 
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp 
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ExampleService {
  private firestore = inject(Firestore);
  private collectionName = 'collection-name';

  // Always return Observables for real-time data
  getAll(): Observable<Example[]> {
    const ref = collection(this.firestore, this.collectionName);
    return collectionData(ref, { idField: 'id' }) as Observable<Example[]>;
  }

  // Use async/await for write operations
  async create(data: Example): Promise<string> {
    const ref = collection(this.firestore, this.collectionName);
    const docRef = await addDoc(ref, {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  }

  // Queries with Firestore operators
  getByPatient(patientId: string): Observable<Example[]> {
    const ref = collection(this.firestore, this.collectionName);
    const q = query(ref, 
      where('idPaciente', '==', patientId),
      orderBy('fecha', 'desc')
    );
    return collectionData(q, { idField: 'id' }) as Observable<Example[]>;
  }
}
```

**Service Responsibilities** (from `notas.md`):
- ✅ Data fetching/persistence (Firestore operations)
- ✅ Business logic (validation, calculations)
- ✅ State management (shared data streams)
- ❌ NO UI rendering or DOM manipulation
- ❌ NO direct user interaction handling

**Component Responsibilities** (from `notas.md`):
- ✅ UI rendering and user interactions
- ✅ Template binding and event handling
- ✅ Subscribe to service Observables
- ❌ NO direct Firestore calls
- ❌ NO business logic beyond presentation

### Firebase Integration
- **Configuration**: `src/environments/environment.ts` contains Firebase config
- **Initialization**: `src/main.ts` bootstraps app with `provideFirebaseApp()` and `provideFirestore()`
- **Timestamps**: Always use `Timestamp.now()` for `createdAt`/`updatedAt` fields
- **Observables**: Use `collectionData(ref, { idField: 'id' })` to auto-populate document IDs

### Code Generation Commands
Use Ionic CLI for consistent structure:
```bash
# Generate service (in features folder)
ionic g service features/[feature-name]/data/[feature-name] --skip-tests

# Generate standalone component (reusable UI)
ionic g component shared/components/[component-name] --standalone

# Generate page within feature
ionic g page features/[feature-name]/pages/[page-name]
```

## 🚨 CRITICAL: Active Migration & Refactor

### Phase 1: OLDservices → Firestore Migration (IN PROGRESS)
**Current State**: Pages use HTTP-based services in `OLDservices/` directory. These are DEPRECATED.

**Migration Strategy - START FROM SCRATCH**:
1. **DO NOT modify or extend `OLDservices/`** - these will be deleted
2. **Create new Firestore services in `src/app/features/[feature]/data/`**
3. **Follow the repository pattern** - see structure below
4. **Reference `paciente.service.ts`** for Firestore CRUD patterns

**Required Services (based on functionality requirements)**:
- `pacientes.service.ts` → Patient search, CRUD, medical alerts
- `fichas-medicas.service.ts` → Medical records, history, antecedents
- `consultas.service.ts` → Consultation notes, evolution timeline
- `examenes.service.ts` → Lab results, exam uploads, critical alerts
- `medicamentos.service.ts` → Prescriptions, medication tracking
- `dashboard.service.ts` → KPIs, stats, recent actions
- `auth.service.ts` → Login, roles (médico, enfermería), permissions (TODO: later)

### Phase 2: Architecture Restructure (TODO)
**Current**: Flat tab structure with mixed concerns
**Target**: Feature-first architecture with proper separation

```
src/app/
├── core/                          # Singleton services
│   ├── guards/                    # Auth guards (TODO)
│   └── interceptors/              # HTTP interceptors
├── features/                      # Feature modules
│   ├── dashboard/
│   │   ├── data/
│   │   │   └── dashboard.service.ts
│   │   ├── components/
│   │   │   ├── stats-card/       # Standalone component
│   │   │   └── alert-panel/      # Standalone component
│   │   └── pages/
│   │       └── dashboard.page.ts
│   ├── pacientes/
│   │   ├── data/
│   │   │   └── pacientes.service.ts
│   │   ├── components/
│   │   │   ├── patient-card/
│   │   │   ├── patient-search/
│   │   │   └── problem-list/     # Alerts display
│   │   └── pages/
│   │       ├── patient-list.page.ts
│   │       └── patient-detail.page.ts
│   ├── consultas/
│   ├── medicamentos/
│   └── examenes/
├── shared/                        # Reusable dumb components
│   ├── components/
│   │   ├── card-wrapper/
│   │   ├── search-bar/
│   │   └── timeline/
│   ├── pipes/
│   └── directives/
├── models/                        # Existing - keep as-is
└── tabs/                          # TODO: Consider renaming to feature names
```

**Component vs Service Separation** (from `notas.md`):
- **Components**: Presentation only, receive `@Input()`, emit `@Output()`, located in `shared/components/` or `features/[feature]/components/`
- **Services**: Business logic, Firestore integration, state management, located in `features/[feature]/data/`

### Phase 3: Theme System Overhaul (TODO)
**Current Issue**: Hard-coded colors scattered across component `.scss` files (e.g., `#3880ff`, `rgba(56, 128, 255, 0.15)`)

**Required Changes**:
1. **Centralize all colors in `src/theme/variables.scss`**:
   ```scss
   :root {
     --nexus-primary: #3880ff;
     --nexus-surface: #ffffff;
     --nexus-border: #e0e0e0;
     --nexus-text-primary: #333333;
     --nexus-text-secondary: #666666;
     // etc...
   }
   
   @media (prefers-color-scheme: dark) {
     :root {
       --nexus-primary: #52a6ff;
       --nexus-surface: #1a1a1a;
       --nexus-border: #404040;
       // etc...
     }
   }
   ```

2. **Replace all hard-coded colors** in component `.scss` with CSS variables
3. **Create theme toggle service** for manual dark/light mode switching
4. **Modular SCSS structure**:
   ```
   src/theme/
   ├── variables.scss       # Color tokens, spacing, radius
   ├── _typography.scss     # Font styles
   ├── _elevations.scss     # Shadow definitions
   └── _mixins.scss         # Reusable style patterns
   ```

### Tab Renaming Strategy (OPTIONAL TODO)
**Current**: `tab1`, `tab2`, etc. (not descriptive)
**Consideration**: Renaming to `dashboard`, `patients`, `consultations`, `medications`, `exams`

**Decision Factors**:
- ✅ **Benefits**: Clearer code navigation, better semantic meaning
- ⚠️ **Risks**: Breaks routing, requires updates in multiple files
- **Recommendation**: Rename during Phase 2 restructure when moving to feature folders anyway

**If renaming**:
1. Update `tabs.routes.ts` path definitions
2. Update `tabs.page.html` tab attribute values
3. Update all `routerLink` references
4. Consider keeping route URLs as `/tabs/dashboard` even if folder is `features/dashboard/`

## Required Functionality (from `notas.md`)

### Core Features to Implement
All services and components must support these capabilities:

1. **Patient Search** (`pacientes.service.ts`)
   - Search by RUT, name, or medical record number
   - Filters and pagination
   - Real-time results from Firestore

2. **Medical Records** (`fichas-medicas.service.ts`)
   - View patient medical file (datos generales, antecedentes, alergias)
   - Medical history tracking
   - Problem list display (allergies, chronic diseases)

3. **Consultations** (`consultas.service.ts`)
   - View all consultations for a patient
   - Medical evolution timeline (chronological view)
   - Add quick notes to consultations

4. **Exams Management** (`examenes.service.ts`)
   - View exams ordered by date
   - Upload exam documents/images (Firebase Storage integration)
   - Critical alerts for abnormal results
   - Visual badges for out-of-range values

5. **Medications** (`medicamentos.service.ts`)
   - Prescription management
   - Treatment tracking
   - Add notes to medications

6. **Dashboard** (`dashboard.service.ts`)
   - KPIs: daily consultations by specialty, active patients
   - Quick actions: "New patient", "View records"
   - Recent activity feed
   - Critical alerts panel

7. **Authentication** (`core/services/auth.service.ts` - TODO Phase 3)
   - Login screen
   - Role-based access (médico, enfermería)
   - Permission guards for routes

### Service-to-Feature Mapping
```
Feature Area        → Service(s)                        → Firestore Collection(s)
─────────────────────────────────────────────────────────────────────────────────
Dashboard           → dashboard.service.ts              → consultas, pacientes, examenes
Patient Management  → pacientes.service.ts              → pacientes
Medical Records     → fichas-medicas.service.ts         → fichas-medicas
Consultations       → consultas.service.ts              → consultas
Exams               → examenes.service.ts               → examenes, ordenes-examen
                      + file-upload.service.ts (Storage)
Medications         → medicamentos.service.ts           → recetas, medicamentos
Auth (Phase 3)      → auth.service.ts                   → Firebase Auth + profesionales
```

## Common Workflows

### Running the App
```bash
npm start           # Development server (localhost:4200)
npm run build       # Production build
npm test            # Run Karma/Jasmine tests
```

### Building for Mobile
```bash
npm run build
npx cap sync        # Sync web assets to native projects
npx cap open ios    # Open Xcode
npx cap open android # Open Android Studio
```

### Firestore Setup
Reference `FIREBASE_IONIC_SETUP_GUIDE.md` for complete Firebase configuration steps. Key points:
- Firestore collections mirror model names (e.g., `pacientes`, `consultas`)
- Security rules should be configured in Firebase Console
- Environment configs are in `src/environments/`

## Key Files

### Entry Points
- `src/main.ts`: App bootstrap with Firebase providers
- `src/app/app.routes.ts`: Root routing (redirects to tabs)
- `src/app/tabs/tabs.routes.ts`: Tab navigation structure

### Models & Services
- `src/app/models/index.ts`: Barrel export for all models
- `src/app/services/paciente.service.ts`: Reference implementation for Firestore CRUD

### Configuration
- `angular.json`: Build configuration (output to `www/`)
- `capacitor.config.ts`: Native mobile app configuration
- `ionic.config.json`: Marks project as Angular standalone

## Project-Specific Patterns

### Reactive State Management
Pages subscribe to service Observables in `ngOnInit()` and clean up in `ngOnDestroy()`:

```typescript
private subscriptions: Subscription[] = [];

ngOnInit() {
  this.subscriptions.push(
    this.myService.data$.subscribe(data => this.data = data)
  );
}

ngOnDestroy() {
  this.subscriptions.forEach(sub => sub.unsubscribe());
}
```

### Error Handling
Use Ionic toast notifications for user feedback:
```typescript
import { IonToast } from '@ionic/angular/standalone';
// Show error/success messages via toast
```

### Model Interfaces
- Use `interface` for data models (not classes)
- Optional ID field: `id?: string`
- Timestamp fields: `Date | Timestamp` type for flexibility
- Export from `models/index.ts` for clean imports

## Notes from Developer (`notas.md`)
- **Architecture Style**: Microservices approach (each service/component is autonomous)
- **Component Definition**: UI presentation unit with `@Input()`/`@Output()` for communication
- **Service Definition**: Business logic + data integration via DI, calls APIs with `HttpClient`
- **Best Practices**: 
  - Separate concerns: services handle data, components handle UI
  - Reuse UI via standalone components
  - Use `environments` for API URLs
  - Validate data and handle HTTP errors properly

## Architecture Analysis

### Current vs. Recommended Structure
The suggested structure in `notas.md` (feature-first with `features/` folder) is **ideal for this project** because:

✅ **Advantages**:
- Clear feature boundaries align with medical domains (patients, consultations, exams)
- Each feature encapsulates its own data layer, components, and pages
- Easier to implement role-based access per feature
- Scalable as new features (e.g., billing, appointments) are added

⚠️ **Adaptation Required**:
The suggested structure mentions "microservices" and "Firebase Functions" in a `firebase/` folder. For this project:
- **Firestore services** (Angular services) are NOT microservices - they're frontend data access layers
- True microservices would be **Firebase Cloud Functions** (optional, for server-side logic)
- Current architecture is **serverless** (client → Firestore directly)

**Recommended Hybrid Approach**:
```
src/app/
├── core/                          # App-wide singletons
│   ├── services/
│   │   ├── auth.service.ts        # Firebase Auth
│   │   └── theme.service.ts       # Dark/light mode toggle
│   ├── guards/
│   │   └── auth.guard.ts
│   └── interceptors/              # (not needed for Firestore)
├── features/                      # Feature modules (NEW)
│   ├── dashboard/
│   │   ├── data/
│   │   │   └── dashboard.service.ts     # Aggregates data from multiple collections
│   │   ├── components/
│   │   │   ├── stats-card/              # Dumb component: @Input() stat
│   │   │   ├── alert-item/              # Dumb component: @Input() alert
│   │   │   └── kpi-panel/
│   │   └── pages/
│   │       └── dashboard.page.ts        # Smart component: injects service
│   ├── pacientes/
│   │   ├── data/
│   │   │   └── pacientes.service.ts     # Firestore CRUD for 'pacientes'
│   │   ├── components/
│   │   │   ├── patient-card/            # Display patient summary
│   │   │   ├── patient-search/          # Search bar + filters
│   │   │   └── problem-list/            # Allergies/chronic diseases
│   │   └── pages/
│   │       ├── patient-list.page.ts     # Main patient list view
│   │       └── patient-detail.page.ts   # Full patient profile
│   ├── consultas/
│   │   ├── data/
│   │   │   └── consultas.service.ts
│   │   ├── components/
│   │   │   ├── consultation-card/
│   │   │   ├── evolution-timeline/
│   │   │   └── nota-rapida-form/
│   │   └── pages/
│   │       └── consultas.page.ts
│   └── [examenes, medicamentos]/
├── shared/                        # Reusable UI (NO service injection)
│   ├── components/
│   │   ├── card-wrapper/          # Generic card layout
│   │   ├── search-bar/            # Generic search input
│   │   ├── empty-state/           # "No data" placeholder
│   │   └── loading-spinner/
│   ├── pipes/
│   │   ├── rut-format.pipe.ts     # Format RUT (XX.XXX.XXX-X)
│   │   └── timestamp-date.pipe.ts # Firestore Timestamp → Date
│   └── directives/
├── models/                        # Keep as-is (centralized types)
├── tabs/                          # Keep for now (migrate routes later)
└── theme/                         # Enhanced theming
    ├── variables.scss             # All CSS custom properties
    ├── _typography.scss           # Font scales
    ├── _elevations.scss           # Box shadows
    └── _mixins.scss               # Reusable SCSS patterns
```

### Why Not True Microservices?
- **Current**: Angular → Firestore (direct client access)
- **Microservices**: Angular → API Gateway → Service 1 (Patients), Service 2 (Exams), etc.
- **Verdict**: Firestore's real-time sync and security rules make microservices unnecessary for this app
- **Exception**: Use Firebase Cloud Functions only for:
  - Server-side validation
  - Email notifications
  - Complex aggregations (e.g., monthly reports)

## Important Reminders
1. **Standalone components only** - no NgModules
2. **Firestore services** - not HTTP/REST for new features
3. **Timestamp types** - use Firebase `Timestamp`, not `Date`
4. **Import Ionic components** - always import from `@ionic/angular/standalone`
5. **Tab navigation** - changes to routing must update `tabs.routes.ts`
