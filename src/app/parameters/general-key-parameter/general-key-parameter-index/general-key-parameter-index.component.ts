import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { LANGUAGE_DATATABLE } from 'src/app/admin/datatable.language';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { BotonesComponent } from 'src/app/general/botones/botones.component';
import { GeneralKeyParameterFormComponent } from '../general-key-parameter-form/general-key-parameter-form.component';
import { GeneralKeyParameterService } from '../general-key-parameter.service';

@Component({
  selector: 'app-generalKey-parameter-index',
  templateUrl: './general-key-parameter-index.component.html',
  styleUrls: ['./general-key-parameter-index.component.css']
})
export class GeneralKeyParameterIndexComponent implements OnInit {

  @ViewChild('botonesDatatable') botonesDatatable!: BotonesComponent;
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  public dtTrigger: Subject<any> = new Subject();
  public opcionesDataTable: any = {};

  public API_URL : any;
  public title = "Listado ";
  public breadcrumb: any[];
  public botones: String[] = ['btn-nuevo'];
  public arrayBotonesDatatable: String[] = ['btn-modificar', 'btn-eliminar'];
  public serviceName: String = "";
  public titleData: String = ""
  public foreignKeyRuta : string = "";
  public foreignKeyTitle : string = "";
  public serviceKey: string = "";
  public modulo : string = "";
  public iconModule : string = "";

  constructor(private service: GeneralKeyParameterService, private helperService: HelperService, private route: Router, private modalService: NgbModal, private routeActual: ActivatedRoute) { 
    this.routeActual.data.subscribe(l => {
      this.serviceName = l.ruta
      this.titleData = l.titulo
      this.foreignKeyRuta = l.foreignKeyRuta
      this.foreignKeyTitle = l.foreignKeyTitle
      this.serviceKey = l.serviceKey;
      this.modulo = l.modulo;
      this.iconModule = l.iconModule;

    });
    this.title = `Listado de ${this.titleData}`;
    this.breadcrumb = [{name: `Inicio` , icon: `fa-solid fa-house`},  {name: this.modulo , icon : this.iconModule}, {name: this.serviceName}];
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
        order: [0, 'desc'],
        ajax: (dataTablesParameters: any, callback : any) => {
          let pageNumber = (dataTablesParameters.start / dataTablesParameters.length) + 1
          var data = new DatatableParameter();
          data.pageNumber = pageNumber.toString();
          data.pageSize = dataTablesParameters.length.toString();
          data.filter = dataTablesParameters.search.value;
          data.columnOrder = that.helperService.capitalizeFirstLetter(dataTablesParameters.columns[dataTablesParameters.order[0].column].data.toString());;
          data.directionOrder = dataTablesParameters.order[0].dir;
          this.service.datatable(this.serviceName, data).subscribe(res => {
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
              title:  `${this.foreignKeyTitle}`,
              data: `${this.foreignKeyRuta}`,
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
        drawCallback: (settings : any) => {
          $('.btn-dropdown-modificar').off().on('click', (event : any) => {
            let modal = this.modalService.open(GeneralKeyParameterFormComponent, {size: 'lg', keyboard: false, backdrop: "static"});
            modal.componentInstance.serviceName = this.serviceName;
            modal.componentInstance.titleData = this.titleData;
            modal.componentInstance.foreignKeyRuta = this.foreignKeyRuta;
            modal.componentInstance.foreignKeyTitle = this.foreignKeyTitle;
            modal.componentInstance.serviceKey = this.serviceKey;
            modal.componentInstance.id = event.target.dataset.id;
            modal.result.then(res => {
              if (res) {
                this.refrescarTabla();
              }
            })
          });
          $('.btn-dropdown-eliminar').off().on('click', (event : any) => {
            this.helperService.confirmDelete(() => {
              this.service.delete(this.serviceName, event.target.dataset.id).subscribe(l => {
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
    let modal = this.modalService.open(GeneralKeyParameterFormComponent, {size: 'lg', keyboard: false, backdrop: "static"});

    modal.componentInstance.titleData = this.titleData;
    modal.componentInstance.serviceName = this.serviceName;
    modal.componentInstance.foreignKeyRuta = this.foreignKeyRuta;
    modal.componentInstance.foreignKeyTitle = this.foreignKeyTitle;
    modal.componentInstance.serviceKey = this.serviceKey;
    modal.result.then(res => {
      if (res) {
        this.refrescarTabla();
      }
    })
  }

}
