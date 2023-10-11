import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { LANGUAGE_DATATABLE } from 'src/app/admin/datatable.language';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';
import {
  HelperService,
  Messages,
  MessageType,
} from 'src/app/admin/helper.service';
import { BotonesComponent } from 'src/app/general/botones/botones.component';
import { RolesFormularioService } from '../rolesFormularios.service';

@Component({
  selector: 'app-roles-formulario-form',
  templateUrl: './roles-formulario-form.component.html',
  styleUrls: ['./roles-formulario-form.component.css'],
})
export class RolesFormularioFormComponent implements OnInit {
  @ViewChild('botonesDatatable') botonesDatatable!: BotonesComponent;
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  public dtTrigger: Subject<any> = new Subject();
  public opcionesDataTable: any = {};
  public arrayBotonesDatatable: String[] = ['btn-modificar', 'btn-eliminar'];
  public botones = ['btn-guardar'];
  public Id = null;

  @Input() Rol_Id: any = null;

  public frmRolesFormulario!: FormGroup;
  public statusForm: boolean = true;
  public listFormularios: any[] = [];

  constructor(
    public routerActive: ActivatedRoute,
    private service: RolesFormularioService,
    private helperService: HelperService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.cargarDatatable();
  }

  buildForm(): void {
    this.frmRolesFormulario = this.fb.group({
      Formulario_Id: [null, [Validators.required]],
      Estado: [true, [Validators.required]],
    });
    this.buildSelect();
  }

  ngAfterViewInit() {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  buildSelect() {
    this.service.getAll('Formularios').subscribe(({ data }) => {
      this.listFormularios = data;
    });
  }

  save() {
    if (this.frmRolesFormulario.invalid) {
      this.statusForm = false;
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }
    let data = {
      id: this.Id ?? 0,
      ...this.frmRolesFormulario.value,
      Rol_Id: this.Rol_Id,
    };
    this.service.save(this.Id, data).subscribe(
      (response) => {
        if (response.status) {
          this.refrescarTabla();
          this.frmRolesFormulario.reset();
          this.Id = null;
          this.frmRolesFormulario.controls.Estado.setValue(true);
          this.helperService.showMessage(
            MessageType.SUCCESS,
            Messages.SAVESUCCESS
          );
        }
      },
      (error) => {
        this.helperService.showMessage(
          MessageType.WARNING,
          error.error.message
        );
      }
    );
  }

  refrescarTabla() {
    if (typeof this.dtElement.dtInstance != 'undefined') {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.ajax.reload();
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
      ajax: (dataTablesParameters: any, callback: any) => {
        let pageNumber =
          dataTablesParameters.start / dataTablesParameters.length + 1;
        var data = new DatatableParameter();
        data.pageNumber = pageNumber.toString();
        data.pageSize = dataTablesParameters.length.toString();
        data.filter = dataTablesParameters.search.value;
        data.columnOrder = that.helperService.capitalizeFirstLetter(
          dataTablesParameters.columns[
            dataTablesParameters.order[0].column
          ].data.toString()
        );
        data.directionOrder = dataTablesParameters.order[0].dir;
        data.foreignKey = this.Rol_Id;
        this.service.getAllRolesFormulario(data).subscribe((res: any) => {
          callback({
            recordsTotal: res.meta.totalCount,
            recordsFiltered: res.meta.totalCount,
            draw: dataTablesParameters.draw,
            data: res.data,
          });
        });
      },
      language: LANGUAGE_DATATABLE,
      columns: [
        {
          title: 'Formulario',
          data: 'formulario',
        },

        {
          title: 'Estado',
          data: 'estado',
          render: function (item: any) {
            if (item) {
              return "<label class='text-center badge badge-success'>Activo</label>";
            } else {
              return "<label class='text-center badge badge-danger'>Inactivo</label>";
            }
          },
        },
        {
          title: 'Acciones',
          orderable: false,
          width: '300px',
          data: 'id',
          render: function (id: any, type: any, row: any) {
            const boton = that.botonesDatatable;
            return boton.botonesDropdown.nativeElement.outerHTML
              .split('$id')
              .join(id);
          },
          className: 'pl-1 pr-0 text-center',
          responsivePriority: 7,
        },
      ],
      drawCallback: (settings: any) => {
        $('.btn-dropdown-modificar')
          .off()
          .on('click', (event: any) => {
            this.service
              .getRolesFormularioById(event.target.dataset.id)
              .subscribe(({ data }) => {
                this.Id = data.id;
                this.frmRolesFormulario.controls.ProductoId.setValue(
                  data.productoId
                );
                this.frmRolesFormulario.controls.Estado.setValue(data.estado);
              });
          });
        $('.btn-dropdown-eliminar')
          .off()
          .on('click', (event: any) => {
            this.helperService.confirmDelete(() => {
              this.service.delete(event.target.dataset.id).subscribe((l) => {
                if (l.status) {
                  this.helperService.showMessage(
                    MessageType.SUCCESS,
                    Messages.DELETESUCCESS
                  );
                  this.refrescarTabla();
                } else {
                  this.helperService.showMessage(
                    MessageType.ERROR,
                    Messages.DELETEERROR
                  );
                }
              });
            });
          });
      },
    };
  }
}
