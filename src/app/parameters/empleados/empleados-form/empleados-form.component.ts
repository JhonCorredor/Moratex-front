import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder,  FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { PersonasFormComponent } from 'src/app/security/personas/personas-form/personas-form.component';
import { PersonasService } from 'src/app/security/personas/personas.service';
import { EmpleadosService } from '../empleados.service';

@Component({
  selector: 'app-empleados-form',
  templateUrl: './empleados-form.component.html',
  styleUrls: ['./empleados-form.component.css']
})
export class EmpleadosFormComponent implements OnInit {

  public frmEmpleados! : FormGroup;
  public statusForm : boolean = true
  public id! : number;
  public botones = ['btn-guardar', 'btn-cancelar'];
  public breadcrumb = [{name: `Inicio` , icon: `fa-solid fa-house`},   {name: "Parametros" , icon: "fas fa-cogs"}, {name: "Empleado"}, {name: "Crear"}];
  public titulo = "";
  public listPersonas: any[] = [];
  public listCargos: any[] = [];
  public listEmpresas: any[] = [];


  constructor(public routerActive: ActivatedRoute, 
    private service: EmpleadosService , 
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
    this.buildSelect();
    if (this.id != undefined && this.id != null) {
      this.titulo = "Editar Empleados"; 
      this.service.getEmpleadosById(this.id).subscribe(({data}) => {
        this.frmEmpleados.controls.Codigo.setValue(data.codigo);
        
        let date = this.datePipe.transform(data.fechaIngreso, 'yyyy-MM-dd');
        this.frmEmpleados.controls.FechaIngreso.setValue(date);
        this.frmEmpleados.controls.Persona_Id.setValue(data.persona_Id);
        this.frmEmpleados.controls.Cargo_Id.setValue(data.cargo_Id);
        this.frmEmpleados.controls.Empresa_Id.setValue(data.empresa_Id);
        this.frmEmpleados.controls.Estado.setValue(data.estado);

        this.personaService.getById(data.persona_Id).subscribe(resPersona => {
          resPersona
          if (resPersona.status && resPersona.status == true) { // se deja validado == true porque en caso de no encontrarn un registro el backend devuelve un status 404
            this.frmEmpleados.controls.Documento.setValue(`${resPersona.data.documento}`);
            this.frmEmpleados.controls.Nombres.setValue(`${resPersona.data.primerNombre} ${resPersona.data.segundoNombre}`);
            this.frmEmpleados.controls.Apellidos.setValue(`${resPersona.data.primerApellido} ${resPersona.data.segundoApellido}`);
          }
        })
      })
    }else {
      this.titulo = "Crear Empleados";
    }
  }

  buildForm(): void {
    
    this.frmEmpleados = this.fb.group({
      Documento: [null, Validators.required],  
      Nombres:  [null],
      Apellidos: [null],
      Codigo: [null, [Validators.required , Validators.maxLength(50)]],
      FechaIngreso : [null, [Validators.required]],
      Persona_Id: [null, [Validators.required]],
      Cargo_Id: [null, [Validators.required]],
      Empresa_Id: [null, [Validators.required]],
      Estado : [true, [Validators.required]]
    });

  }

  buildSelect(){
    this.service.getAll("Cargos").subscribe(({data}) => {
      this.listCargos = data;
    });

    this.service.getAll("Empresas").subscribe(({data}) => {
      this.listEmpresas = data;
    });
  }



  save() {
    if (this.frmEmpleados.invalid) {
      this.statusForm  = false
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }
    let data  = { 
      id: this.id ?? 0,
      ...this.frmEmpleados.value,
    };
    this.service.save(this.id, data).subscribe(l => {
      if (l.status == "Error") {
        this.helperService.showMessage(MessageType.ERROR, Messages.SAVEERROR)
      } else {
        if (!this.id) {
          this.helperService.redirectApp(`parametros/empleados/editar/${l.data.id}`);
        }
        this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS)
      }
      this.helperService.redirectApp('/parametros/empleados');
    })
  }

  cancel() {
    this.helperService.redirectApp('/parametros/empleados');
  }

  searchByDocument() {
    this.personaService.getByDocumentNumber(this.frmEmpleados.controls.Documento.value).subscribe(l => {
      if (l.status && l.status == true) { // se deja validado == true porque en caso de no encontrarn un registro el backend devuelve un status 404
        this.frmEmpleados.controls.Persona_Id.setValue(l.data.id);
        this.frmEmpleados.controls.Documento.setValue(`${l.data.documento}`);
        this.frmEmpleados.controls.Nombres.setValue(`${l.data.primerNombre} ${l.data.segundoNombre}`);
        this.frmEmpleados.controls.Apellidos.setValue(`${l.data.primerApellido} ${l.data.segundoApellido}`);
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
                  this.frmEmpleados.controls.Documento.setValue(`${resPersona.data.documento}`);
                  this.frmEmpleados.controls.Nombres.setValue(`${resPersona.data.primerNombre} ${resPersona.data.segundoNombre}`);
                  this.frmEmpleados.controls.Apellidos.setValue(`${resPersona.data.primerApellido} ${resPersona.data.segundoApellido}`);
                }
              })
            }
          })
        });
      }
    })
  }

}
