# Firestore Setup & Seeding Guide

## Quick Start (5 minutes)

### Step 1: Install Firebase Admin SDK
```powershell
npm install firebase-admin --save-dev
```

### Step 2: Get Service Account Key from Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the gear icon (⚙️) → **Project Settings**
4. Go to **Service Accounts** tab
5. Click **Generate new private key** button
6. Save the downloaded JSON file as `serviceAccountKey.json` in your project root
   ```
   nexus/
   ├── serviceAccountKey.json  ← Put it here
   ├── seed-firestore.js
   ├── package.json
   └── ...
   ```

⚠️ **IMPORTANT**: Add `serviceAccountKey.json` to `.gitignore` to avoid committing sensitive credentials!

### Step 3: Run the Seeding Script
```powershell
node seed-firestore.js
```

You should see output like:
```
🚀 Starting Firestore seeding...
========================================

📝 Seeding profesionales...
✅ Successfully seeded 3 documents to profesionales
📝 Seeding pacientes...
✅ Successfully seeded 4 documents to pacientes
...
🎉 Firestore seeding completed successfully!
```

### Step 4: Verify in Firebase Console
1. Go to Firebase Console → Firestore Database
2. You should see 8 new collections:
   - `profesionales` (3 doctors)
   - `pacientes` (4 patients)
   - `fichas-medicas` (4 medical records)
   - `consultas` (6 consultations)
   - `recetas` (4 prescriptions)
   - `ordenes-examen` (6 exam orders)
   - `medicamentos` (10 medication catalog items)
   - `examenes` (7 exam catalog items)

### Step 5: Test Your App
```powershell
ionic serve
```

Visit http://localhost:8100 and check:
- ✅ **Tab1 (Dashboard)**: Should show stats and alerts
- ✅ **Tab2 (Patients)**: Should show 4 patients
- ✅ **Tab3 (Medical Records)**: Select a patient to see their full record
- ✅ **Tab4 (Medications)**: Should show prescriptions
- ✅ **Tab5 (Exams)**: Should show exam orders

---

## Seed Data Overview

### 👨‍⚕️ Profesionales (3 doctors)
1. **Dr. Juan Pérez** - Medicina General (prof-001)
2. **Dra. María González** - Cardiología (prof-002)
3. **Dr. Carlos Rodríguez** - Pediatría (prof-003)

### 👥 Pacientes (4 patients with different profiles)

#### 1. Ana Martínez (pac-001) - 30 años
- **Condiciones**: Hipertensión
- **Alergias**: Penicilina (severa), Ibuprofeno
- **Medicamentos**: Enalapril 10mg, Atorvastatina 20mg
- **Consultas**: 2 (control PA, evaluación cardio)
- **Exámenes**: Ecocardiografía (realizada), Perfil lipídico (realizado)

#### 2. Pedro Silva (pac-002) - 50 años  
- **Condiciones**: Diabetes tipo 2, Colesterol alto
- **Medicamentos**: Metformina 850mg, Atorvastatina 40mg, Aspirina 100mg
- **Consultas**: 2 (controles de diabetes)
- **Exámenes**: Glicemia, HbA1c, Perfil lipídico (varios controles)
- **Alertas**: Control mensual de glicemia requerido

#### 3. Sofía López (pac-003) - 7 años
- **Condiciones**: Asma leve
- **Alergias**: Polen
- **Medicamentos**: Montelukast 5mg, Salbutamol (inhalador rescate)
- **Consultas**: 1 (control pediátrico)
- **Exámenes**: Espirometría (pendiente)

#### 4. Roberto Fernández (pac-004) - 70 años
- **Condiciones**: Hipertensión, Artritis reumatoide, Post-cirugía cardíaca, Hipotiroidismo
- **Alergias**: Mariscos
- **Medicamentos**: Losartán, Metotrexato, Levotiroxina, Ácido fólico (polimedicado)
- **Consultas**: 1 (control post-cirugía)
- **Exámenes**: Ecocardiograma (pendiente), TSH (pendiente), Hemograma (realizado)
- **Alertas**: Cirugía bypass coronario (2020)

### 📋 Consultas (6 total)
- Distributed across all patients
- Include `motivo`, `tratamiento`, `observaciones`
- Some have `notas` (quick notes feature)
- Dates range from 7-95 days ago

### 💊 Recetas (4 prescriptions)
- All patients have at least one prescription
- Each prescription contains multiple medications (realistic polymedication)
- Includes `dosis`, `frecuencia`, `duracion`, `indicaciones`

### 🔬 Órdenes de Examen (6 exam orders)
- Mix of **realizado** (completed) and **pendiente** (pending)
- Include lab tests (glicemia, HbA1c, TSH, hemograma)
- Include imaging (ecocardiografía, espirometría)
- Results stored in `resultado` field when completed

### 🧪 Catálogos
- **Medicamentos** (10): Common medications used in prescriptions
- **Examenes** (7): Common medical exams

---

## Firestore Security Rules (IMPORTANT!)

For development, you can use permissive rules. In **Firebase Console → Firestore → Rules**, paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // DEVELOPMENT ONLY - Allow all reads/writes
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **For production**, implement proper authentication-based rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated users can read/write
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // Restrict sensitive data
    match /pacientes/{patientId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                   request.auth.token.role == 'medico';
    }
  }
}
```

---

## Troubleshooting

### Error: "Cannot find module 'firebase-admin'"
```powershell
npm install firebase-admin --save-dev
```

### Error: "ENOENT: no such file or directory, open './serviceAccountKey.json'"
- Make sure you downloaded the service account key
- Place it in the project root (same folder as `package.json`)
- Check the filename is exactly `serviceAccountKey.json`

### Error: "Permission denied" in Firebase Console
- Go to Firebase Console → Authentication
- Enable at least one sign-in method (Email/Password recommended)
- Update Firestore security rules (see above)

### Data appears in Firestore but not in app
1. Check browser console for errors (F12 → Console)
2. Verify Firebase config in `src/environments/environment.ts`
3. Check that services are properly initialized
4. Try clearing browser cache and reloading

### Want to re-seed data?
Delete collections in Firebase Console and run `node seed-firestore.js` again.

---

## Next Steps After Seeding

### 1. Test All Tabs ✅
- **Tab1**: Verify stats show correct numbers
- **Tab2**: Search patients, check if all 4 appear
- **Tab3**: Click on a patient, verify medical record loads
- **Tab4**: Check medications display for each patient
- **Tab5**: Verify exam orders appear with correct status

### 2. Test Firestore Queries 🔍
Open browser console (F12) and check for:
- No "permission denied" errors
- Data loading successfully
- Queries completing in reasonable time

### 3. Address CSS/Responsiveness Issues 🎨
Now that you have data, you can properly test:
- Mobile view (toggle device toolbar in Chrome DevTools)
- Tablet view
- Desktop view
- Buttons, cards, modals appearance

### 4. Optional Enhancements
- Add more seed data (more patients, consultations)
- Create seed data for different medical scenarios
- Add test users for authentication

---

## Data Model Reference

### Key Relationships
```
Profesional ──┐
              ├──> Consulta ──> Receta (medicamentos[])
Paciente ────┤
              └──> OrdenExamen (examenes[])

FichaMedica ──> idPaciente
```

### Timestamp Fields
All dates use Firebase `Timestamp` type:
- `createdAt`: Document creation date
- `updatedAt`: Last modification date
- `fecha`: Event date (consultation, prescription, etc.)

### Estado Fields
- **OrdenExamen**: `'pendiente'`, `'realizado'`, `'cancelado'`
- **Receta**: No estado field yet (TODO: add in Phase 2)

---

## Support
If you encounter issues:
1. Check the browser console (F12)
2. Verify Firebase Console shows the seeded data
3. Check Firestore security rules
4. Verify `environment.ts` has correct Firebase config

**Happy testing! 🚀**
