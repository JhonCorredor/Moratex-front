import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
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
  selector: 'app-generar-cotizacion-manual-form',
  templateUrl: './generar-cotizacion-manual-form.component.html',
  styleUrls: ['./generar-cotizacion-manual-form.component.css']
})
export class GenerarCotizacionManualFormComponent implements OnInit , OnChanges {
  @Input() Modelo : any
  @Input() Index : any
  @Input() GuardarCotizacion : any
  @Output() deleteModelo = new EventEmitter<any>()
  @Output() SubTotalAprobado = new EventEmitter<any>()
  public botones = ['btn-eliminar'];
  public frmCotizacionManual: FormGroup;
  ModeloCargoData : any 
  Cargo : any
  ModeloData : any
  SubTotal : number = 0 

  constructor(private generalService: GeneralParameterService, private helperService: HelperService) { 
    this.frmCotizacionManual = new FormGroup({
      ValorUnitario: new FormControl(null, Validators.required),
      Cantidad: new FormControl(null, Validators.required),
      Observacion: new FormControl(null, Validators.required),
    });
  }

  ngOnInit(): void {
    this.generalService.getById("ModelosCargos", this.Modelo).subscribe(l =>{ this.ModeloCargoData = l.data ;   this.getModeloAndCargo()})
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if(this.GuardarCotizacion){
      let data = {
       ...this.frmCotizacionManual.value,
        ModeloId : this.ModeloCargoData.modeloId,
        CargoId : this.ModeloCargoData.cargoId,
        ValorTotal: this.frmCotizacionManual.value.ValorUnitario * this.frmCotizacionManual.value.Cantidad
        
      }
    }
  }

  getModeloAndCargo(){
    this.generalService.getById("Modelos", this.ModeloCargoData.modeloId).subscribe(l => this.ModeloData = l.data)
    this.generalService.getById("Cargos", this.ModeloCargoData.cargoId).subscribe(l => this.Cargo = l.data)
  }

  CalcularSubTotal(){
    let SubTotalAnterior = this.SubTotal
    this.SubTotal = this.frmCotizacionManual.value.ValorUnitario * this.frmCotizacionManual.value.Cantidad * this.ModeloCargoData?.numeroDotacion
    this.SubTotalAprobado.emit([SubTotalAnterior , this.SubTotal])
  }

  
}
