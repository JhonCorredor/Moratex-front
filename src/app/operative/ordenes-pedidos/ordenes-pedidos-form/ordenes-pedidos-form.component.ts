import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { EmpleadosService } from 'src/app/parameters/empleados/empleados.service';
import { ClientesService } from 'src/app/parameters/clientes/clientes.service';
import { GeneralParameterService } from 'src/app/parameters/general-parameter/general-parameter.service';
import { GeneralKeyParameterService } from 'src/app/parameters/general-key-parameter/general-key-parameter.service';
import { PersonasService } from 'src/app/security/personas/personas.service';
import { OrdenesPedidosService } from '../ordenes-pedidos.service';
import { ArchivoService } from 'src/app/parameters/archivo/archivo.service';
import { ProcedimientosService } from 'src/app/operative/Procedimientos/procedimientos.service';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-ordenes-pedidos-form',
    templateUrl: './ordenes-pedidos-form.component.html',
    styleUrls: ['./ordenes-pedidos-form.component.css']
})

export class OrdenesPedidosFormComponent implements OnInit {
    public frmOrdenesPedidos: FormGroup;
    public statusForm: boolean = true;
    public bordado: boolean = false;
    public id!: number;
    public botones = ['btn-guardar', 'btn-cancelar'];
    public breadcrumb = [{ name: `Inicio`, icon: `fa-duotone fa-house` }, { name: "Operativo", icon: "fa-duotone fa-vest-patches" }, { name: "Ordenes de producción", icon: "fa-duotone fa-file-invoice" }, { name: "Crear" }];
    public titulo = "";
    public estadoProceso: any;
    public listEstados: any = [];
    public listProcedimientos: any = [];
    public listClientes: any = [];
    public listEmpleados: any = [];
    public listEmpleadoAsignado: any = [];
    public listTalleres: any = [];
    public listUbicaciones = [
        {
            "Nombre": "Superior Derecha",
        },
        {
            "Nombre": "Superior Izquierda",
        },
        {
            "Nombre": "Frontal Medio",
        },
        {
            "Nombre": "Posterior Medio",
        },
        {
            "Nombre": "Manga Derecha",
        },
        {
            "Nombre": "Manga Izquierda",
        },
    ];

    public listColors = [
        {
            "Nombre": "Rojo",
        },
        {
            "Nombre": "Amarillo",
        },
        {
            "Nombre": "Azul",
        },
        {
            "Nombre": "Naraja",
        },
        {
            "Nombre": "Verde",
        },
        {
            "Nombre": "Morado",
        },
    ];
    public selectedItem: any;
    public dataArchivo: any = undefined;
    public disableForm: boolean = false;
    public serviceName: string = "";

    constructor(private modalService: NgbModal, public routerActive: ActivatedRoute, private service: OrdenesPedidosService, private empleadoService: EmpleadosService, private clienteService: ClientesService, private generalParameterService: GeneralParameterService, private ArchivoService: ArchivoService, private personaService: PersonasService, private helperService: HelperService, private datePipe: DatePipe, private procedimientoService: ProcedimientosService, private generalKeyParameterService: GeneralKeyParameterService, private router: Router) {
        this.router.events.subscribe((event: any) => {
            if (event instanceof NavigationEnd) {
                let url = event.url.split('/')[3];
                this.disableForm = (url == "ver") ? true : false
            }
        });
        this.frmOrdenesPedidos = new FormGroup({
            Codigo: new FormControl(""),
            DocumentoCliente: new FormControl(null),
            DocumentoEmpleado: new FormControl(null),
            NombresCliente: new FormControl(null),
            NombresEmpleado: new FormControl(null),
            ApellidosCliente: new FormControl(null),
            ApellidosEmpleado: new FormControl(null),
            Fecha: new FormControl(null),
            FechaEntrega: new FormControl(null, Validators.required),
            Cantidad: new FormControl(null, Validators.required),
            Ubicacion: new FormControl(""),
            Tamaño: new FormControl(""),
            Colores: new FormControl(""),
            TraePrenda: new FormControl(true, [Validators.required]),
            Observacion: new FormControl(null),
            Cliente_Id: new FormControl(null, [Validators.required]),
            Estado_Id: new FormControl(null, [Validators.required]),
            Empleado_Id: new FormControl(null, [Validators.required]),
            EmpleadoAsignado_Id: new FormControl(null, [Validators.required]),
            Procedimiento_Id: new FormControl(null, [Validators.required]),
            SubTotal: new FormControl(null, [Validators.required]),
            SubTotalString: new FormControl("$ 0"),
            Taller_Id: new FormControl(null, [Validators.required]),
            ArchivoOrdenPedido_Id: new FormControl(null),
        });
        this.routerActive.params.subscribe(l => this.id = l.id);
    }

    ngOnInit(): void {
        this.cargarListas();
        this.frmOrdenesPedidos.controls.Fecha.setValue(new Date());
        if (this.disableForm) {
            this.titulo = "Ver Registro de Ordenes de Producción";
            this.botones = ['btn-cancelar'];
            this.breadcrumb = [{ name: `Inicio`, icon: `fa-duotone fa-house` }, { name: "Operativo", icon: "fa-duotone fa-vest-patches" }, { name: "Ordenes de producción", icon: "fa-duotone fa-file-invoice" }, { name: "Ver" }];
        } else {
            this.titulo = "Editar Ordenes de Producción";
        }
        if (this.id != undefined && this.id != null) {
            this.service.getOrdenesPedidosById(this.id).subscribe(({ data }) => {
                const formattedDate = this.datePipe.transform(data.fechaEntrega, 'yyyy-MM-dd');
                this.frmOrdenesPedidos.controls.Fecha.setValue(data.fecha);
                this.frmOrdenesPedidos.controls.FechaEntrega.setValue(formattedDate);
                this.frmOrdenesPedidos.controls.Codigo.setValue(data.codigo);
                this.frmOrdenesPedidos.controls.Cantidad.setValue(data.cantidad);
                this.frmOrdenesPedidos.controls.Ubicacion.setValue(data.ubicacion);
                this.frmOrdenesPedidos.controls.Tamaño.setValue(data.tamaño);
                this.frmOrdenesPedidos.controls.Colores.setValue(data.colores);
                this.frmOrdenesPedidos.controls.TraePrenda.setValue(data.traePrenda);
                this.frmOrdenesPedidos.controls.Observacion.setValue(data.observacion);
                this.frmOrdenesPedidos.controls.Cliente_Id.setValue(data.cliente_Id);
                this.frmOrdenesPedidos.controls.Estado_Id.setValue(data.estado_Id);
                this.frmOrdenesPedidos.controls.Empleado_Id.setValue(data.empleado_Id);
                this.frmOrdenesPedidos.controls.EmpleadoAsignado_Id.setValue(data.empleadoAsignado_Id);
                this.frmOrdenesPedidos.controls.Procedimiento_Id.setValue(data.procedimiento_Id);
                this.frmOrdenesPedidos.controls.SubTotal.setValue(data.subTotal);
                this.frmOrdenesPedidos.controls.Taller_Id.setValue(data.taller_Id);
                var subTotalString = `$ ${this.helperService.formaterNumber(data.subTotal)}`;
                this.frmOrdenesPedidos.controls.SubTotalString.setValue(subTotalString);

                this.empleadoService.getEmpleadosById(data.empleado_Id).subscribe(resEmpleado => {
                    resEmpleado
                    if (resEmpleado.status && resEmpleado.status == true) { // se deja validado == true porque en caso de no encontrarn un registro el backend devuelve un status 404
                        this.frmOrdenesPedidos.controls.PersonaEmpleado.setValue(`${resEmpleado.data.persona_Id}`);
                    }
                })
                this.clienteService.getClientesById(data.cliente_Id).subscribe(resCliente => {
                    resCliente
                    if (resCliente.status && resCliente.status == true) { // se deja validado == true porque en caso de no encontrarn un registro el backend devuelve un status 404
                        this.frmOrdenesPedidos.controls.PersonaCliente.setValue(`${resCliente.data.persona_Id}`);
                    }
                })
                this.generalParameterService.getById("Estados", data.estado_Id).subscribe(resEstado => {
                    resEstado
                    if (resEstado.status && resEstado.status == true) { // se deja validado == true porque en caso de no encontrarn un registro el backend devuelve un status 404
                        this.frmOrdenesPedidos.controls.Estado.setValue(`${resEstado.data.nombre}`);
                    }
                })

                this.personaService.getById(this.frmOrdenesPedidos.controls.PersonaEmpleado).subscribe(resPersona => {
                    resPersona
                    if (resPersona.status && resPersona.status == true) { // se deja validado == true porque en caso de no encontrarn un registro el backend devuelve un status 404
                        this.frmOrdenesPedidos.controls.DocumentoCliente.setValue(`${resPersona.data.documento}`);
                        this.frmOrdenesPedidos.controls.NombresCliente.setValue(`${resPersona.data.primerNombre} ${resPersona.data.segundoNombre}`);
                        this.frmOrdenesPedidos.controls.ApellidosCliente.setValue(`${resPersona.data.primerApellido} ${resPersona.data.segundoApellido}`);
                    }
                })

                this.personaService.getById(this.frmOrdenesPedidos.controls.PersonaCliente).subscribe(resPersona => {
                    resPersona
                    if (resPersona.status && resPersona.status == true) { // se deja validado == true porque en caso de no encontrarn un registro el backend devuelve un status 404
                        this.frmOrdenesPedidos.controls.DocumentoEmpleado.setValue(`${resPersona.data.documento}`);
                        this.frmOrdenesPedidos.controls.NombresEmpleado.setValue(`${resPersona.data.primerNombre} ${resPersona.data.segundoNombre}`);
                        this.frmOrdenesPedidos.controls.ApellidosEmpleado.setValue(`${resPersona.data.primerApellido} ${resPersona.data.segundoApellido}`);
                    }
                })

                if (data.archivoOrdenPedido_Id && data.archivoOrdenPedido_Id > 0) {
                    this.ArchivoService.getArchivoById(data.archivoOrdenPedido_Id).subscribe((res) => {
                        this.frmOrdenesPedidos.controls.ArchivoOrdenPedido_Id.setValue(res.data.id);
                    })
                }
            })
        } else {
            this.titulo = "Crear Ordenes de Producción";
        }
    }

    cargarListas() {
        this.generalParameterService.getAll("Procedimientos").subscribe(r => {
            this.listProcedimientos = r.data;
        })

        this.generalKeyParameterService.getAll("Talleres").subscribe(r => {
            this.listTalleres = r.data;
            this.frmOrdenesPedidos.controls.Taller_Id.setValue(r.data[0].id);
        })

        this.empleadoService.getAll("Empleados").subscribe(res => {
            this.listEmpleadoAsignado = res.data;
        });

        this.cargarCliente();
        this.cargarEmpleado();
        this.cargarEstados();
    }

    cargarEmpleado() {
        var persona_Id = localStorage.getItem("persona_Id");

        var data = new DatatableParameter();
        data.pageNumber = "1";
        data.pageSize = "10";
        data.filter = "";
        data.columnOrder = "";
        data.directionOrder = "";
        data.foreignKey = Number(persona_Id);

        this.empleadoService.getAllEmpleados(data).subscribe(res => {
            this.listEmpleados = [
                {
                    id: res.data[0].id,
                    textoMostrar: res.data[0].codigo + " - " + res.data[0].persona
                }
            ];
            this.frmOrdenesPedidos.controls.Empleado_Id.setValue(res.data[0].id);
        });
    }

    cargarEstados() {
        var data = new DatatableParameter();
        data.pageNumber = "1";
        data.pageSize = "10";
        data.filter = "En Proceso";
        data.columnOrder = "";
        data.directionOrder = "";
        this.generalParameterService.datatable("Estados", data).subscribe(res => {
            this.listEstados = [
                {
                    id: res.data[0].id,
                    textoMostrar: res.data[0].codigo + " - " + res.data[0].nombre
                }
            ];
            this.frmOrdenesPedidos.controls.Estado_Id.setValue(res.data[0].id);

        })
    }

    cargarCliente() {
        var data = new DatatableParameter();
        data.pageNumber = "1";
        data.pageSize = "10";
        data.filter = "C-2023-0001";
        data.columnOrder = "";
        data.directionOrder = "";
        this.generalParameterService.datatable("Clientes", data).subscribe(res => {
            this.PersonaById(res.data[0].persona_Id).then((persona) => {
                this.listClientes = [
                    {
                        id: res.data[0].id,
                        textoMostrar: res.data[0].codigo + " - " + persona.data.primerNombre + " " + persona.data.segundoNombre + " " + persona.data.primerApellido + " " + persona.data.segundoApellido
                    }
                ];
            });
            this.frmOrdenesPedidos.controls.Cliente_Id.setValue(res.data[0].id);
        })
    }

    ProcedimientoById(procedimiento_Id: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.procedimientoService.getById(procedimiento_Id).subscribe(
                (datos) => {
                    resolve(datos);
                },
                (error) => {
                    reject(error);
                }
            );
        });
    }

    PersonaById(persona_Id: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.personaService.getById(persona_Id).subscribe(
                (datos) => {
                    resolve(datos);
                },
                (error) => {
                    reject(error);
                }
            );
        });
    }

    // calcularSubTotal() {
    //     let data = this.frmOrdenesPedidos.value;
    //     var ProcedimientoValor;
    //     var subtotal = 0;

    //     this.ProcedimientoById(data.Procedimiento_Id)
    //         .then((procedimiento) => {
    //             ProcedimientoValor = procedimiento.data.valor;

    //             if (ProcedimientoValor !== null) {
    //                 subtotal = parseInt(ProcedimientoValor) * parseInt(data.Cantidad);
    //             }

    //             var subTotalString = `$ 0`;

    //             if (!isNaN(subtotal)) {
    //                 subTotalString = `$ ${this.helperService.formaterNumber(subtotal)}`;
    //             }

    //             this.frmOrdenesPedidos.controls.SubTotal.setValue(subtotal);
    //             this.frmOrdenesPedidos.controls.SubTotalString.setValue(subTotalString);
    //         })
    //         .catch((error) => {
    //             console.error('Error al obtener el procedimiento:', error);
    //         });
    // }

    save() {
        if (this.frmOrdenesPedidos.invalid) {
            this.statusForm = false
            this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
            return;
        }

        if(this.frmOrdenesPedidos.controls.Ubicacion.value != '') {
            this.frmOrdenesPedidos.controls.Ubicacion.setValue(this.frmOrdenesPedidos.controls.Ubicacion.value.join(', '));
        }

        if(this.frmOrdenesPedidos.controls.Colores.value != ''){
            this.frmOrdenesPedidos.controls.Colores.setValue(this.frmOrdenesPedidos.controls.Colores.value.join(', '));
        }

        if (this.id != undefined && this.id != null) {
            if (this.dataArchivo != undefined) {
                if (this.frmOrdenesPedidos.controls.ArchivoOrdenPedido_Id.value) {
                    this.ArchivoService.delete(this.frmOrdenesPedidos.controls.ArchivoOrdenPedido_Id.value).subscribe(() => { })
                }
                this.ArchivoService.save(this.dataArchivo).subscribe(l => {
                    if (l.status != "Error") {
                        this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS);
                        this.frmOrdenesPedidos.controls.ArchivoOrdenPedido_Id.setValue(l.data.id);
                        this.guardarOrdenesPedidos();
                    } else {
                        this.helperService.showMessage(MessageType.ERROR, Messages.SAVEERROR);
                    }
                })
            } else {
                this.guardarOrdenesPedidos();
            }
        } else {
            if (this.dataArchivo != undefined) {
                this.ArchivoService.save(this.dataArchivo).subscribe(l => {
                    if (l.status != "Error") {
                        this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS);
                        this.frmOrdenesPedidos.controls.ArchivoOrdenPedido_Id.setValue(l.data.id);
                        this.guardarOrdenesPedidos();
                    } else {
                        this.helperService.showMessage(MessageType.ERROR, Messages.SAVEERROR);
                    }
                })
            } else {
                this.guardarOrdenesPedidos();
            }

        }
    }

    guardarOrdenesPedidos() {
        let data = {
            id: this.id ?? 0,
            ...this.frmOrdenesPedidos.value
        };

        this.service.save(this.id, data).subscribe(l => {
            if (!l.status) {
                this.helperService.showMessage(MessageType.ERROR, Messages.SAVEERROR)
            } else {
                this.guardarOrdenesPedidosFacturasDetalles(l.data.id);
                this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS)
                if (this.router.url.toString() != '/operativo/ordenesPedidos/crear') {
                    this.modalService.dismissAll();
                } else {
                    this.helperService.redirectApp('/operativo/ordenesPedidos');
                }
            }
        })
    }

    cancel() {
        var ruta: string[] = this.router.url.toString().split('/');
        if (ruta[2] != 'ordenesPedidos') {
            localStorage.removeItem("OrdenProduccionProducto");
            localStorage.removeItem("Producto");
            this.modalService.dismissAll();
        } else {
            this.helperService.redirectApp('/operativo/ordenesPedidos');
        }
    }

    fileEvent(event: any) {
        let archivo: any
        let type = event.target.files[0].type.split('/')[1];
        let { name } = event.target.files[0];
        if (type == "png" || type == "jpeg" || type == "jpg") {
            var reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = async (e: any) => {
                archivo = await e.target.result; //imagen en base 64
                this.dataArchivo = {
                    Tabla: "Ordenes",
                    TablaId: 1,
                    Extension: type,
                    Archivo: archivo,
                    Nombre: name,
                    Estado: true
                }
            };
        }
    }

    onSelectProcedimiento(event: any) {
        if (this.selectedItem != null) {
            this.ProcedimientoById(this.selectedItem).then((procedimiento) => {
                if (procedimiento.data.nombre == "Bordado") {
                    this.bordado = true;
                } else {
                    this.bordado = false;
                }
            });
        } else {
            this.bordado = false;
        }
    }

    guardarOrdenesPedidosFacturasDetalles(ordenPedido_Id:any){
        var producto = localStorage.getItem("Producto");
        var jsonString = localStorage.getItem("OrdenProduccionProducto");
        var lstOrdenProduccionProducto;

        if(jsonString){
            lstOrdenProduccionProducto = JSON.parse(jsonString);
            const detalleActualizar: any | undefined = lstOrdenProduccionProducto.find((detalle: any) => detalle.producto_Id == producto);
            if (detalleActualizar) {
                detalleActualizar.ordenProduccion_Id = ordenPedido_Id;                
                const index = lstOrdenProduccionProducto.indexOf(detalleActualizar);
                lstOrdenProduccionProducto.splice(index, 1);

                // Actualiza localStorage con la nueva lista
                lstOrdenProduccionProducto.push(detalleActualizar);
                localStorage.setItem('OrdenProduccionProducto', JSON.stringify(lstOrdenProduccionProducto));
            }
        }
    }
}