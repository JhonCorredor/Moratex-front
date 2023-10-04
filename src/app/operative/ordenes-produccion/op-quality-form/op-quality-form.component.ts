import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OrdenesProduccionService } from '../ordenes-produccion.service';
import { HelperService, MessageType, Messages } from 'src/app/admin/helper.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GeneralParameterService } from 'src/app/parameters/general-parameter/general-parameter.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-op-quality-form',
  templateUrl: './op-quality-form.component.html',
  styleUrls: ['./op-quality-form.component.css']
})
export class OpQualityFormComponent implements OnInit {

  public frmOPCalidad! : FormGroup;
  public statusForm : boolean = true
  public id! : number;
  public ordenProduccionId! : number;
  public botones = ['btn-guardar', 'btn-cancelar'];
  public titulo = "";
  public listEmpleados = [];
  public listControlesCalidades = [];

  constructor(public routerActive: ActivatedRoute, 
    private service: OrdenesProduccionService, 
    public helperService: HelperService, 
    private modalActive: NgbActiveModal,
    private generalService: GeneralParameterService,
    private datePipe: DatePipe) 
  { }

  ngOnInit(): void {
    this.buildForm();
    this.buildSelect();
    if (this.id != undefined && this.id != null) {
      this.titulo = "Editar Calidad";
      this.service.getOPCalidadById(this.id).subscribe(({data}) => {

          this.frmOPCalidad.patchValue({
            ControlCalidadId: data.controlCalidadId,
            Fecha: this.datePipe.transform(data.fecha, 'yyyy-MM-dd'),
            Observacion: data.observacion,
            EmpleadoId: data.empleadoId,
          });


        })
    }else {
      this.titulo = "Crear Calidad";
    }
  }

  buildSelect() {
    this.service.getAll("Empleados").subscribe(({data}) => {
      this.listEmpleados = data;
    });
    this.service.getAll("ControlesCalidades").subscribe(({data}) => {
      this.listControlesCalidades = data;
    });
  }

  buildForm(): void {
    this.frmOPCalidad = new FormGroup({
      ControlCalidadId : new FormControl(null, Validators.required),
      Fecha : new FormControl(null, Validators.required),
      Observacion : new FormControl(null, Validators.required),
      EmpleadoId : new FormControl(null, Validators.required)
     });
  }

  save() {
    if (this.frmOPCalidad.invalid) {
      this.statusForm  = false
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }
    let data  = { 
      id: this.id ?? 0,
      ControlCalidadId: this.frmOPCalidad.controls.ControlCalidadId.value,
      Fecha: this.frmOPCalidad.controls.Fecha.value,
      Observacion: this.frmOPCalidad.controls.Observacion.value,
      EmpleadoId: this.frmOPCalidad.controls.EmpleadoId.value,
      OrdenProduccionId: this.ordenProduccionId,
    };
    this.service.saveOPCalidad(this.id, data).subscribe(l => {
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
