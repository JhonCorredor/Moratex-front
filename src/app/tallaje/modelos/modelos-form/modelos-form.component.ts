import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { ArchivoService } from 'src/app/parameters/archivo/archivo.service';
import { ModelosService } from '../modelos.service';

@Component({
  selector: 'app-modelos-form',
  templateUrl: './modelos-form.component.html',   
  styleUrls: ['./modelos-form.component.css']
})
export class ModelosFormComponent implements OnInit {

  public frmModelos: FormGroup;
  public statusForm : boolean = true
  public id! : number;
  public botones = ['btn-guardar', 'btn-cancelar'];
  public titulo = "";
  public breadcrumb = [{name: `Inicio` , icon: `fa-solid fa-house`},  {name: "Tallaje" , icon: "fas fa-cogs"}, {name: "Modelos"}, {name: "Crear"}];
  public img = "../../../../assets/imagen-usuario.png"
  public dataArchivo : any = undefined

  constructor(public routerActive: ActivatedRoute, private service: ModelosService, public helperService: HelperService, private ArchivosService: ArchivoService) { 
    this.frmModelos = new FormGroup({
      Codigo: new FormControl(null, [Validators.required , Validators.maxLength(20)]),
      Precio : new FormControl(null, [Validators.required , Validators.pattern(/^([0-9])*$/)]),
      Nombre: new FormControl(null, [Validators.required , Validators.maxLength(100)]),
      Estado: new FormControl(true, Validators.required),
      ImagenModeloId: new FormControl(null),
    });
    this.routerActive.params.subscribe(l => this.id = l.id);
  }

  ngOnInit(): void {
    if (this.id != undefined && this.id != null) {
      this.titulo = "Editar Modelo";
      this.service.getById(this.id).subscribe(l => {
        this.frmModelos.controls.Codigo.setValue(l.data.codigo);
        this.frmModelos.controls.Nombre.setValue(l.data.nombre);
        this.frmModelos.controls.Precio.setValue(l.data.precio);
        this.frmModelos.controls.Estado.setValue(l.data.estado);

        if (l.data.imagenModeloId) {
          this.ArchivosService.getArchivoById(l.data.imagenModeloId).subscribe(({data}) => {
            this.img = data.archivo;
            this.frmModelos.controls.ImagenModeloId.setValue(data.id);
          })
        }
      })
    }else {
      this.titulo = "Crear Modelo";
    }

  }

  save() {
    if (this.frmModelos.invalid) {
      this.statusForm  = false
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }
    
    if (this.id != undefined && this.id != null) {
      if(this.dataArchivo != undefined){
        this.ArchivosService.delete(this.frmModelos.controls.ImagenModeloId.value).subscribe(() => {})
        this.ArchivosService.save(this.dataArchivo).subscribe(l => {
          if (l.status != "Error") {
            this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS)
            this.frmModelos.controls.ImagenModeloId.setValue(l.data.id);
            this.saveModel()
          } else {
            this.helperService.showMessage(MessageType.ERROR, Messages.SAVEERROR)
          }
        })
      }else{
        this.saveModel()
      }
      }else{
        this.ArchivosService.save(this.dataArchivo).subscribe(l => {
          if (l.status != "Error") {
            this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS)
            this.frmModelos.controls.ImagenModeloId.setValue(l.data.id);
            this.saveModel()
          } else {
            this.helperService.showMessage(MessageType.ERROR, Messages.SAVEERROR)
          }
        })
      }
  }

  saveModel() {
    let data  = { 
      id: this.id ?? 0,
      ...this.frmModelos.value
    };
    this.service.save(this.id, data).subscribe(l => {
      if (!l.status) {
        this.helperService.showMessage(MessageType.ERROR, Messages.SAVEERROR)
      } else {
        if (!this.id) {
          this.helperService.redirectApp(`tallaje/modelos/editar/${l.data.id}`);
        }
        this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS)
      }
    })
  }

  cancel() {
    this.helperService.redirectApp('tallaje/modelos');
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
          Tabla : "Modelo",
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

}
