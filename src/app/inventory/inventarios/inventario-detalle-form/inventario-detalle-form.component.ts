import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { LANGUAGE_DATATABLE } from 'src/app/admin/datatable.language';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { BotonesComponent } from 'src/app/general/botones/botones.component';
import { InventarioDetalleService } from '../inventario-detalle.service';
import { BitacorasInventariosIndexComponent } from '../bitacora-inventario-index/bitacora-inventario-index.component';

@Component({
  selector: 'app-inventario-detalle-form',
  templateUrl: './inventario-detalle-form.component.html',
  styleUrls: ['./inventario-detalle-form.component.css']
})
export class InventarioDetalleFormComponent implements OnInit {

  @ViewChild('botonesDatatable') botonesDatatable!: BotonesComponent;
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  public dtTrigger: Subject<any> = new Subject();
  public opcionesDataTable: any = {};
  public arrayBotonesDatatable: String[] = ['btn-modificar', 'btn-movimiento'];
  public botones = ['btn-guardar'];
  public Id = null;

  @Input() Inventario_Id: any = null;

  public frmInventarioDetalle!: FormGroup;
  public statusForm: boolean = true
  public listProductos: any[] = [];

  constructor(public routerActive: ActivatedRoute,
    private service: InventarioDetalleService,
    private helperService: HelperService,
    private modalService: NgbModal,
    private fb: FormBuilder) {

  }

  ngOnInit(): void {
    this.buildForm()
    this.cargarDatatable();
  }

  buildForm(): void {
    this.frmInventarioDetalle = this.fb.group({
      CantidadTotal: new FormControl(null, [Validators.required]),
      CantidadUsada: new FormControl(null, [Validators.required]),
      CantidadIngresada: new FormControl(null, [Validators.required]),
      Producto_Id: new FormControl(null, Validators.required),
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
    this.service.getAll("Productos").subscribe(({ data }) => {
      this.listProductos = data;
    });
  }


  // changeCantidadTotal(){
  //   let ingresada = this.frmInventarioDetalle.controls.CantidadIngresada.value;
  //   let usada = this.frmInventarioDetalle.controls.CantidadUsada.value;

  //   if(ingresada != null  && ingresada != undefined && usada != undefined && usada != null){
  //     if(ingresada > usada){
  //       let total = ingresada - usada;
  //       this.frmInventarioDetalle.controls.CantidadTotal.setValue(total);
  //     }
  //     if(ingresada < usada){
  //       this.helperService.showMessage(MessageType.WARNING, Messages.INVALIDOPERATION);
  //       this.frmInventarioDetalle.controls.CantidadTotal.setValue(null);
  //     }
  //   }

  // }


  save() {
    if (this.frmInventarioDetalle.invalid) {
      this.statusForm = false
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }
    let data = {
      id: this.Id ?? 0,
      ...this.frmInventarioDetalle.value,
      inventario_Id: this.Inventario_Id,
    };

    this.service.save(this.Id, data).subscribe(
      (response) => {
        if (response.status) {
          this.refrescarTabla();
          this.frmInventarioDetalle.reset();
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
        data.columnOrder = that.helperService.capitalizeFirstLetter(
          dataTablesParameters.columns[
            dataTablesParameters.order[0].column
          ].data.toString()
        );
        data.directionOrder = dataTablesParameters.order[0].dir;
        data.foreignKey = this.Inventario_Id;
        this.service.getAllInventarioDetalle(data).subscribe((res: any) => {
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
          title: "Cantidad Ingresada",
          data: "cantidadIngresada",
          render: function (data: any,) {
            return that.helperService.formaterNumber(data);
          }
        },
        {
          title: "Cantidad Usada",
          data: 'cantidadUsada',
          render: function (data: any,) {
            return that.helperService.formaterNumber(data);
          }
        },
        {
          title: "Cantidad Total",
          data: 'cantidadTotal',
          render: function (data: any,) {
            return that.helperService.formaterNumber(data);
          }
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
              .getInventarioDetalleById(event.target.dataset.id)
              .subscribe(({ data }) => {
                this.Id = data.id;
                this.frmInventarioDetalle.controls.Producto_Id.setValue(
                  data.producto_Id
                );
                this.frmInventarioDetalle.controls.CantidadIngresada.setValue(
                  data.cantidadIngresada
                );
                this.frmInventarioDetalle.controls.CantidadUsada.setValue(
                  data.cantidadUsada
                );
                this.frmInventarioDetalle.controls.CantidadTotal.setValue(
                  data.cantidadTotal
                );
              });
          });
        $('.btn-dropdown-movimiento')
          .off()
          .on('click', (event: any) => {
            this.service.getInventarioDetalleById(event.target.dataset.id).subscribe(({ data }) => {
              this.abrirModalMovimientos(data.producto_Id);
            })
          });
      },
    };
  }
  
  abrirModalMovimientos(producto_Id: any){
    const  modal = this.modalService.open(BitacorasInventariosIndexComponent, {size: 'xl', keyboard: true, backdrop: "static", centered: true});
    modal.componentInstance.Producto_Id = producto_Id;
    
    modal.result.then(res => {
      if (res) {
        this.refrescarTabla();
      }
    })
  }
}

