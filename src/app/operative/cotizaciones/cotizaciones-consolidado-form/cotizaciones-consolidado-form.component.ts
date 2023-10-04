
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { LANGUAGE_DATATABLE } from 'src/app/admin/datatable.language';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { BotonesComponent } from 'src/app/general/botones/botones.component';
import { CotizacionesConsolidadoService } from '../cotizaciones-consolidado.service';

@Component({
  selector: 'app-cotizaciones-consolidado-form',
  templateUrl: './cotizaciones-consolidado-form.component.html',
  styleUrls: ['./cotizaciones-consolidado-form.component.css']
})
export class CotizacionesConsolidadoFormComponent implements OnInit {

  @ViewChild('botonesDatatable') botonesDatatable!: BotonesComponent;
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  @Input() cotizacionId: any;
  @Input() status : boolean = false
  public arrayBotonesDatatable: String[] = ['btn-eliminar'];
  public botones = ['btn-importar-empleado', 'btn-excel-empleado'  , 'btn-guardar'];
  public dtTrigger: Subject<any> = new Subject();
  public opcionesDataTable: any = {};
  public titulo = "";
  public Archivo : any


  constructor(public routerActive: ActivatedRoute, 
    private service: CotizacionesConsolidadoService, 
    private helperService: HelperService, 
    private spinner: NgxSpinnerService,
    ) 
  {}

  ngOnInit(): void {
    if(this.status){
      this.botones = [];
      this.arrayBotonesDatatable = [];
    }
    this.cargarDatatable();
  }

  ngAfterViewInit() {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  refrescarTabla() {
    if(typeof this.dtElement.dtInstance != 'undefined'){
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.ajax.reload()
      });
    }
  }

  save() {
    if(this.Archivo == undefined){
      this.helperService.showMessage(MessageType.ERROR, Messages.INVALIDFILE);
      return
    }
    this.spinner.show();
    this.service.save(this.Archivo).subscribe(res => {
      if (res && res.status == true) {
        this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVEFILE);
      } else {
        this.helperService.showMessageError(res);
      }
      this.spinner.hide();
      this.refrescarTabla();
    }, (err : any) => {
      this.helperService.showMessageError(err);
      this.spinner.hide();
      this.refrescarTabla();
    }
    )    
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
        ajax: (dataTablesParameters: any, callback : any) => {
          let pageNumber = (dataTablesParameters.start / dataTablesParameters.length) + 1
          var data = new DatatableParameter();
          data.pageNumber = pageNumber.toString();
          data.pageSize = dataTablesParameters.length.toString();
          data.filter = dataTablesParameters.search.value;
          data.columnOrder = that.helperService.capitalizeFirstLetter(dataTablesParameters.columns[dataTablesParameters.order[0].column].data.toString());;
          data.directionOrder = dataTablesParameters.order[0].dir;
          data.foreignKey = this.cotizacionId
          this.service.datatable(data).subscribe(res => {
            callback({
              recordsTotal: res.meta.totalCount,
              recordsFiltered: res.meta.totalCount,
              draw: dataTablesParameters.draw,
              data: res.data
            });
          });
        },
        language: LANGUAGE_DATATABLE,
        columns: [
            {
              title: "Empleado",
              data: 'empleado',
            },
            {
              title: "Acciones",
              orderable: false,
              width: '300px',
              data: "id",
              render: function(id : any, type : any, row : any) {
                const boton = that.botonesDatatable;
                return boton.botonesDropdown.nativeElement.outerHTML.split('$id').join(id);
              },
              className: "pl-1 pr-0 text-center",
              responsivePriority: 7
            }
        ],
        drawCallback: (settings : any) => {
          $('.btn-dropdown-eliminar').off().on('click', (event : any) => {
            this.helperService.confirmDelete(() => {
              this.service.delete(event.target.dataset.id).subscribe(l => {
                if (l.status) {
                  this.helperService.showMessage(MessageType.SUCCESS, Messages.DELETESUCCESS);
                  this.refrescarTabla();
                } else {
                  this.helperService.showMessage(MessageType.ERROR, Messages.DELETEERROR);
                }
              })
            });
          });
        }
    };
  }

  public importarEmpleado(event: any){
    let file : any ; 
    let type = event.target.files[0].type.split('/')[1];
    if (type == "vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (e: any) => {
      file = e.currentTarget.result;
      this.Archivo = {
        "Archivo": file,
        "CotizacionId" : this.cotizacionId
      }
      this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVEFILE);  
      };
    }else{
      this.helperService.showMessage(MessageType.ERROR, Messages.INVALIDFILE);  
    }
  }

  downloadFile(){
    let link = document.createElement("a");
    link.download = "Plantilla Cotizaciones Empleados.xlsx";
    link.href = "/assets/excel/Plantilla_Cotizaciones_Empleados.xlsx";
    link.click();
    link.remove();
  }
}
