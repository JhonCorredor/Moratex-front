import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { ControlesCalidadesService } from '../controles-calidades.service';

@Component({
  selector: 'app-controles-calidades-form',
  templateUrl: './controles-calidades-form.component.html',
  styleUrls: ['./controles-calidades-form.component.css']
})
export class ControlesCalidadesFormComponent implements OnInit {

  public frmControlesCalidades: FormGroup;
  public statusForm : boolean = true
  public id! : number;
  public botones = ['btn-guardar', 'btn-cancelar'];
  public titulo = "";

  constructor(public routerActive: ActivatedRoute, private service: ControlesCalidadesService, private helperService: HelperService, private modalActive: NgbActiveModal) { 
    this.frmControlesCalidades = new FormGroup({
      Variable: new FormControl(null, [Validators.required , Validators.maxLength(100)]),
      Estandar: new FormControl(null, [Validators.required  , Validators.maxLength(100)]), 
      CriterioAceptacion: new FormControl(null, [Validators.required  , Validators.maxLength(500)]), 
      TipoCriterio: new FormControl(null, [Validators.required, Validators.maxLength(500)])
    });
  }

  ngOnInit(): void {
    if (this.id != undefined && this.id != null) {
      this.titulo = `Editar controles de calidades`;
      this.service.getById(this.id).subscribe(l => {
        this.frmControlesCalidades.controls.Variable.setValue(l.data.variable);
        this.frmControlesCalidades.controls.Estandar.setValue(l.data.estandar);
        this.frmControlesCalidades.controls.CriterioAceptacion.setValue(l.data.criterioAceptacion);
        this.frmControlesCalidades.controls.TipoCriterio.setValue(l.data.tipoCriterio);
      })
    }else {
      this.titulo = `Crear controles de calidad`;
    }
  }

  save() {
    if (this.frmControlesCalidades.invalid) {
      this.statusForm  = false
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }
    let data  = { 
      id: this.id ?? 0,
      ...this.frmControlesCalidades.value
    };
    this.service.save(this.id, data).subscribe(l => {
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
