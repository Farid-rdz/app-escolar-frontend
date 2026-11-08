// Creamos estas interfaces para mantener más limpio el código
// También para dividirlo por tipo de usuario
// La ventaja es que se pueden importar y ya no se ven tan largas las clases de los servicios

// Interfaz datos de usuario de administrador
export interface DatosAdministrador {
  rol: string;
  clave_admin: string;
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
  confirmar_password?: string;
  telefono: string;
  rfc: string;
  edad: number;
  ocupacion: string;
}

// Interfaz datos de usuario de maestro
export interface DatosMaestro {
  id?: number;
  id_trabajador: string | number;
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
  confirmar_password?: string;
  fecha_nacimiento: string;
  telefono: string;
  rfc: string;
  cubiculo: string;
  area_investigacion: string | number;
  materias_json?: string[];
}

// Interfaz datos de usuario de alumno
export interface DatosAlumno {
  id?: number;
  matricula: string | number;
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
  confirmar_password?: string;
  fecha_nacimiento: string;
  curp: string;
  rfc: string;
  edad: number;
  telefono: string;
  ocupacion: string;
}
