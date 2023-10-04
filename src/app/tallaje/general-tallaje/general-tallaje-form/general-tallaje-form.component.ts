import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { GeneralTallajeService } from '../general-tallaje.service';

@Component({
  selector: 'app-general-tallaje-form',
  templateUrl: './general-tallaje-form.component.html',
  styleUrls: ['./general-tallaje-form.component.css']
})
export class GeneralTallajeFormComponent implements OnInit {

  public frmGeneral: FormGroup;
  public statusForm : boolean = true
  public id! : number;
  public botones = ['btn-guardar', 'btn-cancelar'];
  public titulo = "";
  public serviceName: String = '';
  private titleData: String = '';
  public foreignKey : string[] = [];
  public lista : any[] = [];
  public generalidad : any[] = [];
  public foreignKeyRuta : string = "";
  public foreignKeyTitle: string = "";
  public serviceKey:string = "";


  public modeloId: any = null;

  constructor(public routerActive: ActivatedRoute ,
    private service: GeneralTallajeService,
     private helperService: HelperService,
     private modalActive: NgbActiveModal
     ) {
    this.frmGeneral = new FormGroup({
      // generaldiadId: new FormControl(null , Validators.required),
      ForaneaId : new FormControl(null, Validators.required),
      Estado: new FormControl(true, Validators.required)
    });
  }

  ngOnInit(): void {
    if (this.id != undefined && this.id != null) {
      this.titulo = `Editar ${this.titleData}`;
      this.service.getById(this.serviceName, this.id).subscribe((l: any) => {
        this.frmGeneral.controls.Estado.setValue(l.data.estado);
        this.frmGeneral.controls.ForaneaId.setValue(l.data[this.foreignKeyTitle+"Id"]);
      })
    }else {
      this.titulo = `Asignar ${this.titleData}`;
    } 
    this.cargarListaForeingKey();
  }

  cargarListaForeingKey() {
    this.service.getAll(this.serviceKey).subscribe(r => {
      this.lista = r.data;
    })
  }

  save() {

    if (this.frmGeneral.invalid) {
      this.statusForm  = false
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }

    let data  = {
      id: this.id ?? 0,
      [this.foreignKeyTitle +"Id"]: this.frmGeneral.controls.ForaneaId.value,
      GeneralidadId: Number(this.modeloId),
      ...this.frmGeneral.value
    };

    this.service.save(this.serviceName, this.id, data).subscribe((l : any) => {
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
