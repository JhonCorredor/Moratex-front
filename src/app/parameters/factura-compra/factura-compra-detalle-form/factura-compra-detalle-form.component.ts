import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { LANGUAGE_DATATABLE } from 'src/app/admin/datatable.language';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { BotonesComponent } from 'src/app/general/botones/botones.component';
import { GeneralParameterService } from 'src/app/parameters/general-parameter/general-parameter.service';
import { FacturaCompraDetalleService } from './factura-compra-detalle.service';

@Component({
  selector: 'app-factura-compra-detalle-form',
  templateUrl: './factura-compra-detalle-form.component.html',
  styleUrls: ['./factura-compra-detalle-form.component.css']
})
export class FacturaCompraDetalleFormComponent implements OnInit {
  
  @ViewChild('botonesDatatable') botonesDatatable!: BotonesComponent;
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  public dtTrigger: Subject<any> = new Subject();
  public opcionesDataTable: any = {};
  public arrayBotonesDatatable: String[] = ['btn-modificar', 'btn-eliminar'];
  public botones = ['btn-guardar'];

  @Input() facturaCompraId: any = null;
  @Input() seeForm: any = null;

  public frmFacturaCompraDetalle: FormGroup;
  public statusForm : boolean = true
  public listFacturaCompra : any = [];
  public listProducto : any = [];
  public listUnidadMedida : any = [];
  public colums : any =  []
  constructor(private generalService: GeneralParameterService, private helperService: HelperService, private service: FacturaCompraDetalleService) { 
    this.frmFacturaCompraDetalle = new FormGroup({
      Id: new FormControl(0, Validators.required),
      FacturaCompraId: new FormControl(this.facturaCompraId, Validators.required),
      Cantidad: new FormControl(null, Validators.required),
      PrecioProducto : new FormControl(null, Validators.required),
      SubTotal: new FormControl(null, Validators.required),
      Descuento: new FormControl(null, Validators.required),
      Iva: new FormControl(null, Validators.required),
      Observacion: new FormControl(null, Validators.required),
      ProductoId: new FormControl(null, Validators.required),
      UnidadMedidaId: new FormControl(null, Validators.required),
    });
  }

  ngOnInit(): void {
    this.cargarDatatable();
    this.cargarSelects();
    if(this.seeForm){
       this.arrayBotonesDatatable = [];
    }
  }

  ngAfterViewInit() {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  cargarSelects() {
    this.generalService.getAll("FacturasCompras").subscribe(r => {
      this.listFacturaCompra = r.data;
    })
    this.generalService.getAll("Productos").subscribe(r => {
      this.listProducto = r.data;
    })
    this.generalService.getAll("UnidadesMedidas").subscribe(r => {
      this.listUnidadMedida = r.data;
    })
  }

  save() {
    this.frmFacturaCompraDetalle.controls.FacturaCompraId.setValue(this.facturaCompraId);
    if (this.frmFacturaCompraDetalle.invalid) {
      this.statusForm  = false
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }
    let data  = this.frmFacturaCompraDetalle.value;
    this.service.save(this.frmFacturaCompraDetalle.controls.Id.value, data).subscribe(l => {
      if (!l.status) {
        this.helperService.showMessage(MessageType.ERROR, Messages.SAVEERROR)
      } else {
        this.refrescarTabla();
        this.frmFacturaCompraDetalle.reset();
        this.frmFacturaCompraDetalle.controls.Id.setValue(0);
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
          data.foreignKey = this.facturaCompraId;
          this.service.datatable(data).subscribe(res => {
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
              title: "Factura Compra",
              data: 'facturaCompra',
            },
            {
              title: "Cantidad",
              data:  "cantidad",
              render : function(item : any) {
                return that.helperService.formaterNumber(item)
              }
            },
            {
            title: "Precio Producto",
            data: 'precioProducto',
            render : function(item : any) {
              return that.helperService.formaterNumber(item)
            }
            },
            {
              title: "SubTotal",
              data: 'subtotal',
              render : function(item : any) {
                return that.helperService.formaterNumber(item)
              }
            },
            {
              title: "Descuento",
              data: 'descuento',
              render : function(item : any) {
                return that.helperService.formaterNumber(item)
              }
            },
            {
              title: "Iva",
              data: 'iva',
              render : function(item : any) {
                return that.helperService.formaterNumber(item)
              }
            },
            {
              title: "Observacion",
              data: 'observacion',
            },
            {
              title: "Producto",
              data: 'producto',
            },
            {
              title: "Unidad Medida",
              data: 'unidadMedida',
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
          $('.btn-dropdown-modificar').off().on('click', (event : any) => {
            this.service.getById(event.target.dataset.id).subscribe(res => {
              this.frmFacturaCompraDetalle.controls.Id.setValue(res.data.id);
              this.frmFacturaCompraDetalle.controls.FacturaCompraId.setValue(res.data.facturaCompraId);
              this.frmFacturaCompraDetalle.controls.Cantidad.setValue(res.data.cantidad);
              this.frmFacturaCompraDetalle.controls.PrecioProducto.setValue(res.data.precioProducto);
              this.frmFacturaCompraDetalle.controls.SubTotal.setValue(res.data.subtotal);
              this.frmFacturaCompraDetalle.controls.Descuento.setValue(res.data.descuento);
              this.frmFacturaCompraDetalle.controls.Iva.setValue(res.data.iva);
              this.frmFacturaCompraDetalle.controls.Observacion.setValue(res.data.observacion);
              this.frmFacturaCompraDetalle.controls.ProductoId.setValue(res.data.productoId);
              this.frmFacturaCompraDetalle.controls.UnidadMedidaId.setValue(res.data.unidadMedidaId);
            })
          });
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
