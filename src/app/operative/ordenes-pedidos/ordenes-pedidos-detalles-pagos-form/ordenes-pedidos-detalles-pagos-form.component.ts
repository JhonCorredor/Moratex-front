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
import { OrdenesPedidosService } from '../ordenes-pedidos.service';
import { EmpleadosService } from '../../../parameters/empleados/empleados.service';
import { DatePipe } from '@angular/common';

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
  public arrayBotonesDatatable: String[] = ['btn-modificarOP', 'btn-Imprimir-tikect'];
  public botones = ['btn-guardar'];
  public Id = null;
  public persona_Id!: string | number;

  @Input() OrdenPedido_Id: any = null;

  public frmOrdenesPedidosDetallesPagos!: FormGroup;
  public statusForm: boolean = true;
  public listEmpleados: any[] = [];
  public listMediosPagos: any[] = [];

  constructor(
    public routerActive: ActivatedRoute,
    private service: OrdenesPedidosDetallesPagosService,
    private empleadoService: EmpleadosService,
    private OrdenPedidoService: OrdenesPedidosService,
    private helperService: HelperService,
    private fb: FormBuilder,
    private datePipe: DatePipe
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

  ValorTotalPagosById(ordenPedido_Id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.service.GetTotalPagos(ordenPedido_Id).subscribe(
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

    this.OrdenPedidoService.getOrdenesPedidosById(this.OrdenPedido_Id).subscribe(({ data }) => {
      subtotal = data.subTotal;
    })

    this.ValorTotalPagosById(this.OrdenPedido_Id)
      .then((valorTotal) => {
        if (subtotal !== null && valorTotal !== null) {
          var saldo = parseInt(subtotal) - parseInt(valorTotal);
          saldoString = `$ ${this.helperService.formaterNumber(saldo)}`;
        }
        this.frmOrdenesPedidosDetallesPagos.controls.SaldoString.setValue(saldoString);
      })
      .catch((error) => {
        console.error('Error al obtener el valor total de los pagos:', error);
      });
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
      this.frmOrdenesPedidosDetallesPagos.controls.Empleado_Id.setValue(
        res.data[0].id
      );
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

  ImprimirTicket(id: any) {
    this.service.GetArchivoPago(id).subscribe(({ data }) => {
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
      newWindow.document.title = 'Recibo de pago';
      newWindow.print();
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
          .getAllOrdenesPedidosDetallesPagos(data)
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
          title: 'Empleado',
          data: 'empleado',
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
              .getOrdenesPedidosDetallesPagosById(event.target.dataset.id)
              .subscribe(({ data }) => {
                const formattedDate = this.datePipe.transform(
                  data.fecha,
                  'yyyy-MM-dd'
                );

                this.Id = data.id;
                this.frmOrdenesPedidosDetallesPagos.controls.Fecha.setValue(
                  formattedDate
                );
                this.frmOrdenesPedidosDetallesPagos.controls.Valor.setValue(
                  data.valor
                );
                this.frmOrdenesPedidosDetallesPagos.controls.MedioPago_Id.setValue(
                  data.medioPago_Id
                );
              });
          });

        $('.btn-dropdown-Imprimir-tikect')
          .off()
          .on('click', (event: any) => {
            this.service
              .getOrdenesPedidosDetallesPagosById(event.target.dataset.id)
              .subscribe(({ data }) => {
                this.ImprimirTicket(data.id);
              });
          });
      },
    };

  }
}
