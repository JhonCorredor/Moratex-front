import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  HelperService,
  Messages,
  MessageType,
} from 'src/app/admin/helper.service';
import { GeneralKeyParameterService } from '../general-key-parameter.service';

@Component({
  selector: 'app-generalKey-parameter-form',
  templateUrl: './general-key-parameter-form.component.html',
  styleUrls: ['./general-key-parameter-form.component.css'],
})
export class GeneralKeyParameterFormComponent implements OnInit {
  public frmGeneralKey: FormGroup;
  public statusForm: boolean = true;
  public id!: number;
  public botones = ['btn-guardar', 'btn-cancelar'];
  public titulo = '';
  public serviceName: String = '';
  public titleData: String = '';
  public foreignKeyRuta: string = '';
  public foreignKeyTitle: string = '';
  public serviceKey: string = '';
  public lista: any[] = [];

  constructor(
    public routerActive: ActivatedRoute,
    private service: GeneralKeyParameterService,
    private helperService: HelperService,
    private modalActive: NgbActiveModal
  ) {
    this.frmGeneralKey = new FormGroup({
      Codigo: new FormControl(null, [
        Validators.required,
        Validators.maxLength(20),
      ]),
      Nombre: new FormControl(null, [
        Validators.required,
        Validators.maxLength(100),
      ]),
      Estado: new FormControl(true, Validators.required),
      Foranea_Id: new FormControl(null, Validators.required),
    });
  }

  ngOnInit(): void {
    if (this.id != undefined && this.id != null) {
      this.titulo = `Editar ${this.titleData}`;
      this.service.getById(this.serviceName, this.id).subscribe((l) => {
        this.frmGeneralKey.controls.Estado.setValue(l.data.estado);
        this.frmGeneralKey.controls.Codigo.setValue(l.data.codigo);
        this.frmGeneralKey.controls.Nombre.setValue(l.data.nombre);
        this.frmGeneralKey.controls.Foranea_Id.setValue(
          l.data[this.foreignKeyRuta + 'Id']
        );
      });
    } else {
      this.titulo = `Crear ${this.titleData}`;
    }

    this.cargarListaForeingKey();
  }

  cargarListaForeingKey() {
    this.service.getAll(this.serviceKey).subscribe((r) => {
      this.lista = r.data;
    });
  }

  save() {
    if (this.frmGeneralKey.invalid) {
      this.statusForm = false;
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }
    let data = {
      id: this.id ?? 0,
      [this.foreignKeyRuta + '_' + 'Id']:
        this.frmGeneralKey.controls.Foranea_Id.value,
      ...this.frmGeneralKey.value,
    };
    this.service.save(this.serviceName, this.id, data).subscribe((l) => {
      if (!l.status) {
        this.modalActive.close();
        this.helperService.showMessage(MessageType.ERROR, Messages.SAVEERROR);
      } else {
        this.modalActive.close(true);
        this.helperService.showMessage(
          MessageType.SUCCESS,
          Messages.SAVESUCCESS
        );
      }
    });
  }

  cancel() {
    this.modalActive.close();
  }
}
