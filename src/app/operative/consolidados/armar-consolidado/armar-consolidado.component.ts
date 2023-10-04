import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HelperService, MessageType } from 'src/app/admin/helper.service';
import { ConsolidadosService } from '../consolidados.service';

@Component({
  selector: 'app-armar-consolidado',
  templateUrl: './armar-consolidado.component.html',
  styleUrls: ['./armar-consolidado.component.css']
})
export class ArmarConsolidadoComponent implements OnInit {
  public title = "Armar Consolidado";
  public breadcrumb = [{name: `Inicio` , icon: `fa-solid fa-house`},  {name: "Operativo" , icon: "fas fa-cogs"}, {name: "Armar Consolidado"}];
  private _cotizacionId: number = 0;
  public dataConsolidados: any = [];
  public frmEncabezadoConsolidado: FormGroup;
  public sumatoriaPrendasActuales = 0;

  constructor(public routerActive: ActivatedRoute, public helperService: HelperService, private _service: ConsolidadosService) { 
    this.routerActive.params.subscribe(l => this._cotizacionId = l.cotizacionid);
    this.frmEncabezadoConsolidado = new FormGroup({
      Empresa: new FormControl(null),
      EmpresaId: new FormControl(null),
      TotalModelo: new FormControl(null),
      Cotizacion: new FormControl(null),
      TotalPrenda: new FormControl(null),
      PrendasActuales: new FormControl(0),
      EmpleadoId: new FormControl(null),
      CotizacionId: new FormControl(null)
    });
  }

  ngOnInit(): void {
    this.cargarDatatable();
    this.cargarCotizacion();
  }

  cargarDatatable() {
    this.helperService.showLoading();
    this._service.armarConsolidado(this._cotizacionId).subscribe(res => {
      this.dataConsolidados = res.data ?? []
      this.calcularPrendasActuales();
      this.helperService.hideLoading();
    })
  }

  cargarCotizacion() {
    this._service.getCotizacionById(this._cotizacionId).subscribe(res => {
      if (res && res.status == true) {
        this.frmEncabezadoConsolidado.controls.Cotizacion.setValue(res.data.codigo);
        this.frmEncabezadoConsolidado.controls.Empresa.setValue(res.data.empresa);
        this.frmEncabezadoConsolidado.controls.EmpresaId.setValue(res.data.empresaId);
        this.frmEncabezadoConsolidado.controls.TotalPrenda.setValue(res.data.totalPrenda);
        this.frmEncabezadoConsolidado.controls.TotalModelo.setValue(res.data.totalModelo);
        this.frmEncabezadoConsolidado.controls.EmpleadoId.setValue(localStorage.getItem("userId") ?? "0");
        this.frmEncabezadoConsolidado.controls.CotizacionId.setValue(this._cotizacionId);
      }
    })
  }

  guardar() {
    let data = {
      encabezado: this.frmEncabezadoConsolidado.value,
      detalles: this.dataConsolidados
    }

    this._service.saveConsolidado(data).subscribe(
      res => {
        this.helperService.showMessage(MessageType.SUCCESS, "Consolidado guardado")
        this.helperService.redirectApp(`/operativo/cotizaciones/editar/${this._cotizacionId}`);
      },
      error => this.helperService.showMessageError(error)
    )
  }

  calcularPrendasActuales() {
    this.sumatoriaPrendasActuales = 0
    this.dataConsolidados.forEach((element: any) => {
      this.sumatoriaPrendasActuales += element.totalPrendas + element.remanente;
    });
    this.frmEncabezadoConsolidado.controls.PrendasActuales.setValue(this.sumatoriaPrendasActuales);
  }

}
