import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  getDocs,
} from '@angular/fire/firestore';
import { Observable, combineLatest, map, from } from 'rxjs';
import { PacientesService } from '../../pacientes/data/pacientes.service';
import { ConsultasService } from '../../consultas/data/consultas.service';
import { ExamenesService } from '../../examenes/data/examenes.service';
import { MedicamentosService } from '../../medicamentos/data/medicamentos.service';

export interface DashboardStats {
  consultasHoy: number;
  pacientesActivos: number;
  examenPendientes: number;
  alertasCriticas: number;
}

export interface ConsultasPorEspecialidad {
  especialidad: string;
  cantidad: number;
}

export interface AlertaDashboard {
  id: string;
  tipo: 'paciente' | 'examen' | 'medicamento' | 'sistema';
  titulo: string;
  descripcion: string;
  severidad: 'baja' | 'media' | 'alta' | 'critica';
  fecha: Date;
  pacienteId?: string;
  pacienteNombre?: string;
}

export interface AccionRapida {
  id: string;
  titulo: string;
  descripcion: string;
  icono: string;
  ruta: string;
  color: string;
}

export interface ActividadReciente {
  id: string;
  tipo: 'consulta' | 'examen' | 'medicamento' | 'paciente';
  titulo: string;
  descripcion: string;
  fecha: Date;
  icono: string;
}

/**
 * Dashboard Service - Aggregates data from multiple services
 * Provides KPIs, alerts, recent activity, and quick actions for the dashboard
 */
@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private firestore = inject(Firestore);
  private pacientesService = inject(PacientesService);
  private consultasService = inject(ConsultasService);
  private examenesService = inject(ExamenesService);
  private medicamentosService = inject(MedicamentosService);

  /**
   * Get dashboard statistics (KPIs)
   */
  getDashboardStats(): Observable<DashboardStats> {
    return from(this.getDashboardStatsAsync());
  }

  private async getDashboardStatsAsync(): Promise<DashboardStats> {
    const [consultasHoy, pacientesActivos, examenPendientes, alertasCriticas] = await Promise.all([
      this.consultasService.getConsultationsCountToday(),
      this.pacientesService.getActivePatientsCount(),
      this.examenesService.getPendingExamOrdersCount(),
      this.examenesService.getCriticalExamsCount(),
    ]);

    return {
      consultasHoy,
      pacientesActivos,
      examenPendientes,
      alertasCriticas,
    };
  }

  /**
   * Get consultations by specialty for today
   * Note: This is a simplified version. In production, you'd need to:
   * 1. Add specialty field to Consulta model
   * 2. Or join with Profesional data to get specialty
   */
  async getConsultasPorEspecialidad(): Promise<ConsultasPorEspecialidad[]> {
    // TODO: Implement proper specialty tracking
    // For now, return mock data structure
    return [
      { especialidad: 'Medicina General', cantidad: 0 },
      { especialidad: 'Pediatría', cantidad: 0 },
      { especialidad: 'Cardiología', cantidad: 0 },
    ];
  }

  /**
   * Get critical alerts for dashboard
   * Aggregates alerts from patients, exams, and medications
   */
  getDashboardAlerts(): Observable<AlertaDashboard[]> {
    return combineLatest([
      this.pacientesService.getPacientesWithAlerts(),
      this.examenesService.getOrdenesConResultadosCriticos(),
    ]).pipe(
      map(([pacientesConAlertas, ordenesConAlertas]) => {
        const alertas: AlertaDashboard[] = [];

        // Patient alerts (allergies, chronic diseases)
        pacientesConAlertas.slice(0, 5).forEach(paciente => {
          if (paciente.alertasMedicas && paciente.alertasMedicas.length > 0) {
            const alertaMasReciente = paciente.alertasMedicas[0];
            alertas.push({
              id: `paciente-${paciente.id}`,
              tipo: 'paciente',
              titulo: `Alerta: ${paciente.nombre} ${paciente.apellido}`,
              descripcion: alertaMasReciente.descripcion,
              severidad: alertaMasReciente.severidad,
              fecha: alertaMasReciente.fechaRegistro instanceof Timestamp
                ? alertaMasReciente.fechaRegistro.toDate()
                : new Date(alertaMasReciente.fechaRegistro as any),
              pacienteId: paciente.id,
              pacienteNombre: `${paciente.nombre} ${paciente.apellido}`,
            });
          }
        });

        // Exam alerts (critical results from orden examen)
        ordenesConAlertas.slice(0, 5).forEach(orden => {
          const alertaData = (orden as any).alerta;
          if (alertaData && alertaData.esCritico) {
            alertas.push({
              id: `orden-${orden.id}`,
              tipo: 'examen',
              titulo: `Examen crítico`,
              descripcion: alertaData.razon || 'Valores fuera de rango',
              severidad: alertaData.severidad || 'alta',
              fecha: orden.fecha instanceof Timestamp
                ? orden.fecha.toDate()
                : new Date(orden.fecha as any),
              pacienteId: orden.idPaciente,
            });
          }
        });

        // Sort by date (most recent first) and severity
        return alertas
          .sort((a, b) => {
            const severityOrder = { critica: 4, alta: 3, media: 2, baja: 1 };
            const severityDiff = severityOrder[b.severidad] - severityOrder[a.severidad];
            if (severityDiff !== 0) return severityDiff;
            return b.fecha.getTime() - a.fecha.getTime();
          })
          .slice(0, 10); // Top 10 alerts
      })
    );
  }

  /**
   * Get quick actions for dashboard
   */
  getQuickActions(): AccionRapida[] {
    return [
      {
        id: 'nuevo-paciente',
        titulo: 'Nuevo Paciente',
        descripcion: 'Registrar nuevo paciente en el sistema',
        icono: 'person-add-outline',
        ruta: '/tabs/tab2', // Navigate to patients tab
        color: 'primary',
      },
      {
        id: 'buscar-paciente',
        titulo: 'Buscar Paciente',
        descripcion: 'Buscar y ver fichas médicas',
        icono: 'search-outline',
        ruta: '/tabs/tab2',
        color: 'secondary',
      },
      {
        id: 'nueva-consulta',
        titulo: 'Nueva Consulta',
        descripcion: 'Registrar consulta médica',
        icono: 'document-text-outline',
        ruta: '/tabs/tab3',
        color: 'tertiary',
      },
      {
        id: 'orden-examen',
        titulo: 'Orden de Examen',
        descripcion: 'Crear nueva orden de examen',
        icono: 'flask-outline',
        ruta: '/tabs/tab5',
        color: 'success',
      },
      {
        id: 'nueva-receta',
        titulo: 'Nueva Receta',
        descripcion: 'Prescribir medicamentos',
        icono: 'medical-outline',
        ruta: '/tabs/tab4',
        color: 'warning',
      },
    ];
  }

  /**
   * Get recent activity feed
   * Combines recent consultations, exams, and prescriptions
   */
  getRecentActivity(): Observable<ActividadReciente[]> {
    return combineLatest([
      this.consultasService.getRecentConsultations(5),
      // Add more streams as needed
    ]).pipe(
      map(([consultas]) => {
        const actividades: ActividadReciente[] = [];

        // Recent consultations
        consultas.forEach(consulta => {
          actividades.push({
            id: `consulta-${consulta.id}`,
            tipo: 'consulta',
            titulo: 'Consulta registrada',
            descripcion: consulta.motivo || 'Sin motivo especificado',
            fecha: consulta.fecha instanceof Timestamp
              ? consulta.fecha.toDate()
              : new Date(consulta.fecha as any),
            icono: 'document-text-outline',
          });
        });

        // Sort by date (most recent first)
        return actividades
          .sort((a, b) => b.fecha.getTime() - a.fecha.getTime())
          .slice(0, 10); // Top 10 activities
      })
    );
  }

  /**
   * Get monthly statistics for charts/graphs
   */
  async getMonthlyStats(): Promise<{
    consultas: number;
    pacientesNuevos: number;
    examenes: number;
  }> {
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    firstDayOfMonth.setHours(0, 0, 0, 0);
    
    const lastDayOfMonth = new Date();
    lastDayOfMonth.setMonth(lastDayOfMonth.getMonth() + 1);
    lastDayOfMonth.setDate(0);
    lastDayOfMonth.setHours(23, 59, 59, 999);

    const [consultas, examenes] = await Promise.all([
      this.consultasService.getConsultationsCountByDateRange(firstDayOfMonth, lastDayOfMonth),
      this.examenesService.getExamCountByDateRange(firstDayOfMonth, lastDayOfMonth),
    ]);

    // Get new patients this month
    const pacientesRef = collection(this.firestore, 'pacientes');
    const q = query(
      pacientesRef,
      where('createdAt', '>=', Timestamp.fromDate(firstDayOfMonth)),
      where('createdAt', '<=', Timestamp.fromDate(lastDayOfMonth))
    );
    const pacientesSnapshot = await getDocs(q);

    return {
      consultas,
      pacientesNuevos: pacientesSnapshot.size,
      examenes,
    };
  }

  /**
   * Get patients with upcoming appointments (if appointment system is implemented)
   * Placeholder for future functionality
   */
  getPacientesConCitasProximas(): Observable<any[]> {
    // TODO: Implement when appointment system is added
    return from(Promise.resolve([]));
  }

  /**
   * Search across all entities (patients, consultations, exams)
   * Global search functionality
   */
  globalSearch(searchTerm: string): Observable<{
    pacientes: any[];
    consultas: any[];
    examenes: any[];
  }> {
    return combineLatest([
      this.pacientesService.searchPacientes(searchTerm),
      // Add more search streams as needed
    ]).pipe(
      map(([pacientes]) => ({
        pacientes,
        consultas: [], // TODO: Implement consultation search
        examenes: [], // TODO: Implement exam search
      }))
    );
  }
}
