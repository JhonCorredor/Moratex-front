import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { PiezasService } from '../piezas.service';

@Component({
  selector: 'app-piezas-form',
  templateUrl: './piezas-form.component.html',
  styleUrls: ['./piezas-form.component.css']
})
export class PiezasFormComponent implements OnInit {

  public frmPiezas: FormGroup;
  public statusForm : boolean = true
  public id! : number;
  public botones = ['btn-guardar', 'btn-cancelar'];
  public titulo = "";
  public breadcrumb = [{name: `Inicio` , icon: `fa-solid fa-house`},  {name: `Tallaje` , icon: `fas fa-cogs`}, {name: "Piezas"} ,  {name: "Crear"}];
  public listTiposPiezas : any[] = [];

  constructor(public routerActive: ActivatedRoute, private service: PiezasService, 
    private helperService: HelperService) { 

    this.routerActive.params.subscribe(e => this.id = e.id);
    
    this.frmPiezas = new FormGroup({
      Codigo: new FormControl(null, [Validators.required , Validators.maxLength(20)]),
      Nombre: new FormControl(null, [Validators.required  , Validators.maxLength(100)]),
      TipoPiezaId: new FormControl(null),
      Estado: new FormControl(true, Validators.required)
    });
  }

  ngOnInit(): void {
    this.buildSelect()
    if (this.id != undefined && this.id != null) {
      this.titulo = `Editar Piezas`;
      this.service.getById("Piezas", this.id).subscribe(l => {
        this.frmPiezas.controls.Codigo.setValue(l.data.codigo);
        this.frmPiezas.controls.Nombre.setValue(l.data.nombre);
        this.frmPiezas.controls.TipoPiezaId.setValue(l.data.tipoPiezaId);
        this.frmPiezas.controls.Estado.setValue(l.data.estado);
      })
    }else {
      this.titulo = `Crear Piezas`;
    }
  }

  buildSelect(){
    this.service.getAll("TiposPiezas").subscribe(l => {
      this.listTiposPiezas = l.data
    })
  }

  save() {
    if (this.frmPiezas.invalid) {
      this.statusForm  = false
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }
    let data  = { 
      id: this.id ?? 0,
      ...this.frmPiezas.value
    };
    this.service.save("Piezas", this.id, data).subscribe(l => {
      if (!l.status) {
        // this.modalActive.close();
        this.helperService.showMessage(MessageType.ERROR, Messages.SAVEERROR)
      } else {
        if (!this.id) {
          this.helperService.redirectApp(`tallaje/piezas/editar/${l.data.id}`);
        }
        // this.modalActive.close(true);
        this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS)
      }
    })
  }

  cancel() {
    this.helperService.redirectApp(`tallaje/piezas`);
  }

}
