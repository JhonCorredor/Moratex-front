import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { FacturaCompraService } from '../factura-compra.service';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';
import { EmpleadosService } from 'src/app/parameters/empleados/empleados.service';
import { GeneralParameterService } from 'src/app/parameters/general-parameter/general-parameter.service';
import { ProveedoresFormComponent } from 'src/app/parameters/proveedor/proveedores-form/proveedores-form.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-factura-compra-form',
  templateUrl: './factura-compra-form.component.html',
  styleUrls: ['./factura-compra-form.component.css']
})

export class FacturaCompraFormComponent implements OnInit {

  public frmFacturaCompra!: FormGroup;
  public statusForm: boolean = true;
  public Pagada: boolean = false;
  public botones = ['btn-guardar', 'btn-cancelar'];
  public breadcrumb = [{ name: `Inicio`, icon: `fa-duotone fa-house` }, { name: "Operativo", icon: "fas fa-cogs" }, { name: "Facturas Compras" }];
  public titulo = "";
  public listEstados: any[] = [];
  public listEmpleados: any[] = [];
  public listProveedores: any[] = [];
  public id!: number;
  public disableForm: boolean = false;
  public serviceName: string = "";

  constructor(private modalService: NgbModal, public routerActive: ActivatedRoute, private service: FacturaCompraService, public helperService: HelperService, private fb: FormBuilder, private router: Router, private datePipe: DatePipe, private empleadoService: EmpleadosService, private generalParameterService: GeneralParameterService) {
    this.routerActive.params.subscribe(l => this.id = l.id);

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        let url = event.url.split('/')[3];
        this.disableForm = (url == "ver") ? true : false
      }
    });

  }

  ngOnInit(): void {
    if (this.id != undefined && this.id != null) {
      this.titulo = "Editar Registro de Ingreso por Compra";
      if (this.disableForm) {
        this.titulo = "Ver Registro de Ingreso por Compra";
        this.botones = ['btn-cancelar'];
      }
      this.service.getById(this.id).subscribe(l => {
        var parseFecha = this.datePipe.transform(l.data.fecha, 'yyyy-MM-dd');
        var parseFechaCreacion = this.datePipe.transform(l.data.fechaCreacion, 'yyyy-MM-dd');

        this.frmFacturaCompra.controls.Codigo.setValue(l.data.codigo);
        this.frmFacturaCompra.controls.NumeroFactura.setValue(l.data.numeroFactura);
        this.frmFacturaCompra.controls.Fecha.setValue(parseFecha);
        this.frmFacturaCompra.controls.FechaCreacion.setValue(parseFechaCreacion);
        this.frmFacturaCompra.controls.Total.setValue(l.data.total);
        this.frmFacturaCompra.controls.Descuento.setValue(l.data.descuento);
        this.frmFacturaCompra.controls.Iva.setValue(l.data.iva);
        this.frmFacturaCompra.controls.Estado_Id.setValue(l.data.estado_Id);
        this.frmFacturaCompra.controls.Empleado_Id.setValue(l.data.empleado_Id);
        this.frmFacturaCompra.controls.Proveedor_Id.setValue(l.data.proveedor_Id);
      })
    }
    else {
      this.titulo = "Crear Registro de Ingreso por Compra";
    }
    this.buildForm();
    this.buildSelect();
  }

  buildForm(): void {
    var parseFecha = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

    this.frmFacturaCompra = this.fb.group({
      Codigo: new FormControl(""),
      NumeroFactura: new FormControl(null, [Validators.required]),
      Fecha: new FormControl(parseFecha, [Validators.required]),
      Total: new FormControl(null, [Validators.required]),
      Descuento: new FormControl(0, [Validators.required]),
      Iva: new FormControl(0, [Validators.required]),
      Proveedor_Id: new FormControl(null, [Validators.required]),
      Estado_Id: new FormControl(null, [Validators.required]),
      Empleado_Id: new FormControl(null, [Validators.required]),
      FechaCreacion: new FormControl(parseFecha, [Validators.required]),
      PagoCaja: new FormControl(false, [Validators.required])
    });
  }

  buildSelect() {
    this.service.getAll("Proveedores").subscribe(({ data }) => {
      this.listProveedores = data;
    });

    this.cargarEmpleado();
    this.cargarEstados();
  }

  cargarEstados() {
    var data = new DatatableParameter();
    data.pageNumber = "1";
    data.pageSize = "10";
    data.filter = "Facturas de Compra";
    data.columnOrder = "";
    data.directionOrder = "";
    this.generalParameterService.datatable("Estados", data).subscribe(estados => {
      var listEstadosFacturaCompra: any[] = [];
      for (const estado of estados.data) {
        var data = {
          id: estado.id,
          textoMostrar: estado.codigo + " - " + estado.nombre
        };
        listEstadosFacturaCompra.push(data);
      }
      setTimeout(() => {
        this.listEstados = listEstadosFacturaCompra;
      }, 500);
    })
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
      this.listEmpleados = [
        {
          id: res.data[0].id,
          textoMostrar: res.data[0].codigo + " - " + res.data[0].persona
        }
      ];
      this.frmFacturaCompra.controls.Empleado_Id.setValue(res.data[0].id);
    });
  }

  onSelectChangeEstado(estado_Id: string) {
    if (estado_Id != null) {
      this.generalParameterService.getById("Estados", estado_Id).subscribe(r => {
        if (r.data.nombre == 'Pagada') {
          this.Pagada = true;
        } else {
          this.Pagada = false;
        }
      })
    } else {
      this.Pagada = false;
    }
  }

  save() {
    if (this.frmFacturaCompra.invalid) {
      this.statusForm = false
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }
    let data = {
      id: this.id ?? 0,
      ...this.frmFacturaCompra.value
    };

    if (this.id != undefined && this.id != null) {
      this.helperService.confirmUpdate(this.saveRegister(this.frmFacturaCompra.value));
    } else {
      this.saveRegister(this.frmFacturaCompra.value)
    }


  }

  saveRegister(data: any) {
    setTimeout(() => {
      this.service.save(this.id, data).subscribe(l => {
        if (!l.status) {
          this.helperService.showMessage(MessageType.ERROR, Messages.SAVEERROR)
        } else {
          this.helperService.redirectApp(`parametros/facturaCompra/editar/${l.data.id}`);
          this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS)
        }
      })
    }, 800);
  }

  cancel() {
    this.helperService.redirectApp('parametros/facturaCompra');
  }

  public nuevoProveedor() {
    let modal = this.modalService.open(ProveedoresFormComponent, { size: 'xl', keyboard: false, backdrop: "static" });
    modal.componentInstance.titleData = "Crear Proveedor";
    modal.componentInstance.serviceName = this.serviceName;
  }

}
