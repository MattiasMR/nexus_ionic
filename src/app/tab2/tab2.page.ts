import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {
  // Base / listas
  IonContent, IonList, IonItem,
  // Inputs
  IonSearchbar, IonInput, IonTextarea, IonSelect, IonSelectOption,
  // UI
  IonIcon, IonBadge,
  IonModal
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { NgFor, NgClass, NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { PacientesService } from '../features/pacientes/data/pacientes.service';
import { Paciente } from '../models/paciente.model';
import { Subscription } from 'rxjs';
import { Timestamp } from '@angular/fire/firestore';

/**
 * UI-friendly patient display interface with calculated fields
 */
interface PacienteUI extends Paciente {
  edad?: number;
  iniciales?: string;
  nombreCompleto?: string;
  // For compatibility with existing template
  nombres?: string;
  apellidos?: string;
  documento?: string;
  estado?: 'activo' | 'inactivo';
  ultimaVisita?: string;
  ubicacion?: string;
  diagnostico?: string;
}

@Component({
  selector: 'app-tab2',
  standalone: true,
  imports: [
    // Ionic usados en el HTML
    IonContent, IonList, IonItem,
    IonSearchbar, IonInput, IonTextarea, IonSelect, IonSelectOption,
    IonIcon, IonBadge,
    IonModal,
    // Angular
    FormsModule, NgFor, NgClass, NgIf, CommonModule
  ],
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
})
export class Tab2Page implements OnInit, OnDestroy {
  // Estados del componente
  pacientes: PacienteUI[] = [];
  filteredPacientes: PacienteUI[] = [];
  isLoading = false;
  error: string | null = null;
  
  // Búsqueda
  query = '';
  
  // For pagination display (not used by Firestore but kept for template compatibility)
  currentPage = 1;
  totalPages = 1;
  totalPatients = 0;
  
  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private pacientesService: PacientesService
  ) {}

  ngOnInit() {
    this.loadPatients();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Cargar todos los pacientes desde Firestore
   */
  loadPatients() {
    this.isLoading = true;
    this.error = null;

    this.subscriptions.push(
      this.pacientesService.getAllPacientes().subscribe({
        next: (pacientes) => {
          this.pacientes = pacientes.map(this.enrichPatient);
          this.filteredPacientes = [...this.pacientes];
          this.totalPatients = this.pacientes.length;
          this.isLoading = false;
          console.log('Patients loaded:', pacientes.length);
        },
        error: (error) => {
          console.error('Error loading patients:', error);
          this.error = 'Error al cargar los pacientes';
          this.isLoading = false;
        }
      })
    );
  }

  /**
   * Enrich patient data with calculated fields and template compatibility
   */
  private enrichPatient = (paciente: Paciente): PacienteUI => {
    const nombreCompleto = `${paciente.nombre} ${paciente.apellido}`;
    
    return {
      ...paciente,
      // Calculated fields
      edad: this.calculateAge(paciente.fechaNacimiento),
      iniciales: this.initials(nombreCompleto),
      nombreCompleto,
      // Template compatibility (map singular to plural)
      nombres: paciente.nombre,
      apellidos: paciente.apellido,
      documento: paciente.rut,
      estado: 'activo', // Default, can be extended later
      ultimaVisita: this.formatDate(paciente.updatedAt)
    };
  };

  /**
   * Calcular edad a partir de fecha de nacimiento
   */
  private calculateAge(fechaNacimiento?: Date | Timestamp): number {
    if (!fechaNacimiento) return 0;
    
    const birth = fechaNacimiento instanceof Timestamp 
      ? fechaNacimiento.toDate() 
      : new Date(fechaNacimiento);
    
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

  /**
   * Formatear fecha para visualización
   */
  private formatDate(date: Date | Timestamp | string | undefined): string {
    if (!date) return 'N/A';
    
    const d = date instanceof Timestamp 
      ? date.toDate() 
      : new Date(date);
    
    return d.toLocaleDateString('es-CL');
  }

  // ---------- Navegación ----------
  goBack() { 
    this.router.navigateByUrl('/tabs/tab1'); 
  }
  
  verFicha(paciente: PacienteUI) { 
    this.router.navigate(['/tabs/tab3'], { 
      queryParams: { patientId: paciente.id } 
    }); 
  }

  // ---------- Búsqueda ----------
  onSearch(ev: any) { 
    this.query = (ev?.detail?.value || '').toLowerCase().trim();
    
    if (!this.query) {
      // Show all patients if search is empty
      this.filteredPacientes = [...this.pacientes];
      return;
    }

    // Use service search for Firestore query
    this.isLoading = true;
    
    this.subscriptions.push(
      this.pacientesService.searchPacientes(this.query).subscribe({
        next: (results) => {
          this.filteredPacientes = results.map(this.enrichPatient);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Search error:', error);
          // Fallback to client-side filtering
          this.filteredPacientes = this.pacientes.filter(p =>
            p.nombre?.toLowerCase().includes(this.query) ||
            p.apellido?.toLowerCase().includes(this.query) ||
            p.rut?.toLowerCase().includes(this.query) ||
            p.nombreCompleto?.toLowerCase().includes(this.query)
          );
          this.isLoading = false;
        }
      })
    );
  }

  get filtered(): PacienteUI[] {
    return this.filteredPacientes;
  }

  get total(): number { 
    return this.filteredPacientes.length; 
  }

  // ---------- Utilidades UI ----------
  initials(nombre?: string): string {
    if (!nombre) return '--';
    const parts = nombre.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? '';
    const last  = parts[parts.length - 1]?.[0] ?? '';
    return (first + last).toUpperCase();
  }

  estadoClass(estado: 'activo' | 'inactivo' | undefined) {
    return {
      'badge-estable': estado === 'activo',
      'badge-activo' : estado === 'activo',
      'badge-critico': estado === 'inactivo',
    };
  }

  // ============== CREAR PACIENTE (Modal) ==============
  isCreateOpen = false;
  newPaciente: any = {}; // Use any for form flexibility

  openCreate() {
    console.log('openCreate() llamado');
    this.newPaciente = this.blankPaciente();
    this.error = null;
    this.isCreateOpen = true;
    console.log('Modal abierto, newPaciente inicializado:', this.newPaciente);
  }
  
  closeCreate() { 
    console.log('closeCreate() llamado');
    this.isCreateOpen = false; 
    this.error = null;
  }

  // Método de prueba simple
  testButton() {
    console.log('¡Botón funciona!');
    alert('¡El botón responde correctamente!');
  }

  async saveCreate() {
    console.log('saveCreate() llamado');
    console.log('Datos del formulario:', this.newPaciente);
    
    const p = this.newPaciente;
    
    // Map template fields (plural) to model fields (singular)
    const nombre = p.nombres || p.nombre;
    const apellido = p.apellidos || p.apellido;
    const rut = p.documento || p.rut;
    
    // Validaciones básicas
    if (!nombre?.trim()) {
      this.error = 'El campo nombre es obligatorio';
      return;
    }
    if (!apellido?.trim()) {
      this.error = 'El campo apellido es obligatorio';
      return;
    }
    if (!rut?.trim()) {
      this.error = 'El campo RUT/documento es obligatorio';
      return;
    }
    if (!p.fechaNacimiento) {
      this.error = 'El campo fecha de nacimiento es obligatorio';
      return;
    }

    // Limpiar error previo
    this.error = null;
    this.isLoading = true;
    
    console.log('Validaciones pasadas, creando paciente...');

    // Preparar datos para Firestore (usar nombres del modelo)
    const nuevoPaciente: Omit<Paciente, 'id'> = {
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      rut: rut.trim(),
      fechaNacimiento: typeof p.fechaNacimiento === 'string'
        ? Timestamp.fromDate(new Date(p.fechaNacimiento))
        : Timestamp.now(),
      sexo: (p.sexo || p.genero || 'Otro') as 'M' | 'F' | 'Otro',
      // Required fields
      direccion: p.direccion?.trim() || 'Sin dirección',
      telefono: p.telefono?.trim() || 'Sin teléfono',
      // Optional fields
      email: p.email,
      grupoSanguineo: p.grupoSanguineo,
      alergias: [],
      enfermedadesCronicas: [],
      alertasMedicas: [],
      nombreCompleto: `${nombre.trim()} ${apellido.trim()}`,
      // Metadata
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    console.log('Paciente preparado:', nuevoPaciente);

    try {
      const docId = await this.pacientesService.createPaciente(nuevoPaciente);
      console.log('Paciente creado con ID:', docId);
      
      // Close modal and refresh list
      this.closeCreate();
      this.loadPatients();
      this.error = null;
      
      console.log('Paciente creado exitosamente y lista actualizada');
    } catch (error: any) {
      console.error('Error al crear paciente:', error);
      this.error = error?.message || 'Error al crear el paciente';
      this.isLoading = false;
    }
  }

  private today(): string {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${mm}-${dd}`;
  }

  private blankPaciente(): any {
    return {
      // Template uses plural forms
      nombres: '',
      apellidos: '',
      documento: '',
      tipoDocumento: 'CC',
      telefono: '',
      email: '',
      direccion: '',
      fechaNacimiento: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      genero: 'Otro',
      estadoCivil: 'soltero',
      ocupacion: '',
      // Model uses singular forms
      nombre: '',
      apellido: '',
      rut: '',
      sexo: 'Otro',
      estado: 'activo',
      diagnostico: '',
      ultimaVisita: ''
    };
  }

  // ============== EXPORTAR (CSV) ==============
  exportar() {
    const header = ['Nombre','Apellido','RUT','Teléfono','Email','Edad','Última actualización'];
    const rows = this.filtered.map(p => [
      p.nombre, 
      p.apellido, 
      p.rut, 
      p.telefono || '', 
      p.email || '', 
      p.edad || '',
      this.formatDate(p.updatedAt)
    ]);

    const toCsv = (r: any[]) => r.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',');
    const csv = [toCsv(header), ...rows.map(toCsv)].join('\r\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pacientes_${this.today()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ============== PAGINACIÓN (Placeholders for template compatibility) ==============
  previousPage() {
    // Firestore doesn't use pagination like this
    // Could be implemented with startAfter/endBefore cursors later
    console.log('Pagination not implemented with Firestore yet');
  }

  nextPage() {
    // Firestore doesn't use pagination like this
    console.log('Pagination not implemented with Firestore yet');
  }

  // ============== REFRESCAR ==============
  refreshPatients() {
    this.loadPatients();
  }

  // ============== ELIMINAR ERROR ==============
  clearError() {
    this.error = null;
  }
}
