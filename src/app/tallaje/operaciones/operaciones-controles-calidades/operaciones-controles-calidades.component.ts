import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { LANGUAGE_DATATABLE } from 'src/app/admin/datatable.language';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { BotonesComponent } from 'src/app/general/botones/botones.component';
import { ControlesCalidadesService } from '../../controles-calidades/controles-calidades.service';
import { OperacionesControlesCalidadesService } from './operaciones-controles-calidades.service';

@Component({
  selector: 'app-operaciones-controles-calidades',
  templateUrl: './operaciones-controles-calidades.component.html',
  styleUrls: ['./operaciones-controles-calidades.component.css']
})
export class OperacionesControlesCalidadesComponent implements OnInit {

  @ViewChild('botonesDatatable') botonesDatatable!: BotonesComponent;
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  public dtTrigger: Subject<any> = new Subject();
  public opcionesDataTable: any = {};
  public arrayBotonesDatatable: String[] = ['btn-modificar', 'btn-eliminar'];
  public botones = ['btn-guardar'];

  @Input() operacionId: any = null;

  public frmOperacionControlCalidad: FormGroup;
  public statusForm : boolean = true
  public listControlesCalidades: any = [];

  constructor(private controlesCalidadesService: ControlesCalidadesService, private helperService: HelperService, private service: OperacionesControlesCalidadesService) { 
    this.frmOperacionControlCalidad = new FormGroup({
      Id: new FormControl(0, Validators.required),
      OperacionId: new FormControl(this.operacionId, Validators.required),
      ControlCalidadId: new FormControl(null, Validators.required),
      Estado: new FormControl(true, Validators.required)
    });
  }

  ngOnInit(): void {
    this.cargarDatatable();
    this.cargarListaPiezas();
  }

  ngAfterViewInit() {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  cargarListaPiezas() {
    this.controlesCalidadesService.getAll().subscribe(r => {
      this.listControlesCalidades = r.data;
    })
  }

  save() {
    this.frmOperacionControlCalidad.controls.OperacionId.setValue(this.operacionId);
    if (this.frmOperacionControlCalidad.invalid) {
      this.statusForm  = false
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }
    let data  = this.frmOperacionControlCalidad.value;
    this.service.save(this.frmOperacionControlCalidad.controls.Id.value, data).subscribe(l => {
      if (!l.status) {
        this.helperService.showMessage(MessageType.ERROR, Messages.SAVEERROR)
      } else {
        this.refrescarTabla();
        this.frmOperacionControlCalidad.reset();
        this.frmOperacionControlCalidad.controls.Id.setValue(0);
        this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS)
      }
    })
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
          data.foreignKey = this.operacionId;
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
              title: "Control calidad",
              data: 'controlCalidad',
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
            this.service.getById(event.target.dataset.id).subscribe(res => {
              this.frmOperacionControlCalidad.controls.Id.setValue(res.data.id);
              this.frmOperacionControlCalidad.controls.ControlCalidadId.setValue(res.data.controlCalidadId);
              this.frmOperacionControlCalidad.controls.Estado.setValue(res.data.estado);
            })
          });
          $('.btn-dropdown-eliminar').off().on('click', (event : any) => {
            this.helperService.confirmDelete(() => {
              this.service.delete(event.target.dataset.id).subscribe(l => {
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

}
