import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { RolesService } from '../roles.service';

@Component({
  selector: 'app-roles-form',
  templateUrl: './roles-form.component.html',
  styleUrls: ['./roles-form.component.css']
})
export class RolesFormComponent implements OnInit {

  public frmRoles: FormGroup;
  public statusForm : boolean = true
  public id! : number;
  public botones = ['btn-guardar', 'btn-cancelar'];
  public titulo = "";
  public breadcrumb = [{name: `Inicio` , icon: `fa-duotone fa-house`},  {name: `Inicio` , icon: `fa-duotone fa-lock`}, {name: "Roles", icon: "fa-duotone fa-user-tag"} ,  {name: "Crear"}];


  constructor(public routerActive: ActivatedRoute, private service: RolesService, 
    private helperService: HelperService) { 

    this.routerActive.params.subscribe(e => this.id = e.id);
    

    this.frmRoles = new FormGroup({
      Codigo: new FormControl(null, [Validators.required , Validators.maxLength(20)]),
      Nombre: new FormControl(null, [Validators.required  , Validators.maxLength(100)]), 
      Estado: new FormControl(true, Validators.required)
    });
  }

  ngOnInit(): void {
    if (this.id != undefined && this.id != null) {
      this.titulo = `Editar Roles`;
      this.service.getById(this.id).subscribe(l => {
        this.frmRoles.controls.Codigo.setValue(l.data.codigo);
        this.frmRoles.controls.Nombre.setValue(l.data.nombre);
        this.frmRoles.controls.Estado.setValue(l.data.estado);
      })
    }else {
      this.titulo = `Crear Roles`;
    }
  }

  save() {
    if (this.frmRoles.invalid) {
      this.statusForm  = false
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }
    let data  = { 
      id: this.id ?? 0,
      ...this.frmRoles.value
    };
    this.service.save(this.id, data).subscribe(l => {
      if (!l.status) {
        // this.modalActive.close();
        this.helperService.showMessage(MessageType.ERROR, Messages.SAVEERROR)
      } else {
        if (!this.id) {
          this.helperService.redirectApp(`seguridad/roles/editar/${l.data.id}`);
        }
        // this.modalActive.close(true);
        this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS)
      }
    })
  }

  cancel() {
    this.helperService.redirectApp(`seguridad/roles`);
  }

}
