import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';
import { Subject } from 'rxjs';
import { LANGUAGE_DATATABLE } from 'src/app/admin/datatable.language';
import { HelperService } from 'src/app/admin/helper.service';
import { BotonesComponent } from 'src/app/general/botones/botones.component';
import { BitacorasInventariosService } from '../bitacora-inventario.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-bitacora-inventario-index',
    templateUrl: './bitacora-inventario-index.component.html',
    styleUrls: ['./bitacora-inventario-index.component.css']
})
export class BitacorasInventariosIndexComponent implements OnInit {

    @ViewChild('botonesDatatable') botonesDatatable!: BotonesComponent;
    @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
    public dtTrigger: Subject<any> = new Subject();
    public opcionesDataTable: any = {};
    public arrayBotonesDatatable: String[] = [];
    public botones = ['btn-cancelar'];
    public Id = null;

    @Input() Producto_Id: any = null;
    public frmBitacoraInventario!: FormGroup;
    public statusForm: boolean = true
    public listProductos: any[] = [];

    public title = "Listado de Movimientos";

    constructor(
        private service: BitacorasInventariosService,
        private helperService: HelperService,
        private modalActive: NgbActiveModal,

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
                data.foreignKey = this.Producto_Id;
                this.service.getAllBitacoraInventario(data).subscribe((res: any) => {
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
                    title: 'Producto',
                    data: 'nombreProducto',
                },
                {
                    title: 'Cantidad',
                    data: 'cantidad',
                },
                {
                    title: 'Observacion',
                    data: 'observacion',
                },
                {
                    title: 'Empleado',
                    data: 'empleado',
                },
                
            ],
            drawCallback: (settings: any) => {

            },
        };
    }

    cancel() {
        this.modalActive.close(null);
    }
}
