import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { LANGUAGE_DATATABLE } from 'src/app/admin/datatable.language';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';
import { HelperService } from 'src/app/admin/helper.service';
import { BotonesComponent } from 'src/app/general/botones/botones.component';
import { FichaTenicaService } from '../ficha-tecnica.service';

@Component({
  selector: 'app-ficha-tecnica-index',
  templateUrl: './ficha-tecnica-index.component.html',
  styleUrls: ['./ficha-tecnica-index.component.css']
})
export class FichaTecnicaIndexComponent implements OnInit {

  @ViewChild('botonesDatatable') botonesDatatable!: BotonesComponent;
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  public dtTrigger: Subject<any> = new Subject();
  public opcionesDataTable: any = {};

  public API_URL : any;
  public title = "Ficha técnica";
  public breadcrumb = [{name: `Inicio` , icon: `fa-solid fa-house`},  {name: "Tallaje" , icon: "fas fa-cogs"}, {name: "Ficha técnica"}];
  public arrayBotonesDatatable: String[] = ['btn-ficha-tecnica'];
  constructor(private service: FichaTenicaService, private helperService: HelperService) { }

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
          this.service.datatableModelo(data).subscribe(res => {
            callback({
              recordsTotal: res.meta.totalCount,
              recordsFiltered: res.meta.totalCount,
              draw: dataTablesParameters.draw,
              data: res.data.filter((l:any) => l.estado == 1)
            });
          });
        },
        language: LANGUAGE_DATATABLE,
        columns: [
            {
              title: 'Codigo',
              data: 'codigo'
            },     
            {
              title: "Nombre",
              data: 'nombre',
            },
            {
              title: "Precio",
              data: 'precio',
              className: "text-right",
              render: function (data : number) {
                return "$"+that.helperService.formaterNumber(data);
              }
            },
            {
              title: "Estado",
              data: 'estado',
              render: function(item: any) {
                if (item) {
                  return "<label class='text-center badge badge-success'>Activo</label>";
                } else {
                  return "<label class='text-center badge badge-danger'>Inactivo</label>";
                }
              }
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
          $('.btn-dropdown-ficha-tecnica').off().on('click', (event : any) => {
            this.helperService.redirectApp(`tallaje/ficha-tecnica/ver/${event.target.dataset.id}`);
          });
        }
    };
  }

}
