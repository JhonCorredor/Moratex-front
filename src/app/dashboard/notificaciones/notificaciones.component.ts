import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { LANGUAGE_DATATABLE } from 'src/app/admin/datatable.language';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';
import { HelperService } from 'src/app/admin/helper.service';
import { BotonesComponent } from 'src/app/general/botones/botones.component';
import { NotificacionesService } from './notificaciones.service';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css']
})
export class NotificacionesComponent implements OnInit {

  @ViewChild('botonesDatatable') botonesDatatable!: BotonesComponent;
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  public dtTrigger: Subject<any> = new Subject();
  public opcionesDataTable: any = {};

  public API_URL : any;
  public title = "Notificaciones";
  public breadcrumb: any[];
  public arrayBotonesDatatable: String[] = ['btn-modificar', 'btn-eliminar'];
  constructor(private service: NotificacionesService, private helperService: HelperService, private modalService: NgbModal) { 
    this.breadcrumb = [{name: `Inicio` , icon: `fa-solid fa-house`},  {name: "Dashboard" , icon: "fas fa-cogs"}, {name: "Notificaciones" }];
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
        order: [0, 'asc'],
        ajax: (dataTablesParameters: any, callback : any) => {
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
        columns: [
            {
              title: "Titulo",
              data: 'titulo'
            },
            {
              title: "Mensaje",
              data: 'mensaje'
            },
            {
              title: "Url",
              data: 'url',
              render: function(item: any) {
                if (item) {
                  return "<a href='" + item + "'>" + item + "</a>";
                } 
                return "";
              }
            },
            // {
            //   title: "Acciones",
            //   orderable: false,
            //   width: '300px',
            //   data: "id",
            //   render: function(id : any, type : any, row : any) {
            //     const boton = that.botonesDatatable;
            //     return boton.botonesDropdown.nativeElement.outerHTML.split('$id').join(id);
            //     // return id
            //   },
            //   className: "pl-1 pr-0 text-center",
            //   responsivePriority: 7
            // }
        ],
        drawCallback: (settings : any) => {
          // $('.btn-dropdown-modificar').off().on('click', (event : any) => {
          //   this.helperService.redirectApp(`/tallaje/piezas/editar/${event.target.dataset.id}`);
          // });
          // $('.btn-dropdown-eliminar').off().on('click', (event : any) => {
          //   this.helperService.confirmDelete(() => {
          //     this.service.delete("Piezas", event.target.dataset.id).subscribe(l => {
          //       if (l.status) {
          //         this.helperService.showMessage(MessageType.SUCCESS, Messages.DELETESUCCESS);
                  
          //         this.refrescarTabla();
          //       } else {
          //         this.helperService.showMessage(MessageType.ERROR, Messages.DELETEERROR);
          //       }
          //     })
          //   });
          // });
        }
    };
  }

}
