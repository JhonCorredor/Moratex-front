import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { EmpleadosService } from 'src/app/parameters/empleados/empleados.service';
import { ClientesService } from 'src/app/parameters/clientes/clientes.service';
import { ClientesFormComponent } from 'src/app/parameters/clientes/clientes-form/clientes-form.component';
import { OrdenesPedidosService } from 'src/app/operative/ordenes-pedidos/ordenes-pedidos.service';
import { OrdenesPedidosFormComponent } from 'src/app/operative/ordenes-pedidos/ordenes-pedidos-form/ordenes-pedidos-form.component';
import { GeneralParameterService } from 'src/app/parameters/general-parameter/general-parameter.service';
import { PersonasService } from 'src/app/security/personas/personas.service';
import { FacturasService } from '../facturas.service';
import { FacturasDetallesService } from '../facturas-detalles.service';
import { ProductosService } from 'src/app/inventory/productos/productos.service';
import { InventarioDetalleService } from 'src/app/inventory/inventarios/inventario-detalle.service';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2'

@Component({
    selector: 'app-facturas-form',
    templateUrl: './facturas-form.component.html',
    styleUrls: ['./facturas-form.component.css']
})

export class FacturasFormComponent implements OnInit {
    public frmFacturas: FormGroup;
    public frmFacturasDetalles: FormGroup;
    public statusForm: boolean = true
    public statusFormDetalles: boolean = true
    public tablaVacia: boolean = true
    public id!: number;
    public botones = ['btn-guardar', 'btn-cancelar'];
    public botonesDetalles = ['btn-guardar'];
    public breadcrumb = [{ name: `Inicio`, icon: `fa-duotone fa-house` }, { name: "Operativo", icon: "fa-duotone fa-vest-patches" }, { name: "Orden de Pedido", icon: "fa-duotone fa-file-invoice" }, { name: "Crear" }];
    public titulo = "";
    public estadoProceso: any;
    public listEstados: any = [];
    public listClientes: any = [];
    public listEmpleados: any = [];
    public listEmpleadoAsignado: any = [];
    public listFacturaDetalles: any = [];
    public listProductos: any = [];
    public disableForm: boolean = false;
    public selectedItem: any;
    public serviceName: string = "";
    public activeNavItem: number = 1;

    constructor(public OrdenesPedidosService: OrdenesPedidosService, public routerActive: ActivatedRoute, private service: FacturasService, private empleadoService: EmpleadosService, private clienteService: ClientesService, private generalParameterService: GeneralParameterService, private personaService: PersonasService, private helperService: HelperService, private datePipe: DatePipe, private productoService: ProductosService, private router: Router, private FacturasDetallesService: FacturasDetallesService, private modalService: NgbModal, private routeActual: ActivatedRoute, private inventarioDetalleService: InventarioDetalleService) {
        this.router.events.subscribe((event: any) => {
            if (event instanceof NavigationEnd) {
                let url = event.url.split('/')[3];
                this.disableForm = (url == "ver") ? true : false
            }
        });
        this.routeActual.data.subscribe(l => {
            this.serviceName = l.ruta
        });
        this.frmFacturas = new FormGroup({
            Codigo: new FormControl(""),
            Fecha: new FormControl(null),
            Cliente_Id: new FormControl(null, [Validators.required]),
            Estado_Id: new FormControl(null, [Validators.required]),
            Empleado_Id: new FormControl(null, [Validators.required]),
            EmpleadoAsignado_Id: new FormControl(null, [Validators.required]),
            SubTotal: new FormControl(0, [Validators.required]),
            Total: new FormControl(0, [Validators.required]),
            SubTotalString: new FormControl("$ 0"),
        });

        this.frmFacturasDetalles = new FormGroup({
            Producto_Id: new FormControl(null, [Validators.required]),
            Cantidad: new FormControl("1", [Validators.required]),
            Valor: new FormControl(null, [Validators.required]),
        });

        this.routerActive.params.subscribe(l => this.id = l.id);
    }

    ngOnInit(): void {
        this.cargarListas();
        this.frmFacturas.controls.Fecha.setValue(new Date());
        if (this.disableForm) {
            this.titulo = "Ver Registro de Ordenes de Pedidos";
            this.botones = ['btn-cancelar'];
        } else {
            this.titulo = "Editar Ordenes de Pedidos";
        }
        if (this.id != undefined && this.id != null) {
            this.service.getFacturasById(this.id).subscribe(({ data }) => {
                const formattedDate = this.datePipe.transform(data.fecha, 'yyyy-MM-dd');
                this.frmFacturas.controls.Fecha.setValue(formattedDate);
                this.frmFacturas.controls.Codigo.setValue(data.codigo);
                this.frmFacturas.controls.Cliente_Id.setValue(data.cliente_Id);
                this.frmFacturas.controls.Estado_Id.setValue(data.estado_Id);
                this.frmFacturas.controls.Empleado_Id.setValue(data.empleado_Id);
                this.frmFacturas.controls.EmpleadoAsignado_Id.setValue(data.empleadoAsignado_Id);
                this.frmFacturas.controls.SubTotal.setValue(data.subTotal);
                this.frmFacturas.controls.Total.setValue(data.total);
                var subTotalString = `$ ${this.helperService.formaterNumber(data.subTotal)}`;
                this.frmFacturas.controls.SubTotalString.setValue(subTotalString);
            });
            this.CargarListaDetalles(this.id);
        } else {
            this.titulo = "Crear Ordenes de Pedidos";
        }

        this.LlenarTablaDetalle();
        this.calcularSubTotalDetalles();
    }

    cargarListas() {
        this.generalParameterService.getAll("Clientes").subscribe(r => {
            this.listClientes = r.data;
        })

        this.empleadoService.getAll("Empleados").subscribe(res => {
            this.listEmpleadoAsignado = res.data;
        });

        this.cargarProductosVenta();
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
            this.frmFacturas.controls.Empleado_Id.setValue(res.data[0].id);
            this.frmFacturas.controls.EmpleadoAsignado_Id.setValue(res.data[0].id);
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
            this.frmFacturas.controls.Estado_Id.setValue(res.data[0].id);
        })
    }

    cargarProductosVenta() {
        var data = new DatatableParameter();
        data.pageNumber = "1";
        data.pageSize = "10";
        data.filter = "";
        data.columnOrder = "";
        data.directionOrder = "";
        data.foreignKey = 1;

        this.productoService.datatable(data).subscribe(res => {
            var lstProductosVenta: any = [];
            res.data.forEach((dato: any) => {
                var producto = {
                    id: dato.id,
                    textoMostrar: dato.codigo + " - " + dato.nombre
                };
                lstProductosVenta.push(producto);
            })
            this.listProductos = lstProductosVenta;
        });
    }

    save() {
        this.ProgressAlert();
        if (this.frmFacturas.invalid) {
            this.statusForm = false
            this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
            return;
        }
        if (this.listFacturaDetalles.length == 0) {
            this.helperService.showMessage(MessageType.WARNING, "Faltan los detalles de la orden");
            return;
        }

        let data = {
            id: this.id ?? 0,
            ...this.frmFacturas.value
        };
        this.service.save(this.id, data).subscribe(l => {
            if (!l.status) {
                this.helperService.showMessage(MessageType.ERROR, Messages.SAVEERROR)
            } else {
                this.saveDetalles(l.data.id);
            }
        })
    }

    ProgressAlert() {
        this.helperService.showMessage(MessageType.PROGRESS, Messages.PROGRESS)
    }

    cancel() {
        localStorage.removeItem("lstFacturaDetalle");
        localStorage.removeItem("OrdenProduccionProducto");
        localStorage.removeItem("Producto");
        this.helperService.redirectApp('/operativo/facturas');
    }

    agregar() {
        if (this.frmFacturasDetalles.invalid) {
            this.statusFormDetalles = false
            this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
            return;
        }

        var jsonString = localStorage.getItem("lstFacturaDetalle");
        var lstFacturaDetalles;

        this.ProductoById(this.frmFacturasDetalles.controls.Producto_Id.value).then((producto) => {
            this.InventarioDetalleByProducto(producto.data.id).then((inventarioDetalle) => {
                var generarOrden = false;
                if(inventarioDetalle.data.cantidadTotal <= 0){
                    generarOrden = true;
                    Swal.fire({
                        title: 'El insumo no tiene cantidades en inventario, genere una orde de producción.',
                        showCancelButton: false,
                        confirmButtonText: 'Ok',
                    })
                } 
                var FacturaDetalle = {
                    "id": null,
                    "producto": producto.data.id,
                    "nombre": producto.data.nombre,
                    "cantidad": this.frmFacturasDetalles.controls.Cantidad.value,
                    "valor": this.frmFacturasDetalles.controls.Valor.value,
                    "subTotal": (parseInt(this.frmFacturasDetalles.controls.Valor.value) * parseInt(this.frmFacturasDetalles.controls.Cantidad.value)),
                    "cantidadTotal": inventarioDetalle.data.cantidadTotal,
                    "ordenProduccion": generarOrden,
                }

                if (jsonString) {
                    lstFacturaDetalles = JSON.parse(jsonString);

                    const detalleAgregar: any | undefined = lstFacturaDetalles.find((detalle: any) => detalle.producto === producto.data.id);
                    if (!detalleAgregar) {
                        lstFacturaDetalles.push(FacturaDetalle);
                    } else {
                        this.helperService.showMessage(MessageType.WARNING, "El producto ya fue agregado");
                    }
                } else {
                    lstFacturaDetalles = [];
                    lstFacturaDetalles.push(FacturaDetalle);
                }

                localStorage.setItem("lstFacturaDetalle", JSON.stringify(lstFacturaDetalles));
                this.LlenarTablaDetalle();
                this.calcularSubTotalDetalles();
            });
        });
    }

    saveDetalles(factura_Id: any) {
        var json = localStorage.getItem("lstFacturaDetalle");
        if (json) {
            var lstFacturaDetalles = JSON.parse(json);
            lstFacturaDetalles.forEach((dato: any) => {
                var FacturaDetalle = {
                    id: dato.id,
                    Cantidad: dato.cantidad,
                    Valor: dato.valor,
                    Producto_Id: dato.producto,
                    Factura_Id: factura_Id
                }
                if (FacturaDetalle.id == null) {
                    FacturaDetalle.id = 0;
                    this.FacturasDetallesService.save(null, FacturaDetalle).subscribe(l => {
                        if (!l.status) {
                            this.helperService.showMessage(MessageType.ERROR, Messages.SAVEERROR)
                        }
                    })
                } else {
                    this.FacturasDetallesService.save(FacturaDetalle.id, FacturaDetalle).subscribe(l => {
                        if (!l.status) {
                            this.helperService.showMessage(MessageType.ERROR, Messages.SAVEERROR)
                        }
                    })
                }
            });

            setTimeout(() => {
                this.saveOrdenesPedidos(factura_Id);
            }, 1000);
        }
    }

    saveOrdenesPedidos(factura_Id: any) {
        var jsonOrdenes = localStorage.getItem("OrdenProduccionProducto");
        if (jsonOrdenes) {
            var lstOrdenesProduccionProductos = JSON.parse(jsonOrdenes);
            lstOrdenesProduccionProductos.forEach((dato: any) => {
                var OrdenProduccionProducto = {
                    "producto_Id": dato.producto_Id,
                    "ordenProduccion_Id": dato.ordenProduccion_Id,
                    "factura_Id": factura_Id,
                }

                this.updateOrdenesPedidos(OrdenProduccionProducto);
            })
        }

        setTimeout(() => {
            localStorage.removeItem("lstFacturaDetalle");
            localStorage.removeItem("OrdenProduccionProducto");
            localStorage.removeItem("Producto");
            this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS);
            this.helperService.redirectApp(`operativo/facturas/editar/${factura_Id}`);
        }, 1000);
    }

    updateOrdenesPedidos(OrdenProduccionProducto: any) {

        var data = new DatatableParameter();
        data.pageNumber = "1";
        data.pageSize = "10";
        data.filter = "";
        data.columnOrder = "";
        data.directionOrder = "";
        data.foreignKey = Number(OrdenProduccionProducto.factura_Id);

        this.FacturasDetallesService.getAllFacturasDetalles(data).subscribe(res => {
            res.data.forEach((dato: any) => {
                if (dato.producto_Id == OrdenProduccionProducto.producto_Id) {
                    this.OrdenProduccionById(OrdenProduccionProducto.ordenProduccion_Id).then((orden) => {
                        orden.data.facturaDetalle_Id = dato.id;

                        this.OrdenesPedidosService.save(orden.data.id, orden.data).subscribe(l => {
                            if (!l.status) {
                                console.log(Messages.SAVEERROR);
                            }
                        })
                    });
                }
            })
        });


    }

    LlenarTablaDetalle() {
        var json = localStorage.getItem("lstFacturaDetalle");
        if (json) {
            var lstFacturaDetalles = JSON.parse(json);
            if (lstFacturaDetalles.length > 0) {
                this.tablaVacia = false;
                setTimeout(() => {
                    this.listFacturaDetalles = lstFacturaDetalles;
                    this.frmFacturasDetalles.reset();
                }, 100);
            }
        }
    }

    EliminarDetalle(producto: any) {
        const detalleAEliminar: any | undefined = this.listFacturaDetalles.find((detalle: any) => detalle.producto === producto);

        if (detalleAEliminar) {
            const index = this.listFacturaDetalles.indexOf(detalleAEliminar);
            this.listFacturaDetalles.splice(index, 1);

            // Actualiza localStorage con la nueva lista
            localStorage.setItem('lstFacturaDetalle', JSON.stringify(this.listFacturaDetalles));
        }
        this.calcularSubTotalDetalles();

        if (this.listFacturaDetalles.length == 0) {
            this.tablaVacia = true;
        }

        this.EliminarOrdenesProduccionProducto(producto);
    }

    EliminarOrdenesProduccionProducto(producto: any) {
        var jsonString = localStorage.getItem('OrdenProduccionProducto');
        if (jsonString) {
            var lstOrdenesProduccionProducto = JSON.parse(jsonString);

            const detalleAEliminar: any | undefined = lstOrdenesProduccionProducto.find((detalle: any) => detalle.producto_Id == producto);

            if (detalleAEliminar) {
                const index = lstOrdenesProduccionProducto.indexOf(detalleAEliminar);
                lstOrdenesProduccionProducto.splice(index, 1);

                // Actualiza localStorage con la nueva lista
                localStorage.setItem('OrdenProduccionProducto', JSON.stringify(lstOrdenesProduccionProducto));
            }
        }

    }

    calcularSubTotalDetalles() {
        var subtotal = 0;
        var json = localStorage.getItem("lstFacturaDetalle");
        if (json) {
            var lstFacturaDetalles = JSON.parse(json);
            lstFacturaDetalles.forEach((dato: any) => {
                subtotal += dato.subTotal;
            });

            setTimeout(() => {
                this.frmFacturas.controls.SubTotal.setValue(subtotal);
                this.frmFacturas.controls.Total.setValue(subtotal);
                var subTotalString = `$ ${this.helperService.formaterNumber(subtotal)}`;
                this.frmFacturas.controls.SubTotalString.setValue(subTotalString);
            }, 100);
        }
    }

    ProductoById(producto_Id: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.productoService.getById(producto_Id).subscribe(
                (datos) => {
                    resolve(datos);
                },
                (error) => {
                    reject(error);
                }
            );
        });
    }

    InventarioDetalleByProducto(producto_Id: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.inventarioDetalleService.getInventarioDetalleByProductoId(producto_Id).subscribe(
                (datos) => {
                    resolve(datos);
                },
                (error) => {
                    reject(error);
                }
            );
        });
    }

    OrdenProduccionById(ordenProduccion_Id: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.OrdenesPedidosService.getOrdenesPedidosById(ordenProduccion_Id).subscribe(
                (datos) => {
                    resolve(datos);
                },
                (error) => {
                    reject(error);
                }
            );
        });
    }

    ActualizarCantidad(dato: any) {
        var NuevaCantidad = $(`#Cantidad_${dato.producto}`).val();
        var NuevoValor = $(`#Valor_${dato.producto}`).val();

        if (NuevaCantidad !== undefined && NuevaCantidad !== "") {
            const detalleActualizar: any | undefined = this.listFacturaDetalles.find((detalle: any) => detalle.producto === dato.producto);
            if (detalleActualizar) {
                detalleActualizar.cantidad = parseInt(NuevaCantidad as string);
                detalleActualizar.subTotal = (parseInt(NuevoValor as string) * parseInt(NuevaCantidad as string));
                const index = this.listFacturaDetalles.indexOf(detalleActualizar);
                this.listFacturaDetalles.splice(index, 1);

                // Actualiza localStorage con la nueva lista
                this.listFacturaDetalles.push(detalleActualizar);
                localStorage.setItem('lstFacturaDetalle', JSON.stringify(this.listFacturaDetalles));
            }

            this.calcularSubTotalDetalles();
        }
    }

    ActualizarValor(dato: any) {
        var NuevaCantidad = $(`#Cantidad_${dato.producto}`).val();
        var NuevoValor = $(`#Valor_${dato.producto}`).val();
        if (NuevoValor !== undefined && NuevoValor !== "") {
            const detalleActualizar: any | undefined = this.listFacturaDetalles.find((detalle: any) => detalle.producto === dato.producto);
            if (detalleActualizar) {
                detalleActualizar.cantidad = parseInt(NuevaCantidad as string);
                detalleActualizar.valor = parseInt(NuevoValor as string);
                detalleActualizar.subTotal = (parseInt(NuevoValor as string) * parseInt(NuevaCantidad as string));
                const index = this.listFacturaDetalles.indexOf(detalleActualizar);
                this.listFacturaDetalles.splice(index, 1);

                // Actualiza localStorage con la nueva lista
                this.listFacturaDetalles.push(detalleActualizar);
                localStorage.setItem('lstFacturaDetalle', JSON.stringify(this.listFacturaDetalles));
            }

            this.calcularSubTotalDetalles();
        }
    }

    CargarListaDetalles(factura_Id: any) {
        var data = new DatatableParameter();
        data.pageNumber = "1";
        data.pageSize = "10";
        data.filter = "";
        data.columnOrder = "";
        data.directionOrder = "";
        data.foreignKey = Number(factura_Id);

        var lstFacturaDetalles: any = [];
        this.FacturasDetallesService.getAllFacturasDetalles(data).subscribe(res => {
            res.data.forEach((dato: any) => {
                this.ProductoById(dato.producto_Id).then((producto) => {

                    var FacturaDetalle = {
                        "id": dato.id,
                        "producto": producto.data.id,
                        "nombre": producto.data.nombre,
                        "cantidad": dato.cantidad,
                        "valor": dato.valor,
                        "subTotal": (parseInt(dato.valor) * parseInt(dato.cantidad)),
                    }

                    lstFacturaDetalles.push(FacturaDetalle);

                    localStorage.setItem("lstFacturaDetalle", JSON.stringify(lstFacturaDetalles));
                    this.LlenarTablaDetalle();
                    this.calcularSubTotalDetalles();
                });
            })
        });
    }

    onSelect(event: any) {
        this.ProductoById(this.selectedItem).then((producto) => {
            this.frmFacturasDetalles.controls.Valor.setValue(producto.data.precioVenta);
        });
    }

    nuevoCliente() {
        let modal = this.modalService.open(ClientesFormComponent, { size: 'lg', keyboard: false, backdrop: "static" });
        modal.componentInstance.titleData = "Crear Cliente";
        modal.componentInstance.serviceName = this.serviceName;
    }

    generarOrdenProduccion(producto_Id: any) {
        Swal.fire({
            title: '¿Desea generar la orden de producción con este producto?',
            showCancelButton: true,
            confirmButtonText: 'Si',
        }).then((result) => {
            if (result.isConfirmed) {
                var jsonString = localStorage.getItem("OrdenProduccionProducto");
                var lstOrdenProduccionProducto;

                var OrdenProduccionProducto = {
                    "producto_Id": producto_Id,
                    "ordenProduccion_Id": null
                }

                if (jsonString) {
                    lstOrdenProduccionProducto = JSON.parse(jsonString);
                    lstOrdenProduccionProducto.push(OrdenProduccionProducto);
                } else {
                    lstOrdenProduccionProducto = [];
                    lstOrdenProduccionProducto.push(OrdenProduccionProducto);
                }

                localStorage.setItem("OrdenProduccionProducto", JSON.stringify(lstOrdenProduccionProducto));
                localStorage.setItem("Producto", producto_Id);

                let modal = this.modalService.open(OrdenesPedidosFormComponent, { size: 'xl', keyboard: false, backdrop: "static" });
                modal.componentInstance.titleData = "Crear Orden de Producción";
                modal.componentInstance.serviceName = this.serviceName;
            }
        })
    }
}