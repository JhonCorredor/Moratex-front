import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder,  FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { PersonasFormComponent } from 'src/app/security/personas/personas-form/personas-form.component';
import { PersonasService } from 'src/app/security/personas/personas.service';
import { ClientesService } from '../clientes.service';

@Component({
  selector: 'app-clientes-form',
  templateUrl: './clientes-form.component.html',
  styleUrls: ['./clientes-form.component.css']
})
export class ClientesFormComponent implements OnInit {

  public frmClientes! : FormGroup;
  public statusForm : boolean = true
  public id! : number;
  public botones = ['btn-guardar', 'btn-cancelar'];
  public breadcrumb = [{name: `Inicio` , icon: `fa-solid fa-house`},   {name: "Parametros" , icon: "fas fa-cogs"}, {name: "Cliente"}, {name: "Crear"}];
  public titulo = "";
  public listPersonas: any[] = [];


  constructor(public routerActive: ActivatedRoute, 
    private service: ClientesService , 
    private personaService: PersonasService,
    private helperService: HelperService, 
    private fb: FormBuilder,
    private modalService: NgbModal,
    private datePipe: DatePipe    
    ) 
  { 
    this.routerActive.params.subscribe(e => this.id = e.id);
  }

  ngOnInit(): void {
    this.buildForm();
    if (this.id != undefined && this.id != null) {
      this.titulo = "Editar Clientes"; 
      this.service.getClientesById(this.id).subscribe(({data}) => {
        this.frmClientes.controls.Codigo.setValue(data.codigo);
        this.frmClientes.controls.Persona_Id.setValue(data.persona_Id);
        this.frmClientes.controls.Estado.setValue(data.estado);

        this.personaService.getById(data.persona_Id).subscribe(resPersona => {
          resPersona
          if (resPersona.status && resPersona.status == true) { // se deja validado == true porque en caso de no encontrarn un registro el backend devuelve un status 404
            this.frmClientes.controls.Documento.setValue(`${resPersona.data.documento}`);
            this.frmClientes.controls.Nombres.setValue(`${resPersona.data.primerNombre} ${resPersona.data.segundoNombre}`);
            this.frmClientes.controls.Apellidos.setValue(`${resPersona.data.primerApellido} ${resPersona.data.segundoApellido}`);
          }
        })
      })
    }else {
      this.titulo = "Crear Clientes";
    }
  }

  buildForm(): void {
    
    this.frmClientes = this.fb.group({
      Documento: [null, Validators.required],  
      Nombres:  [null],
      Apellidos: [null],
      Codigo: [null, [Validators.required , Validators.maxLength(50)]],
      Persona_Id: [null, [Validators.required]],
      Estado : [true, [Validators.required]]
    });

  }

  save() {
    if (this.frmClientes.invalid) {
      this.statusForm  = false
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }
    this.guardarCliente();
  }
  
  guardarCliente() {
    let data  = { 
      id: this.id ?? 0,
      ...this.frmClientes.value
    };
    
    this.service.save(this.id, data).subscribe(l => {
      if (!l.status) {
        this.helperService.showMessage(MessageType.ERROR, Messages.SAVEERROR)
      } else {
        this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS)
        this.helperService.redirectApp(`parametros/clientes`);
      }
    })
  }

  cancel() {
    this.helperService.redirectApp('/parametros/clientes');
  }

  searchByDocument() {
    this.personaService.getByDocumentNumber(this.frmClientes.controls.Documento.value).subscribe(l => {
      if (l.status && l.status == true) { // se deja validado == true porque en caso de no encontrarn un registro el backend devuelve un status 404
        this.frmClientes.controls.Persona_Id.setValue(l.data.id);
        this.frmClientes.controls.Documento.setValue(`${l.data.documento}`);
        this.frmClientes.controls.Nombres.setValue(`${l.data.primerNombre} ${l.data.segundoNombre}`);
        this.frmClientes.controls.Apellidos.setValue(`${l.data.primerApellido} ${l.data.segundoApellido}`);
      }
    }, (error : any) => {
      if (error && error.status == 404) {
        // Usuario no existe y se procede a lanzar la modal
        this.helperService.showDesicionCustom("¿Desea crear la persona?", "La persona no se encuentra registrada", "warning", () => {
          let modal = this.modalService.open(PersonasFormComponent, {size: 'lg', keyboard: false, backdrop: "static"});

          modal.result.then(res => {
            if (res) {
              this.personaService.getById(res.id).subscribe(resPersona => {
                resPersona
                if (resPersona.status && resPersona.status == true) { // se deja validado == true porque en caso de no encontrarn un registro el backend devuelve un status 404
                  this.frmClientes.controls.Documento.setValue(`${resPersona.data.documento}`);
                  this.frmClientes.controls.Nombres.setValue(`${resPersona.data.primerNombre} ${resPersona.data.segundoNombre}`);
                  this.frmClientes.controls.Apellidos.setValue(`${resPersona.data.primerApellido} ${resPersona.data.segundoApellido}`);
                }
              })
            }
          })
        });
      }
    })
  }

}
