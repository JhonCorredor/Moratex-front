import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
import { GeneralParameterService } from 'src/app/parameters/general-parameter/general-parameter.service';
import { UsuariosRolesService } from '../usuarios-roles.service';

@Component({
  selector: 'app-usuarios-roles',
  templateUrl: './usuarios-roles.component.html',
  styleUrls: ['./usuarios-roles.component.css'],
})
export class UsuariosRolesComponent implements OnInit {
  @ViewChild('botonesDatatable') botonesDatatable!: BotonesComponent;
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  public dtTrigger: Subject<any> = new Subject();
  public opcionesDataTable: any = {};
  public arrayBotonesDatatable: String[] = ['btn-modificar', 'btn-eliminar'];
  public botones = ['btn-guardar'];

  @Input() Usuario_Id: any = null;

  public frmUsuariosRol: FormGroup;
  public statusForm: boolean = true;
  public listRoles: any = [];

  constructor(
    private generalService: GeneralParameterService,
    private helperService: HelperService,
    private service: UsuariosRolesService
  ) {
    this.frmUsuariosRol = new FormGroup({
      Id: new FormControl(0, Validators.required),
      Usuario_Id: new FormControl(this.Usuario_Id, Validators.required),
      Rol_Id: new FormControl(null, Validators.required),
      Estado: new FormControl(true, Validators.required),
    });
  }

  ngOnInit(): void {
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
    this.generalService.getAll('Roles').subscribe((r) => {
      this.listRoles = r.data;
    });
  }

  save() {
    this.frmUsuariosRol.controls.Usuario_Id.setValue(this.Usuario_Id);
    if (this.frmUsuariosRol.invalid) {
      this.statusForm = false;
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }
    let data = this.frmUsuariosRol.value;
    this.service.save(this.frmUsuariosRol.controls.Id.value, data).subscribe(
      (response) => {
        if (response.status) {
          this.refrescarTabla();
          this.frmUsuariosRol.reset();
          this.frmUsuariosRol.controls.Id.setValue(0);
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
        data.foreignKey = this.Usuario_Id;
        this.service.datatable(data).subscribe((res) => {
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
          title: 'Rol',
          data: 'rol',
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
            this.service.getById(event.target.dataset.id).subscribe((res) => {
              this.frmUsuariosRol.controls.Id.setValue(res.data.id);
              this.frmUsuariosRol.controls.Rol_Id.setValue(res.data.rol_Id);
              this.frmUsuariosRol.controls.Estado.setValue(res.data.estado);
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
