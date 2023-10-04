import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { LANGUAGE_DATATABLE } from 'src/app/admin/datatable.language';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { BotonesComponent } from 'src/app/general/botones/botones.component';
import { EmpleadosCargeMasivoFormComponent } from '../empleados-carge-masivo-form/empleados-carge-masivo-form.component';
import { EmpleadosMedidasComponent } from '../empleados-medidas/empleados-medidas.component';
import { EmpleadosService } from '../empleados.service';

@Component({
  selector: 'app-empleados-index',
  templateUrl: './empleados-index.component.html',
  styleUrls: ['./empleados-index.component.css']
})
export class EmpleadosIndexComponent implements OnInit { 
  @ViewChild('botonesDatatable') botonesDatatable!: BotonesComponent;
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  public dtTrigger: Subject<any> = new Subject();
  public opcionesDataTable: any = {};
  public url: string = "src/assets/excel/plantilla_empleados.xlsx";
  public API_URL : any;
  public title = "Listado de Empleados";
  public breadcrumb = [{name: `inicio` , icon: `fa-solid fa-house`}, {name: "Parametros" , icon: "fas fa-cogs"}, {name: "Empleados" , icon: "fa-solid fa-people-group"}];
  // <i class="fa-solid fa-people-group"></i>
  public botones: String[] = ['btn-nuevo' , 'btn-excel-empleado' , 'btn-carge-masivo'];
  public arrayBotonesDatatable: String[] = ['btn-modificar', 'btn-eliminar', 'btn-ver-talla'];
  constructor(private service: EmpleadosService, private helperService: HelperService, 
    private route: Router, private modalService: NgbModal,
    // private datePipe: DatePipe
    ) { }

  ngOnInit(): void {
    this.cargarDatatable();
    // alert("hola");
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
          data.foreignKey = "0";
          this.service.getAllEmpleados(data).subscribe(res => {
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
              title: "Empresa",
              data: 'empresa'
            },
            {
              title: "Persona",
              data: 'persona'
            },
            {
              title: "Cargo",
              data: 'cargo'
            },
            {
              title: "Camisa",
              data: 'tallaSuperior',
            },
            {
              title: "Pantalón",
              data: 'tallaInferior',
            },
            {
              title: "Fecha de ingreso",
              data: 'fechaIngreso',
              render: (item : any) => {
                return this.helperService.convertDateUTCToDMA(item);
              }
            },
            {
              title: "Estado",
              data: 'estado',
              render: function(item : boolean) {
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
            this.helperService.redirectApp(`/parametros/empleados/editar/${event.target.dataset.id}`);
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
          $('.btn-dropdown-ver-talla').off().on('click', (event : any) => {
            let modal = this.modalService.open(EmpleadosMedidasComponent, {size: 'lg'});
            modal.componentInstance.empleadoId = event.target.dataset.id;
            modal.componentInstance.ver = true
          });
        }
    };
  }

  public nuevo() {
    this.helperService.redirectApp(`parametros/empleados/crear`);
  }

  cargeMasivo(){
    let modal = this.modalService.open(EmpleadosCargeMasivoFormComponent, {size: 'lg'});
  }

  downloadFile(){
    let link = document.createElement("a");
    link.download = "Plantilla Empleados.xlsx";
    link.href = "/assets/excel/plantilla_empleados.xlsx";
    link.click();
    link.remove();
  }


}
