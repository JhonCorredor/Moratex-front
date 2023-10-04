import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder,  FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { GeneralParameterService } from 'src/app/parameters/general-parameter/general-parameter.service';
import { FormulariosService } from '../formularios.service';

@Component({
  selector: 'app-formularios-form',
  templateUrl: './formularios-form.component.html',
  styleUrls: ['./formularios-form.component.css']
})
export class FormulariosFormComponent implements OnInit {

  // @ViewChild("iconoHTML" , {static: false , read : ""}) iconoHtml : any[] = []
  public frmFormularios! : FormGroup;
  public statusForm : boolean = true
  public id! : number;
  public botones = ['btn-guardar', 'btn-cancelar'];
  public titulo = "";
  public listModulos = [];
  public listIcons : any[] = [];

  constructor(public routerActive: ActivatedRoute, private service : FormulariosService , private helperService: HelperService, private modalActive: NgbActiveModal , private fb: FormBuilder, private generalService: GeneralParameterService) 
  { }

  ngOnInit(): void {
    this.BuildForm();
    if (this.id != undefined && this.id != null) {
      this.titulo = "Editar Formularios";
      this.service.getFormulariosById(this.id).subscribe(({data}) => {
        this.frmFormularios.controls.Codigo.setValue(data.codigo);
        this.frmFormularios.controls.Nombre.setValue(data.nombre);
        this.frmFormularios.controls.ModuloId.setValue(data.moduloId);
        this.frmFormularios.controls.Url.setValue(data.url);
        this.frmFormularios.controls.Estado.setValue(data.estado);

        let id =  this.listIcons.findIndex((element : any) => element.textoMostrar == data.icono  )
        const iconoHtml : any = document.getElementById('icon'+id)
        iconoHtml.style.backgroundColor  = "gray" ;
        this.frmFormularios.controls.Icono.setValue(data.icono);
      })
    }else {
      this.titulo = "Crear Formularios";
    }
    this.generalService.getAll("Modulos").subscribe(res => this.listModulos = res.data);
  }

  BuildForm(): void {

    this.frmFormularios = this.fb.group({
      Codigo: [null, [Validators.required , Validators.maxLength(50)]],
      Nombre: [null, [Validators.required  , Validators.maxLength(100)]],
      Url : [null, [Validators.required , Validators.maxLength(200)]],
      ModuloId: [null, [Validators.required]],
      Icono : [null, [Validators.required]],
      Estado: [true, [Validators.required]]
    });

    this.listIcons = [
      { textoMostrar :"fa-solid fa-user"  , name : "user"} ,
      { textoMostrar :"fa-solid fa-play" ,  name : "play" } ,
      { textoMostrar :"fa-solid fa-location-pin" ,  name : "location" } , 
      { textoMostrar :"fa-solid fa-eye" ,   name : "eye" },
      { textoMostrar :"fa-solid fa-boxes-stacked" ,   name : "boxes"},
      { textoMostrar :"fa-solid fa-cart-shopping" ,   name : "cart"},
      { textoMostrar :"fa-solid fa-lock" ,   name : "security"},
      { textoMostrar :"fa-solid fa-folder" ,   name : "folder"},
      { textoMostrar :"fa-solid fa-briefcase" ,   name : "boxes"},
      { textoMostrar :"fa-solid fa-handshake" ,   name : "boxes"}
    ]
  }

  iconoSelect(icon : number , card : any){
    this.frmFormularios.controls.Icono.setValue(this.listIcons[icon].textoMostrar);

    for (let i = 0; i < this.listIcons.length; i++) {
      const iconoHtml : any = document.getElementById('icon'+i)
      iconoHtml.style.backgroundColor  = "white" ;
    }

    const iconoHtml : any = document.getElementById('icon'+icon)
    iconoHtml.style.backgroundColor  = "gray" ;
  }
  
  save() {
    if (this.frmFormularios.invalid) {
      this.statusForm  = false
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }
    let data  = { 
      id: this.id ?? 0,
      ...this.frmFormularios.value,
    };
    this.service.save(this.id, data).subscribe(l => {
      if (l.status == "Error") {
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
