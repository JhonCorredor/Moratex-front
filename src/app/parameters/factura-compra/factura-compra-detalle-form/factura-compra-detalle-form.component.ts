import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { LANGUAGE_DATATABLE } from 'src/app/admin/datatable.language';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { BotonesComponent } from 'src/app/general/botones/botones.component';
import { GeneralParameterService } from 'src/app/parameters/general-parameter/general-parameter.service';
import { FacturaCompraDetalleService } from '../factura-compra-detalle.service';
import { ProductosService } from '../../../inventory/productos/productos.service';

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

  @Input() facturaCompra_Id: any = null;
  @Input() seeForm: any = null;

  public frmFacturaCompraDetalle: FormGroup;
  public statusForm: boolean = true
  public listFacturaCompra: any = [];
  public listProducto: any = [];
  public listUnidadMedida: any = [];
  public colums: any = [];

  constructor(private generalService: GeneralParameterService, private helperService: HelperService, private service: FacturaCompraDetalleService, private productoService: ProductosService) {
    this.frmFacturaCompraDetalle = new FormGroup({
      Id: new FormControl(0, Validators.required),
      Codigo: new FormControl(null),
      FacturaCompra_Id: new FormControl(this.facturaCompra_Id, Validators.required),
      Cantidad: new FormControl(1.0, Validators.required),
      PrecioCosto: new FormControl(null, Validators.required),
      SubTotal: new FormControl(null),
      SubTotalString: new FormControl("$ 0"),
      Descuento: new FormControl(0, Validators.required),
      Iva: new FormControl(0, Validators.required),
      Producto_Id: new FormControl(null, Validators.required),
    });
  }

  ngOnInit(): void {
    this.cargarDatatable();
    this.cargarSelects();
    if (this.seeForm) {
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
  }

  calcularSubTotal(){
    let data = this.frmFacturaCompraDetalle.value;
    var subtotal = parseInt(data.PrecioCosto) * parseInt(data.Cantidad);
    var subTotalString = `$ 0`;
    
    if (!isNaN(subtotal)){
      subTotalString = `$ ${this.helperService.formaterNumber(subtotal)}`;
    }

    this.frmFacturaCompraDetalle.controls.SubTotal.setValue(subtotal);
    this.frmFacturaCompraDetalle.controls.SubTotalString.setValue(subTotalString);
  }

  save() {
    this.frmFacturaCompraDetalle.controls.FacturaCompra_Id.setValue(this.facturaCompra_Id);
    
    if (this.frmFacturaCompraDetalle.invalid) {
      this.statusForm = false
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }
    
    let data = this.frmFacturaCompraDetalle.value;

    this.productoService.getById(data.Producto_Id).subscribe(r => {
      data.Codigo =  r.data.codigo;
    })
    
    setTimeout(() => {
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
    }, 500);
  }

  refrescarTabla() {
    if (typeof this.dtElement.dtInstance != 'undefined') {
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
      ajax: (dataTablesParameters: any, callback: any) => {
        let pageNumber = (dataTablesParameters.start / dataTablesParameters.length) + 1
        var data = new DatatableParameter();
        data.pageNumber = pageNumber.toString();
        data.pageSize = dataTablesParameters.length.toString();
        data.filter = dataTablesParameters.search.value;
        data.columnOrder = "Id";
        data.directionOrder = dataTablesParameters.order[0].dir;
        data.foreignKey = this.facturaCompra_Id;
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
          title: "Producto",
          data: 'producto',
        },
        {
          title: "Cantidad",
          data: "cantidad",
        },
        {
          title: "Precio Costo",
          data: 'precioCosto',
          className: 'text-right',
          render: function (data: any) {
            return '$ ' + that.helperService.formaterNumber(data);
          },
        },
        {
          title: "Descuento",
          data: 'descuento',
          render: function (item: any) {
            return that.helperService.formaterNumber(item)
          }
        },
        {
          title: "Iva",
          data: 'iva',
          render: function (item: any) {
            return that.helperService.formaterNumber(item)
          }
        },
        {
          title: "SubTotal",
          data: 'subTotal',
          className: 'text-right',
          render: function (data: any) {
            return '$ ' + that.helperService.formaterNumber(data);
          },
        },
        {
          title: "Acciones",
          orderable: false,
          width: '300px',
          data: "id",
          render: function (id: any, type: any, row: any) {
            const boton = that.botonesDatatable;
            return boton.botonesDropdown.nativeElement.outerHTML.split('$id').join(id);
          },
          className: "pl-1 pr-0 text-center",
          responsivePriority: 7
        }
      ],
      drawCallback: (settings: any) => {
        $('.btn-dropdown-modificar').off().on('click', (event: any) => {
          this.service.getById(event.target.dataset.id).subscribe(res => {
            this.frmFacturaCompraDetalle.controls.Id.setValue(res.data.id);
            this.frmFacturaCompraDetalle.controls.Codigo.setValue(res.data.codigo);
            this.frmFacturaCompraDetalle.controls.FacturaCompra_Id.setValue(res.data.facturaCompra_Id);
            this.frmFacturaCompraDetalle.controls.Cantidad.setValue(res.data.cantidad);
            this.frmFacturaCompraDetalle.controls.PrecioCosto.setValue(res.data.precioCosto);
            this.frmFacturaCompraDetalle.controls.SubTotal.setValue(res.data.subTotal);
            this.frmFacturaCompraDetalle.controls.Descuento.setValue(res.data.descuento);
            this.frmFacturaCompraDetalle.controls.Iva.setValue(res.data.iva);
            this.frmFacturaCompraDetalle.controls.Producto_Id.setValue(res.data.producto_Id);
          })
        });
        $('.btn-dropdown-eliminar').off().on('click', (event: any) => {
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
