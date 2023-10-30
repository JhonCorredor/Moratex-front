import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
import { CierresService } from '../cierres.service';

@Component({
    selector: 'app-cierres-index',
    templateUrl: './cierres-index.component.html',
    styleUrls: ['./cierres-index.component.css'],
})
export class CierresIndexComponent implements OnInit {
    @ViewChild('botonesDatatable') botonesDatatable!: BotonesComponent;
    @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
    public dtTrigger: Subject<any> = new Subject();
    public opcionesDataTable: any = {};

    public API_URL: any;
    public title = 'Listado de Cierres';
    public breadcrumb = [
        { name: `Inicio`, icon: `fa-duotone fa-house` }, { name: "Operativo", icon: "fa-duotone fa-vest-patches" }, { name: "Cierres", icon: "fa-duotone fa-shop-lock" },
    ];
    public botones: String[] = ['btn-nuevo'];
    public arrayBotonesDatatable: String[] = ['btn-modificar', 'btn-eliminar', 'btn-Imprimir-tikect'];
    constructor(
        private service: CierresService,
        private helperService: HelperService,
        private route: Router,
        private modalService: NgbModal
    ) { }

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
                data.filter = dataTablesParameters.search.value
                    ? dataTablesParameters.search.value
                        .replaceAll('$', '')
                        .replaceAll('.', '')
                        .replaceAll(',', '')
                    : '';
                data.columnOrder = that.helperService.capitalizeFirstLetter(
                    dataTablesParameters.columns[
                        dataTablesParameters.order[0].column
                    ].data.toString()
                );
                data.directionOrder = dataTablesParameters.order[0].dir;
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
                    title: 'Empleado',
                    data: 'empleado',
                },
                {
                    title: 'Fecha Inicial',
                    data: 'fechaInicial',
                    render: (item: any) => {
                        return this.helperService.convertDateUTCToDMA(item);
                    },
                },
                {
                    title: 'Fecha Final',
                    data: 'fechaFinal',
                    render: (item: any) => {
                        return this.helperService.convertDateUTCToDMA(item);
                    },
                },
                {
                    title: 'Observación',
                    data: 'observacion',
                },
                {
                    title: 'Total Ingreso',
                    data: 'totalIngreso',
                    className: 'text-right',
                    render: function (data: any) {
                        return '$' + that.helperService.formaterNumber(data);
                    },
                },
                {
                    title: 'Total Gastos',
                    data: 'totalEgresos',
                    className: 'text-right',
                    render: function (data: any) {
                        return '$' + that.helperService.formaterNumber(data);
                    },
                },
                {
                    title: 'Saldo Caja',
                    data: 'saldoCaja',
                    className: 'text-right',
                    render: function (data: any) {
                        return '$' + that.helperService.formaterNumber(data);
                    },
                },
                {
                    title: 'Saldo Empleado',
                    data: 'saldoEmpleado',
                    className: 'text-right',
                    render: function (data: any) {
                        return '$' + that.helperService.formaterNumber(data);
                    },
                },
                {
                    title: 'Base',
                    data: 'base',
                    className: 'text-right',
                    render: function (data: any) {
                        return '$' + that.helperService.formaterNumber(data);
                    },
                },
                {
                    title: 'Acciones',
                    orderable: false,
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
                        this.helperService.redirectApp(
                            `operativo/cierres/editar/${event.target.dataset.id}`
                        );
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

                    $('.btn-dropdown-Imprimir-tikect')
                    .off()
                    .on('click', (event: any) => {
                        this.ImprimirCierre(event.target.dataset.id);
                    });
            },
        };
    }

    public nuevo() {
        this.helperService.redirectApp('operativo/cierres/crear');
    }

    ImprimirCierre(id: any) {
        this.service.GetArchivoCierre(id).subscribe(({ data }) => {
            this.openPdfInNewTab(data.archivo);
        })
    }

    openPdfInNewTab(pdfContent: string) {
        const byteCharacters = atob(pdfContent);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const objectUrl = URL.createObjectURL(blob);

        const newWindow = window.open(objectUrl, '_blank');

        if (newWindow) {
            newWindow.document.title = 'Cierre';
            newWindow.print();
        }
    }
}
