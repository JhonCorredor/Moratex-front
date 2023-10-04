import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { EmpleadosService } from '../empleados.service';

@Component({
  selector: 'app-empleados-carge-masivo-form',
  templateUrl: './empleados-carge-masivo-form.component.html',
  styleUrls: ['./empleados-carge-masivo-form.component.css']
})
export class EmpleadosCargeMasivoFormComponent implements OnInit {
  
  public frmEmpleadosCargeMasivo: FormGroup;
  public statusForm : boolean = true
  public id! : number;
  public botones = ['btn-guardar', 'btn-cancelar'];
  public botonesHeader = ['btn-importar-empleado'];
  public titulo = "";
  public Archivo : any
  public listSedes: any[] = [];
  public listEmpresas: any[] = [];
  
  constructor(public routerActive: ActivatedRoute, private service:  EmpleadosService, private helperService: HelperService,private modalActive: NgbActiveModal,private spinner: NgxSpinnerService) { 
    this.frmEmpleadosCargeMasivo = new FormGroup({
      EmpresaId : new FormControl(null, [Validators.required]), 
    });
  }
  
  ngOnInit(): void {
    this.titulo = `Carge masivo`;
    this.buildSelect()
  }
  
  buildSelect(){
    this.service.getAll("Empresas").subscribe(({data}) => {
      this.listEmpresas = data;
    });
    
    this.service.getAll("Sedes").subscribe(({data}) => {
      this.listSedes = data;
    });
  }
  
  save() {
    
    if(this.Archivo != undefined && this.frmEmpleadosCargeMasivo.valid ) {
      let data = {
        ...this.Archivo,
        ...this.frmEmpleadosCargeMasivo.value
      }
      this.spinner.show();
      this.service.importer(data).subscribe(l => {
        if (l.status == true) {
          this.modalActive.close(true);
          this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVEFILE);
        } else {
          this.helperService.showMessage(MessageType.ERROR, l.message);
        }
        this.spinner.hide();
      }, err => {
        this.helperService.showMessageError(err);
        this.spinner.hide();
      });
      
    } else {
      this.statusForm  = false
      return
    }
  }
  
  cancel() {
    this.modalActive.close();
  }
  
  public importarEmpleado(event: any){
    let file : any ; 
    let type = event.target.files[0].type.split('/')[1];
    if (type == "vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (e: any) => {
        file = e.currentTarget.result;
        this.Archivo = {
          "Archivo": file,
        }
        this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVEFILE);  
      };
    }else{
      this.helperService.showMessage(MessageType.ERROR, Messages.INVALIDFILE);  
    }
  }
  
}
