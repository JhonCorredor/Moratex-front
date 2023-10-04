import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { LANGUAGE_DATATABLE } from 'src/app/admin/datatable.language';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { BotonesComponent } from 'src/app/general/botones/botones.component';
import { GeneralTallajeFormComponent } from '../general-tallaje-form/general-tallaje-form.component';
import { GeneralTallajeService } from '../general-tallaje.service';

@Component({
  selector: 'app-general-tallaje-index',
  templateUrl: './general-tallaje-index.component.html',
  styleUrls: ['./general-tallaje-index.component.css']
})
export class GeneralTallajeIndexComponent implements OnInit {

  @ViewChild('botonesDatatable') botonesDatatable!: BotonesComponent;
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  public dtTrigger: Subject<any> = new Subject();
  public opcionesDataTable: any = {};

  public frmGeneral!: FormGroup;
  public statusForm : boolean = true
  public lista : any[] = [];
  public API_URL : any;
  public title = "";
  public breadcrumb: any[] = [];
  public botones: String[] = ['btn-guardar'];
  public arrayBotonesDatatable: String[] = ['btn-modificar', 'btn-eliminar'];
  public id! : number;

  @Input() ruta : string = "";
  @Input() titulo = "";
  
  @Input() foreignKeyRuta : string = "";
  @Input() foreignKeyTitle: string = "";
  @Input() serviceKey:string = "";

  @Input() modeloId: any = null;

  constructor(private service: GeneralTallajeService, 
    private helperService: HelperService, 
    private route: Router, private modalService: NgbModal,
     ) { 
      this.frmGeneral = new FormGroup({
        // generaldiadId: new FormControl(null , Validators.required),
        ForaneaId : new FormControl(null, Validators.required),
        Estado: new FormControl(true, Validators.required)
      });
  }
  
  ngOnInit(): void {
    this.title = `Listado ${this.titulo}`;
    this.breadcrumb = [{name: `Inicio` , icon: `fa-solid fa-house`},   {name: "Parametros" , icon: "fas fa-cogs"}, {name: this.titulo}];
    this.cargarDatatable();
    this.cargarListaForeingKey()
  }


  ngAfterViewInit() {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  cargarListaForeingKey() {
    this.service.getAll(this.serviceKey).subscribe(r => {
      this.lista = r.data;
    })
  }

  refrescarTabla() {
    if(typeof this.dtElement.dtInstance != 'undefined'){
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.ajax.reload()
      });
    }
  }
  save() {
    if (this.frmGeneral.invalid) {
      this.statusForm  = false
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }
    let data  = {
      id: this.id ?? 0,
      [this.foreignKeyTitle +"Id"]: this.frmGeneral.controls.ForaneaId.value,
      GeneralidadId: Number(this.modeloId),
      ...this.frmGeneral.value
    };
    this.service.save(this.ruta, this.id, data).subscribe((l : any) => {
      if (!l.status) {
        // this.modalActive.close();
        this.helperService.showMessage(MessageType.ERROR, Messages.SAVEERROR)
      } else {
        this.refrescarTabla()
        this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS)
      }
    })
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
          data.foreignKey = this.modeloId;

          this.service.datatable(this.ruta, data).subscribe((res: any) => {
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
              title:  `${this.foreignKeyRuta}`,
              data: `${this.foreignKeyTitle}`,
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
                // return id
              },
              className: "pl-1 pr-0 text-center",
              responsivePriority: 7
            }
        ],
        drawCallback: (settings : any) => {
          $('.btn-dropdown-modificar').off().on('click', (event : any) => {
            this.service.getById(this.ruta,event.target.dataset.id).subscribe(res => {
              this.id = res.data.id;
              this.frmGeneral.controls.Estado.setValue(res.data.estado);
              this.frmGeneral.controls.ForaneaId.setValue(res.data[this.foreignKeyTitle+"Id"]);
            })
          });
          $('.btn-dropdown-eliminar').off().on('click', (event : any) => {
            this.helperService.confirmDelete(() => {
              this.service.delete(this.ruta, event.target.dataset.id).subscribe((l: any) => {
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


}
