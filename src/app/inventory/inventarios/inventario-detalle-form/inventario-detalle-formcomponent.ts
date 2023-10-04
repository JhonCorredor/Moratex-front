import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { LANGUAGE_DATATABLE } from 'src/app/admin/datatable.language';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { BotonesComponent } from 'src/app/general/botones/botones.component';
import { InventarioDetalleService } from '../inventario-detalle.service';

@Component({
  selector: 'app-inventario-detalle-form',
  templateUrl: './inventario-detalle-form.component.html',
  styleUrls: ['./inventario-detalle-form.component.css']
})
export class InventarioDetalleFormComponent implements OnInit {

  @ViewChild('botonesDatatable') botonesDatatable!: BotonesComponent;
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  public dtTrigger: Subject<any> = new Subject();
  public opcionesDataTable: any = {};
  public arrayBotonesDatatable: String[] = ['btn-eliminar'];
  public botones = ['btn-guardar'];
  public Id = null;

  @Input() InventarioId: any = null;

  public frmInventarioDetalle! : FormGroup;
  public statusForm : boolean = true
  public listProductos : any[] = [];
  public listEstados : any[] = [];

  constructor(public routerActive: ActivatedRoute, 
    private service : InventarioDetalleService , 
    private helperService: HelperService,  
    private fb: FormBuilder) { 
      
    }

  ngOnInit(): void {
    this.buildForm()
    this.cargarDatatable();
  }

  buildForm(): void {
    this.frmInventarioDetalle = this.fb.group({
      CantidadTotal: new FormControl(null, [Validators.required , Validators.pattern(/^-?\d*[.,]?\d{2,18}$/ )]),
      CantidadUsada: new FormControl(null, [Validators.required , Validators.pattern(/^-?\d*[.,]?\d{2,18}$/ )]),
      CantidadIngresada: new FormControl(null, [Validators.required  , Validators.pattern(/^-?\d*[.,]?\d{2,18}$/ )]),
      ProductoId: new FormControl(null, Validators.required),
      EstadoId: new FormControl(null, Validators.required)
    });
    this.buildSelect()
  }

  ngAfterViewInit() {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  buildSelect(){
    this.service.getAll("Productos").subscribe(({data}) => {
      this.listProductos = data;
    });

    this.service.getAll("Estados").subscribe(({data}) => {
      this.listEstados = data;
    });
  }


  changeCantidadTotal(){
    let ingresada = this.frmInventarioDetalle.controls.CantidadIngresada.value;
    let usada = this.frmInventarioDetalle.controls.CantidadUsada.value;

    if(ingresada != null  && ingresada != undefined && usada != undefined && usada != null){
      if(ingresada > usada){
        let total = ingresada - usada;
        this.frmInventarioDetalle.controls.CantidadTotal.setValue(total);
      }
      if(ingresada < usada){
        this.helperService.showMessage(MessageType.WARNING, Messages.INVALIDOPERATION);
        this.frmInventarioDetalle.controls.CantidadTotal.setValue(null);
      }
    }

  }


  save() {
    if (this.frmInventarioDetalle.invalid) {
      this.statusForm  = false
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }
    let data  = { 
      id: this.Id ?? 0,
      ...this.frmInventarioDetalle.value,
     inventarioId : this.InventarioId,
    };
    this.service.save(this.Id, data).subscribe(l => {
      if (!l.status) {
        this.helperService.showMessage(MessageType.ERROR, Messages.SAVEERROR)
      } else {
        this.refrescarTabla();
        this.frmInventarioDetalle.reset();
        this.Id = null;
        this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS)
      }
    })
  }

  refrescarTabla() {
    if(typeof this.dtElement.dtInstance != 'undefined'){
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.ajax.reload()
      });
    }
  }

  cargarDatatable() {
    const that = this;
    that.opcionesDataTable = {
        serverSide: true,
        processing: true,
        ordering: true,
        responsive: true,
        paging: true,
        order: [0, 'desc'],
        ajax: (dataTablesParameters: any, callback : any) => {
          let pageNumber = (dataTablesParameters.start / dataTablesParameters.length) + 1
          var data = new DatatableParameter();
          data.pageNumber = pageNumber.toString();
          data.pageSize = dataTablesParameters.length.toString();
          data.filter = dataTablesParameters.search.value;
          data.columnOrder = that.helperService.capitalizeFirstLetter(dataTablesParameters.columns[dataTablesParameters.order[0].column].data.toString());;
          data.directionOrder = dataTablesParameters.order[0].dir;
          data.foreignKey = this.InventarioId;
          this.service.getAllInventarioDetalle(data).subscribe((res: any) => {
            callback({
              recordsTotal: res.meta.totalCount,
              recordsFiltered: res.meta.totalCount,
              draw: dataTablesParameters.draw,
              data: res.data
            });
          });
        },
        language: LANGUAGE_DATATABLE,
        columns: [
             {
              title: "Insumo",
              data: "producto"
            },
            {
              title: "Cantidad Ingresada",
              data: "cantidadIngresada",
              render : function(data : any,) {
                return that.helperService.formaterNumber(data);
              }
            },
            {
              title: "Cantidad Usada",
              data: 'cantidadUsada',
              render : function(data : any,) {
                return that.helperService.formaterNumber(data);
              }
            },
            {
              title: "Cantidad Total",
              data: 'cantidadTotal',
              render : function(data : any,) {
                return that.helperService.formaterNumber(data);
              }
            },
            {
              title: "Estado",
              data: "estado"
            },
            {
              title: "Acciones",
              orderable: false,
              width: '300px',
              data: "id",
              render: function(id : any, type : any, row : any) {
                const boton = that.botonesDatatable;
                return boton.botonesDropdown.nativeElement.outerHTML.split('$id').join(id);
              },
              className: "pl-1 pr-0 text-center",
              responsivePriority: 7
            }
        ],
        drawCallback: (settings : any) => {
          $('.btn-dropdown-eliminar').off().on('click', (event : any) => {
            this.helperService.confirmDelete(() => {
              this.service.delete(event.target.dataset.id).subscribe(l => {
                if (l.status) {
                  this.helperService.showMessage(MessageType.SUCCESS, Messages.DELETESUCCESS);
                  this.refrescarTabla();
                } else {
                  this.helperService.showMessage(MessageType.ERROR, Messages.DELETEERROR);
                }
              })
            });
          });
        }
    };
  }


}
