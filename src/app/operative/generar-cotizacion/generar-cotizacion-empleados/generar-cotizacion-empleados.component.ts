import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { LANGUAGE_DATATABLE } from 'src/app/admin/datatable.language';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';
import { HelperService } from 'src/app/admin/helper.service';
import { EmpleadosService } from 'src/app/parameters/empleados/empleados.service';

@Component({
  selector: 'app-generar-cotizacion-empleados',
  templateUrl: './generar-cotizacion-empleados.component.html',
  styleUrls: ['./generar-cotizacion-empleados.component.css']
})
export class GenerarCotizacionEmpleadosComponent implements OnInit {
  @ViewChild(DataTableDirective) dtElementEmpleados!: DataTableDirective;
  public dtTriggerEmpleados: Subject<any> = new Subject();
  public opcionesDataTableEmpleados: any = {};

  @Input() empresaId = "0";

  constructor(private helperService: HelperService, private empleadoService: EmpleadosService) { }

  ngOnInit(): void {
    this.cargarDatatableEmpleados();  
  }

  ngAfterViewInit() {
    this.dtTriggerEmpleados.next();
  }

  ngOnDestroy(): void {
    this.dtTriggerEmpleados.unsubscribe();
  }

  refrescarTablaEmpleados() {
    if(typeof this.dtElementEmpleados.dtInstance != 'undefined'){
      this.dtElementEmpleados.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.ajax.reload()
      });
    }
  }

  cargarDatatableEmpleados() {
    const that = this;
    that.opcionesDataTableEmpleados = {
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
          this.empleadoService.getAllEmpleados(data).subscribe(res => {
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
                title: 'Empleado',
                data: 'persona',
            },
            {
                title: 'Cargo',
                data: 'cargo',
            }
        ]
    };
  }

}
