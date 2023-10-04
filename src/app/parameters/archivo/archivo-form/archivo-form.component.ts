import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder,  FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { LANGUAGE_DATATABLE } from 'src/app/admin/datatable.language';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { BotonesComponent } from 'src/app/general/botones/botones.component';
import { ArchivosViewComponent } from '../archivo-view/archivo-view.component';
import { ArchivoService } from '../archivo.service';

@Component({
  selector: 'app-archivo-form',
  templateUrl: './archivo-form.component.html',
  styleUrls: ['./archivo-form.component.css']
})
export class ArchivoFormComponent implements OnInit {
  @ViewChild('botonesDatatable') botonesDatatable!: BotonesComponent;
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  public dtTrigger: Subject<any> = new Subject();
  public opcionesDataTable: any = {};
  // public arrayBotonesDatatable: String[] = ['btn-descargar', 'btn-eliminar' , "btn-ver-imagen" ];
  public arrayBotonesDatatable: String[] = ['btn-descargar', 'btn-eliminar' ];
  public frmArchivo! : FormGroup;
  public statusForm : boolean = true
  public botones = ['btn-guardar'];
  public botonesVer = ['btn-cancelar'];
  public titulo = "";
  public Archivo: any[] = [];
  public extensionArchive : string = "";

  @Input() multiple :  boolean = true
  @Input() ver : boolean = false;
  @Input() Tabla : string = ""
  @Input() TablaId : number = 0

  constructor(public routerActive: ActivatedRoute,
    private service: ArchivoService , private helperService: HelperService,
     private fb: FormBuilder  , private modalService: NgbModal  )
  { }

  ngOnInit(): void {
    this.cargarDatatable()
    this.BuildForm();
    this.titulo = this.ver ? "Ver Archivo" :  "Crear Archivo" ;
  }

  BuildForm(): void {
    this.frmArchivo = this.fb.group({
      Archivo: [null, [Validators.required]],
      Estado : [true, [Validators.required]]
    });
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
          data.nameForeignKey = this.Tabla ;
          data.foreignKey = this.TablaId
          this.service.getAllArchivo(data).subscribe((res : any) => {
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
              title: 'Archivo',
              data: 'nombre',
              render : (item : any) => {
                  this.extensionArchive = item.split('.').pop()
                  return item
                },
              className:"justify-content"
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
              data: "id",
              render: function(id : any, type : any, row : any) {
                const boton = that.botonesDatatable;
                return boton.botonesDropdown.nativeElement.outerHTML.split('$id').join(id) ;
              },
              className: "pl-1 pr-0 text-center",
              responsivePriority: 7
            }
        ],
        drawCallback: (settings : any) => {
          $('.btn-dropdown-descargar').off().on('click', (event : any) => {
            this.service.getArchivoById(event.target.dataset.id).subscribe(l =>  {

            this.helperService.viewImage(l.data.extension , () => {
            let modal = this.modalService.open(ArchivosViewComponent, {size: 'xl'});
            modal.componentInstance.id = event.target.dataset.id;
            modal.result.then(res => {
              if (res) {
                this.download(l)
              }
            })
            },() => {
                this.download(l)
              })
            })

          }),
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
          })
        }
    };
  }

  download(l : any){
    const linkSource = `${l.data.archivo}`;
    const downloadLink = document.createElement("a");
    const fileName = `${l.data.nombre}`;
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click()
  }


  public fileEvent(event: any) {
    let archivosTotal : any = (event.target.files).length;
    this.Archivo = [];
    for (let i = 0; i < archivosTotal; i++) {
      let archivo : any
      let data : any
      let type = event.target.files[i].type.split('/')[1];
      let { name } =  event.target.files[i] ;

      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[i]);
      reader.onload = async  (e: any) => {
        archivo = await e.target.result; //imagen en base 64
        data = {
          Tabla : this.Tabla,
          TablaId : this.TablaId,
          Extension : type,
          Archivo : archivo,
          Nombre : name,
          Estado : this.frmArchivo.controls.Estado.value
        }
        this.Archivo.push(data);
      };
    }
  }

  save() {
    if (this.frmArchivo.invalid) {
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }
    this.Archivo.forEach(data => {
      this.service.save( data).subscribe(l => {
        if (l.status == "Error") {
          this.helperService.showMessage(MessageType.ERROR, Messages.SAVEERROR)
        } else {
          this.refrescarTabla()
          this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS)
        }
      })
    })
    // this.modalActive.close();

  }
  
  // cancel() {
  //   // this.modalActive.close();
  // }
}
