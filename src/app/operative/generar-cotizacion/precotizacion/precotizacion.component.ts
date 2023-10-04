import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { LANGUAGE_DATATABLE } from 'src/app/admin/datatable.language';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';
import { HelperService } from 'src/app/admin/helper.service';
import { ModelosCargosService } from 'src/app/parameters/empresas/modelos-cargos.service';

@Component({
  selector: 'app-precotizacion',
  templateUrl: './precotizacion.component.html',
  styleUrls: ['./precotizacion.component.css']
})
export class PrecotizacionComponent implements OnInit {
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  public dtTrigger: Subject<any> = new Subject();
  public opcionesDataTable: any = {};

  public breadcrumb = [{name: `Inicio` , icon: `fa-solid fa-house`},  {name: "Operativo"}, {name: "Generar cotización"}];
  public titulo = "Precotización";
  public botones = ['btn-generar-cotizacion'];
  private empresaId = "0";
  private iva = "0";

  constructor(private helperService: HelperService, private route: ActivatedRoute, private modeloCargoService: ModelosCargosService) { 
    this.route.params.subscribe(param => {
      this.empresaId = param.empresaid;
      this.iva = param.iva;
    })
  }

  ngOnInit(): void {
    this.cargarDatatable();
  }

  ngAfterViewInit() {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  refrescarTablaModelosCargos() {
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
          data.foreignKey = this.empresaId;
          data.extra = this.iva;
          this.modeloCargoService.getDatatablePrecotizacion(data).subscribe(res => {
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
                title: 'Modelo',
                data: 'modelo',
            },
            {
                title: 'Cantidad',
                data: 'cantidad',
                className: "text-right",
            },
            {
                title: 'Valor Unitario',
                data: 'valorUnitario',
                className: "text-right",
                render: (item: string) => this.helperService.formatearNumero(item, ',', '.', 2)
            },
            {
                title: 'SubTotal',
                data: 'subTotal',
                className: "text-right",
                render: (item: string) => this.helperService.formatearNumero(item, ',', '.', 2)
            },
            {
                title: 'Total Iva',
                data: 'totalIva',
                className: "text-right",
                render: (item: string) => this.helperService.formatearNumero(item, ',', '.', 2)
            },
            {
                title: 'Total',
                data: 'total',
                className: "text-right",
                render: (item: string) => this.helperService.formatearNumero(item, ',', '.', 2)
            },
        ]
    };
  }

}
