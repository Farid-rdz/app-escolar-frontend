import { Component, inject, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { MaestrosService } from '../../services/maestros-service';
import { DatosMaestro } from '../../interfaces/usuarios.interfaces';

@Component({
  selector: 'app-registro-maestros',
  imports: [
    ...SHARED_IMPORTS,
  ],
  templateUrl: './registro-maestros.html',
  styleUrl: './registro-maestros.scss',
})
export class RegistroMaestros implements OnInit {
  @Input() rol: string = '';
  @Input() datos_user: DatosMaestro = {} as DatosMaestro;

  // Inyección de dependencias
  private location = inject(Location);
  public maestrosService = inject(MaestrosService);

  // Variables para el formulario y control de vista
  public maestro: DatosMaestro = {} as DatosMaestro;
  public errors: Record<string, string> = {};
  public editar: boolean = false;
  public idUser: number = 0;

  // Límites para el datepicker de maestros (18 a 100 años)
  public minDateMaestro!: Date;
  public maxDateMaestro!: Date;

  // Control para mostrar u ocultar contraseñas
  public hide_1: boolean = false;
  public hide_2: boolean = false;
  public inputType_1: string = 'password';
  public inputType_2: string = 'password';

  // Catálogos obtenidos desde el servicio
  public materiasDisponibles: string[] = [];
  public areasInvestigacion = this.maestrosService.areasInvestigacion;

  ngOnInit(): void {
    // 1. Configurar límites de fecha
    const today = new Date();
    const currentYear = today.getFullYear();

    // Fijamos mes 11 (diciembre) y día 31
    const maxYear = currentYear - 20;
    this.maxDateMaestro = new Date(maxYear, 11, 31);

    // Fijamos mes 0 (enero) y día 1 para permitir desde el inicio de ese año
    const minYear = currentYear - 100;
    this.minDateMaestro = new Date(minYear, 0, 1);

    this.materiasDisponibles = this.maestrosService.catalogoMaterias;

    if (this.datos_user && (this.datos_user.id || this.datos_user.id_trabajador)) {
      this.editar = true;
      this.idUser = Number(this.datos_user.id || 0);
      this.maestro = {
        ...this.datos_user,
        materias_json: this.datos_user.materias_json || [],
      };
    } else {
      this.maestro = this.maestrosService.esquemaMaestro();
    }
  }

  // Manejo de la selección de checkboxes para materias (DRY)
  public onCheckboxChange(event: Event, materia: string): void {
    const checkbox = event.target as HTMLInputElement;
    if (!this.maestro.materias_json) {
      this.maestro.materias_json = [];
    }

    if (checkbox.checked) {
      this.maestro.materias_json.push(materia);
    } else {
      this.maestro.materias_json = this.maestro.materias_json.filter((m) => m !== materia);
    }
  }

  // Comprobar si una materia está seleccionada (para modo edición)
  public isMateriaSeleccionada(materia: string): boolean {
    return !!this.maestro.materias_json && this.maestro.materias_json.includes(materia);
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

  // Filtro de solo letras
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

  // Regresar
  public regresar(): void {
    this.location.back();
  }

  // Registro del maestro (Validación pura sin redirecciones prematuras ni alertas de login)
  public registrar(): void {
    this.errors = {};
    this.errors = this.maestrosService.validarMaestro(this.maestro, this.editar);

    console.log('Errores de validación maestro:', this.errors);

    if (Object.keys(this.errors).length > 0) {
      return;
    }

    console.log('Datos del maestro válidos listos para enviar:', this.maestro);
    // TODO: En fases posteriores se conectará con el endpoint del backend HTTP
  }

  // Actualización del maestro
  public actualizar(): void {
    this.errors = {};
    this.errors = this.maestrosService.validarMaestro(this.maestro, this.editar);

    if (Object.keys(this.errors).length > 0) {
      return;
    }

    console.log('Datos actualizados del maestro:', this.maestro);
  }
}
