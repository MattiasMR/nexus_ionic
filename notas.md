## Definiciones
### Microservicios:
Definición: Estilo arquitectónico donde la aplicación se divide en servicios pequeños y autónomos, cada uno con su propia API y ciclo de vida.

Estilo arquitectónico: 
la aplicación se divide en servicios pequeños y autónomos.
Cada servicio:
Expone una API (HTTP/REST).
Tiene su propio ciclo de vida (deploy/escala independiente).
Modela un contexto funcional (p. ej., Libros, Préstamos).
Ventajas:
Escalabilidad, despliegue independiente, resiliencia.
Desafíos:
Observabilidad, comunicación entre servicios, versionado y consistencia.

### Componente: Unidad de presentación (vista + lógica de UI). Recibe datos por @Input(), emite eventos con @Output(). Encapsula HTML/SCSS y comportamiento de interfaz.

### Servicio: Unidad de lógica y datos (negocio/integración). Se inyecta vía DI (Dependency Injection). Llama APIs (HttpClient), gestiona estado compartido, utilidades.


## Estructura
- Frontend: Ionic + Angular (tabs)
- Microservicios: endpoints para cada servicio / componente
- Comunicación vía HttpClient desde Angular.

## Importante
Extraer UI repetida a componentes standalone (Angular 16+).
Reuso, mantenibilidad, encapsulación de estilos/lógica.
API con @Input() / @Output().

### Buenas practicas
1. Proveer HttpClient (Standalone: provideHttpClient()).
2. Separar responsabilidades: servicios (datos), componentes (UI).
3. Reutilizar UI con componentes standalone.
4. Usar environments para URLs.
5. Validar stock y manejar errores HTTP (toasts/alerts).


### Servicios
ionic g service core/servicios/nombre-servicio --skip-tests

### Componentes standalone
ionic g component compartidos/componentes/nombre-componente –standalone

### Microservicios
(ex usando json-server)
microservicios/nombre-servicio/archivo.json


| Aspecto           | Componente (UI)                                                                 | Servicio (lógica/datos)                                                                                 |
|--------------------|----------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------|
| Responsabilidad    | Renderizar la vista y manejar las interacciones del usuario.                     | Obtener datos (HTTP), gestionar reglas de negocio y el estado de la aplicación.                         |
| Reutilización      | Visual (tarjetas, listas, chips, botones).                                       | Funcional (métodos para la lógica del negocio que se pueden usar en toda la aplicación).                 |
| Ubicación          | compartidos/componentes/...                                                      | core/servicios/...                                                                                       |
| Pruebas            | De la interfaz de usuario y el DOM.                                              | Unitarias de la lógica (son más sencillas de probar).                                                    |
| Cambio esperado    | Frecuente (estilos, diseño, ubicación de elementos).                             | Estable (el contrato con la API y los endpoints no cambian a menudo).                                   |



> NO OLVIDAR configurar src/main.ts y src/environments/environment.ts


### Listado de funcionalidades
Buscar pacientes: Buscador en la lista de pacientes con filtros por RUT, nombre o Nº de ficha.

Ver ficha médica del paciente: Pantalla de ficha con datos generales, antecedentes, alergias y episodios.

Ver exámenes y medicación del paciente: Secciones de “Exámenes” y “Tratamiento” dentro de la ficha, ordenadas por fecha.

Subir exámenes: Botón para adjuntar documentos/imágenes de exámenes y registrarlos en la ficha.

Evolución médica del paciente: Visualizar evolución y línea de tiempo cronológica de atenciones.

Agregar notas a pacientes/exámenes/medicamentos: Notas rápidas incrustadas en cada sección.

Alertas por exámenes fuera de lo normal: Panel de alertas y distintivos visuales para resultados críticos recientes.

Inicio de sesión y roles: Pantalla de acceso y control de permisos según perfil (médico, enfermería, etc.).

Accesos rápidos y recientes: Atajos en el dashboard a “nuevo paciente”, “fichas” y acciones frecuentes.

Problem list del paciente: Avisos por paciente en su ficha (Alergias, enfermedades crónicas, etc.).

Reportes y KPIs: Tarjetas con cifras del día (consultas por especialidad, pacientes activos, etc.).



## Estructura recomendada por IA
```
nexus/
├── src/
│   ├── app/
│   │   ├── core/                       # Singletons/global providers
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── firestore.service.ts      # low-level CRUD wrappers
│   │   │   │   └── analytics.service.ts (opt)
│   │   │   ├── guards/
│   │   │   └── tokens/ (opt)
│   │   ├── models/                     # domain types (interfaces)
│   │   │   ├── consulta.model.ts
│   │   │   ├── diagnostico.model.ts
│   │   │   └── ...model.ts
│   │   ├── features/                   # feature-first (recommended)
│   │   │   ├── pacientes/
│   │   │   │   ├── data/               # repositories per feature
│   │   │   │   │   ├── pacientes.repository.ts
│   │   │   │   │   └── paciente.mapper.ts (opt)
│   │   │   │   ├── components/
│   │   │   │   │   └── card-patient/   (ts, html, scss; standalone)
│   │   │   │   └── pages/
│   │   │   │       ├── pacientes.page.ts
│   │   │   │       └── paciente-detalle.page.ts
│   │   │   └── ...otros-features/
│   │   ├── shared/                     # dumb/presentational building blocks
│   │   │   ├── componentes/
│   │   │   ├── pipes/
│   │   │   └── directives/
│   │   ├── tab1/
│   │   ├── tab.../
│   │   └── tabs/                       
│   ├── environments/
│   │   ├── environment.ts              
│   │   └── environment.prod.ts
│   └── main.ts
├── firebase/                           # backend-in-the-same-repo (optional) - microservices
│   ├── functions/                      # Cloud Functions code (Node)
│   ├── firestore.rules
│   ├── firestore.indexes.json
│   ├── storage.rules
│   └── firebase.json
```

