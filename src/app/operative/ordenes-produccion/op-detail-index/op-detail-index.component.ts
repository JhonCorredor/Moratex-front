import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { BotonesComponent } from 'src/app/general/botones/botones.component';
import { OrdenesProduccionService } from '../ordenes-produccion.service';
import { HelperService, MessageType, Messages } from 'src/app/admin/helper.service';
import { Router } from '@angular/router';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';
import { LANGUAGE_DATATABLE } from 'src/app/admin/datatable.language';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OpDetailFormComponent } from '../op-detail-form/op-detail-form.component';

@Component({
  selector: 'app-op-detail-index',
  templateUrl: './op-detail-index.component.html',
  styleUrls: ['./op-detail-index.component.css']
})
export class OpDetailIndexComponent implements OnInit {

  @Input() ordenProduccionId = 0;
  @ViewChild('botonesDatatable') botonesDatatable!: BotonesComponent;
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  public dtTrigger: Subject<any> = new Subject();
  public opcionesDataTable: any = {};

  public API_URL : any;
  public botones: String[] = ['btn-nuevo'];
  public arrayBotonesDatatable: String[] = ['btn-modificar', 'btn-eliminar'];
  constructor(private service: OrdenesProduccionService,
    private helperService: HelperService,
    private modalService: NgbModal) { }

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
          data.foreignKey = this.ordenProduccionId;

          this.service.getAllOPDetalles(data).subscribe((res : any) => {
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
              title: "Fecha",
              data: 'fecha',
              render: (item : any) => {
                return this.helperService.convertDateUTCToDMA(item);
              }
            },
            {
              title: "Avance",
              data: 'avance',
            },
            {
              title: "Empleado",
              data: 'empleado',
            },
            {
              title: "Acciones",
              orderable: false,
              width: '300px',
              data: "id",
              render: function(id : any, type : any, row : any) {
                const boton = that.botonesDatatable;
                return boton.botonesDropdown.nativeElement.outerHTML.split('$id').join(id)
              },
              className: "pl-1 pr-0 text-center",
              responsivePriority: 7
            }
        ],
        // rowCallback: (template: any, data: any) => {
        //   setTimeout(() => {
        //     let modificar = $('.btn-dropdown-modificar')
        //     let eliminar = $('.btn-dropdown-eliminar')
        //     let ver = $('.btn-dropdown-ver')
        //     for (let i = 0; i <= modificar.length - 1; i++) {
        //       let id = modificar[i].dataset.id;
        //       if (id == data.id) {
        //         if(data.estadoId == 1032 || data.estadoId == 1033) {
        //           modificar[i].style.display = 'none';
        //           eliminar[i].style.display = 'none';  
        //         }else {
        //           ver[i].style.display = 'none';
        //         }
        //       }
        //     }
        //   }, 1)
          
        // },
        drawCallback: (settings : any) => {
          $('.btn-dropdown-modificar').off().on('click', (event : any) => {
            let modal = this.modalService.open(OpDetailFormComponent, {size: 'lg', keyboard: false, backdrop: "static"});
            
            modal.componentInstance.id = event.target.dataset.id;
            modal.componentInstance.ordenProduccionId = this.ordenProduccionId;
            
            modal.result.then(res => {
              if (res) {
                this.refrescarTabla();
              }
            })
          });
          $('.btn-dropdown-eliminar').off().on('click', (event : any) => {
            this.helperService.confirmDelete(() => {
              this.service.deleteOPDetalles(event.target.dataset.id).subscribe(l => {
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
    let modal = this.modalService.open(OpDetailFormComponent, {size: 'lg', keyboard: false, backdrop: "static"});

    modal.componentInstance.ordenProduccionId = this.ordenProduccionId;

    modal.result.then(res => {
      if (res) {
        this.refrescarTabla();
      }
    })
  }

}
