import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { LANGUAGE_DATATABLE } from 'src/app/admin/datatable.language';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { BotonesComponent } from 'src/app/general/botones/botones.component';
import { EmpleadosService } from 'src/app/parameters/empleados/empleados.service';
import { ModelosCargosService } from 'src/app/parameters/empresas/modelos-cargos.service';
import { GeneralParameterService } from 'src/app/parameters/general-parameter/general-parameter.service';

@Component({
  selector: 'app-generar-cotizacion-index',
  templateUrl: './generar-cotizacion-index.component.html',
  styleUrls: ['./generar-cotizacion-index.component.css']
})
export class GenerarCotizacionIndexComponent implements OnInit {
  public frmFiltros: FormGroup;
  public statusForm : boolean = true
  public breadcrumb = [{name: `Inicio` , icon: `fa-solid fa-house`},  {name: "Operativo"}, {name: "Generar cotización"}];
  public titulo = "Generar Cotización";
  public botones = ['btn-precotizacion'];
  public listEmpresas: [] = [];
  public mostrarTabla = false;

  constructor(private generalService: GeneralParameterService, private helperService: HelperService) { 
    this.frmFiltros = new FormGroup({
      EmpresaId: new FormControl(-1, Validators.required),
      Iva: new FormControl(null, Validators.required)
    });
  }

  ngOnInit(): void {
    this.generalService.getAll("Empresas").subscribe(l => this.listEmpresas = l.data);
  }

  changeEmpresa() {
    this.mostrarTabla = false;
    setTimeout(() => {
      this.mostrarTabla = true;
    }, 500);
  }

  precotizacion() {
    if (this.frmFiltros.invalid) {
      this.helperService.showMessage(MessageType.ERROR, Messages.EMPTYFIELD);
      return;
    }

    this.helperService.redirectApp(`operativo/generar-cotizaciones/precotizacion/${this.frmFiltros.controls.EmpresaId.value}/${this.frmFiltros.controls.Iva.value}`);

  }

}
