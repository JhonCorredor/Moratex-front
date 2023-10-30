import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { CostosService } from '../costos.service';
import { GeneralParameterService } from '../../../parameters/general-parameter/general-parameter.service';
import { ProveedoresService } from '../../../parameters/proveedor/proveedores.service';
import { EmpleadosService } from '../../../parameters/empleados/empleados.service';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';
import { DatePipe } from '@angular/common';

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
  public breadcrumb = [{ name: `Inicio`, icon: `fa-solid fa-house` }, { name: "Operativo", icon: "fas fa-cogs" }, { name: "Costos" }, { name: "Crear" }];

  public titulo = '';
  public listTiposCostos: any = [];
  public listProveedores: any = [];
  public listEmpleados: any = [];

  constructor(
    public routerActive: ActivatedRoute,
    private service: CostosService,
    private generalParameterService: GeneralParameterService,
    private proveedorService: ProveedoresService,
    private empleadoService: EmpleadosService,
    private helperService: HelperService,
    private datePipe: DatePipe
  ) {
    this.frmCostos = new FormGroup({
      Descripcion: new FormControl(null, Validators.required),
      Fecha: new FormControl(null),
      FechaCosto: new FormControl(null, Validators.required),
      Valor: new FormControl(null, Validators.required),
      PagoCaja: new FormControl(false, Validators.required),
      NumeroFactura: new FormControl(null, Validators.required),
      TipoCosto_Id: new FormControl(null, Validators.required),
      Proveedor_Id: new FormControl(null, Validators.required),
      Empleado_Id: new FormControl(null, Validators.required),
    });
    this.routerActive.params.subscribe((l) => (this.id = l.id));
  }

  ngOnInit(): void {
    this.cargarListas();
    this.frmCostos.controls.Fecha.setValue(new Date());

    if (this.id != undefined && this.id != null) {
      this.titulo = 'Editar Costo';
      this.service.getById(this.id).subscribe((l) => {
        const formattedFecha = this.datePipe.transform(l.data.fecha, 'yyyy-MM-ddTHH:mm:ss', 'America/Bogota');
        const formattedFechaCosto = this.datePipe.transform(l.data.fechaCosto, 'yyyy-MM-ddTHH:mm:ss', 'America/Bogota');

        this.frmCostos.controls.Descripcion.setValue(l.data.descripcion);
        this.frmCostos.controls.Fecha.setValue(formattedFecha);
        this.frmCostos.controls.FechaCosto.setValue(formattedFechaCosto);
        this.frmCostos.controls.Valor.setValue(l.data.valor);
        this.frmCostos.controls.PagoCaja.setValue(l.data.pagoCaja);
        this.frmCostos.controls.NumeroFactura.setValue(l.data.numeroFactura);
        this.frmCostos.controls.TipoCosto_Id.setValue(l.data.tipoCosto_Id);
        this.frmCostos.controls.Proveedor_Id.setValue(l.data.proveedor_Id);
        this.frmCostos.controls.Empleado_Id.setValue(l.data.empleado_Id);
      });
    } else {
      this.titulo = 'Crear Costo';
    }
  }

  save() {
    if (this.frmCostos.invalid) {
      this.statusForm = false
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }
    let data = {
      id: this.id ?? 0,
      ...this.frmCostos.value
    };
    this.service.save(this.id, data).subscribe(l => {
      if (!l.status) {
        this.helperService.showMessage(MessageType.ERROR, Messages.SAVEERROR)
      } else {
        this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS)
        this.helperService.redirectApp(`operativo/costos`);
      }
    })
  }

  cargarListas() {
    this.generalParameterService.getAll("TiposCostos").subscribe(r => {
      this.listTiposCostos = r.data;
    })

    this.proveedorService.getAll("Proveedores").subscribe(r => {
      this.listProveedores = r.data;
    })

    this.cargarEmpleado();
  };

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
      console.log(res.data[0]);
      this.listEmpleados = [
        {
          id: res.data[0].id,
          textoMostrar: res.data[0].codigo + " - " + res.data[0].persona
        }
      ];
      this.frmCostos.controls.Empleado_Id.setValue(res.data[0].id);
    });
  }

  cancel() {
    this.helperService.redirectApp('operativo/costos');
  }
}
