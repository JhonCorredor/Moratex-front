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
import { OrdenesPedidosProductosService } from '../ordenes-pedidos-productos.service';

@Component({
    selector: 'app-ordenes-pedidos-productos-form',
    templateUrl: './ordenes-pedidos-productos-form.component.html',
    styleUrls: ['./ordenes-pedidos-productos-form.component.css'],
})
export class OrdenesPedidosProductosFormComponent implements OnInit {
    @ViewChild('botonesDatatable') botonesDatatable!: BotonesComponent;
    @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
    public dtTrigger: Subject<any> = new Subject();
    public opcionesDataTable: any = {};
    public arrayBotonesDatatable: String[] = ['btn-modificarOrdenPedidoProducto'];
    public botones = ['btn-guardar'];
    public Id = null;

    @Input() OrdenPedido_Id: any = null;

    public frmOrdenesPedidosProductos!: FormGroup;
    public statusForm: boolean = true;
    public listProductos: any[] = [];

    constructor(
        public routerActive: ActivatedRoute,
        private service: OrdenesPedidosProductosService,
        private helperService: HelperService,
        private fb: FormBuilder,
    ) { }

    ngOnInit(): void {
        this.buildForm();
        this.cargarDatatable();
    }

    buildForm(): void {
        this.frmOrdenesPedidosProductos = this.fb.group({
            Producto_Id: [null, Validators.required],
            Cantidad: [0, Validators.required],
            Entrada: [false, Validators.required]
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
        this.service.getAll('Productos').subscribe(({ data }) => {
            this.listProductos = data;
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
                    this.refrescarTabla();
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
                    title: "Entrada",
                    data: 'entrada',
                    render: function (item: boolean) {
                        if (item) {
                            return "<label class='text-center badge badge-success'>Si</label>";
                        } else {
                            return "<label class='text-center badge badge-danger'>No</label>";
                        }
                    }
                },
            ],
            drawCallback: (settings: any) => {
                $('.btn-dropdown-modificarOrdenPedidoProducto')
                    .off()
                    .on('click', (event: any) => {
                        this.service
                            .getOrdenesPedidosProductosById(event.target.dataset.id)
                            .subscribe(({ data }) => {
                                this.Id = data.id;
                                this.frmOrdenesPedidosProductos.controls.Producto_Id.setValue(
                                    data.producto_Id
                                );
                                this.frmOrdenesPedidosProductos.controls.Cantidad.setValue(
                                    data.cantidad
                                );
                                this.frmOrdenesPedidosProductos.controls.Entrada.setValue(
                                    data.entrada
                                );
                            });
                    });
            },
        };

    }
}
