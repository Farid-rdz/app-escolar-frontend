import { Component, inject, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { AlumnosService } from '../../services/alumnos-service';
import { DatosAlumno } from '../../interfaces/usuarios.interfaces';

@Component({
  selector: 'app-registro-alumnos',
  imports: [
    ...SHARED_IMPORTS,
  ],
  templateUrl: './registro-alumnos.html',
  styleUrl: './registro-alumnos.scss',
})
export class RegistroAlumnos implements OnInit {
  @Input() rol: string = '';
  @Input() datos_user: DatosAlumno = {} as DatosAlumno;

  // Inyección de dependencias
  private location = inject(Location);
  private alumnosService = inject(AlumnosService);

  // Variables para el formulario
  public alumno: DatosAlumno = {} as DatosAlumno;
  public errors: Record<string, string> = {};
  public editar: boolean = false;
  public idUser: number = 0;

  // Límites para el datepicker de alumnos (15 a 100 años)
  public minDateAlumno!: Date;
  public maxDateAlumno!: Date;

  // Control visual para ver / ocultar contraseñas
  public hide_1: boolean = false;
  public hide_2: boolean = false;
  public inputType_1: string = 'password';
  public inputType_2: string = 'password';

  ngOnInit(): void {
    // 1. Configurar límites de fecha
    const today = new Date();
    const currentYear = today.getFullYear();

    // Fijamos mes 11 (diciembre) y día 31
    const maxYear = currentYear - 15;
    this.maxDateAlumno = new Date(maxYear, 11, 31);

    // Fijamos mes 0 (enero) y día 1 para permitir desde el inicio de ese año
    const minYear = currentYear - 100;
    this.minDateAlumno = new Date(minYear, 0, 1);

    // Si viene información previa, activamos modo edición
    if (this.datos_user && (this.datos_user.id || this.datos_user.matricula)) {
      this.editar = true;
      this.idUser = Number(this.datos_user.id || 0);
      this.alumno = { ...this.datos_user };
    } else {
      // Inicializar con el esquema por defecto del servicio
      this.alumno = this.alumnosService.esquemaAlumno();
    }
  }

  // Alternar visibilidad de contraseña
  public showPassword(): void {
    if (this.inputType_1 === 'password') {
      this.inputType_1 = 'text';
      this.hide_1 = true;
    } else {
      this.inputType_1 = 'password';
      this.hide_1 = false;
    }
  }

  // Alternar visibilidad de confirmación de contraseña
  public showPwdConfirmar(): void {
    if (this.inputType_2 === 'password') {
      this.inputType_2 = 'text';
      this.hide_2 = true;
    } else {
      this.inputType_2 = 'password';
      this.hide_2 = false;
    }
  }

  // Filtro de solo letras para campos de nombre y apellido
  public soloLetras(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);
    if (
      !(charCode >= 65 && charCode <= 90) &&
      !(charCode >= 97 && charCode <= 122) &&
      charCode !== 32
    ) {
      event.preventDefault();
    }
  }

  // Regresar a la pantalla previa
  public regresar(): void {
    this.location.back();
  }

  // Registro del alumno (Validación pura sin redirecciones prematuras ni alertas de login)
  public registrar(): void {
    this.errors = {};
    this.errors = this.alumnosService.validarAlumno(this.alumno, this.editar);

    console.log('Errores de validación alumno:', this.errors);

    // Si existen errores, se detiene el proceso
    if (Object.keys(this.errors).length > 0) {
      return;
    }

    console.log('Datos del alumno válidos listos para enviar:', this.alumno);
    // TODO: En fases posteriores se conectará con el endpoint del backend HTTP
  }

  // Actualización del alumno
  public actualizar(): void {
    this.errors = {};
    this.errors = this.alumnosService.validarAlumno(this.alumno, this.editar);

    if (Object.keys(this.errors).length > 0) {
      return;
    }

    console.log('Datos actualizados del alumno:', this.alumno);
  }
}
