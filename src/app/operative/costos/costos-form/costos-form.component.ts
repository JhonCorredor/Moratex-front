import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  HelperService,
  Messages,
  MessageType,
} from 'src/app/admin/helper.service';
import { ArchivoService } from 'src/app/parameters/archivo/archivo.service';
import { GeneralParameterService } from '../../../parameters/general-parameter/general-parameter.service';
import { CostosService } from '../costos.service';

@Component({
  selector: 'app-costos-form',
  templateUrl: './costos-form.component.html',
  styleUrls: ['./costos-form.component.css'],
})
export class CostosFormComponent implements OnInit {
  public frmCostos: FormGroup;
  public statusForm: boolean = true;
  public id!: number;
  public botones = ['btn-guardar', 'btn-cancelar'];
  public titulo = '';
  public listMarcas = [];
  public listCategorias = [];
  public listUnidadesMedidas = [];
  public checkMax: boolean = false;

  public img = '../../../../assets/imagen-producto.png';
  public dataArchivo: any = undefined;

  constructor(
    public routerActive: ActivatedRoute,
    private service: CostosService,
    private helperService: HelperService,
    private marcasservice: GeneralParameterService,
    private categoriasservice: GeneralParameterService,
    private unidadesMedidasservice: GeneralParameterService,
    private ArchivoService: ArchivoService
  ) {
    this.frmCostos = new FormGroup({
      Minimo: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^([0-9])*$/),
      ]),
      Maximo: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^([0-9])*$/),
      ]),
      PrecioCosto: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^([0-9])*$/),
      ]),
      Codigo: new FormControl(null, [
        Validators.required,
        Validators.maxLength(20),
      ]),
      Nombre: new FormControl(null, [
        Validators.required,
        Validators.maxLength(100),
      ]),
      CaracteristicaData: new FormControl(null, [
        Validators.required,
        Validators.maxLength(500),
      ]),
      ProductoTerminado: new FormControl(null),
      Estado: new FormControl(true, Validators.required),
      Categoria_Id: new FormControl(null, Validators.required),
      UnidadMedida_Id: new FormControl(null, Validators.required),
      ImagenProductoId: new FormControl(null),
    });
    this.routerActive.params.subscribe((l) => (this.id = l.id));
  }

  ngOnInit(): void {
    if (this.id != undefined && this.id != null) {
      this.titulo = 'Editar insumo';
      this.service.getById(this.id).subscribe((l) => {
        this.frmCostos.controls.Minimo.setValue(l.data.minimo);
        this.frmCostos.controls.Maximo.setValue(l.data.maximo);
        this.frmCostos.controls.PrecioCosto.setValue(l.data.precioCosto);
        this.frmCostos.controls.Codigo.setValue(l.data.codigo);
        this.frmCostos.controls.Nombre.setValue(l.data.nombre);
        this.frmCostos.controls.CaracteristicaData.setValue(
          l.data.caracteristicaData
        );
        this.frmCostos.controls.ProductoTerminado.setValue(
          l.data.productoTerminado
        );
        this.frmCostos.controls.Estado.setValue(l.data.estado);
        this.frmCostos.controls.Categoria_Id.setValue(l.data.categoria_Id);
        this.frmCostos.controls.UnidadMedida_Id.setValue(
          l.data.unidadMedida_Id
        );

        if (l.data.imagenProductoId && l.data.imagenProductoId > 0) {
          this.ArchivoService.getArchivoById(l.data.imagenProductoId).subscribe(
            (res) => {
              this.img = res.data.archivo;
              this.frmCostos.controls.ImagenProductoId.setValue(res.data.id);
            }
          );
        }
      });
    } else {
      this.titulo = 'Crear insumo';
    }
    this.cargarMarcas();
    this.cargarCategorias();
    this.cargarUnidadesMedidas();
  }

  cargarMarcas() {
    this.marcasservice.getAll('Marcas').subscribe((res) => {
      this.listMarcas = res.data;
    });
  }

  cargarCategorias() {
    this.categoriasservice.getAll('Categorias').subscribe((res) => {
      this.listCategorias = res.data;
    });
  }

  cargarUnidadesMedidas() {
    this.unidadesMedidasservice.getAll('UnidadesMedidas').subscribe((res) => {
      this.listUnidadesMedidas = res.data;
    });
  }

  save() {
    if (this.frmCostos.invalid) {
      this.statusForm = false;
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }

    if (this.id != undefined && this.id != null) {
      if (this.dataArchivo != undefined) {
        if (this.frmCostos.controls.ImagenProductoId.value) {
          this.ArchivoService.delete(
            this.frmCostos.controls.ImagenProductoId.value
          ).subscribe(() => {});
        }
        this.ArchivoService.save(this.dataArchivo).subscribe((l) => {
          if (l.status != 'Error') {
            this.helperService.showMessage(
              MessageType.SUCCESS,
              Messages.SAVESUCCESS
            );
            this.frmCostos.controls.ImagenProductoId.setValue(l.data.id);
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
      this.ArchivoService.save(this.dataArchivo).subscribe((l) => {
        if (l.status != 'Error') {
          this.helperService.showMessage(
            MessageType.SUCCESS,
            Messages.SAVESUCCESS
          );
          this.frmCostos.controls.ImagenProductoId.setValue(l.data.id);
          this.guardarProducto();
        } else {
          this.helperService.showMessage(MessageType.ERROR, Messages.SAVEERROR);
        }
      });
    }
  }

  guardarProducto() {
    let data = {
      id: this.id ?? 0,
      ...this.frmCostos.value,
    };

    this.service.save(this.id, data).subscribe((l) => {
      if (!l.status) {
        this.helperService.showMessage(MessageType.ERROR, Messages.SAVEERROR);
      } else {
        this.helperService.showMessage(
          MessageType.SUCCESS,
          Messages.SAVESUCCESS
        );
        this.helperService.redirectApp(`operativo/costos`);
      }
    });
  }

  cancel() {
    this.helperService.redirectApp('operativo/costos/');
  }

  chececkMaxAndMin() {
    if (
      this.frmCostos.controls.Minimo.value >
      this.frmCostos.controls.Maximo.value
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
