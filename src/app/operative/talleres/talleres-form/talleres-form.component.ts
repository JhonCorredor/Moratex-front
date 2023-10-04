import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TalleresService } from '../talleres.service';
import { HelperService, MessageType, Messages } from 'src/app/admin/helper.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GeneralParameterService } from 'src/app/parameters/general-parameter/general-parameter.service';

@Component({
  selector: 'app-talleres-form',
  templateUrl: './talleres-form.component.html',
  styleUrls: ['./talleres-form.component.css']
})
export class TalleresFormComponent implements OnInit {

  public frmTalleres! : FormGroup;
  public statusForm : boolean = true
  public id! : number;
  public botones = ['btn-guardar', 'btn-cancelar'];
  public titulo = "";
  public listEmpresas = [];
  public listEstados = [];

  constructor(public routerActive: ActivatedRoute, private service : TalleresService , private helperService: HelperService, private modalActive: NgbActiveModal, private generalService: GeneralParameterService) { 
    this.frmTalleres = new FormGroup({
      NombrePropietario: new FormControl(null, [Validators.required , Validators.maxLength(50)]),
      Especialidad: new FormControl(null, [Validators.required  , Validators.maxLength(100)]),
      TipoTrabajo : new FormControl(null, [Validators.required , Validators.maxLength(200)]),
      NumeroEmpleado: new FormControl(null, [Validators.required]),
      EmpresaId : new FormControl(null, [Validators.required]),
      EstadoId: new FormControl(null, [Validators.required]),
      Observacion: new FormControl(null, [Validators.required])
    });
  }

  ngOnInit(): void {
    this.getLists();
    if (this.id != undefined && this.id != null) {
      this.titulo = "Editar Talleres";
      this.service.getTallerById(this.id).subscribe(({data}) => {
        this.frmTalleres.controls.NombrePropietario.setValue(data.nombrePropietario);
        this.frmTalleres.controls.Especialidad.setValue(data.especialidad);
        this.frmTalleres.controls.TipoTrabajo.setValue(data.tipoTrabajo);
        this.frmTalleres.controls.NumeroEmpleado.setValue(data.numeroEmpleado);
        this.frmTalleres.controls.EmpresaId.setValue(data.empresaId);
        this.frmTalleres.controls.EstadoId.setValue(data.estadoId);
        this.frmTalleres.controls.Observacion.setValue(data.observacion);
      })
    }else {
      this.titulo = "Crear Talleres";
    }
  }

  getLists() {
    this.generalService.getAll("Empresas").subscribe(res => {
      this.listEmpresas = res.data;
    })
    this.generalService.getAll("Estados").subscribe(res => {
      this.listEstados = res.data;
    })
  }
  
  save() {
    if (this.frmTalleres.invalid) {
      this.statusForm  = false
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }
    let data  = { 
      id: this.id ?? 0,
      ...this.frmTalleres.value,
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
