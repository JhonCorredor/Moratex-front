import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { OrdenesProduccionService } from '../ordenes-produccion.service';
import { HelperService, MessageType, Messages } from 'src/app/admin/helper.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';
import { LANGUAGE_DATATABLE } from 'src/app/admin/datatable.language';
import { OpQualityFormComponent } from '../op-quality-form/op-quality-form.component';
import { BotonesComponent } from 'src/app/general/botones/botones.component';

@Component({
  selector: 'app-op-quality-index',
  templateUrl: './op-quality-index.component.html',
  styleUrls: ['./op-quality-index.component.css']
})
export class OpQualityIndexComponent implements OnInit {

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

          this.service.getAllOPCalidad(data).subscribe((res : any) => {
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
              title: "Control Calidad",
              data: 'controlCalidad',
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
        drawCallback: (settings : any) => {
          $('.btn-dropdown-modificar').off().on('click', (event : any) => {
            let modal = this.modalService.open(OpQualityFormComponent, {size: 'lg', keyboard: false, backdrop: "static"});
            
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
              this.service.deleteOPCalidad(event.target.dataset.id).subscribe(l => {
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
    let modal = this.modalService.open(OpQualityFormComponent, {size: 'lg', keyboard: false, backdrop: "static"});

    modal.componentInstance.ordenProduccionId = this.ordenProduccionId;

    modal.result.then(res => {
      if (res) {
        this.refrescarTabla();
      }
    })
  }

}
