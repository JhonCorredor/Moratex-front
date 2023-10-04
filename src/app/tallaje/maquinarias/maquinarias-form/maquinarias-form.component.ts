import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { GeneralParameterService } from 'src/app/parameters/general-parameter/general-parameter.service';

@Component({
  selector: 'app-maquinarias-form',
  templateUrl: './maquinarias-form.component.html',
  styleUrls: ['./maquinarias-form.component.css']
})
export class MaquinariasFormComponent implements OnInit {

  public frmGeneral: FormGroup;
  public statusForm : boolean = true
  public id! : number;
  public botones = ['btn-guardar', 'btn-cancelar'];
  public titulo = "";

  constructor(public routerActive: ActivatedRoute, private service: GeneralParameterService, private helperService: HelperService, private modalActive: NgbActiveModal) { 
    this.frmGeneral = new FormGroup({
      Codigo: new FormControl(null, [Validators.required , Validators.maxLength(20)]),
      Nombre: new FormControl(null, [Validators.required  , Validators.maxLength(100)]), 
      Descripcion: new FormControl(null, [Validators.required  , Validators.maxLength(500)]), 
      Estado: new FormControl(true, Validators.required)
    });
  }

  ngOnInit(): void {
    if (this.id != undefined && this.id != null) {
      this.titulo = `Editar maquinaria`;
      this.service.getById("Maquinarias", this.id).subscribe(l => {
        this.frmGeneral.controls.Codigo.setValue(l.data.codigo);
        this.frmGeneral.controls.Nombre.setValue(l.data.nombre);
        this.frmGeneral.controls.Estado.setValue(l.data.estado);
        this.frmGeneral.controls.Descripcion.setValue(l.data.descripcion);
      })
    }else {
      this.titulo = `Crear maquinaria`;
    }
  }

  save() {
    if (this.frmGeneral.invalid) {
      this.statusForm  = false
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }
    let data  = { 
      id: this.id ?? 0,
      ...this.frmGeneral.value
    };
    this.service.save("Maquinarias", this.id, data).subscribe(l => {
      if (!l.status) {
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
