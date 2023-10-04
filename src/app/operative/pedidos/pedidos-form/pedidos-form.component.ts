import { Component, OnInit } from '@angular/core';
import { FormBuilder,  FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { PedidosService } from '../pedidos.service';

@Component({
  selector: 'app-pedidos-form',
  templateUrl: './pedidos-form.component.html',
  styleUrls: ['./pedidos-form.component.css']
})
export class PedidosFormComponent implements OnInit {

  public frmPedidos! : FormGroup;
  public statusForm : boolean = true
  public id! : number;
  public botones = ['btn-guardar', 'btn-cancelar'];
  public titulo = "";
  public listCotizaciones : any[] = [];
  public listEstados : any[] = [];

  constructor(public routerActive: ActivatedRoute, 
    private service: PedidosService , 
    private helperService: HelperService, 
    private modalActive: NgbActiveModal , 
    private fb: FormBuilder
    
    ) 
  { }

  ngOnInit(): void {
    this.buildForm();
    this.buildSelect();
    if (this.id != undefined && this.id != null) {
      this.titulo = "Editar Pedidos";
      this.service.getPedidosById(this.id).subscribe(({data}) => {
        // CotizacionId , EstadoId , Fecha , Codigo
        this.frmPedidos.controls.CotizacionId.setValue(data.cotizacionId),
        this.frmPedidos.controls.EstadoId.setValue(data.estadoId),
        this.frmPedidos.controls.Fecha.setValue(data.fecha),
        this.frmPedidos.controls.Codigo.setValue(data.codigo)
      })
    }else {
      this.titulo = "Crear Pedidos";
    }
  }

  buildForm(): void {
    this.frmPedidos = this.fb.group({
      CotizacionId: [null, Validators.required],
      EstadoId: [null, Validators.required],
      Fecha : [null, [Validators.required]],
      Codigo : [null, [Validators.required  , Validators.maxLength(20)]]
    });


   
  }

  buildSelect(){
    this.service.getAll("Cotizaciones").subscribe(({data}) => {
      this.listCotizaciones = data;
    });

    this.service.getAll("Estados").subscribe(({data}) => {
      this.listEstados = data;
    });

  }



  save() {
    if (this.frmPedidos.invalid) {
      this.statusForm  = false
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }
    let data  = { 
      id: this.id ?? 0,
      ...this.frmPedidos.value,
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
