import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { HelperService } from './admin/helper.service';
import { GeneralParameterService } from './parameters/general-parameter/general-parameter.service';
import { UsuariosService } from './security/usuarios/usuarios.service';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';
import { UsuariosRolesService } from 'src/app/security/usuarios/usuarios-roles.service';
import { RolesFormularioService } from 'src/app/security/roles/rolesFormularios.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Moratex-frontend';

  public listSegurity: any[] = []
  public listParameter: any[] = []
  public listInventory: any[] = []
  public listSizing: any[] = []
  public listOperative: any[] = [];
  public listPqrs: any[] = [];
  public idFormulario!: any
  public listFormularios: any[] = [];
  public dataFormulario: any;

  public localStorage = localStorage;
  public document = document.location.origin
  public ocultarLogo = true;
  public innerWidth: number;
  public minWidth: number = 1000;
  public listMenus: any[] = localStorage.getItem("menu") == null || localStorage.getItem("menu") == undefined ?
    [] : JSON.parse(localStorage.getItem("menu")!);
  public listNotifications: [] = [];
  public user: any;

  constructor(
    private primeNgConfig: PrimeNGConfig,
    private helperService: HelperService,
    private http: HttpClient,
    private generalService: GeneralParameterService,
    private usuariosService: UsuariosService,
    private usuarioRoleService: UsuariosRolesService,
    private rolFormularioService: RolesFormularioService
  ) {
    this.innerWidth = window.innerWidth;
  }

  ngOnInit(): void {
    this.primeNgConfig.ripple = true;
    this.getListSegurity();
    this.getListParameter();
    this.getListInventory();
    this.getListSizing();
    this.getListOperative();
    this.getUserLogin();
    if (localStorage.getItem("token") != null) {
      this.cargarFormulario();
      this.loadNotifications().subscribe(res => {
        this.listNotifications = res.data;
      })
    }
  }

  private loadNotifications(): Observable<any> {
    let userId = this.localStorage.getItem("userId");
    return this.http.get<any>(`${environment.url}Notificaciones/lastnotifications/${userId}`);
  }

  public getClass(defaullt: string, variable: string) {
    return `nav-icon ${variable ? variable : defaullt}`
  }

  public logOut(): void {
    localStorage.clear();
  }

  public countNotifications() {
    return this.listNotifications.filter((l: any) => l.Estado).length;
  }

  public userLogin() {
    return this.user;
  }

  public getUserLogin() {
    this.user = localStorage.getItem("userName");
  }

  public cargarFormulario() {
    this.RolByUserId(localStorage.getItem('userId')).then((userRol) => {
      this.RolFormularioByRolId(userRol.data[0].rol_Id).then((rolFormulario) => {
        const observables = rolFormulario.data.map((rol:any) => {
          return this.generalService.getById("Formularios", rol.formulario_Id);
        });
  
        forkJoin(observables).subscribe((results) => {
          this.listFormularios = results.map((res: any) => ({
            id: res.data.id,
            textoMostrar: res.data.codigo + " - " + res.data.nombre
          }));
        });
      })
      .catch((error) => {
        console.error('Error al obtener el RolFormulario:', error);
      });
    })
    .catch((error) => {
      console.error('Error al obtener el rol:', error);
    });
  }

  selectFormulario(data: any) {
    if (data) {
      this.generalService.getById("Formularios", data.id).subscribe(res => {
        window.location.href = `${this.document}/${res.data.url}`;
      })
    }
  }

  RolByUserId(user_Id: any): Promise<any> {
    var data = new DatatableParameter();
    data.pageNumber = "1";
    data.pageSize = "10";
    data.filter = "";
    data.columnOrder = "";
    data.directionOrder = "";
    data.foreignKey = Number(user_Id);

    return new Promise((resolve, reject) => {
      this.usuarioRoleService.datatable(data).subscribe(
        (datos) => {
          resolve(datos);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  RolFormularioByRolId(rol_Id: any): Promise<any> {
    var data = new DatatableParameter();
    data.pageNumber = "1";
    data.pageSize = "50";
    data.filter = "";
    data.columnOrder = "";
    data.directionOrder = "";
    data.foreignKey = Number(rol_Id);

    return new Promise((resolve, reject) => {
      this.rolFormularioService.getAllRolesFormulario(data).subscribe(
        (datos) => {
          resolve(datos);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  public getListSegurity() {
    this.listSegurity = [
      { "Nombre": "Personas", "Ruta": "seguridad/personas" },
      { "Nombre": "Usuarios", "Ruta": "seguridad/usuarios" },
      { "Nombre": "Roles", "Ruta": "seguridad/roles" },
      { "Nombre": "Formularios", "Ruta": "seguridad/formularios" },
      { "Nombre": "Modulos", "Ruta": "seguridad/modulos" }
    ]
  }

  public getListParameter() {
    this.listParameter = [
      { "Nombre": "Bancos", "Ruta": "parametros/bancos" },
      { "Nombre": "Cargos", "Ruta": "parametros/cargos" },
      { "Nombre": "Paises", "Ruta": "parametros/paises" },
      { "Nombre": "Departamentos", "Ruta": "parametros/departamentos" },
      { "Nombre": "Ciudades", "Ruta": "parametros/ciudades" },
      { "Nombre": "Medidas", "Ruta": "parametros/medidas" },
      { "Nombre": "Proveedores", "Ruta": "parametros/proveedores" },
      { "Nombre": "Empresas", "Ruta": "parametros/empresas" },
      { "Nombre": "Empleados", "Ruta": "parametros/empleados" },
      { "Nombre": "Areas", "Ruta": "parametros/areas" },
      { "Nombre": "Sedes", "Ruta": "parametros/sedes" },
    ]
  }

  public getListInventory() {
    this.listInventory = [
      { "Nombre": "Unidades Medida", "Ruta": "inventario/unidades-medidas" },
      { "Nombre": "Marcas", "Ruta": "inventario/marcas" },
      { "Nombre": "Categorias", "Ruta": "inventario/categorias" },
      { "Nombre": "Tipos Estados", "Ruta": "inventario/tipos-estados" },
      { "Nombre": "Tipos Caracteristicas", "Ruta": "inventario/tipos-caracteristicas" },
      { "Nombre": "Productos", "Ruta": "inventario/productos" },
      { "Nombre": "Inventarios", "Ruta": "inventario/inventarios" },
      { "Nombre": "Estados", "Ruta": "inventario/estados" },

    ]
  }

  public getListSizing() {
    this.listSizing = [
      { "Nombre": "Modelos", "Ruta": "tallaje/modelos" },
      { "Nombre": "Generalidades", "Ruta": "tallaje/generalidades" },
      { "Nombre": "Tipos Prendas", "Ruta": "tallaje/tipos-prendas" },
      { "Nombre": "Tipos Piezas", "Ruta": "tallaje/tipos-piezas" },
      { "Nombre": "Tipos Tallas", "Ruta": "tallaje/tipos-tallas" },
      { "Nombre": "Tipos Operaciones", "Ruta": "tallaje/tipos-operaciones" },
      { "Nombre": "Piezas", "Ruta": "tallaje/piezas" },
      { "Nombre": "Tallas", "Ruta": "tallaje/tallas" },
      { "Nombre": "Pliegues", "Ruta": "tallaje/pliegues" },
      { "Nombre": "Cortes", "Ruta": "tallaje/cortes" },
      { "Nombre": "Costuras", "Ruta": "tallaje/costuras" },
      { "Nombre": "Prendas", "Ruta": "tallaje/prendas" },
      { "Nombre": "Criterios Aceptaciones", "Ruta": "tallaje/criterios-aceptaciones" },
      { "Nombre": "Tipos Criterios Aceptaciones", "Ruta": "tallaje/tipos-criterios-aceptaciones" },
    ]
  }

  public getListOperative() {
    this.listOperative = [
      { "Nombre": "Generar Cotización", "Ruta": "operativo/generar-cotizaciones" },
      // { "Nombre": "Cotizaciones Detales" , "Ruta": "operativo/cotizaciones-detalles" },
      // { "Nombre": "Pedidos" , "Ruta": "operativo/pedidos" },
      // { "Nombre": "Pedidos Detalles" , "Ruta": "operativo/pedidos-detalles" },
    ]
  }

  public getlistPqrs() {
    this.listPqrs = [
      { "Nombre": "Medios", "Ruta": "pqrs/medios" },
      { "Nombre": "Tipos Radicados", "Ruta": "pqrs/tiposRadicados" },
      { "Nombre": "Radicados", "Ruta": "pqrs/radicado" },
    ]
  }

  public scrollTop() {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }
}
