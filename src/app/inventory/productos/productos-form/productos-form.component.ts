import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HelperService, Messages, MessageType, } from 'src/app/admin/helper.service';
import { ArchivoService } from 'src/app/parameters/archivo/archivo.service';
import { GeneralParameterService } from '../../../parameters/general-parameter/general-parameter.service';
import { ProductosService } from '../productos.service';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';
import { EmpleadosService } from 'src/app/parameters/empleados/empleados.service';

@Component({
  selector: 'app-productos-form',
  templateUrl: './productos-form.component.html',
  styleUrls: ['./productos-form.component.css'],
})

export class ProductosFormComponent implements OnInit {
  public frmProductos: FormGroup;
  public statusForm: boolean = true;
  public id!: number;
  public dataArchivo: any = undefined;

  public botones = ['btn-guardar', 'btn-cancelar'];
  public titulo = '';
  public listCategorias = [];
  public listUnidadesMedidas = [];
  public checkMax: boolean = false;

  public img = '../../../../assets/imagen-producto.png';

  constructor(
    public routerActive: ActivatedRoute,
    private service: ProductosService,
    private helperService: HelperService,
    private categoriasservice: GeneralParameterService,
    private unidadesMedidasservice: GeneralParameterService,
    private ArchivoService: ArchivoService,
    private empleadoService: EmpleadosService
  ) {
    this.frmProductos = new FormGroup({
      Minimo: new FormControl(null, [Validators.required, Validators.pattern(/^([0-9])*$/),]),
      Maximo: new FormControl(null, [Validators.required, Validators.pattern(/^([0-9])*$/),]),
      PrecioCosto: new FormControl(null, [Validators.required, Validators.pattern(/^([0-9])*$/),]),
      Codigo: new FormControl(null, [Validators.required, Validators.maxLength(20),]),
      Nombre: new FormControl(null, [Validators.required, Validators.maxLength(100),]),
      CaracteristicaData: new FormControl(null, [Validators.required, Validators.maxLength(500),]),
      ProductoTerminado: new FormControl(false, [Validators.required]),
      Estado: new FormControl(true, [Validators.required]),
      Categoria_Id: new FormControl(null, [Validators.required]),
      UnidadMedida_Id: new FormControl(null, [Validators.required]),
      ImagenProductoId: new FormControl(null),
      Empleado_Id: new FormControl(null, [Validators.required]),
    });
    this.routerActive.params.subscribe((e) => (this.id = e.id));
  }

  ngOnInit(): void {
    if (this.id != undefined && this.id != null) {
      this.titulo = 'Editar producto';
      this.service.getById(this.id).subscribe((l) => {
        this.frmProductos.controls.Minimo.setValue(l.data.minimo);
        this.frmProductos.controls.Maximo.setValue(l.data.maximo);
        this.frmProductos.controls.PrecioCosto.setValue(l.data.precioCosto);
        this.frmProductos.controls.Codigo.setValue(l.data.codigo);
        this.frmProductos.controls.Nombre.setValue(l.data.nombre);
        this.frmProductos.controls.CaracteristicaData.setValue(
          l.data.caracteristicaData
        );
        this.frmProductos.controls.ProductoTerminado.setValue(
          l.data.productoTerminado
        );
        this.frmProductos.controls.Estado.setValue(l.data.estado);
        this.frmProductos.controls.Categoria_Id.setValue(l.data.categoria_Id);
        this.frmProductos.controls.UnidadMedida_Id.setValue(
          l.data.unidadMedida_Id
        );

        if (l.data.ImagenProductoId > 0) {
          this.ArchivoService.getArchivoById(l.data.ImagenProductoId).subscribe(
            ({ data }) => {
              this.img = data.archivo;
              this.frmProductos.controls.ImagenProductoId.setValue(data.id);
            }
          );
        }
      });
    } else {
      this.titulo = 'Crear producto';
    }
    this.cargarListas();
  }

  cargarListas() {
    this.categoriasservice.getAll('Categorias').subscribe((res) => {
      this.listCategorias = res.data;
    });

    this.unidadesMedidasservice.getAll('UnidadesMedidas').subscribe((res) => {
      this.listUnidadesMedidas = res.data;
    });

    this.cargarEmpleado();
  }

  cargarEmpleado() {
    var persona_Id = localStorage.getItem("persona_Id");

    var data = new DatatableParameter();
    data.pageNumber = "1";
    data.pageSize = "10";
    data.filter = "";
    data.columnOrder = "";
    data.directionOrder = "";
    data.foreignKey = Number(persona_Id);

    this.empleadoService.getAllEmpleados(data).subscribe(res => {
      this.frmProductos.controls.Empleado_Id.setValue(res.data[0].id);
    });
  }

  save() {
    if (this.frmProductos.invalid) {
      this.statusForm = false;
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }

    if (this.id != undefined && this.id != null) {
      if (this.dataArchivo != undefined) {
        if (this.frmProductos.controls.ImagenProductoId.value) {
          this.ArchivoService.delete(
            this.frmProductos.controls.ImagenProductoId.value
          ).subscribe(() => { });
        }
        this.ArchivoService.save(this.dataArchivo).subscribe((l) => {
          if (l.status != 'Error') {
            this.helperService.showMessage(
              MessageType.SUCCESS,
              Messages.SAVESUCCESS
            );
            this.frmProductos.controls.ImagenProductoId.setValue(l.data.id);
            this.guardarProducto();
          } else {
            this.helperService.showMessage(
              MessageType.ERROR,
              Messages.SAVEERROR
            );
          }
        });
      } else {
        this.guardarProducto();
      }
    } else {
      if (this.dataArchivo != undefined) {
        this.ArchivoService.save(this.dataArchivo).subscribe((l) => {
          if (l.status != 'Error') {
            this.helperService.showMessage(
              MessageType.SUCCESS,
              Messages.SAVESUCCESS
            );
            this.frmProductos.controls.ImagenProductoId.setValue(l.data.id);
          } else {
            this.helperService.showMessage(
              MessageType.ERROR,
              Messages.SAVEERROR
            );
          }
        });
      }
      this.guardarProducto();
    }
  }

  guardarProducto() {
    let data = {
      id: this.id ?? 0,
      ...this.frmProductos.value,
    };

    this.service.save(this.id, data).subscribe((l) => {
      if (!l.status) {
        this.helperService.showMessage(MessageType.ERROR, Messages.SAVEERROR);
      } else {
        this.helperService.showMessage(
          MessageType.SUCCESS,
          Messages.SAVESUCCESS
        );
        this.cancel();
      }
    });
  }

  cancel() {
    this.helperService.redirectApp('inventario/productos/');
  }

  chececkMaxAndMin() {
    if (
      this.frmProductos.controls.Minimo.value >
      this.frmProductos.controls.Maximo.value
    ) {
      this.checkMax = true;
    } else {
      this.checkMax = false;
    }
  }

  fileEvent(event: any) {
    let archivo: any;
    let type = event.target.files[0].type.split('/')[1];
    let { name } = event.target.files[0];
    if (type == 'png' || type == 'jpeg' || type == 'jpg') {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = async (e: any) => {
        archivo = await e.target.result; //imagen en base 64
        this.dataArchivo = {
          Tabla: 'Prenda',
          TablaId: 1,
          Extension: type,
          Archivo: archivo,
          Nombre: name,
          Estado: true,
        };
        this.img = archivo;
      };
    }
  }
}
