import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { ArchivoService } from 'src/app/parameters/archivo/archivo.service';
// import { CiudadesService } from '../../ciudades/ciudades.service';
import { PersonasService } from '../personas.service';

@Component({
  selector: 'app-personas-form',
  templateUrl: './personas-form.component.html',
  styleUrls: ['./personas-form.component.css']
})
export class PersonasFormComponent implements OnInit {

  public frmPersonas: FormGroup;
  public statusForm : boolean = true
  public radicado = false 
  public id! : number;
  public dataArchivo : any = undefined
  public img = "../../../../assets/imagen-usuario.png"
  public botones = ['btn-guardar', 'btn-cancelar'];
  public titulo = "";
  public listCiudades = [];
  public listGeneros : any[] = [];
  public ListTipoIdentificacion: any[] = [];

  constructor(public routerActive: ActivatedRoute, private service: PersonasService, 
    private helperService: HelperService, private modalActive: NgbActiveModal, 
    private ArchivoService: ArchivoService
    ) { 
    this.frmPersonas = new FormGroup({
      NumeroIdentificacion: new FormControl(null, [Validators.required , Validators.maxLength(20)]),
      TipoDocumento: new FormControl(null, [Validators.required]),
      PrimerNombre: new FormControl(null, [Validators.required , Validators.maxLength(100)]),
      SegundoNombre: new FormControl(null, [Validators.maxLength(100)]),
      PrimerApellido: new FormControl(null, [Validators.required , Validators.maxLength(100)]),
      SegundoApellido: new FormControl(null, [Validators.maxLength(100)]),
      Email: new FormControl(null, [Validators.maxLength(50)]),
      Direccion: new FormControl(null, [Validators.required , Validators.maxLength(150)]),
      Telefono: new FormControl(null, [Validators.required , Validators.maxLength(50)]),
      Estado: new FormControl(true, Validators.required),
      CiudadId: new FormControl(null, Validators.required),
      Genero: new FormControl(1, Validators.required),
      ImagenPersonaId: new FormControl(null),
    });
  }

  ngOnInit(): void {
    if (this.id != undefined && this.id != null) {
      this.titulo = "Editar Persona";
      this.service.getById(this.id).subscribe(({data} : any) => {
        this.frmPersonas.controls.NumeroIdentificacion.setValue(data.numeroIdentificacion);
        this.frmPersonas.controls.TipoDocumento.setValue(data.tipoDocumento);
        this.frmPersonas.controls.PrimerNombre.setValue(data.primerNombre);
        this.frmPersonas.controls.SegundoNombre.setValue(data.segundoNombre);
        this.frmPersonas.controls.PrimerApellido.setValue(data.primerApellido);
        this.frmPersonas.controls.SegundoApellido.setValue(data.segundoApellido);
        this.frmPersonas.controls.Genero.setValue(data.genero);
        this.frmPersonas.controls.Email.setValue(data.email);
        this.frmPersonas.controls.Direccion.setValue(data.direccion);
        this.frmPersonas.controls.Telefono.setValue(data.telefono);
        this.frmPersonas.controls.Estado.setValue(data.estado);
        this.frmPersonas.controls.CiudadId.setValue(data.ciudadId);
        this.frmPersonas.controls.Genero.setValue(data.genero);

        if(data.imagenPersonaId > 0){
          this.ArchivoService.getArchivoById(data.imagenPrendaId).subscribe(({data}) => {
          this.img = data.archivo;
          this.frmPersonas.controls.ImagenPersonaId.setValue(data.id);
        })}
      })
    }else {
      this.titulo = "Crear persona";
    }
    this.cargarCiudades();
  }

  cargarCiudades() {
    this.service.getAll("Ciudades").subscribe(res => {
      this.listCiudades = res.data;
    })

    this.ListTipoIdentificacion = [
      { "id": "CC", "textoMostrar": "Cedula de Ciudadania" },
      { "id": "PAS", "textoMostrar": "Pasaporte" },
      { "id": "TI", "textoMostrar": "Tarjeta de Identidad" },
      { "id": "CE", "textoMostrar": "Cedula de Extranjeria" },
    ]

    this.listGeneros = [
      {id: 1, textoMostrar: "Masculino"},
      {id: 2, textoMostrar: "Femenino"},
    ]

  }

  save() {
    if (this.frmPersonas.invalid) {
      this.statusForm  = false
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }
    if (this.id != undefined && this.id != null) {
      if (this.dataArchivo != undefined) {
        this.ArchivoService.delete(this.frmPersonas.controls.ImagenPersonaId.value).subscribe(() => {})
        this.ArchivoService.save(this.dataArchivo).subscribe(l => {
          if (l.status != "Error") {
            this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS)
            this.frmPersonas.controls.ImagenPersonaId.setValue(l.data.id);
            this.guardarPersona()
          } else {
            this.helperService.showMessage(MessageType.ERROR, Messages.SAVEERROR)
          }
        })
      } else {
        this.guardarPersona()
      }
    } else {
      this.ArchivoService.save(this.dataArchivo).subscribe(l => {
        if (l.status != "Error") {
          this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS)
          this.frmPersonas.controls.ImagenPersonaId.value.setValue(l.data.id);
          this.guardarPersona()
        } else {
          this.helperService.showMessage(MessageType.ERROR, Messages.SAVEERROR)
        }
      })
    }
  }

  guardarPersona(){
    let data  = { 
      id: this.id ?? 0,
      ...this.frmPersonas.value
    };
   
    this.service.save(this.id, data).subscribe(l => {
      if (!l.status) {
        this.modalActive.close(null);
        this.helperService.showMessage(MessageType.ERROR, Messages.SAVEERROR)
      } else {
        if(this.id != undefined && this.id != null) {
          this.modalActive.close(true);
          this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS)
          return;
        }
        this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS)
        this.modalActive.close({id: l.data.id});
      }
    })
  }

  public fileEvent(event: any) {
    let archivo: any
    let type = event.target.files[0].type.split('/')[1];
    let { name } = event.target.files[0];
    if (type == "png" || type == "jpeg" || type == "jpg") {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = async (e: any) => {
        archivo = await e.target.result; //imagen en base 64
        this.dataArchivo = {
          Tabla : "Persona",
          TablaId : 1,
          Extension: type,
          Archivo: archivo,
          Nombre: name,
          Estado : true
        }
        this.img = archivo
      };
    }
  }




  cancel() {
    this.modalActive.close(null);
  }

}
