import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { LANGUAGE_DATATABLE } from 'src/app/admin/datatable.language';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { BotonesComponent } from 'src/app/general/botones/botones.component';
import { GeneralParameterService } from 'src/app/parameters/general-parameter/general-parameter.service';
import { PrendasPiezasService } from '../prendas-piezas.service';

@Component({
  selector: 'app-prendas-piezas-form',
  templateUrl: './prendas-piezas-form.component.html',
  styleUrls: ['./prendas-piezas-form.component.css']
})
export class PrendasPiezasFormComponent implements OnInit {
  
  @ViewChild('botonesDatatable') botonesDatatable!: BotonesComponent;
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  public dtTrigger: Subject<any> = new Subject();
  public opcionesDataTable: any = {};
  public arrayBotonesDatatable: String[] = ['btn-modificar', 'btn-eliminar'];
  public botones = ['btn-guardar'];

  @Input() prendaId: any = null;

  public frmPrendaPieza: FormGroup;
  public statusForm : boolean = true
  public listPiezas: any = [];

  constructor(private generalService: GeneralParameterService, private helperService: HelperService, private service: PrendasPiezasService) { 
    this.frmPrendaPieza = new FormGroup({
      Id: new FormControl(0, Validators.required),
      PrendaId: new FormControl(this.prendaId, Validators.required),
      PiezaId: new FormControl(null, Validators.required),
      Cantidad : new FormControl(null, Validators.required),
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
    this.generalService.getAll("Piezas").subscribe(r => {
      this.listPiezas = r.data;
    })
  }

  save() {
    this.frmPrendaPieza.controls.PrendaId.setValue(this.prendaId);
    if (this.frmPrendaPieza.invalid) {
      this.statusForm  = false
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }
    let data  = this.frmPrendaPieza.value;
    this.service.save(this.frmPrendaPieza.controls.Id.value, data).subscribe(l => {
      if (!l.status) {
        this.helperService.showMessage(MessageType.ERROR, Messages.SAVEERROR)
      } else {
        this.refrescarTabla();
        this.frmPrendaPieza.reset();
        this.frmPrendaPieza.controls.Id.setValue(0);
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
              title: "Pieza",
              data: 'pieza',
            },
            {
              title: "Cantidad",
              data:  "cantidad",
              // render : function(cantidad : any) {
              //   return that.helperService.formaterNumber(cantidad)
              // }
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
              this.frmPrendaPieza.controls.Id.setValue(res.data.id);
              this.frmPrendaPieza.controls.PiezaId.setValue(res.data.piezaId);
              this.frmPrendaPieza.controls.Cantidad.setValue(res.data.cantidad);
              this.frmPrendaPieza.controls.Estado.setValue(res.data.estado);
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
