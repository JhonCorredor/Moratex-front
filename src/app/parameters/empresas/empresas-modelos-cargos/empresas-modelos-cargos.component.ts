import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { LANGUAGE_DATATABLE } from 'src/app/admin/datatable.language';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { BotonesComponent } from 'src/app/general/botones/botones.component';
import { GeneralParameterService } from '../../general-parameter/general-parameter.service';
import { ModelosCargosService } from '../modelos-cargos.service';

@Component({
  selector: 'app-empresas-modelos-cargos',
  templateUrl: './empresas-modelos-cargos.component.html',
  styleUrls: ['./empresas-modelos-cargos.component.css']
})
export class EmpresasModelosCargosComponent implements OnInit {
  @ViewChild('botonesDatatable') botonesDatatable!: BotonesComponent;
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  public dtTrigger: Subject<any> = new Subject();
  public opcionesDataTable: any = {};
  public arrayBotonesDatatable: String[] = ['btn-modificar', 'btn-eliminar'];
  public botones = ['btn-guardar'];

  @Input() empresaId: number = 0;
  public frmModeloCargo: FormGroup;
  public statusForm : boolean = true
  public listCargo: [] = [];
  public listModelo: [] = [];

  constructor(private generalService: GeneralParameterService, private helperService: HelperService, private service: ModelosCargosService) { 
    this.frmModeloCargo = new FormGroup({
      Id: new FormControl(0, Validators.required),
      EmpresaId: new FormControl(null, Validators.required),
      CargoId: new FormControl(null, Validators.required),
      ModeloId: new FormControl(null, Validators.required),
      NumeroDotacion: new FormControl(null, Validators.required),
      Estado: new FormControl(true, Validators.required)
    });
  }

  ngOnInit(): void {
    this.frmModeloCargo.controls.EmpresaId.setValue(this.empresaId);
    this.cargarDatatable();
    this.cargarListas();
  }

  ngAfterViewInit() {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  cargarListas() {
    this.generalService.getAll("Cargos").subscribe(l => this.listCargo = l.data);
    this.generalService.getAll("Modelos").subscribe(l => this.listModelo = l.data);
  }

  save() {
    this.frmModeloCargo.controls.EmpresaId.setValue(this.empresaId)
    if (this.frmModeloCargo.invalid) {
      this.statusForm  = false
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }
    let data  = this.frmModeloCargo.value;
    this.service.save(this.frmModeloCargo.controls.Id.value, data).subscribe(
      res => {
        this.refrescarTabla();
        this.frmModeloCargo.reset();
        this.frmModeloCargo.controls.Id.setValue(0);
        this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS)
      },
      error => {
        this.helperService.showMessageError(error)
      }
    )
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
          data.foreignKey = this.empresaId.toString();
          this.service.getDatatable(data).subscribe(res => {
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
              title: "Modelo",
              data: 'modelo',
            },
            {
              title: "Imagen Modelo",
              data: 'archivo',
              render : function(data : any,) {
                return   `<img src='${data}'  width='70' height='70'>`;
              }
            },
            {
              title: "Cargo",
              data: 'cargo',
            },
            {
              title: "Número dotación",
              data: 'numeroDotacion',
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
              this.frmModeloCargo.controls.Id.setValue(res.data.id);
              this.frmModeloCargo.controls.ModeloId.setValue(res.data.modeloId);
              this.frmModeloCargo.controls.EmpresaId.setValue(res.data.empresaId);
              this.frmModeloCargo.controls.CargoId.setValue(res.data.cargoId);
              this.frmModeloCargo.controls.NumeroDotacion.setValue(res.data.numeroDotacion);
              this.frmModeloCargo.controls.Estado.setValue(res.data.estado);
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
