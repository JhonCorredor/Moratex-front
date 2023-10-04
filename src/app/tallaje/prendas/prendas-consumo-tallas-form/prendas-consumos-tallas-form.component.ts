import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { LANGUAGE_DATATABLE } from 'src/app/admin/datatable.language';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { BotonesComponent } from 'src/app/general/botones/botones.component';
import { GeneralParameterService } from 'src/app/parameters/general-parameter/general-parameter.service';
import { ConsumosPrendasTallasService } from '../prendas-consumos-tallas.service';

@Component({
  selector: 'app-consumos-prendas-tallas-form',
  templateUrl: './prendas-consumos-tallas-form.component.html',
  styleUrls: ['./prendas-consumos-tallas-form.component.css']
})
export class ConsumosPrendasTallasFormComponent implements OnInit {

  @ViewChild('botonesDatatable') botonesDatatable!: BotonesComponent;
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  public dtTrigger: Subject<any> = new Subject();
  public opcionesDataTable: any = {};
  public arrayBotonesDatatable: String[] = ['btn-modificar', 'btn-eliminar', 'btn-copiar'];
  public botones = ['btn-guardar'];

  @Input() prendaId : any = null;

  public frmConsumoPrenda: FormGroup;
  public statusForm : boolean = true
  public listConsumosPrendras: any[] = [];
  public listTallas: any[] = [];
  public listUnidadesMedidas: any[] = [];

  constructor(private generalService: GeneralParameterService, private helperService: HelperService, private service: ConsumosPrendasTallasService) { 
    this.frmConsumoPrenda = new FormGroup({
      Id : new FormControl(0, Validators.required),
      Cantidad : new FormControl(null, [Validators.required ]),
      ConsumoPrendaId : new FormControl(null, Validators.required),
      TallaId : new FormControl(null, Validators.required),
      UnidadMedidaId : new FormControl(null, Validators.required),
      Estado: new FormControl(true, Validators.required)
    });
  }

  ngOnInit(): void {
    this.cargarDatatable();
    this.cargarSelects();
  }

  ngAfterViewInit() {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  cargarSelects() {
    this.generalService.getAllCustom(`ConsumosPrendas/AllSelectByPrenda/${this.prendaId}`).subscribe(r => {
      this.listConsumosPrendras = r.data;
    })
    this.generalService.getAll("Tallas").subscribe(r => {
      this.listTallas = r.data;
    })
    this.generalService.getAll("UnidadesMedidas").subscribe(r => {
      this.listUnidadesMedidas = r.data;
    })
  }

  save() {
    if (this.frmConsumoPrenda.invalid) {
      this.statusForm  = false
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }
    let data  = this.frmConsumoPrenda.value;
    this.service.save(this.frmConsumoPrenda.controls.Id.value, data).subscribe(l => {
      if (!l.status) {
        this.helperService.showMessage(MessageType.ERROR, Messages.SAVEERROR)
      } else {
        this.refrescarTabla();
        this.frmConsumoPrenda.reset();
        this.frmConsumoPrenda.controls.Id.setValue(0);
        this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS)
      }
    })
  }

  refrescarTabla() {
    if(typeof this.dtElement.dtInstance != 'undefined'){
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
        ajax: (dataTablesParameters: any, callback : any) => {
          let pageNumber = (dataTablesParameters.start / dataTablesParameters.length) + 1
          var data = new DatatableParameter();
          data.pageNumber = pageNumber.toString();
          data.pageSize = dataTablesParameters.length.toString();
          data.filter = dataTablesParameters.search.value;
          data.columnOrder = that.helperService.capitalizeFirstLetter(dataTablesParameters.columns[dataTablesParameters.order[0].column].data.toString());;
          data.directionOrder = dataTablesParameters.order[0].dir;
          data.foreignKey = this.prendaId;
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
              title: "Cantidad",
              data: 'cantidad',
            },
            {
              title: "Consumo de Prenda",
              data: 'consumoPrenda',
            },
            {
              title: "Talla",
              data: 'talla',
            },
            {
              title: "Unidad de Medida",
              data: 'unidadMedida',
            },
            {
              title: "Estado",
              data: 'estado',
              render: function(item: any) {
                if (item) {
                  return "<label class='text-center badge badge-success'>Activo</label>";
                } else {
                  return "<label class='text-center badge badge-danger'>Inactivo</label>";
                }
              }
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
          $('.btn-dropdown-modificar').off().on('click', (event : any) => {
            this.service.getById(event.target.dataset.id).subscribe(res => {
              this.frmConsumoPrenda.controls.Id.setValue(res.data.id);
              this.frmConsumoPrenda.controls.Cantidad.setValue(res.data.cantidad);
              this.frmConsumoPrenda.controls.ConsumoPrendaId.setValue(res.data.consumoPrendaId);
              this.frmConsumoPrenda.controls.TallaId.setValue(res.data.tallaId);
              this.frmConsumoPrenda.controls.UnidadMedidaId.setValue(res.data.unidadMedidaId);
              this.frmConsumoPrenda.controls.Estado.setValue(res.data.estado);
            })
          });
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
          $('.btn-dropdown-copiar').off().on('click', (event: any) => {
            this.service.getById(event.target.dataset.id).subscribe(res => { 
              this.frmConsumoPrenda.controls.Cantidad.setValue(res.data.cantidad);
              this.frmConsumoPrenda.controls.ConsumoPrendaId.setValue(res.data.consumoPrendaId);
              this.frmConsumoPrenda.controls.TallaId.setValue(res.data.tallaId);
              this.frmConsumoPrenda.controls.UnidadMedidaId.setValue(res.data.unidadMedidaId);
              this.frmConsumoPrenda.controls.Estado.setValue(res.data.estado);
            });
          });
        }
    };
  }

}
