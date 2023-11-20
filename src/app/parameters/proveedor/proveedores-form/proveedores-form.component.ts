import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { ProveedoresService } from '../proveedores.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmpresasFormComponent } from '../../empresas/empresas-form/empresas-form.component';

@Component({
  selector: 'app-proveedores-form',
  templateUrl: './proveedores-form.component.html',
  styleUrls: ['./proveedores-form.component.css']
})
export class ProveedoresFormComponent implements OnInit {

  public frmProveedores!: FormGroup;
  public statusForm: boolean = true
  public id!: number;
  public botones = ['btn-guardar', 'btn-cancelar'];

  public breadcrumb = [{ name: `Inicio`, icon: `fa-duotone fa-house` }, { name: "Parametros", icon: "fa-duotone fa-gears" }, { name: "Proveedores", icon: "fa-duotone fa-people-carry-box" }, { name: "Crear" }];
  public titulo = "";
  public listEmpresas: any[] = [];
  public listBancos: any[] = [];
  public serviceName: string = "";

  constructor(private router: Router, private modalService: NgbModal, public routerActive: ActivatedRoute, private service: ProveedoresService,
    private helperService: HelperService, private fb: FormBuilder,) {
    this.routerActive.params.subscribe(e => this.id = e.id);

  }

  ngOnInit(): void {
    this.BuildForm();
    if (this.id != undefined && this.id != null) {
      this.titulo = "Editar Proveedores";
      this.service.getProveedoresById(this.id).subscribe(({ data }) => {
        this.frmProveedores.controls.Codigo.setValue(data.codigo);
        this.frmProveedores.controls.NumeroCuenta.setValue(data.numeroCuenta);
        this.frmProveedores.controls.Empresa_Id.setValue(data.empresa_Id);
        this.frmProveedores.controls.Banco_Id.setValue(data.banco_Id);
        this.frmProveedores.controls.Estado.setValue(data.estado);
      })
    } else {
      this.titulo = "Crear Proveedores";
    }
  }

  BuildForm(): void {
    this.frmProveedores = this.fb.group({
      Codigo: [null, [Validators.required, Validators.maxLength(50)]],
      NumeroCuenta: [null, [Validators.required, Validators.maxLength(50)]],
      Empresa_Id: [null, [Validators.required]],
      Banco_Id: [null, [Validators.required]],
      Estado: [true, [Validators.required]]
    });

    this.service.getAll("Empresas").subscribe(({ data }) => {
      this.listEmpresas = data;
    })

    this.service.getAll("Bancos").subscribe(({ data }) => {
      this.listBancos = data;
    })

  }

  save() {
    if (this.frmProveedores.invalid) {
      this.statusForm = false
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }
    let data = {
      id: this.id ?? 0,
      ...this.frmProveedores.value,
    };
    this.service.save(this.id, data).subscribe(l => {
      if (l.status == "Error") {
        this.helperService.showMessage(MessageType.ERROR, Messages.SAVEERROR)
      } else {
        this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS)
        this.cancel();
      }
    })
  }

  cancel() {
    var ruta: string[] = this.router.url.toString().split('/');

    if (ruta[2] != 'parametros') {
      this.modalService.dismissAll();
    } else {
      this.helperService.redirectApp('/parametros/proveedores');
    }
  }

  public nuevaEmpresa() {
    let modal = this.modalService.open(EmpresasFormComponent, { size: 'xl', keyboard: false, backdrop: "static" });
    modal.componentInstance.titleData = "Crear Empresa";
    modal.componentInstance.serviceName = this.serviceName;
  }

}
