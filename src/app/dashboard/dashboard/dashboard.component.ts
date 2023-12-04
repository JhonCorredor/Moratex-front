import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Chart, registerables } from 'node_modules/chart.js';
import { FacturasService } from '../../operative/facturas/facturas.service';
import { FacturasDetallesPagosService } from '../../operative/facturas/facturas-detalles-pagos.service';
import { CostosService } from '../../operative/costos/costos.service';
import { HelperService } from 'src/app/admin/helper.service';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';
import { LANGUAGE_DATATABLE } from 'src/app/admin/datatable.language';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  public dtTrigger: Subject<any> = new Subject();
  public dtTriggerGastos: Subject<any> = new Subject();
  public frmDashBoard: FormGroup;
  public listDetallesPagosVentasChart: any = [];
  public listDetallesPagosGastosChart: any = [];
  public totalVentas: any;
  public lstDetallesPagosVentas: any = [];
  public lstDetallesPagosGastos: any = [];
  public totalGastos: any;
  public fecha: string = this.ObtenerFechaActual();
  public mesActual: any;
  public year: any;
  
  public labelsDias: any = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
  public dataDiasVentas: any = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  public dataDiasGastos: any = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  public labelsMeses: any = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  public dataMesesVentas: any = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  public dataMesesGastos: any = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  public litsMeses: any[] = [
    {
      id: 1,
      textoMostrar: "Enero"
    },
    {
      id: 2,
      textoMostrar: "Febrero"
    },
    {
      id: 3,
      textoMostrar: "Marzo"
    },
    {
      id: 4,
      textoMostrar: "Abril"
    },
    {
      id: 5,
      textoMostrar: "Mayo"
    },
    {
      id: 6,
      textoMostrar: "Junio"
    },
    {
      id: 7,
      textoMostrar: "Julio"
    },
    {
      id: 8,
      textoMostrar: "Agosto"
    },
    {
      id: 9,
      textoMostrar: "Septiembre"
    },
    {
      id: 10,
      textoMostrar: "Octubre"
    },
    {
      id: 11,
      textoMostrar: "Noviembre"
    },
    {
      id: 12,
      textoMostrar: "Diciembre"
    },
  ];
  public dtOptionsVentas: any = {
    serverSide: true,
    processing: true,
    ordering: true,
    responsive: true,
    paging: false,
    order: [1, 'desc'],
    searching: false,
    lengthChange: false,
    info: false,
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
      data.columnOrder = this.helperService.capitalizeFirstLetter(
        dataTablesParameters.columns[
          dataTablesParameters.order[0].column
        ].data.toString()
      );
      data.directionOrder = dataTablesParameters.order[0].dir;
      callback({
        recordsTotal: this.lstDetallesPagosVentas.length,
        recordsFiltered: this.lstDetallesPagosVentas.length,
        draw: dataTablesParameters.draw,
        data: this.lstDetallesPagosVentas,
      });
    },
    language: LANGUAGE_DATATABLE,
    columns: [
      {
        title: 'Medio de Pago',
        data: 'medioPago',
      },
      {
        title: 'Total',
        data: 'valor',
      },
    ],
    drawCallback: (settings: any) => {
    },
  };
  public dtOptionsGastos: any = {
    serverSide: true,
    processing: true,
    ordering: true,
    responsive: true,
    paging: false,
    order: [1, 'desc'],
    searching: false,
    lengthChange: false,
    info: false,
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
      data.columnOrder = this.helperService.capitalizeFirstLetter(
        dataTablesParameters.columns[
          dataTablesParameters.order[0].column
        ].data.toString()
      );
      data.directionOrder = dataTablesParameters.order[0].dir;
      callback({
        recordsTotal: this.lstDetallesPagosGastos.length,
        recordsFiltered: this.lstDetallesPagosGastos.length,
        draw: dataTablesParameters.draw,
        data: this.lstDetallesPagosGastos,
      });
    },
    language: LANGUAGE_DATATABLE,
    columns: [
      {
        title: 'Tipo de Gasto',
        data: 'tipoCosto',
      },
      {
        title: 'Total',
        data: 'valor',
      },
    ],
    drawCallback: (settings: any) => {
    },
  };

  constructor(
    private facturaService: FacturasService,
    private facturasDetallesPagosService: FacturasDetallesPagosService,
    private costosService: CostosService,
    private helperService: HelperService,
  ) {
    this.frmDashBoard = new FormGroup({
      VentasDia: new FormControl(true),
      GastosDia: new FormControl(true),
      Mes_Id: new FormControl(),
    })
  }

  ngOnInit(): void {
    this.helperService.showLoading();
    this.CargarFacturasDay();
    this.CargarGastosDay();
    this.CargarFacturasCalendar("DIA");
    this.CargarGastosCalendar("DIA");
    this.CargarCalendar();
    const mes = (new Date().getMonth() + 1).toString().padStart(2, '0');
    this.frmDashBoard.controls.Mes_Id.setValue(parseInt(mes));
    setTimeout(() => {
      this.helperService.hideLoading();
    }, 500);
  }

  ngAfterViewInit() {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  CargarFacturasDay() {
    var data = new DatatableParameter(); data.pageNumber = "1"; data.pageSize = "10"; data.filter = this.fecha; data.columnOrder = ""; data.directionOrder = ""; data.foreignKey = "";

    this.facturasDetallesPagosService.getAllFacturasDetallesPagosDay(data).subscribe(l => {
      this.listDetallesPagosVentasChart.push(l.data);
    });

    setTimeout(() => {
      this.RenderChartVentas();
    }, 1000);
  }

  CargarFacturasMonth() {
    var data = new DatatableParameter(); data.pageNumber = "1"; data.pageSize = "10"; data.filter = this.fecha; data.columnOrder = ""; data.directionOrder = ""; data.foreignKey = "";

    this.facturasDetallesPagosService.getAllFacturasDetallesPagosMonth(data).subscribe(l => {
      this.listDetallesPagosVentasChart.push(l.data);
    });

    setTimeout(() => {
      this.RenderChartVentas();
    }, 1000);
  }

  CargarGastosDay() {
    var data = new DatatableParameter(); data.pageNumber = "1"; data.pageSize = "10"; data.filter = this.fecha; data.columnOrder = ""; data.directionOrder = ""; data.foreignKey = "";

    this.costosService.getAllCostosDay(data).subscribe(l => {
      this.listDetallesPagosGastosChart.push(l.data);
    });

    setTimeout(() => {
      this.RenderChartCostos();
    }, 1000);
  }

  CargarGastosMonth() {
    var data = new DatatableParameter(); data.pageNumber = "1"; data.pageSize = "10"; data.filter = this.fecha; data.columnOrder = ""; data.directionOrder = ""; data.foreignKey = "";

    this.costosService.getAllCostosMonth(data).subscribe(l => {
      this.listDetallesPagosGastosChart.push(l.data);
    });

    setTimeout(() => {
      this.RenderChartCostos();
    }, 1000);
  }

  CargarFacturasCalendar(filter: string) {
    var data = new DatatableParameter(); data.pageNumber = "1"; data.pageSize = "10"; data.filter = filter; data.columnOrder = this.fecha; data.directionOrder = ""; data.foreignKey = "";

    this.facturasDetallesPagosService.getAllFacturasDetallesPagosCalendar(data).subscribe(l => {
      l.data.forEach((dato: any) => {
        var valorActual = parseInt(this.dataDiasVentas[dato.dia - 1]);
        this.dataDiasVentas[dato.dia - 1] = valorActual + dato.valor;
      });
    });

    setTimeout(() => {
      this.DrawChartVentasCalendar();
    }, 1000);
  }

  CargarGastosCalendar(filter: string) {
    var data = new DatatableParameter(); data.pageNumber = "1"; data.pageSize = "10"; data.filter = filter; data.columnOrder = this.fecha; data.directionOrder = ""; data.foreignKey = "";

    this.costosService.getAllCostosCalendar(data).subscribe(l => {
      l.data.forEach((dato: any) => {
        var valorActual = parseInt(this.dataDiasGastos[dato.dia - 1]);
        this.dataDiasGastos[dato.dia - 1] = valorActual + dato.valor;
      });
    });

    setTimeout(() => {
      this.DrawChartGastosCalendar();
    }, 1000);
  }

  CargarCalendar() {
    var data = new DatatableParameter(); data.pageNumber = "1"; data.pageSize = "10"; data.filter = "AÑO"; data.columnOrder = this.fecha; data.directionOrder = ""; data.foreignKey = "";

    this.facturasDetallesPagosService.getAllFacturasDetallesPagosCalendar(data).subscribe(l => {
      l.data.forEach((dato: any) => {
        var valorActual = parseInt(this.dataMesesVentas[dato.mes - 1]);
        this.dataMesesVentas[dato.mes - 1] = valorActual + dato.valor;
      });
    });

    this.costosService.getAllCostosCalendar(data).subscribe(l => {
      l.data.forEach((dato: any) => {
        var valorActual = parseInt(this.dataMesesGastos[dato.mes - 1]);
        this.dataMesesGastos[dato.mes - 1] = valorActual + dato.valor;
      });
    });

    setTimeout(() => {
      this.DrawChartCalendar();
    }, 1000);
  }

  DrawChartCalendar() {
    var barChartData = {
      labels: this.labelsMeses,
      datasets: [
        {
          label: "Ventas",
          data: this.dataMesesVentas,
          backgroundColor: ['rgba(75, 192, 192, 0.2)'],
          borderColor: ['rgb(75, 192, 192)'],
          borderWidth: 1
        },
        {
          label: "Gastos",
          data: this.dataMesesGastos,
          backgroundColor: ['rgba(255, 99, 132, 0.2)'],
          borderColor: ['rgb(255, 99, 132)'],
          borderWidth: 1
        },
      ]
    };

    var existingChartCalendar = Chart.getChart("chartCalendar");
    if (existingChartCalendar) {
      existingChartCalendar.destroy();
    }

    new Chart("chartCalendar", {
      type: 'bar',
      data: barChartData,
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  RenderChartVentas() {
    var labels: any = [];
    var dataValores: any = [];

    this.listDetallesPagosVentasChart.forEach((dato: any) => {
      dato.forEach((item: any) => {
        labels.push(item.medioPago);
        dataValores.push(item.valor);
      });
    });
    this.DrawChartVentas(dataValores, labels);
    this.DrawChartVentasCalendar();
    $("#tableVentas").DataTable().destroy();
    this.CargarTablaVentas(labels, dataValores);
  }

  RenderChartCostos() {
    var labels: any = [];
    var dataValores: any = [];
    this.listDetallesPagosGastosChart.forEach((dato: any) => {
      dato.forEach((item: any) => {
        labels.push(item.tipoCosto);
        dataValores.push(item.valor);
      });
    });

    this.DrawChartCostos(dataValores, labels);
    this.DrawChartGastosCalendar();
    $("#tableGastos").DataTable().destroy();
    this.CargarTablaCostos(labels, dataValores);
  }

  refrescarTabla() {
    if (typeof this.dtElement.dtInstance != 'undefined') {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.ajax.reload();
      });
    }
  }

  CargarTablaVentas(labels: any, dataValores: any) {
    for (let i = 0; i < labels.length; i++) {
      var MedioPago = {
        "medioPago": labels[i],
        "valorNumerico": dataValores[i],
        "valor": `$ ${this.helperService.formaterNumber(dataValores[i])}`
      }

      this.lstDetallesPagosVentas.push(MedioPago);
    }


    setTimeout(() => {
      var valorTotal = 0;
      this.lstDetallesPagosVentas.forEach((dato: any) => {
        valorTotal += dato.valorNumerico;
      })
      this.totalVentas = `$ ${this.helperService.formaterNumber(valorTotal)}`;
    }, 500);

    this.refrescarTabla();
  }

  DrawChartVentas(ChartDataValores: any, ChartLabels: any) {
    var count = ChartDataValores.length

    var listDataSetColorsChart = [];
    var listDataSetColorsBorderChart = [];

    var colores = this.GenerarColoresAleatorios(count);

    for (var i = 0; i < count; i++) {
      listDataSetColorsChart.push(colores[i] + "90");
      listDataSetColorsBorderChart.push(colores[i]);
    }

    var doughnutChartData = {
      labels: ChartLabels,
      datasets: [
        {
          label: "Valor Total",
          data: ChartDataValores,
          backgroundColor: listDataSetColorsChart,
          borderColor: listDataSetColorsBorderChart,
        },
      ]
    };

    let delayed: any;

    var existingChart = Chart.getChart("chartVentas");
    if (existingChart) {
      existingChart.destroy();
    }

    new Chart("chartVentas", {
      type: 'doughnut',
      data: doughnutChartData,
      options: {
        responsive: true,
        animation: {
          onComplete: () => {
            delayed = true;
          },
          delay: (context) => {
            let delay = 0;
            if (context.type === 'data' && context.mode === 'default' && !delayed) {
              delay = context.dataIndex * 300 + context.datasetIndex * 100;
            }
            return delay;
          },
        },
      }
    });
  }

  DrawChartVentasCalendar() {
    var count = this.dataDiasVentas.length

    var listDataSetColorsChart = [];
    var listDataSetColorsBorderChart = [];

    var colores = this.GenerarColoresAleatorios(count);

    for (var i = 0; i < count; i++) {
      listDataSetColorsChart.push(colores[i] + "90");
      listDataSetColorsBorderChart.push(colores[i]);
    }

    var barChartData = {
      labels: this.labelsDias,
      datasets: [
        {
          label: "Ventas",
          data: this.dataDiasVentas,
          backgroundColor: listDataSetColorsChart,
          borderColor: listDataSetColorsBorderChart,
        },
      ]
    };

    var existingChartCalendar = Chart.getChart("chartVentasCalendar");
    if (existingChartCalendar) {
      existingChartCalendar.destroy();
    }

    new Chart("chartVentasCalendar", {
      type: 'bar',
      data: barChartData,
      options: {
        responsive: true,
      }
    });
  }

  DrawChartGastosCalendar() {
    var count = this.dataDiasGastos.length

    var listDataSetColorsChart = [];
    var listDataSetColorsBorderChart = [];

    var colores = this.GenerarColoresAleatorios(count);

    for (var i = 0; i < count; i++) {
      listDataSetColorsChart.push(colores[i] + "90");
      listDataSetColorsBorderChart.push(colores[i]);
    }

    var barChartData = {
      labels: this.labelsDias,
      datasets: [
        {
          label: "Gastos",
          data: this.dataDiasGastos,
          backgroundColor: listDataSetColorsChart,
          borderColor: listDataSetColorsBorderChart,
        },
      ]
    };

    var existingChartCalendar = Chart.getChart("chartGastosCalendar");
    if (existingChartCalendar) {
      existingChartCalendar.destroy();
    }

    new Chart("chartGastosCalendar", {
      type: 'bar',
      data: barChartData,
      options: {
        responsive: true,
      }
    });
  }

  CargarTablaCostos(labels: any, dataValores: any) {
    for (let i = 0; i < labels.length; i++) {
      var MedioPago = {
        "tipoCosto": labels[i],
        "valorNumerico": dataValores[i],
        "valor": `$ ${this.helperService.formaterNumber(dataValores[i])}`
      }

      this.lstDetallesPagosGastos.push(MedioPago);
    }

    setTimeout(() => {
      var valorTotal = 0;
      this.lstDetallesPagosGastos.forEach((dato: any) => {
        valorTotal += dato.valorNumerico;
      });
      this.totalGastos = `$ ${this.helperService.formaterNumber(valorTotal)}`
    }, 500);

    $("#DataTables_Table_1").DataTable().destroy();
    $("#DataTables_Table_1").html("");

    this.dtOptionsGastos = {
      serverSide: true,
      processing: true,
      ordering: true,
      responsive: true,
      paging: false,
      order: [1, 'desc'],
      pageLength: 3,
      searching: false,
      lengthChange: false,
      info: false,
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
        data.columnOrder = this.helperService.capitalizeFirstLetter(
          dataTablesParameters.columns[
            dataTablesParameters.order[0].column
          ].data.toString()
        );
        data.directionOrder = dataTablesParameters.order[0].dir;
        callback({
          recordsTotal: this.lstDetallesPagosGastos.length,
          recordsFiltered: this.lstDetallesPagosGastos.length,
          draw: dataTablesParameters.draw,
          data: this.lstDetallesPagosGastos,
        });
      },
      language: LANGUAGE_DATATABLE,
      columns: [
        {
          title: 'Tipo de Gasto',
          data: 'tipoCosto',
        },
        {
          title: 'Total',
          data: 'valor',
        },
      ],
      drawCallback: (settings: any) => {
      },
    };
    this.dtTriggerGastos.next();
  }

  DrawChartCostos(ChartDataValores: any, ChartLabels: any) {
    var count = ChartDataValores.length

    var listDataSetColorsChart = [];
    var listDataSetColorsBorderChart = [];

    var colores = this.GenerarColoresAleatorios(count);

    for (var i = 0; i < count; i++) {
      listDataSetColorsChart.push(colores[i] + "90");
      listDataSetColorsBorderChart.push(colores[i]);
    }

    var doughnutChartData = {
      labels: ChartLabels,
      datasets: [
        {
          label: "Valor Total",
          data: ChartDataValores,
          backgroundColor: listDataSetColorsChart,
          borderColor: listDataSetColorsBorderChart,
        },
      ]
    };

    let delayed: any;

    var existingChart = Chart.getChart("chartGastos");
    if (existingChart) {
      existingChart.destroy();
    }

    new Chart("chartGastos", {
      type: 'doughnut',
      data: doughnutChartData,
      options: {
        responsive: true,
        animation: {
          onComplete: () => {
            delayed = true;
          },
          delay: (context) => {
            let delay = 0;
            if (context.type === 'data' && context.mode === 'default' && !delayed) {
              delay = context.dataIndex * 300 + context.datasetIndex * 100;
            }
            return delay;
          },
        },
      }
    });
  }

  GenerarColoresAleatorios(cantidad: any) {
    const coloresAleatorios = [];

    for (let i = 0; i < cantidad; i++) {
      // Genera valores aleatorios para los componentes R, G y B
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);

      // Convierte los valores en formato hexadecimal y agrégalos al arreglo de colores
      const colorHex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      coloresAleatorios.push(colorHex);
    }

    return coloresAleatorios;
  }

  ObtenerFechaActual(): string {
    const fecha = new Date();

    const año = fecha.getFullYear();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Los meses van de 0 a 11, por lo que sumamos 1
    const dia = fecha.getDate().toString().padStart(2, '0');

    const fechaFormateada = `${año}-${mes}-${dia}`;
    var lstMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    this.mesActual = lstMeses[parseInt(mes) - 1];
    this.year = año;
    return fechaFormateada;
  }

  onChangeVentas() {
    this.helperService.showLoading();

    //Boton dia
    $(".btnVentasDia").removeClass("btn-outline-primary");
    $(".btnVentasDia").addClass("btn-primary");

    const mes = (new Date().getMonth() + 1).toString().padStart(2, '0');
    this.frmDashBoard.controls.Mes_Id.setValue(parseInt(mes));
    this.fecha = this.ObtenerFechaActual();

    //Limpiar las Tablas
    this.listDetallesPagosVentasChart = [];
    this.lstDetallesPagosVentas = [];
    this.dataDiasVentas = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.listDetallesPagosGastosChart = [];
    this.lstDetallesPagosGastos = [];
    this.dataDiasGastos = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    $(".btnVentasMes").removeClass("btn-primary");
    $(".btnVentasDia").removeClass("btn-outline-primary");
    $(".btnVentasMes").addClass("btn-outline-primary");
    $(".btnVentasDia").addClass("btn-primary");
    this.CargarFacturasDay();
    this.CargarFacturasCalendar("DIA");
    this.CargarGastosDay();
    this.CargarGastosCalendar("DIA");

    setTimeout(() => {
      this.helperService.hideLoading();
    }, 500);
  }

  onchangeMes(event: any) {
    this.helperService.showLoading();
    //Boton dia
    $(".btnVentasDia").removeClass("btn-primary");
    $(".btnVentasDia").addClass("btn-outline-primary");
    const fechaObjeto = new Date(this.fecha);
    if (event != undefined) {
      fechaObjeto.setMonth(event.id - 1);
      const nuevaFechaString = `${new Date().getFullYear()}-${(fechaObjeto.getMonth() + 1).toString().padStart(2, '0')}-${new Date().getDate().toString().padStart(2, '0')}`;
      this.mesActual = event.textoMostrar;
      this.fecha = nuevaFechaString;
    } else {
      const mes = (new Date().getMonth() + 1).toString().padStart(2, '0');
      this.frmDashBoard.controls.Mes_Id.setValue(parseInt(mes));
      this.fecha = this.ObtenerFechaActual();
    }

    //Limpiar las Tablas
    this.listDetallesPagosVentasChart = [];
    this.lstDetallesPagosVentas = [];
    this.dataDiasVentas = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.listDetallesPagosGastosChart = [];
    this.lstDetallesPagosGastos = [];
    this.dataDiasGastos = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    this.CargarFacturasMonth();
    this.CargarFacturasCalendar("MES");
    this.CargarGastosMonth();
    this.CargarGastosCalendar("MES");

    setTimeout(() => {
      this.helperService.hideLoading();
    }, 500);
  }
}
