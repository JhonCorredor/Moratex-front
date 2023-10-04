
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { LANGUAGE_DATATABLE } from 'src/app/admin/datatable.language';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';
import { HelperService } from 'src/app/admin/helper.service';
import { ModelosCargosService } from 'src/app/parameters/empresas/modelos-cargos.service';

@Component({
  selector: 'app-generar-cotizacion-modeloscargos',
  templateUrl: './generar-cotizacion-modeloscargos.component.html',
  styleUrls: ['./generar-cotizacion-modeloscargos.component.css']
})
export class GenerarCotizacionModeloscargosComponent implements OnInit {
  @ViewChild(DataTableDirective) dtElementModelosCargos!: DataTableDirective;
  public dtTriggerModelosCargos: Subject<any> = new Subject();
  public opcionesDataTableModelosCargos: any = {};

  @Input() empresaId = "0";

  constructor(private modeloCargoService: ModelosCargosService, private helperService: HelperService) { 
    
  }

  ngOnInit(): void {
    this.cargarDatatableModelosCargos();
  }

  ngAfterViewInit() {
    this.dtTriggerModelosCargos.next();
  }

  ngOnDestroy(): void {
    this.dtTriggerModelosCargos.unsubscribe();
  }

  refrescarTablaModelosCargos() {
    if(typeof this.dtElementModelosCargos.dtInstance != 'undefined'){
      this.dtElementModelosCargos.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.ajax.reload()
      });
    }
  }

  

  cargarDatatableModelosCargos() {
    const that = this;
    that.opcionesDataTableModelosCargos = {
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
          this.modeloCargoService.getDatatable(data).subscribe(res => {
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
                title: 'Cargo',
                data: 'cargo',
            }
            ,
            {
                title: 'Número dotación',
                data: 'numeroDotacion',
                className: "text-right"
            },
            
        ]
    };
  }

}
