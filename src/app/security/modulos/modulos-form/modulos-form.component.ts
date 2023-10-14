import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { ModulosService } from '../modulos.service';

@Component({
  selector: 'app-modulos-form',
  templateUrl: './modulos-form.component.html',
  styleUrls: ['./modulos-form.component.css']
})
export class ModulosFormComponent implements OnInit {

  public frmModulos: FormGroup;
  public statusForm : boolean = true
  public id! : number;
  public botones = ['btn-guardar', 'btn-cancelar'];
  public titulo = "";
  public listModulos : any[] = [];
  public listIcons : any[] = [];

  constructor(public routerActive: ActivatedRoute, private service: ModulosService, private helperService: HelperService, private modalActive: NgbActiveModal) { 
    this.frmModulos = new FormGroup({
      Codigo: new FormControl(null,[ Validators.required , Validators.maxLength(20)]),
      Nombre: new FormControl(null,[ Validators.required , Validators.maxLength(100)]),
      Icono : new FormControl(null, [Validators.required]),
      Estado: new FormControl(true, Validators.required),
      ModuloPadreId: new FormControl(null)
    });
  }

  ngOnInit(): void {
    this.cargarListaForeingKey();
    if (this.id != undefined && this.id != null) {
      this.titulo = `Editar modulo`;
      this.service.getById(this.id).subscribe(l => {
        this.frmModulos.controls.Estado.setValue(l.data.estado);
        this.frmModulos.controls.Codigo.setValue(l.data.codigo);
        this.frmModulos.controls.Nombre.setValue(l.data.nombre);
        this.frmModulos.controls.ModuloPadreId.setValue(l.data.moduloPadreId);

        let id =  this.listIcons.findIndex((element : any) => element.textoMostrar == l.data.icono  )
        const iconoHtml : any = document.getElementById('icon'+id)
        iconoHtml.style.backgroundColor  = "gray" ;
        this.frmModulos.controls.Icono.setValue(l.data.icono);
      })
    }else {
      this.titulo = `Crear modulo`;
    }


  }

  cargarListaForeingKey() {
    this.service.getAll().subscribe(r => {
      this.listModulos = r.data;
    })

    this.listIcons = [
      { textoMostrar :"fa-duotone fa-user"  , name : "user"} ,
      { textoMostrar :"fa-duotone fa-eye" ,   name : "eye" },
      { textoMostrar :"fa-duotone fa-boxes-stacked" ,   name : "boxes"},
      { textoMostrar :"fa-duotone fa-cart-shopping" ,   name : "cart"},
      { textoMostrar :"fa-duotone fa-lock" ,   name : "security"},
      { textoMostrar :"fa-duotone fa-folder" ,   name : "folder"},
      { textoMostrar :"fa-duotone fa-briefcase" ,   name : "boxes"},
      { textoMostrar :"fa-duotone fa-handshake" ,   name : "boxes"},
      { textoMostrar :"fa-duotone fa-vest-patches" ,   name : "patches"},
      { textoMostrar :"fa-duotone fa-gears" ,   name : "gears"},
      { textoMostrar :"fa-duotone fa-window-maximize" ,   name : "window"}
    ]
  }

  iconoSelect(icon : number , card : any){
    this.frmModulos.controls.Icono.setValue(this.listIcons[icon].textoMostrar);

    for (let i = 0; i < this.listIcons.length; i++) {
      const iconoHtml : any = document.getElementById('icon'+i)
      iconoHtml.style.backgroundColor  = "white" ;
    }

    const iconoHtml : any = document.getElementById('icon'+icon)
    iconoHtml.style.backgroundColor  = "gray" ;
  }


  save() {
    if (this.frmModulos.invalid) {
      this.statusForm  = false
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }
    let data  = { 
      id: this.id ?? 0,
      ...this.frmModulos.value
    };
    this.service.save(this.id, data).subscribe(l => {
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
