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