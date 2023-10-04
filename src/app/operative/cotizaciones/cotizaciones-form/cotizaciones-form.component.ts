import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder,  FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { CotizacionesService } from '../cotizaciones.service';

@Component({
  selector: 'app-cotizaciones-form',
  templateUrl: './cotizaciones-form.component.html',
  styleUrls: ['./cotizaciones-form.component.css']
})
export class CotizacionesFormComponent implements OnInit {

  public frmCotizaciones! : FormGroup;
  public statusForm : boolean = true
  public id! : number;
  public botones = ['btn-guardar', 'btn-cancelar'];
  public titulo = "";
  public breadcrumb = [{name: `Inicio` , icon: `fa-solid fa-house`},  {name: "Tallaje" , icon: "fas fa-cogs"}, {name: "Cotizaciones"}];
  public ListEstados : any[] = [];
  public listEmpresas : any[] = [];
  public disableForm: boolean = false;

  constructor(
    public routerActive: ActivatedRoute,
    private service: CotizacionesService , 
    public helperService: HelperService,
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private router: Router ){
      this.routerActive.params.subscribe(l => this.id = l.id);
      
      this.router.events.subscribe((event: any) => {
        if (event instanceof NavigationEnd) {
          let url  = event.url.split('/')[3];
          this.disableForm = (url == "ver") ? true : false
        }
      });

    }

  ngOnInit(): void {
    this.buildForm();
    if(this.disableForm){
      this.botones = ['btn-cancelar'];
    }
    if (this.id != undefined && this.id != null) {
      this.titulo = "Editar Cotizacion";
        let date 
      this.service.getCotizacionesById(this.id).subscribe(l => {
        this.frmCotizaciones.controls.EstadoId.setValue(l.data.estadoId);
        this.frmCotizaciones.controls.EmpresaId.setValue(l.data.empresaId);

        this.frmCotizaciones.controls.TotalEmpleado.setValue(l.data.totalEmpleado);
        this.frmCotizaciones.controls.PagoAnticipo.setValue(l.data.pagoAnticipo);

        date = this.datePipe.transform(l.data.fechaPago, 'yyyy-MM-dd');
        this.frmCotizaciones.controls.FechaPago.setValue(date);

        date = this.datePipe.transform(l.data.fechaEntrega, 'yyyy-MM-dd');
        this.frmCotizaciones.controls.FechaEntrega.setValue(date);
        if(l.data.estadoId == 1033){  this.titulo = "Ver Cotizacion  RECHAZADA"} 
        if(l.data.estadoId == 1032){ this.titulo = "Ver Cotizacion  ACEPTADA"} 
      })
    }else {
      this.titulo = "Crear Cotizacion";
      this.frmCotizaciones.controls.EstadoId.setValue(1031);
    }
  }

  buildForm(): void {
    this.frmCotizaciones = this.fb.group({
      EstadoId: [null, [Validators.required]],
      EmpresaId: [null, [Validators.required]],
      TotalEmpleado: [null, [Validators.required]],
      FechaPago: [null, [Validators.required]],
      FechaEntrega: [null, [Validators.required]],
      PagoAnticipo: [null, [Validators.required]],
    });

    this.service.getAll("Estados").subscribe(({data}) => {
      this.ListEstados = data;
    });

    this.service.getAll("Empresas").subscribe(({data}) => {
      this.listEmpresas = data;
    });
  }

  save() {
    if (this.frmCotizaciones.invalid) {
      this.statusForm  = false
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }
    let data  = { 
      id: this.id ?? 0,
      EstadoId: this.frmCotizaciones.controls.EstadoId.value,
      EmpresaId: this.frmCotizaciones.controls.EmpresaId.value,
      TotalEmpleado: this.frmCotizaciones.controls.TotalEmpleado.value,
      FechaPago: this.frmCotizaciones.controls.FechaPago.value,
      FechaEntrega: this.frmCotizaciones.controls.FechaEntrega.value,
      PagoAnticipo: this.helperService.formatearNumeroDB(this.frmCotizaciones.controls.PagoAnticipo.value ?? '')
    };
    this.service.save(this.id, data).subscribe(l => {
      if (l.status == "Error") {
        this.helperService.showMessage(MessageType.ERROR, Messages.SAVEERROR)
      } else {
        if (!this.id) {
          this.helperService.redirectApp(`operativo/cotizaciones/editar/${l.data.id}`);
        }
        this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS)
      }
    })
  }

  cancel() {
    this.helperService.redirectApp('operativo/cotizaciones');
  }

}
