import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { of, Subject } from 'rxjs';
import { LANGUAGE_DATATABLE } from 'src/app/admin/datatable.language';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { BotonesComponent } from 'src/app/general/botones/botones.component';
// import { FacturaCompraFormComponent } from '../factura-compra-form/factura-compra-form.component';
import { FacturaCompraService } from '../factura-compra.service';

@Component({
  selector: 'app-factura-compra-index',
  templateUrl: './factura-compra.component.html',
  styleUrls: ['./factura-compra.component.css']
})
export class FacturaCompraIndexComponent implements OnInit {

  @ViewChild('botonesDatatable') botonesDatatable!: BotonesComponent;
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  public dtTrigger: Subject<any> = new Subject();
  public opcionesDataTable: any = {};

  public API_URL : any;
  public title = "Listado  Facturas Compra";
  public breadcrumb = [{name: `Inicio` , icon: `fa-solid fa-house`},  {name: "Operativo" , icon: "fas fa-cogs"}, {name: "Facturas Compras"}];
  public botones: String[] = ['btn-nuevo'];
  public arrayBotonesDatatable: String[] = ['btn-modificar', 'btn-eliminar' ,  'btn-ver'];
  public arrayBotonesDatatableVer: String[] = [ 'btn-ver'];
  constructor(private service: FacturaCompraService, private helperService: HelperService) { }

  ngOnInit(): void {
    this.cargarDatatable();
  }

  ngAfterViewInit() {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
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
        data.columnOrder = that.helperService.capitalizeFirstLetter(dataTablesParameters.columns[dataTablesParameters.order[0].column].data.toString());;
        data.directionOrder = dataTablesParameters.order[0].dir;
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
      columns: [{
          title: "Codigo",
          data: 'codigo',
        },
        {
          title: "Fecha",
          data: 'fecha',
          render: (item: any) => {
            return this.helperService.convertDateUTCToDMA(item);
          }
        },
        {
          title: "Proveedor",
          data: 'proveedor',
        },
        {
          title: "Total",
          data: 'total',
          render: (item: any) => {
            return this.helperService.formaterNumber(item);
          }
        },
        {
          title: "Estado",
          data: 'estado',
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
      rowCallback: (template: any, data: any) => {
        setTimeout(() => {
          let modificar = $('.btn-dropdown-modificar')
          let eliminar = $('.btn-dropdown-eliminar')

          for (let i = 0; i < modificar.length - 1; i++) {
            let id = modificar[i].dataset.id;
            if (id == data.id) {
              if (data.estadoId == 24) {
                modificar[i].remove()
                eliminar[i].remove()
                // modificar[i].style.display = 'none';
                // eliminar[i].style.display = 'none';
              }
            }
          }
        }, 1)
      },
      drawCallback: (settings: any) => {
        $('.btn-dropdown-modificar').off().on('click', (event: any) => {
          this.helperService.redirectApp(`parametros/factura-compra/editar/${event.target.dataset.id}`)
        });
        $('.btn-dropdown-ver').off().on('click', (event: any) => {
          this.helperService.redirectApp(`parametros/factura-compra/ver/${event.target.dataset.id}`);
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
          })
        });
      },
    };
  }

  public nuevo() {
    this.helperService.redirectApp('parametros/factura-compra/crear');
  }

  }
