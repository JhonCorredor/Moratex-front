import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { LANGUAGE_DATATABLE } from 'src/app/admin/datatable.language';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { BotonesComponent } from 'src/app/general/botones/botones.component';
import { CotizacionesService } from '../../cotizaciones.service';
import { CotizacionesDetallesFormComponent } from '../cotizaciones-detalles-form/cotizaciones-detalles-form.component';
import { CotizacionesDetallesService } from '../cotizaciones-detalles.service';

@Component({
  selector: 'app-cotizacionesDetalles-index',
  templateUrl: './cotizaciones-detalles-index.component.html',
  styleUrls: ['./cotizaciones-detalles-index.component.css']
})
export class CotizacionesDetallesIndexComponent implements OnInit { 
  @ViewChild('botonesDatatable') botonesDatatable!: BotonesComponent;
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  public dtTrigger: Subject<any> = new Subject();
  public opcionesDataTable: any = {};

  @Input() cotizacion: any;
  @Input() status : boolean = false
  @Input() EmpresaId: any;
  public API_URL : any;
  public total : number = 0
  public botones: String[] = ['btn-nuevo'];
  public arrayBotonesDatatable: String[] = ['btn-modificar', 'btn-eliminar'];

  constructor(private service: CotizacionesDetallesService, 
    private helperService: HelperService, 
    private modalService: NgbModal
    ) { }

  ngOnInit(): void {
    if(this.status){
      this.botones = [];
      this.arrayBotonesDatatable = [];
    }
    this.cargarDatatable();
  }

  ngAfterViewInit() {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  refrescarTabla() {
      this.total = 0;
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
          data.foreignKey = this.cotizacion;

          this.service.getAllCotizacionesDetalles(data).subscribe((res : any) => {

            for (let i = 0; i < res.data.length; i++) {
              this.total += res.data[i].valorTotal;
            }

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
              title: 'Cantidad' , 
              data: 'cantidad' ,
            },
            { 
              title: 'Valor Unitario'  , 
              data: 'valorUnitario' ,
              render: (item: string) => this.helperService.formatearNumero(item, ',', '.', 2)
            },
            { 
              title: 'Iva' ,
               data: 'iva' ,
            },
            { 
              title: 'Valor Total' ,
               data: 'valorTotal' ,
               render: (item: string) => this.helperService.formatearNumero(item, ',', '.', 0)
            },
            { 
              title: 'Observaciones' ,
               data: 'observacion' 
            },
            { 
              title: 'Modelo' ,
               data: 'modelo'
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
        // responsive: true,
        drawCallback: (settings : any) => {
          $('.btn-dropdown-modificar').off().on('click', (event : any) => {
            let modal = this.modalService.open(CotizacionesDetallesFormComponent, {size: 'lg', keyboard: false, backdrop: "static"});
            
            modal.componentInstance.id = event.target.dataset.id;
            modal.componentInstance.empresa = this.EmpresaId;
            
            modal.result.then(res => {
              if (res) {
                this.refrescarTabla();
              }
            })
          });
          $('.btn-dropdown-eliminar').off().on('click', (event : any) => {
            this.helperService.confirmDelete(() => {
              this.service.delete(event.target.dataset.id).subscribe(
                _ => {
                  this.helperService.showMessage(MessageType.SUCCESS, Messages.DELETESUCCESS);
                  this.refrescarTabla();
                },
                error => this.helperService.showMessageError(error)
              )
            });
          });
        }
    };
  }

  public nuevo() {
    let modal = this.modalService.open(CotizacionesDetallesFormComponent, {size: 'lg', keyboard: false, backdrop: "static"});

    modal.componentInstance.cotizacion = this.cotizacion;
    modal.componentInstance.empresa = this.EmpresaId;

    modal.result.then(res => {
      if (res) {
        this.refrescarTabla();
      }
    })
  }

}
