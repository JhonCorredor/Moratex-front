
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { RadicadosService } from '../radicado.service';
import { PersonasService } from 'src/app/security/personas/personas.service';
import { PersonasFormComponent } from 'src/app/security/personas/personas-form/personas-form.component';

@Component({
  selector: 'app-radicados-form',
  templateUrl: './radicado-form.component.html',
  styleUrls: ['./radicado-form.component.css']
})
export class RadicadosFormComponent implements OnInit {

  public frmRadicados: FormGroup;
  public statusForm : boolean = true
  public admin : boolean = false ; 
  public id! : number;
  public botones = ['btn-guardar', 'btn-cancelar'];
  public titulo = "";

  public breadcrumb = [{name: `Inicio` , icon: `fa-solid fa-house`},  {name: "Pqrs"}, {name: "Radicado"}];
  public listMedios : any[] = [];
  public listTiposRadicados : any[] = [];
  public listEstados : any[] = [];
  public listEmpleados : any[] = [];
  public listEmpresas : any[] = [];

  
  constructor(public routerActive: ActivatedRoute, private service: RadicadosService, 
    private helperService: HelperService, 
    // private modalActive: NgbActiveModal,
    private modalService: NgbModal,
    private Radicadosservice: RadicadosService,
    private personaService : PersonasService) { 
    this.frmRadicados = new FormGroup({
      NumeroRadicado: new FormControl(null),
      Fecha: new FormControl(null),
      
      Folio: new FormControl(null,[ Validators.pattern(/^([0-9])*$/)]),
      Asunto : new FormControl(null,[ Validators.required , Validators.maxLength(150)]),
      Descripcion : new FormControl(null,[ Validators.required  , Validators.maxLength(500)]),
      Pedido : new FormControl(null,[ Validators.maxLength(500)] ),

      PersonaId : new FormControl(null  , [ Validators.required ]),

      MedioId : new FormControl(null, [ Validators.required ]),
      TipoRadicadoId : new FormControl(null , [ Validators.required ] ),

      EstadoId : new FormControl(null ,  [ Validators.required ]),
      
      EmpleadoId : new FormControl(null),
      EmpresaId : new FormControl(null),    
      
      Estado: new FormControl(true, Validators.required),
      
      NumeroIdentificacion: new FormControl(null, Validators.required),  
      Nombres:  new FormControl(null),
      Apellidos: new FormControl(null),
    });
    this.routerActive.data.subscribe(l => {this.admin = l.admin})
    
    this.routerActive.params.subscribe(l => this.id = l.id);


  }

  ngOnInit(): void {
    if (this.id != undefined && this.id != null) {
      this.titulo = "Editar Radicado";
      this.breadcrumb.push({name: "Editar"})
      this.service.getById(this.id).subscribe(l => {
        this.frmRadicados.controls.NumeroRadicado.setValue(l.data.numeroRadicado);
        this.frmRadicados.controls.Fecha.setValue(l.data.fecha);
        this.frmRadicados.controls.Folio.setValue(l.data.folio);
        this.frmRadicados.controls.Asunto.setValue(l.data.asunto);
        this.frmRadicados.controls.Descripcion.setValue(l.data.descripcion);
        this.frmRadicados.controls.Pedido.setValue(l.data.pedido);
        this.personaService.getById(l.data.personaId).subscribe(l => {
          this.frmRadicados.controls.NumeroIdentificacion.setValue(`${l.data.numeroIdentificacion}`);
          this.frmRadicados.controls.Nombres.setValue(`${l.data.primerNombre} ${l.data.segundoNombre}`);
          this.frmRadicados.controls.Apellidos.setValue(`${l.data.primerApellido} ${l.data.segundoApellido}`);
        })
        this.frmRadicados.controls.PersonaId.setValue(l.data.personaId);
        this.frmRadicados.controls.MedioId.setValue(l.data.medioId);
        this.frmRadicados.controls.TipoRadicadoId.setValue(l.data.tipoRadicadoId);
        this.frmRadicados.controls.EstadoId.setValue(l.data.estadoId);
        this.frmRadicados.controls.EmpleadoId.setValue(l.data.empleadoId);
        this.frmRadicados.controls.EmpresaId.setValue(l.data.empresaId);

        this.frmRadicados.controls.Estado.setValue(l.data.estado);
      })
    }else {
      this.titulo = "Crear Radicado";
      this.frmRadicados.controls.EstadoId.setValue(15);
      if (!this.admin){
        this.frmRadicados.controls.MedioId.setValue(3);
      }
      this.breadcrumb.push({name: "Crear"})
      // this.frmRadicados.controls.MedioId.setValue(); // VITRUAL

    }
    this.buildSelect();
  }

  buildSelect() {

    this.Radicadosservice.getAll("Medios").subscribe(res => {
      this.listMedios = res.data
    })
    this.Radicadosservice.getAll("TiposRadicados").subscribe(res => {
      this.listTiposRadicados = res.data
    })
    this.Radicadosservice.getAll("Estados").subscribe(res => {
      this.listEstados = res.data
    })
    this.Radicadosservice.getAll("Empleados").subscribe(res => {
      this.listEmpleados = res.data
    })
    this.Radicadosservice.getAll("Empresas").subscribe(res => {
      this.listEmpresas = res.data;
    })

  }

  save() {
    if (this.frmRadicados.invalid) {
      this.statusForm  = false
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }

    if (!this.admin){
      this.frmRadicados.controls.Fecha.setValue(new Date());
    }
    let data  = { 
      id: this.id ?? 0,
      ...this.frmRadicados.value
    };
    this.service.save(this.id, data).subscribe(l => {
      if (!l.status) {
        // this.modalActive.close();
        this.helperService.showMessage(MessageType.ERROR, Messages.SAVEERROR)
      } else {
        //  this.modalActive.close(true);
        this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS)
      }
    })
  }

  searchByDocument() {
    this.personaService.getByDocumentNumber(this.frmRadicados.controls.NumeroIdentificacion.value).subscribe(l => {
      if (l.status && l.status == true) { // se deja validado == true porque en caso de no encontrarn un registro el backend devuelve un status 404
        this.frmRadicados.controls.PersonaId.setValue(l.data.id);
        this.frmRadicados.controls.NumeroIdentificacion.setValue(`${l.data.numeroIdentificacion}`);
        this.frmRadicados.controls.Nombres.setValue(`${l.data.primerNombre} ${l.data.segundoNombre}`);
        this.frmRadicados.controls.Apellidos.setValue(`${l.data.primerApellido} ${l.data.segundoApellido}`);
      }
    }, (error : any) => {
      if (error && error.status == 404) {
        // Usuario no existe y se procede a lanzar la modal
        this.helperService.showDesicionCustom("¿Deseas Registrarte?", "Si no estas registrado no podras enviar un pqrs", "warning", () => {
          let modal = this.modalService.open(PersonasFormComponent, {size: 'lg', keyboard: false, backdrop: "static"});
          modal.componentInstance.radicado = true;
          modal.result.then((res : any) => {
            if (res) {
              this.personaService.getById(res.id).subscribe(resPersona => {
                // resPersona
                if (resPersona.status && resPersona.status == true) { // se deja validado == true porque en caso de no encontrarn un registro el backend devuelve un status 404
                  this.frmRadicados.controls.PersonaId.setValue(resPersona.data.id);
                  this.frmRadicados.controls.NumeroIdentificacion.setValue(`${resPersona.data.numeroIdentificacion}`);
                  this.frmRadicados.controls.Nombres.setValue(`${resPersona.data.primerNombre} ${resPersona.data.segundoNombre}`);
                  this.frmRadicados.controls.Apellidos.setValue(`${resPersona.data.primerApellido} ${resPersona.data.segundoApellido}`);
                }
              })
            }
          })
        });
      }
    })
  }



  cancel() {
    if(this.admin){
      this.helperService.redirectApp(`/pqrs/radicado/`);
    }else{
      this.helperService.redirectApp(`/login`);
    }
  }

}
