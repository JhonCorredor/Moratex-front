
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { LANGUAGE_DATATABLE } from 'src/app/admin/datatable.language';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';
import { HelperService} from 'src/app/admin/helper.service';
import { BotonesComponent } from 'src/app/general/botones/botones.component';
import { CotizacionesService } from '../cotizaciones.service';

@Component({
  selector: 'app-consolidado-index',
  templateUrl: './consolidado-index.component.html',
  styleUrls: ['./consolidado-index.component.css']
})
export class ConsolidadoIndexComponent implements OnInit {

  @ViewChild('botonesDatatableConsolidado') botonesDatatableConsolidado!: BotonesComponent;
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  @Input() cotizacionId: any;
  public arrayBotonesDatatable: String[] = ['btn-generar-orden-produccion'];
  public dtTrigger: Subject<any> = new Subject();
  public opcionesDataTable: any = {};
  public titulo = "";
  public hasData = false;

  constructor(public routerActive: ActivatedRoute, 
    private service: CotizacionesService, 
    private helperService: HelperService, 
    ) 
  {}

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
          data.foreignKey = this.cotizacionId
          this.service.consolidado(data).subscribe(res => {
            if (res.data && res.data.length > 0) {
              that.hasData = true
            }
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
              title: "Sede",
              data: 'sede',
            },
            {
              title: "Area",
              data: 'area',
            },
            {
              title: "Uniforme por Cargo",
              data: 'uniformeCargo',
            },
            {
              title: "Modelo",
              data: 'modelo',
            },
            {
              title: "Genero",
              data: 'genero',
            },
            {
              title: "Prenda",
              data: 'prenda',
            },
            {
              title: "Talla",
              data: 'talla',
            },
            {
              title: "Empleados por Talla",
              data: 'empleadoTalla',
            },
            {
              title: "Total",
              orderable: false,
              data: 'uniformeCargo',
              render: function(_: any, __: any, data: any) {
                return data.uniformeCargo * data.empleadoTalla;
              }
            },
            {
              title: "Acciones",
              orderable: false,
              width: '5%',
              data: "id",
              render: (id: any) => {
                const boton = this.botonesDatatableConsolidado!;
                return boton.botonesDropdown!.nativeElement.outerHTML.split('$id').join(id);
              },
              className: "pl-1 pr-0 text-center",
              responsivePriority: 1
            }
        ],
        drawCallback: (settings: any) => {
          $('.btn-dropdown-generar-orden-produccion').off().on('click', (event) => {

            this.service.findIfExistsByConsolidadoDetalleId(event.target.dataset.id).subscribe(
              res => {
                if (res.data != 0) {
                  this.helperService.redirectApp(`/operativo/ordenes-produccion/editar/${res.data}`);
                } else {
                  this.helperService.redirectApp(`/operativo/ordenes-produccion/ordenes-produccion-create/${event.target.dataset.id}`);
                }
              },
              error => {
                this.helperService.redirectApp(`/operativo/ordenes-produccion/ordenes-produccion-create/${event.target.dataset.id}`);
              }
            )

          });
        }
    };
  }

  generarConsolidado() {
    this.helperService.redirectApp(`/operativo/consolidados/armar-consolidado/${this.cotizacionId}`)
  }

}
