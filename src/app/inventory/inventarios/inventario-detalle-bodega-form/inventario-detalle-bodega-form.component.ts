import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { LANGUAGE_DATATABLE } from 'src/app/admin/datatable.language';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { BotonesComponent } from 'src/app/general/botones/botones.component';
import { InventarioDetalleBodegaService } from '../inventario-detalle-bodega.service';
import { InventarioDetalleService } from '../inventario-detalle.service';
import { GeneralParameterService } from '../../../parameters/general-parameter/general-parameter.service';

@Component({
    selector: 'app-inventario-detalle-bodega-form',
    templateUrl: './inventario-detalle-bodega-form.component.html',
    styleUrls: ['./inventario-detalle-bodega-form.component.css']
})
export class InventarioDetalleBodegaFormComponent implements OnInit {

    @ViewChild('botonesDatatable') botonesDatatable!: BotonesComponent;
    @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
    public dtTrigger: Subject<any> = new Subject();
    public opcionesDataTable: any = {};
    public arrayBotonesDatatable: String[] = ['btn-modificar'];
    public botones = ['btn-guardar'];
    public Id = null;

    @Input() Inventario_Id: any = null;

    public frmInventarioDetalleBodega!: FormGroup;
    public statusForm: boolean = true
    public listInventarioDetalle: any[] = [];
    public listBodegas: any[] = [];

    constructor(public routerActive: ActivatedRoute,
        private service: InventarioDetalleBodegaService,
        private inventarioDetalleService: InventarioDetalleService,
        private generalParameterService: GeneralParameterService,
        private helperService: HelperService,
        private fb: FormBuilder) {

    }

    ngOnInit(): void {
        this.buildForm()
        this.cargarDatatable();
    }

    buildForm(): void {
        this.frmInventarioDetalleBodega = this.fb.group({
            InventarioDetalle_Id: new FormControl(null, Validators.required),
            Bodega_Id: new FormControl(null, Validators.required),
            Cantidad: new FormControl(null, [Validators.required])
        });
        this.buildSelect()
    }

    ngAfterViewInit() {
        this.dtTrigger.next();
    }

    ngOnDestroy(): void {
        this.dtTrigger.unsubscribe();
    }

    buildSelect() {
        this.inventarioDetalleService.getAll("InventariosDetalles").subscribe(({ data }) => {
            this.listInventarioDetalle = data;
        });

        this.generalParameterService.getAll("Bodegas").subscribe(({ data }) => {
            this.listBodegas = data;
        });
    }


    save() {
        if (this.frmInventarioDetalleBodega.invalid) {
            this.statusForm = false
            this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
            return;
        }

        let data = {
            id: this.Id ?? 0,
            ...this.frmInventarioDetalleBodega.value
        };

        this.service.save(this.Id, data).subscribe(
            (response) => {
                if (response.status) {
                    this.refrescarTabla();
                    this.frmInventarioDetalleBodega.reset();
                    this.Id = null;
                    this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS)
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
                data.columnOrder = "Id";
                data.directionOrder = dataTablesParameters.order[0].dir;
                data.foreignKey = this.Inventario_Id;
                this.service.getAllInventarioDetalleBodega(data).subscribe((res: any) => {
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
                    title: "Producto",
                    data: "producto"
                },
                {
                    title: "Cantidad",
                    data: "cantidad",
                    render: function (data: any,) {
                        return that.helperService.formaterNumber(data);
                    }
                },
                {
                    title: "Bodega",
                    data: "bodega"
                },
                {
                    title: "Acciones",
                    orderable: false,
                    width: '300px',
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
                $('.btn-dropdown-modificar')
                    .off()
                    .on('click', (event: any) => {
                        this.service
                            .getInventarioDetalleBodegaById(event.target.dataset.id)
                            .subscribe(({ data }) => {
                                this.Id = data.id;
                                this.frmInventarioDetalleBodega.controls.InventarioDetalle_Id.setValue(
                                    data.inventarioDetalle_Id
                                );
                                this.frmInventarioDetalleBodega.controls.Bodega_Id.setValue(
                                    data.bodega_Id
                                );
                                this.frmInventarioDetalleBodega.controls.Cantidad.setValue(
                                    data.cantidad
                                );
                            });
                    });
            },
        };
    }


}
