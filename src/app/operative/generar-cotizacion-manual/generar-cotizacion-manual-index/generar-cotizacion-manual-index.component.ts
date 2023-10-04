import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';
import { HelperService } from 'src/app/admin/helper.service';
import { GeneralParameterService } from 'src/app/parameters/general-parameter/general-parameter.service';

@Component({
  selector: 'app-generar-cotizacion-manual-index',
  templateUrl: './generar-cotizacion-manual-index.component.html',
  styleUrls: ['./generar-cotizacion-manual-index.component.css']
})
export class GenerarCotizacionManualIndexComponent implements OnInit   {
  public frmFiltros: FormGroup;
  public statusForm : boolean = true
  public breadcrumb = [{name: `Inicio` , icon: `fa-solid fa-house`},  {name: "Operativo"}, {name: "Generar cotización"}];
  public titulo = "Generar Cotización Manual";
  public botones = ['btn-agregar' , 'btn-guardar'];
  public guardarCotizacion : boolean = false
  public listEmpresas: [] = [];
  public listModelos: [] = [];
  public listModelosSelect: number[] = [];
  public Subtotal : number = 0

  constructor(private generalService: GeneralParameterService,
     private helperService: HelperService) { 
    this.frmFiltros = new FormGroup({
      EmpresaId: new FormControl(null, Validators.required),
      TotalEmpleado: new FormControl(null, Validators.required),
      FechaPagoAnticipado: new FormControl(null, Validators.required),
      FechaEntrega: new FormControl(null, Validators.required),
      ModeloId: new FormControl(null, Validators.required),
      PagoAnticipado: new FormControl(null, Validators.required)
    });
  }

  ngOnInit(): void {
    this.generalService.getAll("Empresas").subscribe(l => this.listEmpresas = l.data);
  }

  changeEmpresa() {
    var data = new DatatableParameter();
    data.foreignKey = this.frmFiltros.controls.EmpresaId.value;
    this.generalService.datatableAgg("ModelosCargos",data).subscribe(l => this.listModelos = l.data)
  }

  AgregarModelo() {
    if(this.frmFiltros.controls.ModeloId.value){
      this.listModelosSelect.push(this.frmFiltros.controls.ModeloId.value)
    }
  }
  
  eliminarModelo(index: any) {
    this.listModelosSelect.splice(index[0], 1);
    this.Subtotal = this.Subtotal - index[1]
  }

  GuardarCotizacion(){
    this.guardarCotizacion = true
    setTimeout(() => {
      this.guardarCotizacion = false
    }, 300);
  }

  calcularSubTotal(number : any){
      this.Subtotal = this.Subtotal - number[0]
      this.Subtotal = this.Subtotal + number[1]
  }
  

}
