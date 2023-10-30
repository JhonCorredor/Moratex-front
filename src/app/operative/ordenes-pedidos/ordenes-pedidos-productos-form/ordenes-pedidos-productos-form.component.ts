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

@Component({
    selector: 'app-ordenes-pedidos-productos-form',
    templateUrl: './ordenes-pedidos-productos-form.component.html',
    styleUrls: ['./ordenes-pedidos-productos-form.component.css'],
})

export class OrdenesPedidosProductosFormComponent implements OnInit {
    @ViewChild('botonesDatatable') botonesDatatable!: BotonesComponent;
    @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
    @ViewChild(DataTableDirective) dtElementEntrada!: DataTableDirective;
    public dtTrigger: Subject<any> = new Subject();
    public dtTriggerEntrada: Subject<any> = new Subject();
    public opcionesDataTable: any = {};
    public opcionesDataTableEntrada: any = {};
    public arrayBotonesDatatable: String[] = ['btn-modificarOrdenPedidoProducto'];
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
        private empleadoService: EmpleadosService
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
            Empleado_Id: [null, Validators.required]
        });
        this.buildSelect();
    }

    buildSelect() {
        this.service.getAll('Productos').subscribe(({ data }) => {
            this.listProductos = data;
        });
        this.cargarEmpleado();
    }

    cargarEmpleado() {
        var persona_Id = localStorage.getItem("persona_Id");

        var data = new DatatableParameter();
        data.pageNumber = "1";
        data.pageSize = "10";
        data.filter = "";
        data.columnOrder = "";
        data.directionOrder = "";
        data.foreignKey = Number(persona_Id);

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

    save() {
        if (this.frmOrdenesPedidosProductos.invalid) {
            this.statusForm = false;
            this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
            return;
        }
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
    }

    refrescarTablas(entrada: boolean) {
        if (typeof this.dtElement.dtInstance != 'undefined') {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                dtInstance.ajax.reload();
            });
        }

        if (entrada) {
            //Refrescar manualmente tabla Entrada
            $("#DataTables_Table_1").DataTable().destroy();
            $("#DataTables_Table_1").html("");
            this.cargarDatatableEntrada();
            this.dtTriggerEntrada.next();
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

    cargarDatatableEntrada() {
        const that = this;
        that.opcionesDataTableEntrada = {
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
}