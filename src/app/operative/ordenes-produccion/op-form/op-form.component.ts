import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OrdenesProduccionService } from '../ordenes-produccion.service';
import { HelperService, MessageType, Messages } from 'src/app/admin/helper.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-op-form',
  templateUrl: './op-form.component.html',
  styleUrls: ['./op-form.component.css']
})
export class OpFormComponent implements OnInit {

  private consolidadoDetalleId: any;
  

  public titulo = "Generar Orden Producción"
  public breadcrumb = [{name: `Inicio` , icon: `fa-solid fa-house`},  {name: "Tallaje" , icon: "fas fa-cogs"}, {name: "Cotizaciones"}];
  public frmOrdenesProduccion: FormGroup;
  public botones = ['btn-guardar'];
  public id! : number;
  public listTalleres = [];
  public listEstados = [];
  public listTiposOperaciones = [];
  public listEmpleados = [];

  constructor(public routerActive: ActivatedRoute, private service: OrdenesProduccionService, public helperService: HelperService, private datePipe: DatePipe) { 
    this.routerActive.params.subscribe(l => {
      this.consolidadoDetalleId = l.consolidadodetalleid
      this.id = l.id
    });
    this.frmOrdenesProduccion = new FormGroup({
      Fecha: new FormControl(null, Validators.required),
      CantidadPrenda: new FormControl(null, Validators.required),
      Avance: new FormControl(null, Validators.required),
      FechaEntregaMaterial: new FormControl(null, Validators.required),
      FechaInicio: new FormControl(null, Validators.required),
      FechaFin: new FormControl(null, Validators.required),
      TallerId: new FormControl(null, Validators.required),
      TipoOperacionId: new FormControl(null, Validators.required),
      EstadoId: new FormControl(null, Validators.required),
      EmpleadoId: new FormControl(null, Validators.required),
      Observacion: new FormControl(null, Validators.required),
      
    });
  }

  ngOnInit(): void {
    this.loadLists();
    this.loadData();
  }

  loadData() {
    if (this.id) {
      this.titulo = "Editar Orden Producción"
      this.service.getById(this.id).subscribe(
        res => {

          this.frmOrdenesProduccion.patchValue({
            Fecha: this.datePipe.transform(res.data.fecha, 'yyyy-MM-dd'),
            CantidadPrenda: res.data.cantidadPrenda,
            Avance: res.data.avance,
            FechaEntregaMaterial: this.datePipe.transform(res.data.fechaEntregaMaterial, 'yyyy-MM-dd'),
            FechaInicio: this.datePipe.transform(res.data.fechaInicio, 'yyyy-MM-dd'),
            FechaFin: this.datePipe.transform(res.data.fechaFin, 'yyyy-MM-dd'),
            TallerId: res.data.tallerId,
            TipoOperacionId: res.data.tipoOperacionId,
            EstadoId: res.data.estadoId,
            EmpleadoId: res.data.empleadoId,
            Observacion: res.data.observacion
          });
          this.consolidadoDetalleId = res.data.ConsolidadoDetalleId;
        }
      )
    }
  }

  loadLists() {
    this.service.getAll("Estados").subscribe(({data}) => {
      this.listEstados = data;
    });

    this.service.getAll("Talleres").subscribe(({data}) => {
      this.listTalleres = data;
    });

    this.service.getAll("TiposOperaciones").subscribe(({data}) => {
      this.listTiposOperaciones = data;
    });

    this.service.getAll("Empleados").subscribe(({data}) => {
      this.listEmpleados = data;
    });
  }

  save() {
    let data = {
      Id: this.id ?? 0,
      Fecha: this.frmOrdenesProduccion.controls['Fecha'].value,
      CantidadPrenda: this.frmOrdenesProduccion.controls['CantidadPrenda'].value,
      Avance: this.helperService.formatearNumeroDB(this.frmOrdenesProduccion.controls['Avance'].value.toString()),
      FechaEntregaMaterial: this.frmOrdenesProduccion.controls['FechaEntregaMaterial'].value,
      FechaInicio: this.frmOrdenesProduccion.controls['FechaInicio'].value,
      FechaFin: this.frmOrdenesProduccion.controls['FechaFin'].value,
      TallerId: this.frmOrdenesProduccion.controls['TallerId'].value,
      TipoOperacionId: this.frmOrdenesProduccion.controls['TipoOperacionId'].value,
      EstadoId: this.frmOrdenesProduccion.controls['EstadoId'].value,
      EmpleadoId: this.frmOrdenesProduccion.controls['EmpleadoId'].value,
      Observacion: this.frmOrdenesProduccion.controls['Observacion'].value,
      ConsolidadoDetalleId: this.consolidadoDetalleId
    }

    this.service.save(this.id, data).subscribe(
      res => {
        if (res.status == "Error") {
          this.helperService.showMessage(MessageType.ERROR, Messages.SAVEERROR)
        } else {
          if (!this.id) {
            this.helperService.redirectApp(`operativo/ordenes-produccion/editar/${res.data.id}`);
          }
          this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS)
        }
      }
    )

  }

  cancel() {

  }

}
