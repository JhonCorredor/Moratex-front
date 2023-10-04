import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OrdenesProduccionService } from '../ordenes-produccion.service';
import { HelperService, MessageType, Messages } from 'src/app/admin/helper.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GeneralParameterService } from 'src/app/parameters/general-parameter/general-parameter.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-op-detail-form',
  templateUrl: './op-detail-form.component.html',
  styleUrls: ['./op-detail-form.component.css']
})
export class OpDetailFormComponent implements OnInit {

  public frmOPDetail! : FormGroup;
  public statusForm : boolean = true
  public id! : number;
  public ordenProduccionId! : number;
  public botones = ['btn-guardar', 'btn-cancelar'];
  public titulo = "";
  public listEmpleados = [];

  constructor(public routerActive: ActivatedRoute, 
    private service: OrdenesProduccionService , 
    public helperService: HelperService, 
    private modalActive: NgbActiveModal,
    private generalService: GeneralParameterService,
    private datePipe: DatePipe) 
  { }

  ngOnInit(): void {
    this.buildForm();
    this.buildSelect();
    if (this.id != undefined && this.id != null) {
      this.titulo = "Editar Detalle";
      this.service.getOPDetallesById(this.id).subscribe(({data}) => {

          this.frmOPDetail.patchValue({
            Avance: data.avance,
            Fecha: this.datePipe.transform(data.fecha, 'yyyy-MM-dd'),
            Observacion: data.observacion,
            EmpleadoId: data.empleadoId,
          });


        })
    }else {
      this.titulo = "Crear Detalle";
    }
  }

  buildSelect() {
    this.service.getAll("Empleados").subscribe(({data}) => {
      this.listEmpleados = data;
    });
  }

  buildForm(): void {
    this.frmOPDetail = new FormGroup({
      Avance : new FormControl(null, Validators.required),
      Fecha : new FormControl(null, Validators.required),
      Observacion : new FormControl(null, Validators.required),
      EmpleadoId : new FormControl(null, Validators.required)
     });
  }

  save() {
    if (this.frmOPDetail.invalid) {
      this.statusForm  = false
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }
    let data  = { 
      id: this.id ?? 0,
      Avance: this.helperService.formatearNumeroDB(this.frmOPDetail.controls.Avance.value.toString()),
      Fecha: this.frmOPDetail.controls.Fecha.value,
      Observacion: this.frmOPDetail.controls.Observacion.value,
      EmpleadoId: this.frmOPDetail.controls.EmpleadoId.value,
      OrdenProduccionId: this.ordenProduccionId,
    };
    this.service.saveOPDetalles(this.id, data).subscribe(l => {
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
