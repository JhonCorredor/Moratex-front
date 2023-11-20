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
import { FacturasComprasDetallesPagosService } from '../facturas-compras-detalles-pagos.service';
import { FacturaCompraService } from '../factura-compra.service';
import { EmpleadosService } from '../../../parameters/empleados/empleados.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2'

@Component({
    selector: 'app-facturas-compras-detalles-pagos-form',
    templateUrl: './facturas-compras-detalles-pagos-form.component.html',
    styleUrls: ['./facturas-compras-detalles-pagos-form.component.css'],
})
export class FacturasComprasDetallesPagosFormComponent implements OnInit {
    @ViewChild('botonesDatatable') botonesDatatable!: BotonesComponent;
    @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
    public dtTrigger: Subject<any> = new Subject();
    public opcionesDataTable: any = {};
    public arrayBotonesDatatable: String[] = ['btn-modificarOP'];
    public botones = ['btn-guardar'];
    public Id = null;
    public persona_Id!: string | number;

    @Input() FacturaCompra_Id: any = null;

    public frmFacturasComprasDetallesPagos!: FormGroup;
    public statusForm: boolean = true;
    public listEmpleados: any[] = [];
    public listMediosPagos: any[] = [];

    constructor(
        public routerActive: ActivatedRoute,
        private service: FacturasComprasDetallesPagosService,
        private empleadoService: EmpleadosService,
        private facturaService: FacturaCompraService,
        private helperService: HelperService,
        private fb: FormBuilder,
        private datePipe: DatePipe
    ) { }

    ngOnInit(): void {
        this.buildForm();
        this.cargarDatatable();
    }

    buildForm(): void {
        this.frmFacturasComprasDetallesPagos = this.fb.group({
            Fecha: [null, Validators.required],
            Valor: [null, Validators.required],
            Observacion: [""],
            PagoCaja: [false, Validators.required],
            Empleado_Id: [null, Validators.required],
            MedioPago_Id: [null, [Validators.required]],
            SaldoString: ["$ 0"],
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
        this.cargarEmpleado();
        this.service.getAll('MediosPagos').subscribe(({ data }) => {
            this.listMediosPagos = data;
        });
        this.calcularSaldo();
    }

    ValorTotalPagosById(factura_Id: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.service.GetTotalPagos(factura_Id).subscribe(
                (datos) => {
                    resolve(datos);
                },
                (error) => {
                    reject(error);
                }
            );
        });
    }

    calcularSaldo() {
        var saldoString = "$ 0"
        var subtotal: any;

        this.facturaService.getById(this.FacturaCompra_Id).subscribe(({ data }) => {
            subtotal = data.total;

            this.ValorTotalPagosById(this.FacturaCompra_Id)
                .then((valorTotal) => {
                    if (subtotal !== null && valorTotal !== null) {
                        var saldo = parseInt(subtotal) - parseInt(valorTotal);
                        saldoString = `$ ${this.helperService.formaterNumber(saldo)}`;
                    }
                    this.frmFacturasComprasDetallesPagos.controls.SaldoString.setValue(saldoString);
                })
                .catch((error) => {
                    console.error('Error al obtener el valor total de los pagos:', error);
                });
        })
    }


    cargarEmpleado() {
        var persona_Id = localStorage.getItem('persona_Id');

        var data = new DatatableParameter();
        data.pageNumber = '1';
        data.pageSize = '10';
        data.filter = '';
        data.columnOrder = '';
        data.directionOrder = '';
        data.foreignKey = Number(persona_Id);

        this.empleadoService.getAllEmpleados(data).subscribe((res) => {
            this.listEmpleados = [
                {
                    id: res.data[0].id,
                    textoMostrar: res.data[0].codigo + ' - ' + res.data[0].persona,
                },
            ];
            this.frmFacturasComprasDetallesPagos.controls.Empleado_Id.setValue(
                res.data[0].id
            );
        });
    }

    save() {
        if (this.frmFacturasComprasDetallesPagos.invalid) {
            this.statusForm = false;
            this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
            return;
        }

        Swal.fire({
            title: '¿Quieres guardar los cambios?',
            text: 'Una vez guardado no se puede cambiar.',
            showCancelButton: true,
            confirmButtonText: 'Guardar',
        }).then((result) => {
            if (result.isConfirmed) {
                let data = {
                    id: this.Id ?? 0,
                    ...this.frmFacturasComprasDetallesPagos.value,
                    FacturaCompra_Id: this.FacturaCompra_Id,
                };
                this.service.save(this.Id, data).subscribe(
                    (response) => {
                        if (response.status) {
                            this.refrescarTabla();
                            this.frmFacturasComprasDetallesPagos.reset();
                            this.buildSelect();
                            this.calcularSaldo();
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
                        this.frmFacturasComprasDetallesPagos.reset();
                        this.buildSelect();
                        this.Id = null;
                    }
                );
            } else {
                this.frmFacturasComprasDetallesPagos.reset();
                this.buildSelect();
                this.Id = null;
            }
        })
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
                data.foreignKey = this.FacturaCompra_Id;
                this.service
                    .getAllFacturasDetallesPagos(data)
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
                    title: 'Fecha',
                    data: 'fecha',
                    render: (item: any) => {
                        return this.helperService.convertDateUTCToDMA(item);
                    },
                },
                {
                    title: 'Valor',
                    data: 'valor',
                    className: 'text-right',
                    render: function (data: any) {
                        return '$' + that.helperService.formaterNumber(data);
                    },
                },
                {
                    title: 'Medio de Pago',
                    data: 'medioPago',
                },
                {
                    title: 'Pago de Caja',
                    data: 'pagoCaja',
                    render: function (item: any) {
                      if (item) {
                        return "<label class='text-center badge badge-success'>Si</label>";
                      } else {
                        return "<label class='text-center badge badge-danger'>No</label>";
                      }
                    },
                  },
                {
                    title: 'Empleado',
                    data: 'empleado',
                },
                {
                    title: 'Observacion',
                    data: 'observacion',
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
                $('.btn-dropdown-modificarOP')
                    .off()
                    .on('click', (event: any) => {
                        this.service
                            .getFacturasDetallesPagosById(event.target.dataset.id)
                            .subscribe(({ data }) => {
                                const formattedDate = this.datePipe.transform(
                                    data.fecha,
                                    'yyyy-MM-dd'
                                );

                                this.Id = data.id;
                                this.frmFacturasComprasDetallesPagos.controls.Fecha.setValue(
                                    formattedDate
                                );
                                this.frmFacturasComprasDetallesPagos.controls.Valor.setValue(
                                    data.valor
                                );
                                this.frmFacturasComprasDetallesPagos.controls.MedioPago_Id.setValue(
                                    data.medioPago_Id
                                );
                            });
                    });
            },
        };

    }
}
