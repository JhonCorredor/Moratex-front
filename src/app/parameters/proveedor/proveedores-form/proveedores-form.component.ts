import { Component, OnInit } from '@angular/core';
import { FormBuilder,  FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { ProveedoresService } from '../proveedores.service';

@Component({
  selector: 'app-proveedores-form',
  templateUrl: './proveedores-form.component.html',
  styleUrls: ['./proveedores-form.component.css']
})
export class ProveedoresFormComponent implements OnInit {

  public frmProveedores! : FormGroup;
  public statusForm : boolean = true
  public id! : number;
  public botones = ['btn-guardar', 'btn-cancelar'];
 
  public breadcrumb = [{name: `Inicio` , icon: `fa-solid fa-house`},  {name: "Parametros" , icon: "fas fa-cogs"}, {name: "Proveedores"} ,  {name: "Crear"}];
  public titulo = "";
  public listEmpresas: any[] = [];
  public listBancos: any[] = [];

  constructor(public routerActive: ActivatedRoute, private service: ProveedoresService ,
     private helperService: HelperService, private fb: FormBuilder,) 
  { 
    this.routerActive.params.subscribe(e => this.id = e.id);
    
  }

  ngOnInit(): void {
    this.BuildForm();
    if (this.id != undefined && this.id != null) {
      this.titulo = "Editar Proveedores";
      this.service.getProveedoresById(this.id).subscribe(({data}) => {
        this.frmProveedores.controls.Codigo.setValue(data.codigo);
        this.frmProveedores.controls.NumeroCuenta.setValue(data.numeroCuenta);
        this.frmProveedores.controls.EmpresaId.setValue(data.empresaId);
        this.frmProveedores.controls.BancoId.setValue(data.bancoId);
        this.frmProveedores.controls.Estado.setValue(data.estado);
      })
    }else {
      this.titulo = "Crear Proveedores";
    }
  }

  BuildForm(): void {
    this.frmProveedores = this.fb.group({
      Codigo: [null, [Validators.required , Validators.maxLength(50)]],
      NumeroCuenta: [null, [Validators.required , Validators.maxLength(50)]],
      EmpresaId: [null, [Validators.required]],
      BancoId: [null, [Validators.required]],
      Estado : [true, [Validators.required]]
    });

    this.service.getAll("Empresas").subscribe(({data}) => {
      this.listEmpresas = data;
    })

    this.service.getAll("Bancos").subscribe(({data}) => {
      this.listBancos = data;
    })

  }

  save() {
    if (this.frmProveedores.invalid) {
      this.statusForm  = false
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }
    let data  = { 
      id: this.id ?? 0,
      ...this.frmProveedores.value,
    };
    this.service.save(this.id, data).subscribe(l => {
      if (l.status == "Error") {
        // this.modalActive.close();
        this.helperService.showMessage(MessageType.ERROR, Messages.SAVEERROR)
      } else {
        // this.modalActive.close(true);
        this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS)
      }
    })
  }

  cancel() {
    this.helperService.redirectApp('/parametros/proveedores')
  }

}
