import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { PersonasService } from '../../personas/personas.service';
import { UsuariosService } from '../usuarios.service';

@Component({
  selector: 'app-usuarios-password-form',
  templateUrl: './usuarios-password-form.component.html',
  styleUrls: ['./usuarios-password-form.component.css']
})
export class UsuariosPasswordFormComponent implements OnInit {

  public frmUsuarios: FormGroup;
  public statusForm : boolean = true
  public id! : number;
  public botones = ['btn-guardar', 'btn-cancelar'];
  public titulo = "";

  constructor(public routerActive: ActivatedRoute, private service: UsuariosService, private helperService: HelperService, private modalActive: NgbActiveModal, private Personasservice: PersonasService) { 
    this.frmUsuarios = new FormGroup({      
      Usuario: new FormControl(null, [Validators.required , Validators.maxLength(100)]),
      Password: new FormControl(null, [Validators.required , Validators.maxLength(200)]),
      PasswordRepeat: new FormControl(null, [Validators.required , Validators.maxLength(200)])
    });
  }

  ngOnInit(): void {
      this.titulo = "Editar Contraseña";
      this.service.getById(this.id).subscribe(l => {
        this.frmUsuarios.controls.Usuario.setValue(l.data.usuario);
      })
  }


  save() {
    if (this.frmUsuarios.invalid) {
      this.statusForm  = false
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }
    if (this.frmUsuarios.controls.Password.value === this.frmUsuarios.controls.PasswordRepeat.value) {
      let data  = { 
        id: this.id ?? 0,
        ...this.frmUsuarios.value
      };
      this.service.updatePassword(this.id, data).subscribe(l => {
        if (!l.status) {
          this.modalActive.close();
          this.helperService.showMessage(MessageType.ERROR, Messages.SAVEERROR)
        } else {
          this.modalActive.close(true);
          this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS)
        }
      })
    }else{
      this.helperService.showMessage(MessageType.WARNING, Messages.INVALIDPASSWORD);
    }
  }

  cancel() {
    this.modalActive.close();
  }

}
