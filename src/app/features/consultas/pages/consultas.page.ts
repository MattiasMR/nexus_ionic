import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonButton,
  IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle,
  IonBadge, IonGrid, IonRow, IonCol, IonList, IonItem, IonLabel,
  IonTextarea, IonTabs, IonTabButton, IonSpinner, IonToast,
  IonInput, IonSelect, IonSelectOption,
  ModalController, ToastController
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription, forkJoin } from 'rxjs';
import { Timestamp } from '@angular/fire/firestore';

// Servicios Firestore
import { PacientesService } from '../../pacientes/data/pacientes.service';
import { FichasMedicasService } from '../../fichas-medicas/data/fichas-medicas.service';
import { ConsultasService } from '../data/consultas.service';
import { ExamenesService } from '../../examenes/data/examenes.service';

// Components
import { NuevaConsultaModalComponent } from '../components/nueva-consulta-modal/nueva-consulta-modal.component';

// Modelos
import { Paciente } from '../../../models/paciente.model';
import { FichaMedica } from '../../../models/ficha-medica.model';
import { Consulta } from '../../../models/consulta.model';
import { OrdenExamen } from '../../../models/orden-examen.model';

// Utilidades
import { AvatarUtils } from '../../../shared/utils/avatar.utils';

/**
 * UI interface for medical record display
 */
interface FichaMedicaUI {
  datosPersonales: {
    nombres: string;
    apellidos: string;
    rut: string;
    edad: number;
    grupoSanguineo: string;
    direccion: string;
    telefono: string;
    contactoEmergencia: string;
  };
  alertasMedicas: Array<{
    tipo: 'alergia' | 'medicamento' | 'antecedente';
    descripcion: string;
    criticidad: 'alta' | 'media' | 'baja';
  }>;
  consultas: ConsultaUI[];
  examenes: OrdenExamenUI[];
  historiaMedica?: {
    antecedentesPersonales: string[];
    antecedentesFamiliares: string[];
    hospitalizacionesPrevias?: number;
  };
}

/**
 * UI interface for consultations with additional display properties
 */
interface ConsultaUI extends Consulta {
  hora?: string;
  especialidad?: string;
  medico?: string;
  signosVitales?: {
    presionArterial?: string;
    frecuenciaCardiaca?: number;
    temperatura?: number;
    peso?: number;
  };
}

/**
 * UI interface for exam orders with additional display properties
 */
interface OrdenExamenUI extends OrdenExamen {
  nombre?: string;
  resultado?: string;
  detalle?: string;
}

@Component({
  selector: 'app-consultas',
  templateUrl: './consultas.page.html',
  styleUrls: ['./consultas.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonIcon, IonButton,
    IonCard, IonCardContent, IonCardHeader, IonCardTitle,
    IonBadge, IonGrid, IonRow, IonCol,
    IonTextarea, IonInput, IonSelect, IonSelectOption,
    CommonModule, FormsModule
  ],
})
export class ConsultasPage implements OnInit, OnDestroy {
  
  // Estados del componente
  ficha: FichaMedicaUI | null = null;
  fichaId: string | null = null;
  paciente: Paciente | null = null;
  isLoading = false;
  error: string | null = null;
  patientId: string | null = null;
  
  // Variable para las notas rápidas
  nuevaNota: string = '';
  
  // Edit mode
  isEditMode = false;
  editedData: any = {};
  
  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private pacientesService: PacientesService,
    private fichasMedicasService: FichasMedicasService,
    private consultasService: ConsultasService,
    private examenesService: ExamenesService,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    // Obtener el ID del paciente desde los query params
    this.subscriptions.push(
      this.route.queryParams.subscribe(params => {
        this.patientId = params['patientId'];
        if (this.patientId) {
          this.loadPatientData(this.patientId);
        } else {
          this.error = 'No se especificó el ID del paciente';
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Cargar todos los datos del paciente desde Firestore
   */
  loadPatientData(patientId: string) {
    this.isLoading = true;
    this.error = null;

    // Cargar datos en paralelo usando forkJoin
    const paciente$ = this.pacientesService.getPacienteById(patientId);
    const ficha$ = this.fichasMedicasService.getFichaByPacienteId(patientId);
    const consultas$ = this.consultasService.getConsultasByPaciente(patientId);
    const examenes$ = this.examenesService.getOrdenesByPaciente(patientId);

    this.subscriptions.push(
      forkJoin({
        paciente: paciente$,
        ficha: ficha$,
        consultas: consultas$,
        examenes: examenes$
      }).subscribe({
        next: (data) => {
          if (data.paciente && data.ficha) {
            this.paciente = data.paciente;
            this.fichaId = data.ficha.id || null;
            this.ficha = this.buildFichaMedicaUI(
              data.paciente,
              data.ficha,
              data.consultas,
              data.examenes
            );
          } else {
            console.error('Missing patient or ficha data');
            this.error = 'No se encontró el paciente o su ficha médica';
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('❌ Error loading patient data:', error);
          this.error = 'Error al cargar los datos del paciente: ' + (error.message || 'Desconocido');
          this.isLoading = false;
        }
      })
    );
  }

  /**
   * Construir la ficha médica UI a partir de los datos de Firestore
   */
  private buildFichaMedicaUI(
    paciente: Paciente,
    ficha: FichaMedica,
    consultas: Consulta[],
    examenes: OrdenExamen[]
  ): FichaMedicaUI {
    const datosPersonales = {
      nombres: paciente.nombre || 'Sin nombre',
      apellidos: paciente.apellido || 'Sin apellido',
      rut: paciente.rut || 'Sin RUT',
      edad: this.calculateAge(paciente.fechaNacimiento),
      grupoSanguineo: paciente.grupoSanguineo || 'No registrado',
      direccion: paciente.direccion || 'Sin dirección',
      telefono: paciente.telefono || 'Sin teléfono',
      contactoEmergencia: 'Contacto por definir' // TODO: Add to Paciente model
    };
    
    return {
      datosPersonales,
      alertasMedicas: [
        // Alergias del paciente
        ...(paciente.alergias || []).map(alergia => ({
          tipo: 'alergia' as const,
          descripcion: alergia,
          criticidad: 'alta' as const
        })),
        // Enfermedades crónicas
        ...(paciente.enfermedadesCronicas || []).map(enfermedad => ({
          tipo: 'antecedente' as const,
          descripcion: enfermedad,
          criticidad: 'media' as const
        })),
        // Alertas médicas
        ...(paciente.alertasMedicas || []).map(alerta => ({
          tipo: 'antecedente' as const,
          descripcion: alerta.descripcion,
          criticidad: (alerta.severidad === 'critica' || alerta.severidad === 'alta' 
            ? 'alta' 
            : (alerta.severidad === 'media' ? 'media' : 'baja')) as 'alta' | 'media' | 'baja'
        }))
      ],
      consultas: consultas.slice(0, 10), // Últimas 10 consultas
      examenes: examenes.slice(0, 10), // Últimas 10 órdenes de examen
      historiaMedica: {
        antecedentesPersonales: ficha.antecedentes?.personales ? [ficha.antecedentes.personales] : [],
        antecedentesFamiliares: ficha.antecedentes?.familiares ? [ficha.antecedentes.familiares] : [],
        hospitalizacionesPrevias: ficha.antecedentes?.hospitalizaciones ? 1 : 0
      }
    };
  }

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

  // ============== NAVEGACIÓN ==============
  goBack() {
    this.router.navigateByUrl('/tabs/tab2');
  }

  /**
   * Toggle edit mode for datos personales
   */
  editarDatosPersonales() {
    this.isEditMode = true;
    // Copy current data to editedData for editing
    if (this.ficha?.datosPersonales) {
      this.editedData = {
        telefono: this.ficha.datosPersonales.telefono,
        direccion: this.ficha.datosPersonales.direccion,
        grupoSanguineo: this.ficha.datosPersonales.grupoSanguineo
      };
    }
  }
  
  /**
   * Cancel editing and restore original data
   */
  cancelarEdicion() {
    this.isEditMode = false;
    this.editedData = {};
  }
  
  /**
   * Save edited patient data to Firestore
   */
  async guardarCambios() {
    if (!this.patientId) return;
    
    this.isLoading = true;
    
    try {
      // Update only the fields that can be edited
      const updateData: any = {};
      if (this.editedData.telefono) updateData.telefono = this.editedData.telefono;
      if (this.editedData.direccion) updateData.direccion = this.editedData.direccion;
      if (this.editedData.grupoSanguineo) updateData.grupoSanguineo = this.editedData.grupoSanguineo;
      
      await this.pacientesService.updatePaciente(this.patientId, updateData);
      
      // Reload patient data to reflect changes
      this.loadPatientData(this.patientId);
      
      this.isEditMode = false;
      this.editedData = {};
      
      // Show success toast
      const toast = await this.toastCtrl.create({
        message: 'Cambios guardados correctamente',
        duration: 2000,
        color: 'success',
        position: 'bottom'
      });
      await toast.present();
    } catch (error: any) {
      console.error('❌ Error saving changes:', error);
      this.error = 'Error al guardar los cambios: ' + (error.message || 'Desconocido');
      
      // Show error toast
      const toast = await this.toastCtrl.create({
        message: 'Error al guardar los cambios',
        duration: 3000,
        color: 'danger',
        position: 'bottom'
      });
      await toast.present();
    } finally {
      this.isLoading = false;
    }
  }

  verMedicamentos() {
    if (this.patientId) {
      this.router.navigate(['/tabs/tab4'], { 
        queryParams: { patientId: this.patientId } 
      });
    }
  }

  verExamenes() {
    if (this.patientId) {
      this.router.navigate(['/tabs/tab5'], { 
        queryParams: { patientId: this.patientId } 
      });
    }
  }

  /**
   * Open modal to create a new consultation
   */
  async nuevaConsulta() {
    if (!this.paciente || !this.fichaId) {
      await this.showToast('Error: No se pudo cargar la información del paciente', 'danger');
      return;
    }

    const modal = await this.modalCtrl.create({
      component: NuevaConsultaModalComponent,
      componentProps: {
        pacienteId: this.paciente.id,
        fichaMedicaId: this.fichaId,
        pacienteNombre: `${this.paciente.nombre} ${this.paciente.apellido}`
      }
    });

    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm' && data) {
      await this.guardarConsulta(data);
    }
  }

  /**
   * Save consultation to Firestore
   */
  private async guardarConsulta(consultaData: any) {
    try {
      const consultaId = await this.consultasService.createConsulta(consultaData);
      await this.showToast('Consulta guardada exitosamente', 'success');
      
      // Reload the medical record to show the new consultation
      this.refreshData();
    } catch (error) {
      console.error('Error saving consultation:', error);
      await this.showToast('Error al guardar la consulta', 'danger');
    }
  }

  /**
   * Show toast notification
   */
  private async showToast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'top',
      color
    });
    await toast.present();
  }

  // ============== UTILIDADES UI ==============
  badgeClass(criticidad: 'alta' | 'media' | 'baja') {
    return {
      'badge-alta': criticidad === 'alta',
      'badge-media': criticidad === 'media',
      'badge-baja': criticidad === 'baja'
    };
  }

  badgeColor(criticidad: 'alta' | 'media' | 'baja'): string {
    switch (criticidad) {
      case 'alta': return 'danger';
      case 'media': return 'warning';
      case 'baja': return 'secondary';
      default: return 'secondary';
    }
  }

  // Alias para compatibilidad con HTML
  getBadgeColor(criticidad: string): string {
    return this.badgeColor(criticidad as 'alta' | 'media' | 'baja');
  }

  verMedicacion() {
    if (this.patientId) {
      this.router.navigate(['/tabs/tab4'], { 
        queryParams: { patientId: this.patientId } 
      });
    }
  }

  estadoExamenColor(estado: string): string {
    switch (estado) {
      case 'normal': 
      case 'completado': return 'success';
      case 'atencion': 
      case 'en_proceso': return 'warning';
      case 'critico': 
      case 'solicitado': return 'danger';
      case 'pendiente': return 'warning';
      default: return 'medium';
    }
  }

  formatDate(date: Date | Timestamp | string | undefined): string {
    if (!date) return '';
    
    const d = date instanceof Timestamp 
      ? date.toDate() 
      : new Date(date);
    
    return d.toLocaleDateString('es-CL');
  }

  formatDateShort(date: Date | Timestamp | string | undefined): string {
    if (!date) return '';
    
    const d = date instanceof Timestamp 
      ? date.toDate() 
      : new Date(date);
    
    return d.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit' });
  }

  getExamenBadgeColor(estado: string): string {
    return this.estadoExamenColor(estado);
  }

  getExamenBadgeText(estado: string): string {
    switch (estado) {
      case 'normal': return 'Normal';
      case 'atencion': return 'Atención';
      case 'critico': return 'Crítico';
      case 'solicitado': return 'Solicitado';
      case 'pendiente': return 'Pendiente';
      case 'en_proceso': return 'En Proceso';
      case 'completado': return 'Completado';
      default: return estado;
    }
  }

  formatTime(time: string | Date | Timestamp): string {
    if (!time) return '';
    
    let date: Date;
    if (typeof time === 'string') {
      return time; // Already formatted
    } else if (time instanceof Timestamp) {
      date = time.toDate();
    } else {
      date = time;
    }
    
    return date.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
  }

  // ============== REFRESCAR DATOS ==============
  refreshData() {
    if (this.patientId) {
      this.loadPatientData(this.patientId);
    }
  }

  clearError() {
    this.error = null;
  }
  
  // ============== AVATAR UTILITIES ==============
  
  /**
   * Get initials for patient avatar
   */
  getInitials(nombre?: string, apellido?: string): string {
    return AvatarUtils.getInitials(nombre || '', apellido);
  }
  
  /**
   * Get avatar color for patient
   */
  getAvatarColor(nombre?: string, apellido?: string): string {
    return AvatarUtils.getAvatarColor(`${nombre || ''} ${apellido || ''}`);
  }
  
  /**
   * Get avatar style object
   */
  getAvatarStyle(nombre?: string, apellido?: string): any {
    return AvatarUtils.getAvatarStyle(nombre || '', apellido);
  }

  // ============== NOTAS RÁPIDAS ==============
  async guardarNota() {
    if (!this.nuevaNota.trim() || !this.patientId || !this.fichaId) return;
    
    try {
      // Get the most recent consultation to add note to
      const consultas = await this.consultasService.getConsultasByPaciente(this.patientId).toPromise();
      
      if (consultas && consultas.length > 0) {
        const consultaId = consultas[0].id!;
        await this.consultasService.addNotaRapida(consultaId, {
          texto: this.nuevaNota.trim(),
          autor: 'medico-general' // TODO: Get from auth
        });
        this.nuevaNota = '';
        this.refreshData();
      } else {
        // Si no hay consultas, crear una nueva solo para la nota
        await this.nuevaConsulta();
        // Note will be added after consultation is created
      }
    } catch (error) {
      console.error('Error guardando nota:', error);
      this.error = 'Error al guardar la nota';
    }
  }

  agregarNota() {
    this.guardarNota();
  }
}
