# 🐛 Bug Tracking & Issue Log

**Last Updated:** October 6, 2025

---

## 🔴 P0 - CRITICAL (Blocking Core Workflows)

### BUG-001: Nueva Consulta Modal Freezes App
**Status:** 🔴 Open  
**Severity:** Critical  
**Reported:** October 6, 2025  
**Location:** `features/consultas/pages/consultas.page.ts`

**Description:**
When clicking "Nueva Consulta" button in Ficha Médica page, modal opens but app becomes completely unresponsive/frozen.

**Steps to Reproduce:**
1. Navigate to patient list (Tab 2)
2. Click on any patient
3. View Ficha Médica (Tab 3)
4. Click "Nueva Consulta" button
5. Modal appears but app freezes

**Expected Behavior:**
Modal should open, allow user to fill consultation form, save, and close properly.

**Investigation Needed:**
- [ ] Check if modal component exists and is imported
- [ ] Look for infinite loops in modal ngOnInit
- [ ] Check for circular dependencies
- [ ] Verify modal controller dismiss() works
- [ ] Check for memory leaks in event listeners

**Files to Check:**
- `features/consultas/pages/consultas.page.ts` - Method: `openNuevaConsultaModal()`
- Modal component (need to find filename)
- `features/consultas/pages/consultas.page.html` - Button binding

---

### BUG-002: Nueva Orden de Examen Not Saving
**Status:** 🔴 Open  
**Severity:** Critical  
**Reported:** October 6, 2025  
**Location:** `features/examenes/pages/examenes.page.ts`

**Description:**
When creating a new exam order, modal opens and user can fill form, but after clicking save, nothing happens. New exam doesn't appear in list.

**Steps to Reproduce:**
1. Navigate to patient Ficha Médica
2. Click "Ver Exámenes"
3. Click "Nueva Orden" button
4. Fill out exam form in modal
5. Click save
6. Modal remains open or closes, but no exam appears in list

**Expected Behavior:**
- Form validates inputs
- Creates OrdenExamen in Firestore
- Closes modal
- Reloads exam list to show new exam
- Shows success message

**Investigation Needed:**
- [ ] Check if `saveExam()` method is called
- [ ] Verify service `createOrdenExamen()` returns ordenId
- [ ] Check if `closeCreateModal()` is called
- [ ] Verify `loadExams()` is triggered after save
- [ ] Check modal component's save handler
- [ ] Look for validation errors blocking save

**Files to Check:**
- `features/examenes/pages/examenes.page.ts` - Method: `saveExam()`
- `features/examenes/components/nueva-orden-examen-modal/` - Modal component
- `features/examenes/data/examenes.service.ts` - Method: `createOrdenExamen()`

**Debug Plan:**
```typescript
// Add console logs to track execution
async saveExam() {
  console.log('🔍 saveExam() called');
  console.log('🔍 newExam data:', this.newExam);
  
  try {
    const ordenId = await this.examenesService.createOrdenExamen(ordenData);
    console.log('✅ Orden created with ID:', ordenId);
    
    this.closeCreateModal();
    console.log('✅ Modal closed');
    
    this.loadExams(this.patientId);
    console.log('✅ Exams reloaded');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}
```

---

### BUG-003: Editar Datos Personales UI Broken
**Status:** 🔴 Open  
**Severity:** Critical  
**Reported:** October 6, 2025  
**Location:** `features/consultas/pages/consultas.page.html`

**Description:**
When clicking edit button for personal data in Ficha Médica, edit mode activates but form fields don't display properly. Fields appear blank or hidden.

**Steps to Reproduce:**
1. Navigate to patient Ficha Médica
2. Find "Datos Personales" section
3. Click edit/pencil icon
4. Fields should become editable but appear broken/hidden

**Expected Behavior:**
- Edit mode activates
- Form fields populate with current patient data
- User can modify values
- Save button stores changes
- Cancel button reverts to view mode

**Investigation Needed:**
- [ ] Check `isEditingPersonalData` flag binding
- [ ] Verify form controls are initialized
- [ ] Check CSS display properties (hidden/none)
- [ ] Verify *ngIf conditions in template
- [ ] Check FormGroup/FormControl setup

**Files to Check:**
- `features/consultas/pages/consultas.page.html` - Edit personal data section
- `features/consultas/pages/consultas.page.ts` - Edit mode logic
- `features/consultas/pages/consultas.page.scss` - CSS for edit mode

---

## 🟠 P1 - HIGH (Missing Core Features)

### BUG-004: Agregar Nota Button Does Nothing
**Status:** 🟠 Open  
**Severity:** High  
**Reported:** October 6, 2025  
**Location:** `features/consultas/pages/consultas.page.ts`

**Description:**
"Agregar Nota" button exists in UI but has no functionality. Clicking it does nothing.

**Expected Behavior:**
Should open modal or inline form to add note to consultation, then save to Firestore.

**Solution Options:**
1. Create modal with textarea
2. Add inline textarea below consultation
3. Use Ionic alert with input

**Implementation Needed:**
```typescript
async agregarNota(consultaId: string) {
  // Option 1: Modal
  const modal = await this.modalCtrl.create({
    component: AgregarNotaModalComponent,
    componentProps: { consultaId }
  });
  await modal.present();
  const { data } = await modal.onWillDismiss();
  if (data?.nota) {
    await this.consultasService.addNotaToConsulta(consultaId, data.nota);
    this.loadPatientData(this.patientId);
  }
}
```

---

### BUG-005: Agregar Nuevo Medicamento Button Does Nothing
**Status:** 🟠 Open  
**Severity:** High  
**Reported:** October 6, 2025  
**Location:** `features/medicamentos/pages/medicamentos.page.ts`

**Description:**
"Agregar Nuevo Medicamento" button exists but clicking it does nothing. No modal opens.

**Expected Behavior:**
- Opens modal with medication form
- User fills: nombre, dosis, frecuencia, via, indicaciones, fechaInicio, duracion
- Saves to Firestore as Receta with MedicamentoRecetado
- Refreshes medication list

**Implementation Needed:**
- [ ] Create `NuevoMedicamentoModalComponent`
- [ ] Implement form with validation
- [ ] Wire up to `medicamentosService.createReceta()`

---

### BUG-006: Agregar Indicación Button Does Nothing
**Status:** 🟠 Open  
**Severity:** High  
**Reported:** October 6, 2025  
**Location:** `features/medicamentos/pages/medicamentos.page.ts`

**Description:**
"Agregar Indicación" button exists but clicking it does nothing. No modal opens.

**Expected Behavior:**
- Opens modal with indication form
- User fills: titulo, tipo, descripcion, estado
- Saves indication
- Refreshes indications list

**Implementation Needed:**
- [ ] Create `NuevaIndicacionModalComponent`
- [ ] Implement form
- [ ] Create service method if doesn't exist

---

### BUG-007: Missing Back Button in Medications Page
**Status:** 🟠 Open  
**Severity:** High  
**Reported:** October 6, 2025  
**Location:** `features/medicamentos/pages/medicamentos.page.html`

**Description:**
No way to navigate back from medications page to patient's Ficha Médica. User must use browser back button or tab navigation.

**Expected Behavior:**
Should have "Volver a Ficha Médica" button at top, similar to exams page.

**Implementation:**
```html
<!-- Add to medicamentos.page.html -->
<div class="volver-container">
  <button class="volver-btn" (click)="volverAFicha()">
    <ion-icon name="arrow-back-outline"></ion-icon>
    <span>Volver a Ficha Médica</span>
  </button>
</div>
```

```typescript
// Add to medicamentos.page.ts
volverAFicha() {
  if (this.patientId) {
    this.router.navigate(['/tabs/tab3'], { 
      queryParams: { patientId: this.patientId } 
    });
  }
}
```

---

## 🟡 P2 - MEDIUM (Non-Critical Issues)

### BUG-008: Filter Button in Patient List Does Nothing
**Status:** 🟡 Open  
**Severity:** Medium  
**Reported:** October 6, 2025  
**Location:** Tab 2 - Patient list page

**Description:**
Filter button appears in patient list but clicking it has no effect. No filter panel/modal opens.

**Expected Behavior:**
Should open filter panel with options: age range, gender, with alerts, etc.

**Implementation Needed:**
- [ ] Create filter panel/modal
- [ ] Add filter logic to patient list
- [ ] Store filter state
- [ ] Clear filters option

---

## ✅ RESOLVED

### BUG-R001: Exams Not Appearing After Creation
**Status:** ✅ Resolved  
**Fixed:** October 6, 2025  
**Severity:** Critical

**Description:**
Newly created exam orders weren't appearing in list after save.

**Root Cause:**
- Service queried wrong field name (`fechaOrden` instead of `fecha`)
- Observable used `take(1)` but wasn't being re-subscribed after creation

**Solution:**
- Fixed field name in queries
- Modified `loadExams()` to unsubscribe and re-subscribe
- Kept `take(1)` for `forkJoin` compatibility

**Files Changed:**
- `features/examenes/data/examenes.service.ts`
- `features/examenes/pages/examenes.page.ts`

---

### BUG-R002: Ficha Médica Showing Blank Fields
**Status:** ✅ Resolved  
**Fixed:** October 6, 2025  
**Severity:** Critical

**Description:**
After fixing exams, Ficha Médica page showed blank fields for all patient data.

**Root Cause:**
Removed `take(1)` from `getOrdenesByPaciente()` which broke `forkJoin` - it needs all observables to complete.

**Solution:**
Added back `take(1)` to maintain `forkJoin` compatibility while allowing exam page to reload manually.

**Files Changed:**
- `features/examenes/data/examenes.service.ts` - Added back `take(1)`
- `features/examenes/pages/examenes.page.ts` - Modified to reload after save

---

### BUG-R003: Exam Page Layout Cramped/Broken
**Status:** ✅ Resolved  
**Fixed:** October 6, 2025  
**Severity:** Medium

**Description:**
Exam container was too narrow (700px), cards mushed together, duplicate buttons.

**Solution:**
- Increased container width to 1200px
- Improved padding and spacing
- Enhanced card styling with hover effects
- Removed duplicate "Nueva Orden" button from empty state
- Better typography and layout

**Files Changed:**
- `features/examenes/pages/examenes.page.scss`
- `features/examenes/pages/examenes.page.html`

---

### BUG-R004: Angular Template Errors in Medications Page
**Status:** ✅ Resolved  
**Fixed:** October 6, 2025  
**Severity:** Critical (Build Error)

**Description:**
Complex inline filter expressions in medication tabs caused compilation errors. Angular templates can't have multi-statement expressions.

**Solution:**
- Created getter methods: `activeMedicationsCount` and `completedMedicationsCount`
- Replaced complex inline logic with simple getter calls
- Moved all filtering logic to TypeScript component

**Files Changed:**
- `features/medicamentos/pages/medicamentos.page.ts`
- `features/medicamentos/pages/medicamentos.page.html`

---

## 📊 Bug Statistics

**Total Bugs:** 8 Open, 4 Resolved  
**Critical (P0):** 3  
**High (P1):** 4  
**Medium (P2):** 1  
**Resolution Rate:** 33% (4/12)

**By Category:**
- UI/UX Issues: 3
- Functionality Missing: 4
- Data Issues: 2
- Navigation Issues: 1

**By Component:**
- Ficha Médica (Tab 3): 3 bugs
- Medications (Tab 4): 3 bugs
- Exams (Tab 5): 1 bug (1 resolved)
- Patient List (Tab 2): 1 bug

---

## 🎯 Resolution Strategy

**Week 1 Priority:**
1. Fix all P0 bugs (modal freeze, exam save, edit UI)
2. Implement missing P1 features (add note, add medication/indication)
3. Add navigation improvements (back buttons)

**Week 2 Priority:**
1. Fix P2 bugs (filter button)
2. Polish UI/UX
3. Add validation and error handling
4. Comprehensive testing

---

**Note:** See `PROJECT_STATUS.md` for full project status and feature tracking.
