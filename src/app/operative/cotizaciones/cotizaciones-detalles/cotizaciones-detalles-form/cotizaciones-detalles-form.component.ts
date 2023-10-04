import { Component, OnInit } from '@angular/core';
import { FormBuilder,  FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { GeneralParameterService } from 'src/app/parameters/general-parameter/general-parameter.service';
import { CotizacionesDetallesService } from '../cotizaciones-detalles.service';

@Component({
  selector: 'app-cotizacionesDetalles-form',
  templateUrl: './cotizaciones-detalles-form.component.html',
  styleUrls: ['./cotizaciones-detalles-form.component.css']
})
export class CotizacionesDetallesFormComponent implements OnInit {

  public frmCotizacionesDetalles! : FormGroup;
  public statusForm : boolean = true
  public id! : number;
  public cotizacion!: number;
  public empresa! : number  
  public botones = ['btn-guardar', 'btn-cancelar'];
  public titulo = "";
  public ModeloCargoData : any 
  public Modelos : number = 0 
  public valorTotal : number = 0
  public listCotizaciones : any[] = [];
  public listModelos : any[] = [];

  constructor(public routerActive: ActivatedRoute, 
    private service: CotizacionesDetallesService , 
    public helperService: HelperService, 
    private modalActive: NgbActiveModal ,
    private generalService: GeneralParameterService, 
    private fb: FormBuilder) 
  { }

  ngOnInit(): void {
    this.buildForm();
    this.buildSelect();
    if (this.id != undefined && this.id != null) {
      this.titulo = "Editar Cotizaciones Detalles";
      this.service.getCotizacionesDetallesById(this.id).subscribe(({data}) => {
        this.frmCotizacionesDetalles.controls.Cantidad.setValue(data.cantidad);
        this.frmCotizacionesDetalles.controls.ValorUnitario.setValue(data.valorUnitario);
        this.frmCotizacionesDetalles.controls.Iva.setValue(data.iva.toString());
        this.frmCotizacionesDetalles.controls.ValorTotal.setValue(data.valorTotal);
        this.frmCotizacionesDetalles.controls.Observacion.setValue(data.observacion);
        this.cotizacion = data.cotizacionId;
        this.valorTotal = data.valorTotal;
        this.frmCotizacionesDetalles.controls.ModeloId.setValue(data.modeloId);
        if (this.listModelos && this.listModelos.length > 0) {
          setTimeout(() => {
            this.ChangeModeloSelect(this.listModelos.find(item => item.Id == data.modeloId));
          }, 500);
        }
        })
    }else {
      this.titulo = "Crear Cotizaciones Detalles";
    }
  }

  buildForm(): void {
    this.frmCotizacionesDetalles = this.fb.group({
      Cantidad : [null, [Validators.required]], //Validators.pattern(/^([0-9])*$/)
      ValorUnitario : [null, [Validators.required]], // Validators.pattern(/^-?\d*[.,]?\d{2,18}$/)
      Iva : [null, [Validators.required]], //Validators.pattern(/^-?\d*[.,]?\d{2,18}$/)
      ValorTotal : [null, [Validators.required]], //Validators.pattern(/^-?\d*[.,]?\d{2,18}$/)
      Observacion : [null, Validators.required],
      CotizacionId : [null ],
      CantidadUniforme: [null],
      PrecioModelo: [null],
      CargoId: [null],
      ModeloId : [null, Validators.required],
     });
  }

  buildSelect(){
    this.generalService.getAllCustom(`ModelosCargos/GetModelosByEmpresaId/${this.empresa}`).subscribe(l => this.listModelos = l.data)
  }

  ChangeModeloSelect(item: any){
    this.generalService.getAllCustom(`ModelosCargos/GetNumeroDotacionPrecioCargoIdByModeloCargoId/${item.ModeloCargoId}`).subscribe(
      res => {
        this.ModeloCargoData = res.data;
        this.frmCotizacionesDetalles.controls.CargoId.setValue(res.data.CargoId);
        this.frmCotizacionesDetalles.controls.PrecioModelo.setValue(res.data.Precio);
        this.frmCotizacionesDetalles.controls.ValorUnitario.setValue(res.data.Precio.toString());
        this.frmCotizacionesDetalles.controls.CantidadUniforme.setValue(res.data.NumeroDotacion);
      }
    )
  }
  
  calculateValorTotal(){
    let cantidad = this.frmCotizacionesDetalles.controls.Cantidad.value;
    let valorUnitario = this.frmCotizacionesDetalles.controls.ValorUnitario.value;
    let iva = this.frmCotizacionesDetalles.controls.Iva.value;
    let numeroDotacion = this.ModeloCargoData?.NumeroDotacion
    if(cantidad != null && valorUnitario != null && iva != null){
      valorUnitario = this.helperService.formatearNumeroDB(valorUnitario);
      iva = this.helperService.formatearNumeroDB(iva);
      valorUnitario = (valorUnitario * iva / 100) + parseFloat(valorUnitario);
      this.valorTotal = valorUnitario * cantidad * numeroDotacion;   //(cantidad * valorUnitario * numeroDotacion) + (cantidad * valorUnitario * iva / 100);
      this.frmCotizacionesDetalles.controls.ValorTotal.setValue(this.valorTotal);
    }
  }

  save() {
    if (this.frmCotizacionesDetalles.invalid) {
      this.statusForm  = false
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }
    this.frmCotizacionesDetalles.controls.CotizacionId.setValue(this.cotizacion);
    this.frmCotizacionesDetalles.controls.ValorUnitario.setValue(this.helperService.formatearNumeroDB(this.frmCotizacionesDetalles.controls.ValorUnitario.value));
    let data  = { 
      id: this.id ?? 0,
      Cantidad: this.frmCotizacionesDetalles.controls.Cantidad.value,
      ValorUnitario: this.frmCotizacionesDetalles.controls.ValorUnitario.value,
      Iva: this.helperService.formatearNumeroDB(this.frmCotizacionesDetalles.controls.Iva.value ?? ''),
      ValorTotal: this.frmCotizacionesDetalles.controls.ValorTotal.value,
      Observacion: this.frmCotizacionesDetalles.controls.Observacion.value,
      CotizacionId: this.frmCotizacionesDetalles.controls.CotizacionId.value,
      CantidadUniforme: this.frmCotizacionesDetalles.controls.CantidadUniforme.value,
      PrecioModelo: this.frmCotizacionesDetalles.controls.PrecioModelo.value,
      CargoId: this.frmCotizacionesDetalles.controls.CargoId.value,
      ModeloId: this.frmCotizacionesDetalles.controls.ModeloId.value
    };
    this.service.save(this.id, data).subscribe(l => {
      if (l.status == "Error") {
        this.modalActive.close();
        this.helperService.showMessage(MessageType.ERROR, Messages.SAVEERROR)
      } else {
        this.modalActive.close(true);
        this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS)
      }
    })
  }

  cancel() {
    this.modalActive.close();
  }

}
