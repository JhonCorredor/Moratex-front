import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  HelperService,
  Messages,
  MessageType,
} from 'src/app/admin/helper.service';
import { ArchivoService } from 'src/app/parameters/archivo/archivo.service';
import { PersonasService } from '../personas.service';
import { PersonasIndexComponent } from '../personas-index/personas-index.component';

@Component({
  selector: 'app-personas-form',
  templateUrl: './personas-form.component.html',
  styleUrls: ['./personas-form.component.css'],
})
export class PersonasFormComponent implements OnInit {
  @ViewChild(PersonasIndexComponent)
  personasIndexComponent!: PersonasIndexComponent;

  public frmPersonas: FormGroup;
  public statusForm: boolean = true;
  public radicado = false;
  public id!: number;
  public dataArchivo: any = undefined;
  public img = '../../../../assets/imagen-usuario.png';
  public botones = ['btn-guardar', 'btn-cancelar'];
  public titulo = '';
  public listCiudades = [];
  public listGeneros: any[] = [];
  public ListTipoIdentificacion: any[] = [];

  constructor(
    public routerActive: ActivatedRoute,
    private service: PersonasService,
    private helperService: HelperService,
    private modalActive: NgbActiveModal,
    private ArchivoService: ArchivoService,
    private router: Router
  ) {
    this.frmPersonas = new FormGroup({
      Documento: new FormControl(null, [
        Validators.required,
        Validators.maxLength(20),
      ]),
      TipoDocumento: new FormControl(null, [Validators.required]),
      PrimerNombre: new FormControl(null),
      SegundoNombre: new FormControl(null, [Validators.maxLength(100)]),
      PrimerApellido: new FormControl(null, [
        Validators.required,
        Validators.maxLength(100),
      ]),
      SegundoApellido: new FormControl(null, [Validators.maxLength(100)]),
      Email: new FormControl(null, [Validators.maxLength(50)]),
      Direccion: new FormControl(null, [
        Validators.required,
        Validators.maxLength(150),
      ]),
      Telefono: new FormControl(null, [
        Validators.required,
        Validators.maxLength(50),
      ]),
      Estado: new FormControl(true, Validators.required),
      Ciudad_Id: new FormControl(null, Validators.required),
      Genero: new FormControl(null, [Validators.required]),
      imagenPersonaId_Id: new FormControl(null),
    });
  }

  ngOnInit(): void {
    if (this.id != undefined && this.id != null) {
      this.titulo = 'Editar Persona';
      this.service.getById(this.id).subscribe(({ data }: any) => {
        this.frmPersonas.controls.Documento.setValue(data.documento);
        this.frmPersonas.controls.TipoDocumento.setValue(data.tipoDocumento);
        this.frmPersonas.controls.PrimerNombre.setValue(data.primerNombre);
        this.frmPersonas.controls.SegundoNombre.setValue(data.segundoNombre);
        this.frmPersonas.controls.PrimerApellido.setValue(data.primerApellido);
        this.frmPersonas.controls.SegundoApellido.setValue(
          data.segundoApellido
        );
        this.frmPersonas.controls.Genero.setValue(data.genero);
        this.frmPersonas.controls.Email.setValue(data.email);
        this.frmPersonas.controls.Direccion.setValue(data.direccion);
        this.frmPersonas.controls.Telefono.setValue(data.telefono);
        this.frmPersonas.controls.Estado.setValue(data.estado);
        this.frmPersonas.controls.Ciudad_Id.setValue(data.ciudad_Id);
        this.frmPersonas.controls.Genero.setValue(data.genero);

        if (data.imagenPersonaId_Id > 0) {
          this.ArchivoService.getArchivoById(data.imagenPersonaId_Id).subscribe(
            ({ data }) => {
              this.img = data.archivo;
              this.frmPersonas.controls.imagenPersonaId_Id.setValue(data.id);
            }
          );
        }
      });
    } else {
      this.titulo = 'Crear persona';
    }
    this.cargarCiudades();
  }

  cargarCiudades() {
    this.service.getAll('Ciudades').subscribe((res) => {
      this.listCiudades = res.data;
    });

    this.ListTipoIdentificacion = [
      { id: 'CC', textoMostrar: 'Cedula de Ciudadania' },
      { id: 'PAS', textoMostrar: 'Pasaporte' },
      { id: 'TI', textoMostrar: 'Tarjeta de Identidad' },
      { id: 'CE', textoMostrar: 'Cedula de Extranjeria' },
    ];

    this.listGeneros = [
      { id: 1, textoMostrar: 'Masculino' },
      { id: 2, textoMostrar: 'Femenino' },
    ];
  }

  save() {
    if (this.frmPersonas.invalid) {
      this.statusForm = false
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }

    if (this.dataArchivo != undefined && this.dataArchivo != null) {
      this.ArchivoService.save(this.dataArchivo).subscribe(l => {
        if (l.status != "Error") {
          this.frmPersonas.controls.imagenPersonaId_Id.setValue(l.data.id);
          this.guardarPersona();
          this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS);
        } else {
          this.helperService.showMessage(MessageType.ERROR, Messages.SAVEERROR);
        }
      })
    } else {
      this.guardarPersona()
    }
  }

  guardarPersona() {
    let data = {
      id: this.id ?? 0,
      ...this.frmPersonas.value,
    };

    this.service.save(this.id, data).subscribe((l) => {
      if (!l.status) {
        this.helperService.showMessage(MessageType.ERROR, Messages.SAVEERROR);
      } else {
        this.helperService.showMessage(
          MessageType.SUCCESS,
          Messages.SAVESUCCESS
        );
        this.modalActive.close(null);
      }
    });
  }

  cancel() {
    this.modalActive.close(null);
  }

  fileEvent(event: any) {
    let archivo: any;
    let type = event.target.files[0].type.split('/')[1];
    let { name } = event.target.files[0];
    if (type == 'png' || type == 'jpeg' || type == 'jpg') {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = async (e: any) => {
        archivo = await e.target.result; //imagen en base 64
        this.dataArchivo = {
          Tabla: 'Persona',
          TablaId: 1,
          Extension: type,
          Archivo: archivo,
          Nombre: name,
          Estado: true,
        };
        this.img = archivo;
      };
    }
  }
}
