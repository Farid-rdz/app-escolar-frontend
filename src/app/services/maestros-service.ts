import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth-service';
import { ErrorsService } from './tools/errors-service';
import { ValidatorService } from './tools/validator-service';
import { DatosMaestro } from '../interfaces/usuarios.interfaces';

@Injectable({
  providedIn: 'root',
})
export class MaestrosService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private validatorService = inject(ValidatorService);
  private errorService = inject(ErrorsService);

  // Catálogo de materias
  public readonly catalogoMaterias: string[] = [
    'Aplicaciones Web',
    'Programación 1',
    'Bases de datos',
    'Tecnologías Web',
    'Minería de datos',
    'Desarrollo móvil',
    'Estructuras de datos',
    'Administración de redes',
    'Ingeniería de Software',
    'Administración de S.O.',
  ];

  // Catálogo de Áreas de Investigación
  public readonly areasInvestigacion = [
    { id: 1, nombre: 'Desarrollo de Software y Arquitecturas Web' },
    { id: 2, nombre: 'Inteligencia Artificial y Ciencia de Datos' },
    { id: 3, nombre: 'Redes, Ciberseguridad y Sistemas Distribuidos' },
    { id: 4, nombre: 'Sistemas Embebidos e Internet de las Cosas (IoT)' },
  ];

  // Headers de autenticación
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getSessionToken();
    return token
      ? new HttpHeaders({ 'Content-Type': 'application/json', Authorization: `Bearer ${token}` })
      : new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  // Esquema inicial con valores por defecto para un nuevo maestro
  public esquemaMaestro(): DatosMaestro {
    return {
      id_trabajador: '',
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirmar_password: '',
      fecha_nacimiento: '',
      telefono: '',
      rfc: '',
      cubiculo: '',
      area_investigacion: '',
      materias_json: [],
    };
  }

  // Validación centralizada reutilizando ValidatorService y ErrorsService (DRY)
  public validarMaestro(data: DatosMaestro, editar: boolean = false): Record<string, string> {
    const error: Record<string, string> = {};

    if (!this.validatorService.required(data.id_trabajador)) {
      error['id_trabajador'] = this.errorService.required;
    }

    if (!this.validatorService.required(data.first_name)) {
      error['first_name'] = this.errorService.required;
    }

    if (!this.validatorService.required(data.last_name)) {
      error['last_name'] = this.errorService.required;
    }

    if (!this.validatorService.required(data.email)) {
      error['email'] = this.errorService.required;
    } else if (!this.validatorService.max(data.email, 40)) {
      error['email'] = this.errorService.max(40);
    } else if (!this.validatorService.email(data.email)) {
      error['email'] = this.errorService.email;
    }

    if (!editar) {
      if (!this.validatorService.required(data.password)) {
        error['password'] = this.errorService.required;
      }
      if (!this.validatorService.required(data.confirmar_password)) {
        error['confirmar_password'] = this.errorService.required;
      }
    }

    if (data.password && data.confirmar_password && data.password !== data.confirmar_password) {
      error['confirmar_password'] = 'Las contraseñas no coinciden';
    }

    if (!this.validatorService.required(data.fecha_nacimiento)) {
      error['fecha_nacimiento'] = this.errorService.required;
    }

    if (!this.validatorService.required(data.telefono)) {
      error['telefono'] = this.errorService.required;
    }

    if (!this.validatorService.required(data.rfc)) {
      error['rfc'] = this.errorService.required;
    } else if (!this.validatorService.min(data.rfc, 12)) {
      error['rfc'] = this.errorService.min(12);
    } else if (!this.validatorService.max(data.rfc, 13)) {
      error['rfc'] = this.errorService.max(13);
    }

    if (!this.validatorService.required(data.cubiculo)) {
      error['cubiculo'] = this.errorService.required;
    }

    if (!this.validatorService.required(data.area_investigacion)) {
      error['area_investigacion'] = this.errorService.required;
    }

    if (!data.materias_json || data.materias_json.length === 0) {
      error['materias_json'] = 'Debe seleccionar al menos una materia a impartir';
    }

    return error;
  }
}
