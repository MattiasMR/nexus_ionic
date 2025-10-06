# Firestore Indexes Required

## Critical Index Needed

### `ordenes-examen` Collection

**Error from console:**
```
The query requires an index. You can create it here: https://console.firebase.google.com/v1/r/project/nexus-68994/firestore/indexes?create_composite=...
```

**Index Configuration:**
- Collection: `ordenes-examen`
- Fields to index:
  1. `idPaciente` (Ascending)
  2. `fechaOrden` (Descending)
  3. `__name__` (Descending)

**How to Create:**
1. Click the link provided in the console error
2. OR go to Firebase Console → Firestore Database → Indexes
3. Click "Create Index"
4. Select collection: `ordenes-examen`
5. Add fields:
   - Field: `idPaciente`, Order: Ascending
   - Field: `fechaOrden`, Order: Descending
6. Click "Create"

**Why needed:** The `getOrdenesByPaciente()` query filters by `idPaciente` and orders by `fechaOrden`, which requires a composite index.

## Other Potential Indexes

### `consultas` Collection
If you see similar errors for consultations:
- Collection: `consultas`
- Fields:
  1. `idPaciente` (Ascending)
  2. `fecha` (Descending)

### `recetas` Collection  
If you see similar errors for medications:
- Collection: `recetas`
- Fields:
  1. `idPaciente` (Ascending)
  2. `fechaCreacion` (Descending)

## Quick Link
Direct link to create the `ordenes-examen` index:
https://console.firebase.google.com/v1/r/project/nexus-68994/firestore/indexes?create_composite=ClJwcm9qZWN0cy9uZXh1cy02ODk5NC9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvb3JkZW5lcy1leGFtZW4vaW5kZXhlcy9fEAEaDgoKaWRQYWNpZW50ZRABGg4KCmZlY2hhT3JkZW4QAhoMCghfX25hbWVfXxAC
