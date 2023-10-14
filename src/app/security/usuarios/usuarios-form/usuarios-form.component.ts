import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  HelperService,
  Messages,
  MessageType,
} from 'src/app/admin/helper.service';
import { PersonasService } from '../../personas/personas.service';
import { UsuariosService } from '../usuarios.service';

@Component({
  selector: 'app-usuarios-form',
  templateUrl: './usuarios-form.component.html',
  styleUrls: ['./usuarios-form.component.css'],
})
export class UsuariosFormComponent implements OnInit {
  public frmUsuarios: FormGroup;
  public statusForm: boolean = true;
  public id!: number;
  public botones = ['btn-guardar', 'btn-cancelar'];
  public titulo = '';
  public listPersonas = [];
  public breadcrumb = [
    { name: `Inicio`, icon: `fa-duotone fa-house` },
    { name: 'Seguridad', icon: 'fa-duotone fa-lock' },
    { name: 'Usuario', icon: "fa-duotone fa-users-gear"},
    { name: 'Crear' },
  ];

  constructor(
    public routerActive: ActivatedRoute,
    private service: UsuariosService,
    private helperService: HelperService,
    private Personasservice: PersonasService
  ) {
    this.frmUsuarios = new FormGroup({
      Usuario: new FormControl(null, [
        Validators.required,
        Validators.maxLength(100),
      ]),
      Codigo: new FormControl(null, Validators.required),
      Password: new FormControl(null, [
        Validators.required,
        Validators.maxLength(200),
      ]),
      Estado: new FormControl(true, Validators.required),
      persona_Id: new FormControl(null, Validators.required),
    });
    this.routerActive.params.subscribe((l) => (this.id = l.id));
  }

  ngOnInit(): void {
    if (this.id != undefined && this.id != null) {
      this.titulo = 'Editar usuario';
      this.service.getById(this.id).subscribe((l) => {
        this.frmUsuarios.controls.Usuario.setValue(l.data.usuario);
        this.frmUsuarios.controls.Codigo.setValue(l.data.codigo);
        this.frmUsuarios.controls.Password.setValue(l.data.password);
        this.frmUsuarios.controls.Estado.setValue(l.data.estado);
        this.frmUsuarios.controls.persona_Id.setValue(l.data.persona_Id);
      });
    } else {
      this.titulo = 'Crear usuario';
    }
    this.cargarPersonas();
  }

  cargarPersonas() {
    this.Personasservice.getAll('Personas').subscribe((res) => {
      this.listPersonas = res.data;
    });
  }

  save() {
    if (this.frmUsuarios.invalid) {
      this.statusForm = false;
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }
    let data = {
      id: this.id ?? 0,
      ...this.frmUsuarios.value,
    };
    this.service.save(this.id, data).subscribe((l) => {
      if (!l.status) {
        this.helperService.showMessage(MessageType.ERROR, Messages.SAVEERROR);
      } else {
        this.helperService.redirectApp(
          `seguridad/usuarios/editar/${l.data.id}`
        );
        this.helperService.showMessage(
          MessageType.SUCCESS,
          Messages.SAVESUCCESS
        );
      }
    });
  }

  cancel() {
    this.helperService.redirectApp('seguridad/usuarios');
  }
}
