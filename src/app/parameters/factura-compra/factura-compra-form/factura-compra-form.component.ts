import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
// import { GeneralParameterService } from 'src/app/parameters/general-parameter/general-parameter.service';
import { FacturaCompraService } from '../factura-compra.service';

@Component({
  selector: 'app-factura-compra-form',
  templateUrl: './factura-compra-form.component.html',
  styleUrls: ['./factura-compra-form.component.css']
})
export class FacturaCompraFormComponent implements OnInit {

  public frmFacturaCompra! : FormGroup;
  public statusForm : boolean = true
  public botones = ['btn-guardar'];
  public breadcrumb = [{name: `Inicio` , icon: `fa-solid fa-house`},  {name: "Operativo" , icon: "fas fa-cogs"},  {name: "Facturas Compras"}];
  public titulo = "";
  public listEstados : any[] = [];
  public listEmpleados : any[] = [];
  public listProveedores : any[] = [];
  public id! : number;
  public disableForm: boolean = false; 

  constructor(public routerActive: ActivatedRoute, private service: FacturaCompraService, 
    public helperService: HelperService , 
    private fb: FormBuilder , private router: Router , private datePipe: DatePipe  
    ) {
    this.routerActive.params.subscribe(l => this.id = l.id);

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        let url  = event.url.split('/')[3];
        this.disableForm = (url == "ver") ? true : false
      }
    });
    
  }

  ngOnInit(): void {
      if (this.id != undefined && this.id != null) {
        this.titulo = "Editar Registro de Ingreso por Compra";
        if(this.disableForm) {
          this.titulo = "Ver Registro de Ingreso por Compra";
          this.botones = [];
        }
        this.service.getById(this.id).subscribe(l => {
        this.frmFacturaCompra.controls.Codigo.setValue(l.data.codigo);
        let date = this.datePipe.transform(l.data.fecha, 'yyyy-MM-dd');
        this.frmFacturaCompra.controls.Fecha.setValue(date);
        this.frmFacturaCompra.controls.Total.setValue(l.data.total);
        this.frmFacturaCompra.controls.Descuento.setValue(l.data.descuento);
        this.frmFacturaCompra.controls.Iva.setValue(l.data.iva);
        this.frmFacturaCompra.controls.Observacion.setValue(l.data.observacion);
        this.frmFacturaCompra.controls.EstadoId.setValue(l.data.estadoId);
        this.frmFacturaCompra.controls.EmpleadoId.setValue(l.data.empleadoId);
        this.frmFacturaCompra.controls.ProveedorId.setValue(l.data.proveedorId);
      })
    }
    else {
      this.titulo = "Crear Registro de Ingreso por Compra";
    }
    this.buildForm();
    this.buildSelect();
  }

  buildForm(): void {
    this.frmFacturaCompra = this.fb.group({
      Codigo : new FormControl(null ,  [Validators.required]),
      Fecha: new FormControl(null, [Validators.required]),
      Total : new FormControl(null, [Validators.required]),
      Descuento : new FormControl(null, [Validators.required]),
      Iva : new FormControl(null, [Validators.required]),
      Observacion : new FormControl(null, [Validators.required]),
      EstadoId : new FormControl(null, [Validators.required]),
      EmpleadoId : new FormControl(null, [Validators.required]),
      ProveedorId : new FormControl(null, [Validators.required]),
    });
  }

  buildSelect(){
    this.service.getAll("Proveedores").subscribe(({data}) => {
      this.listProveedores = data;
    });

    this.service.getAll("Empleados").subscribe(({data}) => {
      this.listEmpleados = data;
    });

    this.service.getAll("Estados").subscribe(({data}) => {
      this.listEstados = data;
    });

  }

  save() {
    if (this.frmFacturaCompra.invalid) {
      this.statusForm  = false
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }
    let data  = { 
      id: this.id ?? 0,
      ...this.frmFacturaCompra.value
    };
    
    if (this.id != undefined && this.id != null) {
      this.helperService.confirmUpdate(this.saveRegister(this.frmFacturaCompra.value));
    }else{
      this.saveRegister(this.frmFacturaCompra.value)
    }


  }
  
  saveRegister(data : any){    
    this.service.save(this.id, data).subscribe(l => {
      if (!l.status) {
        this.helperService.showMessage(MessageType.ERROR, Messages.SAVEERROR)
      } else {
        this.helperService.redirectApp(`tallaje/factura-compra/editar/${l.data.id}`);
        this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS)
      }
    })
  }

  cancel() {
    this.helperService.redirectApp('tallaje/factura-compra');
  }

}
