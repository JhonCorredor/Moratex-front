import { Component, OnInit } from '@angular/core';
import { FormBuilder,  FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { ArchivoService } from '../../archivo/archivo.service';
import { EmpresasService } from '../empresas.service';

@Component({
  selector: 'app-empresas-form',
  templateUrl: './empresas-form.component.html',
  styleUrls: ['./empresas-form.component.css']
})
export class EmpresasFormComponent implements OnInit {
  
  public frmEmpresas! : FormGroup;
  public statusForm : boolean = true
  public id! : number;
  public img = "../../../../assets/imagen-usuario.png"
  public botones = ['btn-guardar', 'btn-cancelar'];
  public breadcrumb = [{name: `Inicio` , icon: `fa-solid fa-house`},   {name: "Parametros" , icon: "fas fa-cogs"}, {name: "Empresas"}, {name: "Crear"}];
  public titulo = "";
  public dataArchivo : any = undefined
  public listCiudades = [];
  
  constructor(public routerActive: ActivatedRoute, private service: EmpresasService , private helperService: HelperService, private fb: FormBuilder ,  private ArchivoService: ArchivoService) { 
    this.routerActive.params.subscribe(l => this.id = l.id);
  }
  
  ngOnInit(): void {
    this.BuildForm();
    if (this.id != undefined && this.id != null) {
      this.titulo = "Editar Empresas";
      this.service.getEmpresasById(this.id).subscribe(({data}) => {
        this.frmEmpresas.controls.Codigo.setValue(data.codigo);
        this.frmEmpresas.controls.RazonSocial.setValue(data.razonSocial);
        this.frmEmpresas.controls.Nit.setValue(data.nit);

        this.ArchivoService.getArchivoById(data.logoId).subscribe(({data}) => {
          this.img = data.archivo;
          this.frmEmpresas.controls.LogoId.setValue(data.id);
        })

        this.frmEmpresas.controls.Marquilla.setValue(data.marquilla);
        this.frmEmpresas.controls.Direccion.setValue(data.direccion);
        this.frmEmpresas.controls.Telefono.setValue(data.telefono);
        this.frmEmpresas.controls.Email.setValue(data.email);
        this.frmEmpresas.controls.Web.setValue(data.web);
        this.frmEmpresas.controls.CiudadId.setValue(data.ciudadId);
        this.frmEmpresas.controls.Estado.setValue(data.estado);
      })
    }else {
      this.titulo = "Crear Empresas";
    }

  }
  
  BuildForm(): void {
    this.frmEmpresas = this.fb.group({
      Codigo: [null , [Validators.required , Validators.maxLength(50)]],
      RazonSocial : [null, [Validators.required , Validators.maxLength(100)]],
      Nit : [null, [Validators.required , Validators.maxLength(50)]],
      Direccion : [null, [ Validators.maxLength(150)]],
      Telefono : [null, [Validators.maxLength(50)]],
      Email : [null, [Validators.maxLength(100)]],
      Web : [null, [ Validators.maxLength(100)]],
      CiudadId : [null, [Validators.required] ],
      LogoId : [0,  ],
      Marquilla: [null, [Validators.required , Validators.maxLength(200)]],
      Estado : [true, [Validators.required]]
    });


    this.service.getAll("Ciudades").subscribe(({data}) => {
      this.listCiudades = data;
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
          Tabla : "Empresa",
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

  save() {
    if (this.frmEmpresas.invalid) {
      this.statusForm  = false
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }

    if (this.id != undefined && this.id != null) {
      if(this.dataArchivo != undefined){
        this.ArchivoService.delete(this.frmEmpresas.controls.LogoId.value).subscribe(() => {})
        this.ArchivoService.save(this.dataArchivo).subscribe(l => {
          if (l.status != "Error") {
            this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS)
            this.frmEmpresas.controls.LogoId.setValue(l.data.id);
            this.guardarEmpresa()
          } else {
            this.helperService.showMessage(MessageType.ERROR, Messages.SAVEERROR)
          }
        })
      }else{
        this.guardarEmpresa()
      }
      }else{
        this.ArchivoService.save(this.dataArchivo).subscribe(l => {
          if (l.status != "Error") {
            this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS)
            this.frmEmpresas.controls.LogoId.setValue(l.data.id);
            this.guardarEmpresa()
          } else {
            this.helperService.showMessage(MessageType.ERROR, Messages.SAVEERROR)
          }
        })
      }
  }

  guardarEmpresa(){
    let data  = { 
      Id: this.id ?? 0,
      ...this.frmEmpresas.value,
    };
    this.service.save(this.id, data).subscribe(l => {
      if (l.status == "Error") {
        this.helperService.showMessage(MessageType.ERROR, Messages.SAVEERROR)
      } else {
        this.helperService.redirectApp(`parametros/empresas/editar/${l.data.id}`);
        this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS)
      }
    })
  }

  
  cancel() {
    this.helperService.redirectApp('parametros/empresas');
  }
  
}
