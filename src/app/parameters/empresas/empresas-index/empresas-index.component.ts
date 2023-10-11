import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { LANGUAGE_DATATABLE } from 'src/app/admin/datatable.language';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { BotonesComponent } from 'src/app/general/botones/botones.component';
import { EmpresasFormComponent } from '../empresas-form/empresas-form.component';
import { EmpresasService } from '../empresas.service';

@Component({
  selector: 'app-empresas-index',
  templateUrl: './empresas-index.component.html',
  styleUrls: ['./empresas-index.component.css']
})
export class EmpresasIndexComponent implements OnInit { 
  @ViewChild('botonesDatatable') botonesDatatable!: BotonesComponent;
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  public dtTrigger: Subject<any> = new Subject();
  public opcionesDataTable: any = {};

  public API_URL : any;
  public title = "Listado de Empresas";
  public breadcrumb = [{name: `Inicio` , icon: `fa-solid fa-house`}, {name: "Parametros" , icon: "fas fa-cogs"},  {name: "Empresas"}];
  public botones: String[] = ['btn-nuevo'];
  public arrayBotonesDatatable: String[] = ['btn-modificar', 'btn-eliminar'];
  constructor(private service: EmpresasService, private helperService: HelperService, private route: Router, private modalService: NgbModal) { }

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
          this.service.getAllEmpresas(data).subscribe(res => {
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
              title: 'Codigo',
              data: 'codigo',
            },
            {
              title: 'RazonSocial',
              data: 'razonSocial',
            },
            {
              title: 'Nit',
              data: 'nit',
            },
            {
              title: "Direccion",
              data: 'direccion'
            },
            {
              title: 'Telefono',
              data: 'telefono',
            },
            {
              title: 'Correo',
              data: 'email',
            },
            {
              title: 'Web',
              data: 'web',
            },
            {
              title: 'Ciudad',
              data: 'ciudad',
            },
            {
              title: "Logo",
              data: 'logo',
              render : function(data : any,) {
                return   `<img src='${data}'  width='70' height='70'>`;
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
                // return id
              },
              className: "pl-1 pr-0 text-center",
              responsivePriority: 7
            }
        ],
        // responsive: true,
        drawCallback: (settings : any) => {
          $('.btn-dropdown-modificar').off().on('click', (event : any) => {
            this.helperService.redirectApp(`parametros/empresas/editar/${event.target.dataset.id}`);
          });
          $('.btn-dropdown-eliminar').off().on('click', (event : any) => {
            this.helperService.confirmDelete(() => {
              this.service.delete(event.target.dataset.id).subscribe(l => {
                if (l.status == "Success") {
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

  public nuevo() {
    this.helperService.redirectApp(`parametros/empresas/crear`);
  }

}
