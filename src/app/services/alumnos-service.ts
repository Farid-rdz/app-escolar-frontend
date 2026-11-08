import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth-service';
import { ErrorsService } from './tools/errors-service';
import { ValidatorService } from './tools/validator-service';
import { DatosAlumno } from '../interfaces/usuarios.interfaces';

@Injectable({
  providedIn: 'root',
})
export class AlumnosService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private validatorService = inject(ValidatorService);
  private errorService = inject(ErrorsService);

  // Headers de autenticación para futuras peticiones HTTP
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getSessionToken();
    return token
      ? new HttpHeaders({ 'Content-Type': 'application/json', Authorization: `Bearer ${token}` })
      : new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  // Esquema inicial con valores por defecto para un nuevo alumno
  public esquemaAlumno(): DatosAlumno {
    return {
      matricula: '',
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirmar_password: '',
      fecha_nacimiento: '',
      curp: '',
      rfc: '',
      edad: 0,
      telefono: '',
      ocupacion: '',
    };
  }

  // Validación centralizada reutilizando ValidatorService y ErrorsService (DRY)
  public validarAlumno(data: DatosAlumno, editar: boolean = false): Record<string, string> {
    const error: Record<string, string> = {};

    if (!this.validatorService.required(data.matricula)) {
      error['matricula'] = this.errorService.required;
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

    //validación de que las contraseñas coincidan
    if (data.password && data.confirmar_password && data.password !== data.confirmar_password) {
      error['confirmar_password'] = 'Las contraseñas no coinciden';
    }

    if (!this.validatorService.required(data.fecha_nacimiento)) {
      error['fecha_nacimiento'] = this.errorService.required;
    }

    // Simplificación de CURP: únicamente requerida y validación básica de longitud (como en Administrador)
    if (!this.validatorService.required(data.curp)) {
      error['curp'] = this.errorService.required;
    }

    if (!this.validatorService.required(data.rfc)) {
      error['rfc'] = this.errorService.required;
    } else if (!this.validatorService.min(data.rfc, 12)) {
      error['rfc'] = this.errorService.min(12);
    } else if (!this.validatorService.max(data.rfc, 13)) {
      error['rfc'] = this.errorService.max(13);
    }

    if (!this.validatorService.required(data.edad)) {
      error['edad'] = this.errorService.required;
    } else if (!this.validatorService.numeric(data.edad)) {
      error['edad'] = 'El formato es solo números';
    } else if (Number(data.edad) < 15) {
      error['edad'] = 'La edad debe ser mayor o igual a 15';
    }

    if (!this.validatorService.required(data.telefono)) {
      error['telefono'] = this.errorService.required;
    }

    if (!this.validatorService.required(data.ocupacion)) {
      error['ocupacion'] = this.errorService.required;
    }

    return error;
  }
}
