import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { LANGUAGE_DATATABLE } from 'src/app/admin/datatable.language';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { BotonesComponent } from 'src/app/general/botones/botones.component';
import { GeneralParameterService } from '../../general-parameter/general-parameter.service';
import { EmpleadosMedidasService } from '../empleados-medidas.service';

@Component({
  selector: 'app-empleados-medidas',
  templateUrl: './empleados-medidas.component.html',
  styleUrls: ['./empleados-medidas.component.css']
})
export class EmpleadosMedidasComponent implements OnInit {
  @ViewChild('botonesDatatable') botonesDatatable!: BotonesComponent;
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  public  ver : boolean = false
  public dtTrigger: Subject<any> = new Subject();
  public opcionesDataTable: any = {};
  public frmEmpleadoMedida: FormGroup;
  public statusForm : boolean = true
  @Input() empleadoId = 0;
  public listMedidas : any[] = [];
  public botones = ['btn-guardar', 'btn-cancelar'];
  public id = 0;
  public arrayBotonesDatatable: String[] = ['btn-modificar', 'btn-eliminar'];

  constructor(private helperService: HelperService, private service: EmpleadosMedidasService, private generalService: GeneralParameterService) { 
    this.frmEmpleadoMedida = new FormGroup({
      MedidaId: new FormControl(null, Validators.required),
      Valor: new FormControl(null, Validators.required),
      EmpleadoId: new FormControl(null, Validators.required)
    });
  }

  ngOnInit(): void {
    this.cargarDatatable();
    this.frmEmpleadoMedida.controls.EmpleadoId.setValue(this.empleadoId);
    this.generalService.getAll("Medidas").subscribe(l => this.listMedidas = l.data)
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
          data.foreignKey = this.empleadoId.toString();
          this.service.getAllEmpleadosMedidas(data).subscribe((res : any) => {
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
              title: "Medida (cm) ",
              data: 'medida',
            },
            {
              title: 'Valor',
              data: 'valor',
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
            this.service.getEmpleadosMedidasById(event.target.dataset.id).subscribe(l => {
              this.id = l.data.id;
              this.frmEmpleadoMedida.controls.MedidaId.setValue(l.data.medidaId);
              this.frmEmpleadoMedida.controls.Valor.setValue(l.data.valor);
            })
          });
          $('.btn-dropdown-eliminar').off().on('click', (event : any) => {
            this.helperService.confirmDelete(() => {
              this.service.delete(event.target.dataset.id).subscribe(l => {
                if (l.status == true) {
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

  save() {
    if (this.frmEmpleadoMedida.invalid) {
      this.statusForm  = false
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }
    let data  = { 
      id: this.id ?? 0,
      ...this.frmEmpleadoMedida.value,
    };
    this.service.save(this.id, data).subscribe(l => {
      if (l.status == "Error") {
        this.helperService.showMessage(MessageType.ERROR, Messages.SAVEERROR)
      } else {
        this.refrescarTabla();
        this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS)
      }
      this.frmEmpleadoMedida.controls.MedidaId.setValue(null);
        this.frmEmpleadoMedida.controls.Valor.setValue(null);
        this.id = 0;
    })
  }

}
