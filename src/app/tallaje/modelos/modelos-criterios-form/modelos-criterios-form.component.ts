import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { LANGUAGE_DATATABLE } from 'src/app/admin/datatable.language';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { BotonesComponent } from 'src/app/general/botones/botones.component';
import { GeneralParameterService } from 'src/app/parameters/general-parameter/general-parameter.service';
import { ModelosCriteriosService } from '../modelos-criterios.service';

@Component({
  selector: 'app-modelos-criterios-form',
  templateUrl: './modelos-criterios-form.component.html',
  styleUrls: ['./modelos-criterios-form.component.css']
})
export class ModelosCriteriosFormComponent implements OnInit {

  @ViewChild('botonesDatatable') botonesDatatable!: BotonesComponent;
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  public dtTrigger: Subject<any> = new Subject();
  public opcionesDataTable: any = {};
  public arrayBotonesDatatable: String[] = ['btn-modificar', 'btn-eliminar'];
  public botones = ['btn-guardar'];

  @Input() modeloId: any = null;

  public frmModeloCriterio: FormGroup;
  public statusForm : boolean = true
  public listCriterioAceptacion: any = [];

  constructor(private generalService: GeneralParameterService, private helperService: HelperService, private service: ModelosCriteriosService) { 
    this.frmModeloCriterio = new FormGroup({
      Id: new FormControl(0, Validators.required),
      ModeloId: new FormControl(this.modeloId, Validators.required),
      CriterioAceptacionId: new FormControl(null, Validators.required),
      Estado: new FormControl(true, Validators.required)
    });
  }

  ngOnInit(): void {
    this.cargarDatatable();
    this.cargarListasPrendas();
  }

  ngAfterViewInit() {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  cargarListasPrendas() {
    this.generalService.getAll("CriteriosAceptaciones").subscribe(r => {
      this.listCriterioAceptacion = r.data;
    })
  }

  save() {
    this.frmModeloCriterio.controls.ModeloId.setValue(this.modeloId);
    if (this.frmModeloCriterio.invalid) {
      this.statusForm  = false
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }
    let data  = this.frmModeloCriterio.value;
    this.service.save(this.frmModeloCriterio.controls.Id.value, data).subscribe(l => {
      if (!l.status) {
        this.helperService.showMessage(MessageType.ERROR, Messages.SAVEERROR)
      } else {
        this.refrescarTabla();
        this.frmModeloCriterio.reset();
        this.frmModeloCriterio.controls.Id.setValue(0);
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
          data.foreignKey = this.modeloId;
          this.service.getAllModelosCriterios(data).subscribe(res => {
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
            title: 'Modelo',
            data: 'modelo',
          },
          {
            title: 'Criterio Aceptacion',
            data: 'criterioAceptacion'
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
            this.service.getModelosCriteriosById(event.target.dataset.id).subscribe(res => {
              this.frmModeloCriterio.controls.Id.setValue(res.data.id);
              this.frmModeloCriterio.controls.PrendaId.setValue(res.data.prendaId);
              this.frmModeloCriterio.controls.Estado.setValue(res.data.estado);
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
