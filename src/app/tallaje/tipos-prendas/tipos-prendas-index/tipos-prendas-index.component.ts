import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { LANGUAGE_DATATABLE } from 'src/app/admin/datatable.language';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { BotonesComponent } from 'src/app/general/botones/botones.component';
import { GeneralParameterService } from 'src/app/parameters/general-parameter/general-parameter.service';
import {  TiposPrendasFormComponent } from '../tipos-prendas-form/tipos-prendas-form.component';

@Component({
  selector: 'app-tipos-prendas-index',
  templateUrl: './tipos-prendas-index.component.html',
  styleUrls: ['./tipos-prendas-index.component.css']
})
export class TiposPrendasIndexComponent implements OnInit {

  @ViewChild('botonesDatatable') botonesDatatable!: BotonesComponent;
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  public dtTrigger: Subject<any> = new Subject();
  public opcionesDataTable: any = {};

  public API_URL : any;
  public title = "Listado de Tipos de Prendas";
  public breadcrumb = [{name: `Inicio` , icon: `fa-solid fa-house`},  {name: 'Tallaje'} , {name: 'Tipos de Prendas' }];
  public botones: String[] = ['btn-nuevo'];
  public arrayBotonesDatatable: String[] = ['btn-modificar', 'btn-eliminar'];

  constructor(private service: GeneralParameterService, private helperService: HelperService, private route: Router, private modalService: NgbModal, private routeActual: ActivatedRoute) { 
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
          this.service.datatable("TiposPrendas", data).subscribe(res => {
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
              title: "Código",
              data: 'codigo'
            },
            {
              title: "Nombre",
              data: 'nombre'
            },
            {
              title: "Superior",
              data: 'superior',
              render: function(item: any) {
                if (item) {
                  return "<label class='text-center badge badge-success'>Si</label>";
                } else {
                  return "<label class='text-center badge badge-danger'>No</label>";
                }
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
          $('.btn-dropdown-modificar').off().on('click', (event : any) => {
            let modal = this.modalService.open(TiposPrendasFormComponent, {size: 'lg', keyboard: false, backdrop: "static"});

            modal.componentInstance.id = event.target.dataset.id;
            modal.result.then(res => {
              if (res) {
                this.refrescarTabla();
              }
            })
          });
          $('.btn-dropdown-eliminar').off().on('click', (event : any) => {
            this.helperService.confirmDelete(() => {
              this.service.delete("Maquinarias", event.target.dataset.id).subscribe(l => {
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

  public nuevo() {
    let modal = this.modalService.open(TiposPrendasFormComponent, {size: 'lg', keyboard: false, backdrop: "static"});

    modal.result.then(res => {
      if (res) {
        this.refrescarTabla();
      }
    })
  }

}
