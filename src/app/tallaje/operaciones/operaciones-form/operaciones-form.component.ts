import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { GeneralParameterService } from 'src/app/parameters/general-parameter/general-parameter.service';
import { OperacionesService } from '../operaciones.service';

@Component({
  selector: 'app-operaciones-form',
  templateUrl: './operaciones-form.component.html',
  styleUrls: ['./operaciones-form.component.css']
})
export class OperacionesFormComponent implements OnInit {

  public frmOperaciones: FormGroup;
  public statusForm : boolean = true
  public id! : number;
  public botones = ['btn-guardar', 'btn-cancelar'];
  public titulo = "";
  public breadcrumb = [{name: `Inicio` , icon: `fa-solid fa-house`},  {name: `Tallaje` , icon: `fa-solid fa-house`}, {name: "Operaciones"}];
  public listMaquinaria = [];
  public listTipoOperacion = [];

  constructor(public routerActive: ActivatedRoute, private service: OperacionesService, private helperService: HelperService, private generalService: GeneralParameterService) { 
    this.routerActive.params.subscribe(e => this.id = e.id);
    
    this.frmOperaciones = new FormGroup({
      Codigo: new FormControl(null, [Validators.required , Validators.maxLength(20)]),
      Nombre: new FormControl(null, [Validators.required  , Validators.maxLength(100)]),
      Observacion: new FormControl(null),
      MaquinariaId: new FormControl(null),
      TipoOperacionId: new FormControl(null),
      Estado: new FormControl(true, Validators.required)
    });
  }

  ngOnInit(): void {
    this.buildSelect()
    if (this.id != undefined && this.id != null) {
      this.titulo = `Editar Operaciones`;
      this.service.getById(this.id).subscribe(l => {
        this.frmOperaciones.controls.Codigo.setValue(l.data.codigo);
        this.frmOperaciones.controls.Nombre.setValue(l.data.nombre);
        this.frmOperaciones.controls.MaquinariaId.setValue(l.data.maquinariaId);
        this.frmOperaciones.controls.TipoOperacionId.setValue(l.data.tipoOperacionId);
        this.frmOperaciones.controls.Observacion.setValue(l.data.observacion);
        this.frmOperaciones.controls.Estado.setValue(l.data.estado);
      })
    }else {
      this.titulo = `Crear Operaciones`;
    }
  }

  buildSelect(){
    this.generalService.getAll("Maquinarias").subscribe(l => {this.listMaquinaria = l.data});
    this.generalService.getAll("TiposOperaciones").subscribe(l => {this.listTipoOperacion = l.data});
  }

  save() {
    if (this.frmOperaciones.invalid) {
      this.statusForm  = false
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }
    let data  = { 
      id: this.id ?? 0,
      ...this.frmOperaciones.value
    };
    this.service.save(this.id, data).subscribe(l => {
      if (!l.status) {
        this.helperService.showMessage(MessageType.ERROR, Messages.SAVEERROR)
      } else {
        if (!this.id) {
          this.helperService.redirectApp(`tallaje/operaciones/editar/${l.data.id}`);
        }
        this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS)
      }
    })
  }

  cancel() {
    this.helperService.redirectApp(`tallaje/operaciones`);
  }

}
