import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { GeneralParameterService } from '../../../parameters/general-parameter/general-parameter.service';
import { InventariosService } from '../inventarios.service';

@Component({
  selector: 'app-inventarios-form',
  templateUrl: './inventarios-form.component.html',
  styleUrls: ['./inventarios-form.component.css']
})
export class InventariosFormComponent implements OnInit {

  public frmInventarios: FormGroup;
  public statusForm : boolean = true
  public breadcrumb = ""
  public id! : number;
  public botones = ['btn-guardar', 'btn-cancelar'];
  public titulo = "";
  public listProductos = [];
  public listEstados = [];

  constructor(public routerActive: ActivatedRoute, private service: InventariosService, private helperService: HelperService,
     private ProductoService: GeneralParameterService, private EstadoService: GeneralParameterService) { 
    this.frmInventarios = new FormGroup({
      Codigo: new FormControl(null,[ Validators.required , Validators.maxLength(20)]),
      Nombre : new FormControl(null, [Validators.required , Validators.maxLength(100)]), 
      Observacion: new FormControl(null, [Validators.required , Validators.maxLength(500)]),
      Estado: new FormControl(true, Validators.required),
    });
    this.routerActive.params.subscribe(e => this.id = e.id);
  }

  ngOnInit(): void {
    if (this.id != undefined && this.id != null) {
      this.titulo = "Editar inventario";
      this.service.getById(this.id).subscribe(l => {    
        this.frmInventarios.controls.Codigo.setValue(l.data.codigo);
        this.frmInventarios.controls.Nombre.setValue(l.data.nombre);
        this.frmInventarios.controls.Observacion.setValue(l.data.observacion);
        this.frmInventarios.controls.Estado.setValue(l.data.estado);
      })
    }else {
      this.titulo = "Crear inventario";
    }
    this.buildSelect();
  }

  buildSelect() {
    this.ProductoService.getAll("Productos").subscribe(res => {
      this.listProductos = res.data;
    }) 

    this.EstadoService.getAll("Estados").subscribe(res => {
      this.listEstados = res.data;
    })
  }

  changeCantidadTotal(){
    let ingresada = this.frmInventarios.controls.CantidadIngresada.value;
    let usada = this.frmInventarios.controls.CantidadUsada.value;

    if(ingresada != null  && ingresada != undefined && usada != undefined && usada != null){
      if(ingresada > usada){
        let total = ingresada - usada;
        this.frmInventarios.controls.CantidadTotal.setValue(total);
      }
      if(ingresada < usada){
        this.helperService.showMessage(MessageType.WARNING, Messages.INVALIDOPERATION);
        this.frmInventarios.controls.CantidadTotal.setValue(null);
      }
    }

  }

  save() {
    if (this.frmInventarios.invalid) {
      this.statusForm  = false
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }
    let data  = { 
      id: this.id ?? 0,
      ...this.frmInventarios.value
    };
    this.service.save(this.id, data).subscribe(l => {
      if (!l.status) {
        // this.modalActive.close();
        this.helperService.showMessage(MessageType.ERROR, Messages.SAVEERROR)
      } else {
        // this.modalActive.close(true);
        this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS)
      }
    })
  }

  cancel() {
    this.helperService.redirectApp(`inventario/inventarios`);
  }

}
