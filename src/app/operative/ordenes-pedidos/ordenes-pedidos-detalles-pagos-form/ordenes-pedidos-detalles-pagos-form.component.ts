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
import { OrdenesPedidosDetallesPagosService } from '../ordenes-pedidos-detalles-pagos.service';

@Component({
    selector: 'app-ordenes-pedidos-detalles-form',
    templateUrl: './ordenes-pedidos-detalles-pagos-form.component.html',
    styleUrls: ['./ordenes-pedidos-detalles-pagos-form.component.css'],
})
export class OrdenesPedidosDetallesPagosFormComponent implements OnInit {
    @ViewChild('botonesDatatable') botonesDatatable!: BotonesComponent;
    @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
    public dtTrigger: Subject<any> = new Subject();
    public opcionesDataTable: any = {};
    public arrayBotonesDatatable: String[] = ['btn-modificar'];
    public botones = ['btn-guardar'];
    public Id = null;

    @Input() OrdenPedido_Id: any = null;

    public frmOrdenesPedidosDetallesPagos!: FormGroup;
    public statusForm: boolean = true;
    public listEmpleados: any[] = [];
    public listMediosPagos: any[] = [];

    constructor(
        public routerActive: ActivatedRoute,
        private service: OrdenesPedidosDetallesPagosService,
        private helperService: HelperService,
        private fb: FormBuilder
    ) { }

    ngOnInit(): void {
        this.buildForm();
        this.cargarDatatable();
    }

    buildForm(): void {
        this.frmOrdenesPedidosDetallesPagos = this.fb.group({
            Fecha: [null, Validators.required],
            Valor: [null, Validators.required],
            Empleado_Id: [null, Validators.required],
            MedioPago_Id: [null, [Validators.required]]
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
        this.service.getAll('Empleados').subscribe(({ data }) => {
            this.listEmpleados = data;
        });

        this.service.getAll('MediosPagos').subscribe(({ data }) => {
            this.listMediosPagos = data;
        });
    }

    save() {
        if (this.frmOrdenesPedidosDetallesPagos.invalid) {
            this.statusForm = false;
            this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
            return;
        }
        let data = {
            id: this.Id ?? 0,
            ...this.frmOrdenesPedidosDetallesPagos.value,
            OrdenPedido_Id: this.OrdenPedido_Id,
        };
        this.service.save(this.Id, data).subscribe(
            (response) => {
                if (response.status) {
                    this.refrescarTabla();
                    this.frmOrdenesPedidosDetallesPagos.reset();
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
                this.service.getAllOrdenesPedidosDetallesPagos(data).subscribe((res: any) => {
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
                    title: 'Medio de Pago',
                    data: 'medioPago',
                },
                {
                    title: 'Valor',
                    data: 'valor',
                },
                {
                    title: 'Empleado',
                    data: 'empleado',
                },
                {
                    title: 'Fecha',
                    data: 'fecha',
                    render: (item: any) => {
                        return this.helperService.convertDateUTCToDMA(item);
                    }
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
                            .getOrdenesPedidosDetallesPagosById(event.target.dataset.id)
                            .subscribe(({ data }) => {
                                this.Id = data.id;
                                this.frmOrdenesPedidosDetallesPagos.controls.ProductoId.setValue(
                                    data.productoId
                                );
                                this.frmOrdenesPedidosDetallesPagos.controls.Estado.setValue(data.estado);
                            });
                    });
            },
        };
    }
}
