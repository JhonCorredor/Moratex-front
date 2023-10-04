import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { ArchivoService } from 'src/app/parameters/archivo/archivo.service';
import { GeneralParameterService } from 'src/app/parameters/general-parameter/general-parameter.service';
import { PrendasService } from '../prendas.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-prendas-form',
  templateUrl: './prendas-form.component.html',
  styleUrls: ['./prendas-form.component.css']
})
export class PrendasFormComponent implements OnInit {
  
  public frmPrendas: FormGroup;
  public statusForm : boolean = true
  public id! : number;
  public img = "../../../../assets/imagen-usuario.png"
  public dataArchivo : any = undefined
  public botones = ['btn-guardar', 'btn-cancelar'];
  public titulo = "";
  public breadcrumb = [{name: `Inicio` , icon: `fa-solid fa-house`},   {name: "Parametros" , icon: "fas fa-cogs"}, {name: "Prendas"}, {name: "Crear"}];
  public listTipoPrenda = [];
  
  constructor(private http: HttpClient, public routerActive: ActivatedRoute, private service: PrendasService,public helperService: HelperService, private generalService: GeneralParameterService,private ArchivoService: ArchivoService) { 
    this.frmPrendas = new FormGroup({
      Nombre: new FormControl(null, [Validators.required , Validators.maxLength(100)]),
      Descripcion: new FormControl(null, [Validators.required , Validators.maxLength(500)]),
      Ancho: new FormControl(null, [ Validators.pattern(/^-?\d*[.,]?\d{2,18}$/ )]),
      Longitud: new FormControl(null, [ Validators.pattern(/^-?\d*[.,]?\d{2,18}$/ )]),
      Aprovechamiento: new FormControl(null, [ Validators.pattern(/^-?\d*[.,]?\d{2,18}$/ )]),
      Tiempo: new FormControl(null, [ Validators.pattern(/^-?\d*[.,]?\d{2,18}$/ )]),
      Estado: new FormControl(true, Validators.required),
      TipoPrendaId: new FormControl(null, Validators.required),
      ImagenPrendaId: new FormControl(null),
    });
    this.routerActive.params.subscribe(l => this.id = l.id);
  }
  
  ngOnInit(): void {
    if (this.id != undefined && this.id != null) {
      this.titulo = "Editar prenda";
      this.service.getById(this.id).subscribe(l => {
        this.frmPrendas.controls.Descripcion.setValue(l.data.descripcion);
        this.frmPrendas.controls.Nombre.setValue(l.data.nombre);
        this.frmPrendas.controls.Ancho.setValue(l.data.ancho);
        this.frmPrendas.controls.Longitud.setValue(l.data.longitud);
        this.frmPrendas.controls.Aprovechamiento.setValue(l.data.aprovechamiento);
        this.frmPrendas.controls.Tiempo.setValue(l.data.tiempo);
        this.frmPrendas.controls.Estado.setValue(l.data.estado);
        this.frmPrendas.controls.TipoPrendaId.setValue(l.data.tipoPrendaId);
        
        if(l.data.imagenPrendaId > 0){
          this.ArchivoService.getArchivoById(l.data.imagenPrendaId).subscribe(({data}) => {
            this.img = data.archivo;
            this.frmPrendas.controls.ImagenPrendaId.setValue(data.id);
          })
        }
      })
    }else {
      this.titulo = "Crear prenda";
    }
    this.cargarTiposPrendas();
  }
  
  cargarTiposPrendas() {
    this.generalService.getAll("TiposPrendas").subscribe(res => {
      this.listTipoPrenda = res.data;
    })
  }
  
  save() {
    if (this.frmPrendas.invalid) {
      this.statusForm  = false
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }
    
    if (this.id != undefined && this.id != null) {
      if(this.dataArchivo != undefined){
        this.ArchivoService.delete(this.frmPrendas.controls.ImagenPrendaId.value).subscribe(() => {})
        this.ArchivoService.save(this.dataArchivo).subscribe(l => {
          if (l.status != "Error") {
            this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS)
            this.frmPrendas.controls.ImagenPrendaId.setValue(l.data.id);
            this.guardarPrenda()
          } else {
            this.helperService.showMessage(MessageType.ERROR, Messages.SAVEERROR)
          }
        })
      }else{
        this.guardarPrenda()
      }
    } else {
      if (!this.dataArchivo) {
        this.getBase64FromImgSrc(this.img);
      }
      this.ArchivoService.save(this.dataArchivo).subscribe(l => {
        if (l.status != "Error") {
          this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS)
          this.frmPrendas.controls.ImagenPrendaId.setValue(l.data.id);
          this.guardarPrenda()
        } else {
          this.helperService.showMessage(MessageType.ERROR, Messages.SAVEERROR)
        }
      })
    }
  }
  
  guardarPrenda(){
    let data  = { 
      id: this.id ?? 0,
      ...this.frmPrendas.value
    };
    this.service.save(this.id, data).subscribe(
      res => {
        this.helperService.redirectApp(`tallaje/prendas/editar/${res.data.id}`);
        this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS)
      },
      error => {
        this.helperService.showMessageError(error)
      }
    )
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
          Tabla : "Prenda",
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
    this.helperService.redirectApp('tallaje/prendas');
  }

  getBase64FromImgSrc(imgSrc: string): void {
    this.http.get(imgSrc, { responseType: 'blob' }).subscribe((blob: Blob) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        this.dataArchivo = {
          Tabla : "Prenda",
          TablaId : 1,
          Extension: 'png',
          Archivo: reader.result,
          Nombre: name,
          Estado : true
        }
      };
    });
  }
  
}
