import { Component, OnInit } from '@angular/core';
import { FormBuilder,  FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { PedidosDetallesService } from '../pedidos-detalles.service';

@Component({
  selector: 'app-pedidosDetalles-form',
  templateUrl: './pedidos-detalles-form.component.html',
  styleUrls: ['./pedidos-detalles-form.component.css']
})
export class PedidosDetallesFormComponent implements OnInit {

  public frmPedidosDetalles! : FormGroup;
  public statusForm : boolean = true
  public id! : number;
  public botones = ['btn-guardar', 'btn-cancelar'];
  public titulo = "";
  public listPedidos : any[] = [];
  public listEmpleados : any[] = [];
  public listModelos : any[] = [];

  constructor(public routerActive: ActivatedRoute, 
    private service: PedidosDetallesService , 
    private helperService: HelperService, 
    private modalActive: NgbActiveModal , 
    private fb: FormBuilder
    
    ) 
  { }

  ngOnInit(): void {
    this.buildForm();
    this.buildSelect();
    if (this.id != undefined && this.id != null) {
      this.titulo = "Editar Pedidos Detalles";
      this.service.getPedidosDetallesById(this.id).subscribe(({data}) => {
        //Estado , PedidoId , EmpleadoId , ModeloId
        this.frmPedidosDetalles.controls.Estado.setValue(data.estado);
        this.frmPedidosDetalles.controls.PedidoId.setValue(data.pedidoId);
        this.frmPedidosDetalles.controls.EmpleadoId.setValue(data.empleadoId);
        this.frmPedidosDetalles.controls.ModeloId.setValue(data.modeloId);
      })
    }else {
      this.titulo = "Crear Pedidos Detalles";
    }
  }

  buildForm(): void {
    this.frmPedidosDetalles = this.fb.group({
      Estado : [null, Validators.required],
      PedidoId : [null, Validators.required],
      EmpleadoId : [null, Validators.required],
      ModeloId : [null, Validators.required],
      });


   
  }

  buildSelect(){
    this.service.getAll("Pedidos").subscribe(({data}) => {
      this.listPedidos = data;
    });

    this.service.getAll("Modelos").subscribe(({data}) => {
      this.listModelos = data;
    });

    this.service.getAll("Empleados").subscribe(({data}) => {
      this.listEmpleados = data;
    });


  }



  save() {
    if (this.frmPedidosDetalles.invalid) {
      this.statusForm  = false
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }
    let data  = { 
      id: this.id ?? 0,
      ...this.frmPedidosDetalles.value,
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
