import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { LANGUAGE_DATATABLE } from 'src/app/admin/datatable.language';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';
import {
  HelperService,
  Messages,
  MessageType,
} from 'src/app/admin/helper.service';
import { BotonesComponent } from 'src/app/general/botones/botones.component';
import { CostosFormComponent } from '../costos-form/costos-form.component';
import { CostosService } from '../costos.service';

@Component({
  selector: 'app-costos-index',
  templateUrl: './costos-index.component.html',
  styleUrls: ['./costos-index.component.css'],
})
export class CostosIndexComponent implements OnInit {
  @ViewChild('botonesDatatable') botonesDatatable!: BotonesComponent;
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  public dtTrigger: Subject<any> = new Subject();
  public opcionesDataTable: any = {};

  public API_URL: any;
  public title = 'Listado de  Costos';
  public breadcrumb = [
    { name: `Inicio`, icon: `fa-solid fa-house` },
    { name: 'Operativo', icon: 'fas fa-cogs' },
    { name: 'Costos' },
  ];
  public botones: String[] = ['btn-nuevo'];
  public arrayBotonesDatatable: String[] = ['btn-modificar', 'btn-eliminar'];
  constructor(
    private service: CostosService,
    private helperService: HelperService,
    private route: Router,
    private modalService: NgbModal
  ) {}

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
        dtInstance.ajax.reload();
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
        let pageNumber =
          dataTablesParameters.start / dataTablesParameters.length + 1;
        var data = new DatatableParameter();
        data.pageNumber = pageNumber.toString();
        data.pageSize = dataTablesParameters.length.toString();
        data.filter = dataTablesParameters.search.value
          ? dataTablesParameters.search.value
              .replaceAll('$', '')
              .replaceAll('.', '')
              .replaceAll(',', '')
          : '';
        data.columnOrder = that.helperService.capitalizeFirstLetter(
          dataTablesParameters.columns[
            dataTablesParameters.order[0].column
          ].data.toString()
        );
        data.directionOrder = dataTablesParameters.order[0].dir;
        this.service.datatable(data).subscribe((res) => {
          callback({
            recordsTotal: res.meta.totalCount,
            recordsFiltered: res.meta.totalCount,
            draw: dataTablesParameters.draw,
            data: res.data,
          });
        });
      },
      language: LANGUAGE_DATATABLE,
      columns: [
        {
          title: 'Descripción',
          data: 'descripcion',
        },
        {
          title: 'Tipo Costo',
          data: 'tipoCosto',
        },
        {
          title: 'Valor',
          data: 'valor',
          className: 'text-right',
          render: function (data: any) {
            return '$' + that.helperService.formaterNumber(data);
          },
        },
        {
          title: 'Proveedor',
          data: 'proveedor',
        },
        {
          title: 'Número Factura',
          data: 'numeroFactura',
        },
        {
          title: 'Pago de Caja',
          data: 'pagoCaja',
          render: function (item: any) {
            if (item) {
              return "<label class='text-center badge badge-success'>Si</label>";
            } else {
              return "<label class='text-center badge badge-danger'>No</label>";
            }
          },
        },
        {
          title: 'Fecha',
          data: 'fechaCosto',
          render: (item: any) => {
            return this.helperService.convertDateUTCToDMA(item);
          },
        },
        {
          title: 'Acciones',
          orderable: false,
          data: 'id',
          render: function (id: any, type: any, row: any) {
            const boton = that.botonesDatatable;
            return boton.botonesDropdown.nativeElement.outerHTML
              .split('$id')
              .join(id);
          },
          className: 'pl-1 pr-0 text-center',
          responsivePriority: 7,
        },
      ],
      drawCallback: (settings: any) => {
        $('.btn-dropdown-modificar')
          .off()
          .on('click', (event: any) => {
            this.helperService.redirectApp(
              `operativo/costos/editar/${event.target.dataset.id}`
            );
          });
        $('.btn-dropdown-eliminar')
          .off()
          .on('click', (event: any) => {
            this.helperService.confirmDelete(() => {
              this.service.delete(event.target.dataset.id).subscribe((l) => {
                if (l.status) {
                  this.helperService.showMessage(
                    MessageType.SUCCESS,
                    Messages.DELETESUCCESS
                  );

                  this.refrescarTabla();
                } else {
                  this.helperService.showMessage(
                    MessageType.ERROR,
                    Messages.DELETEERROR
                  );
                }
              });
            });
          });
      },
    };
  }

  public nuevo() {
    this.helperService.redirectApp('operativo/costos/crear');
  }
}
