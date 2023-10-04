import { Component, OnInit } from '@angular/core';
import { FormBuilder,  FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { GeneralidadesService } from '../generalidades.service';

@Component({
  selector: 'app-generalidades-form',
  templateUrl: './generalidades-form.component.html',
  styleUrls: ['./generalidades-form.component.css']
})
export class GeneralidadesFormComponent implements OnInit {

  public frmGeneralidades! : FormGroup;
  public statusForm : boolean = true
  public id! : number;
  public botones = ['btn-guardar', 'btn-cancelar'];
  public titulo = "";
  public breadcrumb = [{name: `Inicio` , icon: `fa-solid fa-house`},  {name: "Tallaje" , icon: "fas fa-cogs"}, {name: "Generalidades"}, {name: "Crear"}];
  public ListModeloPrenda : any[] = [];
  public listGeneros : any[] = [];

  constructor(
    public routerActive: ActivatedRoute,
    private service: GeneralidadesService , 
    private helperService: HelperService,
    private fb: FormBuilder){
      this.routerActive.params.subscribe(l => this.id = l.id);
     }

  ngOnInit(): void {
    this.buildForm();
    if (this.id != undefined && this.id != null) {
      this.titulo = "Editar Generalidades";
      this.service.getGeneralidadesById(this.id).subscribe(l => {
        this.frmGeneralidades.controls.Codigo.setValue(l.data.codigo);
        this.frmGeneralidades.controls.Genero.setValue(l.data.genero);
        this.frmGeneralidades.controls.ModeloPrendaId.setValue(l.data.modeloPrendaId);
        this.frmGeneralidades.controls.Estado.setValue(l.data.estado);
      })
    }else {
      this.titulo = "Crear Generalidades";
    }
  }

  buildForm(): void {
    this.buildSelect();
    this.frmGeneralidades = this.fb.group({
      Codigo: [null , [Validators.required , Validators.maxLength(50)]],
      Genero: [null, [Validators.required]],
      ModeloPrendaId: [null, [Validators.required]],
      Estado: [true, [Validators.required]]
    });

    
  }
  
  buildSelect(){
    
    this.service.getAll("ModelosPrendas").subscribe(({data}) => {
      this.ListModeloPrenda = data;
    });

    this.listGeneros = [
      {id: 1, textoMostrar: "Masculino"},
      {id: 2, textoMostrar: "Femenino"},
    ]

  }



  save() {
    if (this.frmGeneralidades.invalid) {
      this.statusForm  = false
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }
    let data  = { 
      id: this.id ?? 0,
      ...this.frmGeneralidades.value,
    };
    this.service.save(this.id, data).subscribe(l => {
      if (!l.status) {
        this.helperService.showMessage(MessageType.ERROR, Messages.SAVEERROR)
      } else {
        if (!this.id) {
          this.helperService.redirectApp(`tallaje/generalidades/editar/${l.data.id}`);
        }
        this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS)
      }
    })
  }

  cancel() {
    this.helperService.redirectApp('tallaje/generalidades');
  }

}
