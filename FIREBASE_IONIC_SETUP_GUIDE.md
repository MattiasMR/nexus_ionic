# 🔥 Guía Completa: Firebase + Firestore + Ionic desde Cero

## 📋 Tabla de Contenidos
1. [Crear Proyecto en Firebase](#1-crear-proyecto-en-firebase)
2. [Habilitar Firestore Database](#2-habilitar-firestore-database)
3. [Registrar una App Web](#3-registrar-una-app-web)
4. [Configurar Reglas de Seguridad](#4-configurar-reglas-de-seguridad)
5. [Conectar con tu Proyecto Ionic](#5-conectar-con-tu-proyecto-ionic)
6. [Verificar la Conexión](#6-verificar-la-conexión)
7. [Configuración Avanzada (Opcional)](#7-configuración-avanzada-opcional)

---

## 1. Crear Proyecto en Firebase

### Paso 1.1: Acceder a Firebase Console
1. Abre tu navegador
2. Ve a: **https://console.firebase.google.com/**
3. Inicia sesión con tu cuenta de Google

### Paso 1.2: Crear Nuevo Proyecto
1. Haz clic en **"Agregar proyecto"** o **"Add project"**
   
   ```
   ┌─────────────────────────────────────┐
   │  Firebase Console                    │
   │                                      │
   │  [+ Agregar proyecto]                │
   │                                      │
   │  Mis proyectos:                      │
   │  □ proyecto-1                        │
   │  □ proyecto-2                        │
   └─────────────────────────────────────┘
   ```

2. **Nombre del proyecto:**
   - Escribe un nombre descriptivo
   - Ejemplo: `fichas-medicas` o `clinica-app`
   - Firebase generará un ID único: `fichas-medicas-a1b2c3`
   - Haz clic en **"Continuar"**

   ```
   ┌─────────────────────────────────────┐
   │  Paso 1 de 3                         │
   │                                      │
   │  Nombre del proyecto:                │
   │  [fichas-medicas____________]        │
   │                                      │
   │  ID: fichas-medicas-a1b2c3          │
   │                                      │
   │  [Cancelar]  [Continuar →]          │
   └─────────────────────────────────────┘
   ```

3. **Google Analytics (opcional):**
   - Puedes **desactivarlo** para un proyecto simple
   - O **activarlo** si quieres estadísticas
   - Haz clic en **"Crear proyecto"**

   ```
   ┌─────────────────────────────────────┐
   │  Paso 2 de 3                         │
   │                                      │
   │  ☑ Habilitar Google Analytics        │
   │     (Recomendado)                    │
   │                                      │
   │  [← Atrás]  [Crear proyecto]        │
   └─────────────────────────────────────┘
   ```

4. **Espera la creación** (20-30 segundos)
   - Verás una animación de carga
   - Cuando termine, clic en **"Continuar"**

---

## 2. Habilitar Firestore Database

### Paso 2.1: Navegar a Firestore
1. En el panel izquierdo, busca **"Build"** (Compilación)
2. Haz clic en **"Firestore Database"**

   ```
   Panel Lateral:
   ├── 🏠 Descripción general del proyecto
   ├── 📊 Analytics
   ├── 🔨 Build (Compilación)
   │   ├── ⚡ Authentication
   │   ├── 🗄️ Firestore Database ← AQUÍ
   │   ├── 💾 Realtime Database
   │   ├── 📦 Storage
   │   └── ...
   ```

### Paso 2.2: Crear Base de Datos
1. Verás una pantalla de bienvenida
2. Haz clic en **"Crear base de datos"** o **"Create database"**

   ```
   ┌─────────────────────────────────────┐
   │  Cloud Firestore                     │
   │                                      │
   │  Base de datos de NoSQL en tiempo    │
   │  real para aplicaciones web y móvil  │
   │                                      │
   │      [Crear base de datos]           │
   │                                      │
   └─────────────────────────────────────┘
   ```

### Paso 2.3: Elegir Modo de Seguridad
Aparecerá un modal con dos opciones:

**Opción A: Modo de producción (Recomendado inicialmente)**
```
┌─────────────────────────────────────────────┐
│  Reglas de seguridad                         │
│                                              │
│  ⚪ Modo de producción                       │
│     Denegar todas las lecturas/escrituras   │
│     Configurarás las reglas después          │
│                                              │
│  ○ Modo de prueba                           │
│     Permitir todas las lecturas/escrituras  │
│     (Solo para desarrollo - 30 días)        │
│                                              │
│  [Siguiente]                                 │
└─────────────────────────────────────────────┘
```

**Selecciona:** 
- ✅ **"Modo de producción"** si vas a configurar las reglas manualmente (más seguro)
- ⚠️ **"Modo de prueba"** si quieres probar rápido (se vence en 30 días)

Para este tutorial, selecciona **"Modo de producción"** y luego configuraremos las reglas.

Haz clic en **"Siguiente"**

### Paso 2.4: Elegir Ubicación
1. Selecciona la región más cercana a tus usuarios:
   - **Estados Unidos:** `us-east1`, `us-central1`, `us-west1`
   - **Sudamérica:** `southamerica-east1` (São Paulo)
   - **Europa:** `europe-west1`, `europe-west3`
   
   ```
   ┌─────────────────────────────────────┐
   │  Ubicación de Cloud Firestore        │
   │                                      │
   │  [southamerica-east1 (São Paulo) ▼] │
   │                                      │
   │  ⚠️ No se puede cambiar después      │
   │                                      │
   │  [← Atrás]  [Habilitar]             │
   └─────────────────────────────────────┘
   ```

2. Haz clic en **"Habilitar"**

3. **Espera** que se cree la base de datos (30-60 segundos)

### Paso 2.5: Confirmar Creación
Verás la interfaz de Firestore vacía:

```
┌────────────────────────────────────────────────┐
│  Cloud Firestore                                │
│  [Data] [Rules] [Indexes] [Usage]              │
│                                                 │
│  ╔════════════════════════════════════════╗   │
│  ║  No hay colecciones todavía            ║   │
│  ║                                         ║   │
│  ║  [+ Iniciar colección]                 ║   │
│  ╚════════════════════════════════════════╝   │
└────────────────────────────────────────────────┘
```

¡Perfecto! Firestore está habilitado ✅

---

## 3. Registrar una App Web

### Paso 3.1: Ir a Configuración del Proyecto
1. En el panel izquierdo, haz clic en el ⚙️ (engranaje)
2. Selecciona **"Configuración del proyecto"** o **"Project settings"**

   ```
   ┌─────────────────────────────────────┐
   │  ⚙️ Configuración del proyecto      │
   │  👥 Usuarios y permisos              │
   │  💳 Uso y facturación               │
   └─────────────────────────────────────┘
   ```

### Paso 3.2: Registrar App Web
1. En la sección **"Tus apps"**, verás iconos de plataformas:
   
   ```
   Tus apps:
   [iOS]  [Android]  [Web </>]  [Unity]  [C++]
   ```

2. Haz clic en el ícono **"</>"** (Web)

### Paso 3.3: Configurar la App
1. Aparecerá un modal: **"Agregar Firebase a tu aplicación web"**

   ```
   ┌─────────────────────────────────────────────┐
   │  Agregar Firebase a tu aplicación web        │
   │                                              │
   │  Alias de la app:                           │
   │  [Mi App Ionic___________________]          │
   │                                              │
   │  ☑ También configura Firebase Hosting       │
   │                                              │
   │  [Cancelar]  [Registrar app]                │
   └─────────────────────────────────────────────┘
   ```

2. **Alias de la app:** Escribe un nombre descriptivo
   - Ejemplo: `Fichas Médicas Web`, `Clinica App`, etc.

3. **Firebase Hosting:** 
   - Déjalo **desmarcado** por ahora (no lo necesitamos)

4. Haz clic en **"Registrar app"**

### Paso 3.4: Copiar las Credenciales
Aparecerá un código con la configuración de Firebase:

```javascript
┌─────────────────────────────────────────────────┐
│  Agregar el SDK de Firebase                      │
│                                                  │
│  // Import the functions you need               │
│  import { initializeApp } from "firebase/app";  │
│                                                  │
│  // Your web app's Firebase configuration       │
│  const firebaseConfig = {                       │
│    apiKey: "AIzaSyAbc123...",                   │
│    authDomain: "mi-proyecto.firebaseapp.com",   │
│    projectId: "mi-proyecto",                    │
│    storageBucket: "mi-proyecto.appspot.com",    │
│    messagingSenderId: "123456789",              │
│    appId: "1:123456789:web:abc123"              │
│  };                                              │
│                                                  │
│  [📋 Copiar]                                    │
│                                                  │
│  [Continuar a la consola]                       │
└─────────────────────────────────────────────────┘
```

**IMPORTANTE:** 
- ✅ **Copia solo el objeto `firebaseConfig`** (desde `{` hasta `}`)
- ✅ Lo usaremos en el siguiente paso

Haz clic en **"Continuar a la consola"**

---

## 4. Configurar Reglas de Seguridad

### Paso 4.1: Navegar a Rules
1. Ve a **Firestore Database** (menú lateral)
2. Haz clic en la pestaña **"Rules"** (arriba)

   ```
   ┌────────────────────────────────────────────────┐
   │  Cloud Firestore                                │
   │  [Data] [Rules] [Indexes] [Usage]              │
   │         ^^^^^^                                  │
   └────────────────────────────────────────────────┘
   ```

### Paso 4.2: Ver Reglas Actuales
Verás algo como esto (modo producción):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;  // ← Bloquea TODO
    }
  }
}
```

### Paso 4.3: Configurar Reglas para Desarrollo

#### Opción A: Acceso Total (Solo Desarrollo)
**Recomendado para:** Desarrollo inicial, pruebas rápidas

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;  // ← Permite TODO (SOLO DESARROLLO)
    }
  }
}
```

⚠️ **ADVERTENCIA:** Cualquiera puede leer/escribir. Solo para desarrollo.

#### Opción B: Solo Usuarios Autenticados (Producción)
**Recomendado para:** Producción con Firebase Authentication

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;  // Solo usuarios logueados
    }
  }
}
```

#### Opción C: Reglas Específicas por Colección (Avanzado)
**Recomendado para:** Control granular de permisos

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Pacientes: Solo médicos autenticados
    match /pacientes/{pacienteId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                      request.auth.token.rol == 'medico';
    }
    
    // Consultas: Solo el médico que la creó o administradores
    match /consultas/{consultaId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
                               (resource.data.idProfesional == request.auth.uid ||
                                request.auth.token.rol == 'admin');
    }
    
    // Catálogos (exámenes, medicamentos): Solo lectura para todos
    match /examenes/{examenId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                      request.auth.token.rol == 'admin';
    }
    
    match /medicamentos/{medicamentoId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                      request.auth.token.rol == 'admin';
    }
  }
}
```

### Paso 4.4: Publicar las Reglas
1. **Copia** las reglas que elijas (Opción A para empezar)
2. **Pégalas** en el editor de reglas
3. Haz clic en **"Publicar"** (botón azul arriba a la derecha)

   ```
   ┌────────────────────────────────────────┐
   │  [Publicar]  [Simular]               │
   │                                        │
   │  rules_version = '2';                  │
   │  service cloud.firestore {             │
   │    ...                                 │
   │  }                                     │
   └────────────────────────────────────────┘
   ```

4. Confirma haciendo clic en **"Publicar"** en el modal

5. Verás un mensaje: ✅ **"Se publicaron las reglas"**

---

## 5. Conectar con tu Proyecto Ionic

### Paso 5.1: Instalar Dependencias

Abre la terminal en la raíz de tu proyecto Ionic:

```bash
cd tu-proyecto-ionic
npm install firebase @angular/fire
```

**Salida esperada:**
```
added 73 packages in 25s
```

### Paso 5.2: Configurar Environment

Abre el archivo `src/environments/environment.ts`:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "TU_API_KEY_AQUI",              // ← Pega desde Firebase Console
    authDomain: "tu-proyecto.firebaseapp.com",
    projectId: "tu-proyecto-id",
    storageBucket: "tu-proyecto.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123"
  }
};
```

**Reemplaza con las credenciales** que copiaste en el Paso 3.4

Haz lo mismo en `src/environments/environment.prod.ts`:

```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,  // ← Cambia a true
  firebaseConfig: {
    // Las mismas credenciales
    apiKey: "TU_API_KEY_AQUI",
    authDomain: "tu-proyecto.firebaseapp.com",
    projectId: "tu-proyecto-id",
    storageBucket: "tu-proyecto.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123"
  }
};
```

### Paso 5.3: Configurar main.ts

Abre `src/main.ts` y agrega los providers de Firebase:

```typescript
// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

// ← AGREGAR ESTOS IMPORTS
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';  // ← AGREGAR

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes),
    
    // ← AGREGAR ESTOS PROVIDERS
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
  ],
});
```

### Paso 5.4: Crear un Modelo

Crea `src/app/models/paciente.model.ts`:

```typescript
// src/app/models/paciente.model.ts
import { Timestamp } from '@angular/fire/firestore';

export interface Paciente {
  id?: string;
  rut: string;
  nombre: string;
  apellido: string;
  email?: string;
  telefono?: string;
  createdAt?: Timestamp;
}
```

### Paso 5.5: Crear un Servicio

Crea `src/app/services/paciente.service.ts`:

```typescript
// src/app/services/paciente.service.ts
import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Paciente } from '../models/paciente.model';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private firestore = inject(Firestore);
  private collectionName = 'pacientes';

  // Obtener todos los pacientes
  getPacientes(): Observable<Paciente[]> {
    const pacientesRef = collection(this.firestore, this.collectionName);
    return collectionData(pacientesRef, { idField: 'id' }) as Observable<Paciente[]>;
  }

  // Crear paciente
  async createPaciente(paciente: Paciente): Promise<string> {
    const pacientesRef = collection(this.firestore, this.collectionName);
    const docRef = await addDoc(pacientesRef, {
      ...paciente,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  }

  // Actualizar paciente
  async updatePaciente(id: string, paciente: Partial<Paciente>): Promise<void> {
    const pacienteRef = doc(this.firestore, `${this.collectionName}/${id}`);
    await updateDoc(pacienteRef, paciente);
  }

  // Eliminar paciente
  async deletePaciente(id: string): Promise<void> {
    const pacienteRef = doc(this.firestore, `${this.collectionName}/${id}`);
    await deleteDoc(pacienteRef);
  }
}
```

### Paso 5.6: Usar en un Componente

Modifica tu página (ej: `src/app/home/home.page.ts`):

```typescript
// src/app/home/home.page.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonList, IonItem } from '@ionic/angular/standalone';
import { PacienteService } from '../services/paciente.service';
import { Paciente } from '../models/paciente.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonList, IonItem],
})
export class HomePage implements OnInit {
  private pacienteService = inject(PacienteService);
  pacientes$!: Observable<Paciente[]>;

  ngOnInit() {
    this.pacientes$ = this.pacienteService.getPacientes();
  }

  async agregarPaciente() {
    const paciente: Paciente = {
      rut: '12345678-9',
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan@example.com'
    };

    try {
      const id = await this.pacienteService.createPaciente(paciente);
      console.log('Paciente creado con ID:', id);
      alert('✅ Paciente creado exitosamente');
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al crear paciente');
    }
  }
}
```

Y el HTML (`src/app/home/home.page.html`):

```html
<!-- src/app/home/home.page.html -->
<ion-header>
  <ion-toolbar>
    <ion-title>Mi App Médica</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>
  <div style="padding: 20px;">
    <h1>🏥 Gestión de Pacientes</h1>
    
    <ion-button expand="block" (click)="agregarPaciente()">
      ➕ Agregar Paciente
    </ion-button>

    <h2>Lista de Pacientes:</h2>
    <ion-list>
      <ion-item *ngFor="let paciente of pacientes$ | async">
        <h3>{{ paciente.nombre }} {{ paciente.apellido }}</h3>
        <p>RUT: {{ paciente.rut }}</p>
      </ion-item>
    </ion-list>
  </div>
</ion-content>
```

---

## 6. Verificar la Conexión

### Paso 6.1: Ejecutar la Aplicación

```bash
ionic serve
```

La app se abrirá en: **http://localhost:8100**

### Paso 6.2: Abrir Consola del Navegador
1. Presiona **F12**
2. Ve a la pestaña **"Console"**

### Paso 6.3: Probar Creación de Paciente
1. Haz clic en **"Agregar Paciente"**
2. Deberías ver: **"✅ Paciente creado exitosamente"**

### Paso 6.4: Verificar en Firebase Console
1. Ve a Firebase Console
2. **Firestore Database** → Pestaña **"Data"**
3. Deberías ver:
   ```
   📂 pacientes
     └── 📄 abc123xyz (documento)
         ├── rut: "12345678-9"
         ├── nombre: "Juan"
         ├── apellido: "Pérez"
         └── createdAt: October 5, 2025 at 10:30:00 PM
   ```

**Si ves el documento = ✅ ¡Conexión exitosa!**

---

## 7. Configuración Avanzada (Opcional)

### 7.1: Habilitar Firebase Authentication

1. **Firebase Console** → **Authentication**
2. Clic en **"Get Started"**
3. Selecciona un proveedor:
   - **Email/Password** (más simple)
   - **Google**
   - **Facebook**
   - etc.

4. En tu proyecto:
```bash
npm install @angular/fire
```

5. En `main.ts`:
```typescript
import { provideAuth, getAuth } from '@angular/fire/auth';

providers: [
  // ... otros providers
  provideAuth(() => getAuth()),
]
```

### 7.2: Habilitar Firebase Storage (para imágenes/documentos)

1. **Firebase Console** → **Storage**
2. Clic en **"Get Started"**
3. Elige reglas (prueba o producción)

4. En tu proyecto:
```typescript
import { provideStorage, getStorage } from '@angular/fire/storage';

providers: [
  // ... otros providers
  provideStorage(() => getStorage()),
]
```

### 7.3: Configurar Índices Compuestos

Si haces queries complejas:
```typescript
query(
  collection(firestore, 'consultas'),
  where('idPaciente', '==', 'abc'),
  where('fecha', '>=', startDate),
  orderBy('fecha', 'desc')
)
```

Firestore te dará un **link en la consola** para crear el índice automáticamente.

### 7.4: Persistencia Offline

Para que funcione sin internet:

```typescript
// En main.ts
import { enableIndexedDbPersistence } from '@angular/fire/firestore';

provideFirebaseApp(() => {
  const app = initializeApp(environment.firebaseConfig);
  const firestore = getFirestore(app);
  
  // Habilitar persistencia
  enableIndexedDbPersistence(firestore)
    .catch((err) => {
      console.error('Persistencia offline no disponible:', err);
    });
  
  return app;
}),
```

---

## 🎯 Checklist Final

- [ ] Proyecto creado en Firebase Console
- [ ] Firestore Database habilitado
- [ ] App web registrada
- [ ] Credenciales copiadas
- [ ] Reglas de seguridad configuradas
- [ ] Dependencias instaladas (`firebase`, `@angular/fire`)
- [ ] `environment.ts` configurado
- [ ] `environment.prod.ts` configurado
- [ ] `main.ts` con providers de Firebase
- [ ] Modelo creado
- [ ] Servicio creado
- [ ] Componente usando el servicio
- [ ] App ejecutándose (`ionic serve`)
- [ ] Paciente creado exitosamente
- [ ] Documento visible en Firebase Console

**Si todos están marcados = ✅ ¡Firestore completamente configurado!**

---

## 🆘 Solución de Problemas Comunes

### Error: "Missing or insufficient permissions"
**Solución:** Revisa las reglas en Firestore (Paso 4)

### Error: "Firebase: Error (auth/invalid-api-key)"
**Solución:** Verifica las credenciales en `environment.ts`

### Error: "Failed to get document"
**Solución:** Asegúrate de que Firestore esté habilitado (Paso 2)

### No aparecen los datos
**Solución:** 
1. Abre F12 → Console y busca errores
2. Verifica las reglas de seguridad
3. Verifica que la colección exista en Firestore

### Warning: "outside injection context"
**Solución:** Usa `inject()` dentro de constructores o `ngOnInit()`

---

## 📚 Recursos Adicionales

- **Documentación Firebase:** https://firebase.google.com/docs
- **AngularFire:** https://github.com/angular/angularfire
- **Ionic Framework:** https://ionicframework.com/docs
- **Reglas de Seguridad:** https://firebase.google.com/docs/firestore/security/get-started

---

**¡Listo! Ahora tienes Firebase + Firestore completamente integrado con tu app Ionic.** 🚀

¿Necesitas ayuda con algún paso específico? ¡Avísame!
