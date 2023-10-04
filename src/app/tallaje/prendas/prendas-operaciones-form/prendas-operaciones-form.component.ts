import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { LANGUAGE_DATATABLE } from 'src/app/admin/datatable.language';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { BotonesComponent } from 'src/app/general/botones/botones.component';
import { GeneralParameterService } from 'src/app/parameters/general-parameter/general-parameter.service';
import { PrendasOperacionesService } from '../prendas-operaciones.service';

@Component({
  selector: 'app-prendas-operaciones-form',
  templateUrl: './prendas-operaciones-form.component.html',
  styleUrls: ['./prendas-operaciones-form.component.css']
})
export class PrendasOperacionesFormComponent implements OnInit {

  @ViewChild('botonesDatatable') botonesDatatable!: BotonesComponent;
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  public dtTrigger: Subject<any> = new Subject();
  public opcionesDataTable: any = {};
  public arrayBotonesDatatable: String[] = ['btn-eliminar'];
  public botones = ['btn-guardar'];

  @Input() prendaId : any = null;

  public frmPrendasOperaciones: FormGroup;
  public statusForm : boolean = true
  public listOperaciones: any[] = [];

  constructor(private generalService: GeneralParameterService, public helperService: HelperService, private service: PrendasOperacionesService) { 
    this.frmPrendasOperaciones = new FormGroup({
      PrendaId: new FormControl(this.prendaId, Validators.required),
      TiempoMinuto: new FormControl(null),
      OperacionId: new FormControl(null, Validators.required)
    });
  }

  ngOnInit(): void {
    this.cargarDatatable();
    this.cargarSelects();
  }

  ngAfterViewInit() {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  cargarSelects() {
    this.generalService.getAll("Operaciones").subscribe(r => {
      this.listOperaciones = r.data;
    })
  }

  save() {
    this.frmPrendasOperaciones.controls.PrendaId.setValue(this.prendaId);
    if (this.frmPrendasOperaciones.invalid) {
      this.statusForm  = false
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }
    let data  = {
      PrendaId: this.frmPrendasOperaciones.controls.PrendaId.value,
      TiempoMinuto: this.helperService.formatearNumeroDB(this.frmPrendasOperaciones.controls.TiempoMinuto.value),
      OperacionId: this.frmPrendasOperaciones.controls.OperacionId.value
    };
    this.service.save(0, data).subscribe(l => {
      if (!l.status) {
        this.helperService.showMessage(MessageType.ERROR, Messages.SAVEERROR)
      } else {
        this.refrescarTabla();
        this.frmPrendasOperaciones.reset();
        this.frmPrendasOperaciones.controls.Id.setValue(0);
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
          data.foreignKey = this.prendaId;
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
              title: "Operaciónes",
              data: 'operacion',
            },
            {
              title: "Tiempo (minutos)",
              data: 'tiempoMinuto',
              width: '100px'
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
