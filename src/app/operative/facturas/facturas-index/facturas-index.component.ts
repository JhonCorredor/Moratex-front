import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { LANGUAGE_DATATABLE } from 'src/app/admin/datatable.language';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { BotonesComponent } from 'src/app/general/botones/botones.component';
import { FacturasService } from '../facturas.service';
import { UsuariosRolesService } from '../../../security/usuarios/usuarios-roles.service';
import { EmpleadosService } from 'src/app/parameters/empleados/empleados.service';

@Component({
    selector: 'app-facturas-index',
    templateUrl: './facturas-index.component.html',
    styleUrls: ['./facturas-index.component.css']
})
export class FacturasIndexComponent implements OnInit {
    @ViewChild('botonesDatatable') botonesDatatable!: BotonesComponent;
    @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
    public dtTrigger: Subject<any> = new Subject();
    public opcionesDataTable: any = {};
    public API_URL: any;
    public title = "Listado de Ordenes de pedido";
    public breadcrumb = [{ name: `inicio`, icon: `fa-duotone fa-house` }, { name: "Operativo", icon: "fa-duotone fa-vest-patches" }, { name: "Orden de Pedido", icon: "fa-duotone fa-file-invoice" }];
    public botones: String[] = ['btn-nuevo'];
    public arrayBotonesDatatable: String[] = ['btn-modificar', 'btn-eliminar'];

    constructor(private service: FacturasService, private helperService: HelperService, private usuarioRoleService: UsuariosRolesService, private empleadoService: EmpleadosService, private modalService: NgbModal,
    ) {
    }

    ngOnInit(): void {
        this.cargarDatatable();
    }

    ngAfterViewInit() {
        this.dtTrigger.next();
    }

    ngOnDestroy(): void {
        this.dtTrigger.unsubscribe();
    }

    refrescarTabla() {
        if (typeof this.dtElement.dtInstance != 'undefined') {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                dtInstance.ajax.reload()
            });
        }
    }

    RolByUserId(user_Id: any): Promise<any> {
        var data = new DatatableParameter();
        data.pageNumber = "1";
        data.pageSize = "10";
        data.filter = "";
        data.columnOrder = "";
        data.directionOrder = "";
        data.foreignKey = Number(user_Id);

        return new Promise((resolve, reject) => {
            this.usuarioRoleService.datatable(data).subscribe(
                (datos) => {
                    resolve(datos);
                },
                (error) => {
                    reject(error);
                }
            );
        });
    }

    EmpleadoByPersonaId(persona_Id: any): Promise<any> {
        var data = new DatatableParameter();
        data.pageNumber = "1";
        data.pageSize = "10";
        data.filter = "";
        data.columnOrder = "";
        data.directionOrder = "";
        data.foreignKey = Number(persona_Id);

        return new Promise((resolve, reject) => {
            this.empleadoService.getAllEmpleados(data).subscribe(
                (datos) => {
                    resolve(datos);
                },
                (error) => {
                    reject(error);
                }
            );
        });
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
                let pageNumber = (dataTablesParameters.start / dataTablesParameters.length) + 1
                var data = new DatatableParameter();
                data.pageNumber = pageNumber.toString();
                data.pageSize = dataTablesParameters.length.toString();
                data.filter = dataTablesParameters.search.value;
                data.columnOrder = that.helperService.capitalizeFirstLetter(dataTablesParameters.columns[dataTablesParameters.order[0].column].data.toString());;
                data.directionOrder = dataTablesParameters.order[0].dir;
                var empleado_Id = null;
                this.RolByUserId(localStorage.getItem('userId')).then((userRol) => {
                    if (userRol.data[0].rol != "Admin") {
                        this.EmpleadoByPersonaId(localStorage.getItem('persona_Id')).then((empleado) => {
                            empleado_Id = empleado.data[0].id;
                            if (empleado_Id != null) {
                                data.foreignKey = empleado_Id;
                                this.arrayBotonesDatatable = ["btn-ver"];
                            } else {
                                data.foreignKey = "";
                            }
                            this.service.getAllFacturas(data).subscribe(res => {
                                callback({
                                    recordsTotal: res.meta.totalCount,
                                    recordsFiltered: res.meta.totalCount,
                                    draw: dataTablesParameters.draw,
                                    data: res.data
                                });
                            });
                        })
                            .catch((error) => {
                                console.error('Error al obtener el empleado:', error);
                            });
                    } else {
                        data.foreignKey = "";
                        this.service.getAllFacturas(data).subscribe(res => {
                            callback({
                                recordsTotal: res.meta.totalCount,
                                recordsFiltered: res.meta.totalCount,
                                draw: dataTablesParameters.draw,
                                data: res.data
                            });
                        });
                    }

                })
                    .catch((error) => {
                        console.error('Error al obtener el rol:', error);
                    });
            },
            language: LANGUAGE_DATATABLE,
            columns: [
                {
                    title: "Codigo",
                    data: 'codigo'
                },
                {
                    title: "Cliente",
                    data: 'cliente'
                },
                {
                    title: "SubTotal",
                    data: 'subTotal',
                    className: 'text-right',
                    render: function (data: any) {
                        return '$' + that.helperService.formaterNumber(data);
                    },
                },
                {
                    title: "Empleado",
                    data: 'empleadoAsignado'
                },
                {
                    title: "Estado",
                    data: 'estado',
                },
                {
                    title: "Fecha",
                    data: 'fecha',
                    render: (item: any) => {
                        return this.helperService.convertDateUTCToDMA(item);
                    }
                },
                {
                    title: "Acciones",
                    orderable: false,
                    width: '300px',
                    data: "id",
                    render: function (item: any) {
                        const boton = that.botonesDatatable;
                        return boton.botonesDropdown.nativeElement.outerHTML.split('$id').join(item);
                    },
                    className: "pl-1 pr-0 text-center",
                    responsivePriority: 7
                }
            ],

            drawCallback: (settings: any) => {
                $('.btn-dropdown-modificar').off().on('click', (event: any) => {
                    this.helperService.redirectApp(`/operativo/facturas/editar/${event.target.dataset.id}`);
                });
                $('.btn-dropdown-eliminar').off().on('click', (event: any) => {
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
                $('.btn-dropdown-ver').off().on('click', (event: any) => {
                    this.helperService.redirectApp(`operativo/facturas/ver/${event.target.dataset.id}`);
                });
            }
        };
    }

    public nuevo() {
        this.helperService.redirectApp(`operativo/facturas/crear`);
    }
}
