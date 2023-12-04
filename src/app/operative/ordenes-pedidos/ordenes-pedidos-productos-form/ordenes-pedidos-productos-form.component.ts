import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { ActivatedRoute } from '@angular/router';
import { HelperService, Messages, MessageType, } from 'src/app/admin/helper.service';
import { OrdenesPedidosProductosService } from '../ordenes-pedidos-productos.service';
import { Subject } from 'rxjs';
import { LANGUAGE_DATATABLE } from 'src/app/admin/datatable.language';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';
import { BotonesComponent } from 'src/app/general/botones/botones.component';
import { EmpleadosService } from 'src/app/parameters/empleados/empleados.service';
import { ProcedimientosService } from 'src/app/operative/Procedimientos/procedimientos.service';
import { ProductosService } from 'src/app/inventory/productos/productos.service';
import Swal from 'sweetalert2'

@Component({
    selector: 'app-ordenes-pedidos-productos-form',
    templateUrl: './ordenes-pedidos-productos-form.component.html',
    styleUrls: ['./ordenes-pedidos-productos-form.component.css'],
})

export class OrdenesPedidosProductosFormComponent implements OnInit {
    @ViewChild('botonesDatatable') botonesDatatable!: BotonesComponent;
    @ViewChild('botonesDatatableEntrada') botonesDatatableEntrada!: BotonesComponent;
    @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
    @ViewChild(DataTableDirective) dtElementEntrada!: DataTableDirective;
    public dtTrigger: Subject<any> = new Subject();
    public dtTriggerEntrada: Subject<any> = new Subject();
    public opcionesDataTable: any = {};
    public opcionesDataTableEntrada: any = {};
    public arrayBotonesDatatable: String[] = ['btn-modificarOrdenPedidoProducto'];
    public arrayBotonesDatatableE: String[] = ['btn-modificarOrdenPedidoProducto', 'btn-terminado'];
    public botones = ['btn-guardar'];
    public Id = null;
    @Input() OrdenPedido_Id: any = null;
    public frmOrdenesPedidosProductos!: FormGroup;
    public statusForm: boolean = true;
    public listProductos: any[] = [];
    public listEmpleados: any = [];

    constructor(
        public routerActive: ActivatedRoute,
        private service: OrdenesPedidosProductosService,
        private helperService: HelperService,
        private fb: FormBuilder,
        private empleadoService: EmpleadosService,
        private procedimientoService: ProcedimientosService,
        private productosService: ProductosService
    ) { }

    ngOnInit(): void {
        this.buildForm();
        this.cargarDatatableSalida();
        this.cargarDatatableEntrada();
    }

    ngAfterViewInit() {
        this.dtTrigger.next();
        this.dtTriggerEntrada.next();
    }

    ngOnDestroy(): void {
        this.dtTrigger.unsubscribe();
        this.dtTriggerEntrada.unsubscribe();
    }

    buildForm(): void {
        this.frmOrdenesPedidosProductos = this.fb.group({
            Producto_Id: [null, Validators.required],
            Cantidad: [0, Validators.required],
            Entrada: [false, Validators.required],
            ProductoTerminado: [false, Validators.required],
            Empleado_Id: [null, Validators.required]
        });
        this.buildSelect();
    }

    buildSelect() {
        this.cargarProductos();
        this.cargarEmpleado();
    }

    cargarProductos(){
        var procedimiento_Id = localStorage.getItem("Procedimiento");

        this.ProcedimientoById(procedimiento_Id).then((procedimiento) => {
            var data = new DatatableParameter(); data.pageNumber = "1"; data.pageSize = "10"; data.filter = ""; data.columnOrder = ""; data.directionOrder = ""; data.foreignKey = "";

            var lstProductos: any[] = [];
            this.productosService.datatable(data).subscribe(res => {
                res.data.forEach((item: any) => {
                    var procedimiento = {
                        id: item.id,
                        textoMostrar: item.codigo + " - " + item.nombre
                    }

                    lstProductos.push(procedimiento);
                })
            });

            setTimeout(() => {
                this.listProductos = lstProductos;
            }, 200);
        })
        
    }

    cargarEmpleado() {
        var persona_Id = localStorage.getItem("persona_Id");

        var data = new DatatableParameter(); data.pageNumber = "1"; data.pageSize = "10"; data.filter = ""; data.columnOrder = ""; data.directionOrder = ""; data.foreignKey = Number(persona_Id);

        this.empleadoService.getAllEmpleados(data).subscribe(res => {
            this.listEmpleados = [
                {
                    id: res.data[0].id,
                    textoMostrar: res.data[0].codigo + " - " + res.data[0].persona
                }
            ];
            this.frmOrdenesPedidosProductos.controls.Empleado_Id.setValue(res.data[0].id);
        });
    }

    ProcedimientoById(procedimiento_Id: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.procedimientoService.getById(procedimiento_Id).subscribe(
                (datos) => {
                    resolve(datos);
                },
                (error) => {
                    reject(error);
                }
            );
        });
    }

    save() {
        if (this.frmOrdenesPedidosProductos.invalid) {
            this.statusForm = false;
            this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
            return;
        }

        Swal.fire({
            title: '¿Quieres guardar los cambios?',
            text: 'Estos cambios afectan el inventario',
            showCancelButton: true,
            confirmButtonText: 'Guardar',
        }).then((result) => {
            if (result.isConfirmed) {
                this.ProgressAlert();
                let data = {
                    id: this.Id ?? 0,
                    ...this.frmOrdenesPedidosProductos.value,
                    OrdenPedido_Id: this.OrdenPedido_Id,
                };

                this.service.save(this.Id, data).subscribe(
                    (response) => {
                        if (response.status) {
                            if (!this.frmOrdenesPedidosProductos.controls.Entrada.value) {
                                this.refrescarTablas(false);
                            } else {
                                this.refrescarTablas(true);
                            }

                            this.frmOrdenesPedidosProductos.reset();
                            this.buildSelect();
                            this.Id = null;
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
            } else {
                this.frmOrdenesPedidosProductos.reset();
                this.buildSelect();
                this.Id = null;
            }
        })
    }

    refrescarTablas(entrada: boolean) {
        if (entrada) {
            //Refrescar manualmente tabla Entrada
            $("#DataTables_Table_1").DataTable().destroy();
            $("#DataTables_Table_1").html("");
            this.cargarDatatableEntrada();
            this.dtTriggerEntrada.next();
        } else {
            if (typeof this.dtElement.dtInstance != 'undefined') {
                this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                    dtInstance.ajax.reload();
                });
            }
        }
    }

    cargarDatatableSalida() {
        const that = this;
        that.opcionesDataTable = {
            serverSide: true,
            processing: true,
            ordering: true,
            responsive: true,
            paging: true,
            searching: false,
            info: false,
            lengthChange: false,
            order: [0, 'desc'],
            ajax: (dataTablesParameters: any, callback: any) => {
                let pageNumber =
                    dataTablesParameters.start / dataTablesParameters.length + 1;
                var data = new DatatableParameter();
                data.pageNumber = pageNumber.toString();
                data.pageSize = dataTablesParameters.length.toString();
                data.filter = "0";
                data.columnOrder = that.helperService.capitalizeFirstLetter(
                    dataTablesParameters.columns[
                        dataTablesParameters.order[0].column
                    ].data.toString()
                );
                data.directionOrder = dataTablesParameters.order[0].dir;
                data.foreignKey = this.OrdenPedido_Id;
                this.service
                    .getAllOrdenesPedidosProductos(data)
                    .subscribe((res: any) => {
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
                    title: 'Producto',
                    data: 'producto',
                },

                {
                    title: 'Cantidad',
                    data: 'cantidad',
                    className: "pl-1 pr-0 text-center",
                },
                {
                    title: "Acciones",
                    orderable: false,
                    data: "id",
                    render: function (id: any, type: any, row: any) {
                        const boton = that.botonesDatatable;
                        return boton.botonesDropdown.nativeElement.outerHTML.split('$id').join(id);
                    },
                    className: "pl-1 pr-0 text-center",
                    responsivePriority: 7
                }
            ],
            drawCallback: (settings: any) => {
                $('.btn-dropdown-modificarOrdenPedidoProducto')
                    .off()
                    .on('click', (event: any) => {
                        this.service
                            .getOrdenesPedidosProductosById(event.target.dataset.id)
                            .subscribe(({ data }) => {
                                this.Id = data.id;
                                this.frmOrdenesPedidosProductos.controls.Producto_Id.setValue(data.producto_Id);
                                this.frmOrdenesPedidosProductos.controls.Cantidad.setValue(data.cantidad);
                                this.frmOrdenesPedidosProductos.controls.Entrada.setValue(data.entrada);
                            });
                    });
            },
        };

    }

    ProgressAlert() {
        this.helperService.showMessage(MessageType.PROGRESS, Messages.PROGRESS)
    }

    cargarDatatableEntrada() {
        const that = this;
        that.opcionesDataTableEntrada = {
            destroy: true,
            serverSide: true,
            processing: true,
            ordering: true,
            responsive: true,
            paging: true,
            searching: false,
            info: false,
            lengthChange: false,
            order: [0, 'desc'],
            ajax: (dataTablesParameters: any, callback: any) => {
                let pageNumber =
                    dataTablesParameters.start / dataTablesParameters.length + 1;
                var data = new DatatableParameter();
                data.pageNumber = pageNumber.toString();
                data.pageSize = dataTablesParameters.length.toString();
                data.filter = "1";
                data.columnOrder = that.helperService.capitalizeFirstLetter(
                    dataTablesParameters.columns[
                        dataTablesParameters.order[0].column
                    ].data.toString()
                );
                data.directionOrder = dataTablesParameters.order[0].dir;
                data.foreignKey = this.OrdenPedido_Id;
                this.service
                    .getAllOrdenesPedidosProductos(data)
                    .subscribe((res: any) => {
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
                    title: 'Producto',
                    data: 'producto',
                },
                {
                    title: 'Cantidad',
                    data: 'cantidad',
                    className: "pl-1 pr-0 text-center",
                },
                {
                    title: "Terminado",
                    orderable: false,
                    data: 'productoTerminado',
                    render: function (productoTerminado: boolean) {
                        if (productoTerminado) {
                            return "<label class='text-center badge badge-success'>Si</label>";
                        } else {
                            return "<label class='text-center badge badge-danger'>No</label>";
                        }
                    },
                    className: "pl-1 pr-0 text-center",
                },
                {
                    title: "Acciones",
                    orderable: false,
                    data: {
                        "id": "id",
                        "productoTerminado": "productoTerminado"
                    },
                    render: function (data: any) {
                        const boton = that.botonesDatatableEntrada;
                        if (data.productoTerminado) {
                            return boton.botonesDropdown.nativeElement.outerHTML.split('$id').join(data.id).split('btn-dropdown-terminado').join('btn-dropdown-terminado d-none');
                        } else {
                            return boton.botonesDropdown.nativeElement.outerHTML.split('$id').join(data.id);
                        }
                    },
                    className: "pl-1 pr-0 text-center",
                    responsivePriority: 7
                }
            ],
            drawCallback: (settings: any) => {
                $('.btn-dropdown-modificarOrdenPedidoProducto')
                    .off()
                    .on('click', (event: any) => {
                        this.service
                            .getOrdenesPedidosProductosById(event.target.dataset.id)
                            .subscribe(({ data }) => {
                                this.Id = data.id;
                                this.frmOrdenesPedidosProductos.controls.Producto_Id.setValue(data.producto_Id);
                                this.frmOrdenesPedidosProductos.controls.Cantidad.setValue(data.cantidad);
                                this.frmOrdenesPedidosProductos.controls.Entrada.setValue(data.entrada);
                            });
                    });

                $('.btn-dropdown-terminado')
                    .off()
                    .on('click', (event: any) => {
                        this.service
                            .getOrdenesPedidosProductosById(event.target.dataset.id)
                            .subscribe(({ data }) => {
                                this.Id = data.id;
                                this.frmOrdenesPedidosProductos.controls.Producto_Id.setValue(data.producto_Id);
                                this.frmOrdenesPedidosProductos.controls.Cantidad.setValue(data.cantidad);
                                this.frmOrdenesPedidosProductos.controls.Entrada.setValue(data.entrada);
                                this.frmOrdenesPedidosProductos.controls.ProductoTerminado.setValue(true);


                                Swal.fire({
                                    title: '¿Esta seguro que desea ingresar el producto a inventario?',
                                    text: 'Una vez ingresado no se puede cambiar.',
                                    showCancelButton: true,
                                    confirmButtonText: 'Guardar',
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        let dataSave = {
                                            id: data.id,
                                            ...this.frmOrdenesPedidosProductos.value,
                                            OrdenPedido_Id: this.OrdenPedido_Id,
                                        };

                                        this.service.save(this.Id, dataSave).subscribe(
                                            (response) => {
                                                if (response.status) {
                                                    if (!this.frmOrdenesPedidosProductos.controls.Entrada.value) {
                                                        this.refrescarTablas(false);
                                                    } else {
                                                        this.refrescarTablas(true);
                                                    }

                                                    this.frmOrdenesPedidosProductos.reset();
                                                    this.buildSelect();
                                                    this.Id = null;
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
                                    } else {
                                        this.frmOrdenesPedidosProductos.reset();
                                        this.buildSelect();
                                        this.Id = null;
                                    }
                                })
                            });
                    });
            },
        };

    }
}