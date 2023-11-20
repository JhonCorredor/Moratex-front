import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { CierresService } from '../cierres.service';
import { EmpleadosService } from '../../../parameters/empleados/empleados.service';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-cierres-form',
    templateUrl: './cierres-form.component.html',
    styleUrls: ['./cierres-form.component.css'],
})

export class CierresFormComponent implements OnInit {
    public frmCierres: FormGroup;
    public statusForm: boolean = true;
    public id!: number;
    public botones = ['btn-guardar', 'btn-cancelar'];
    public breadcrumb = [{ name: `Inicio`, icon: `fa-duotone fa-house` }, { name: "Operativo", icon: "fa-duotone fa-vest-patches" }, { name: "Cierres", icon: "fa-duotone fa-shop-lock" }, { name: "Crear" }];

    public titulo = '';
    public listEmpleados: any = [];

    constructor(
        public routerActive: ActivatedRoute,
        private service: CierresService,
        private empleadoService: EmpleadosService,
        private helperService: HelperService,
        private datePipe: DatePipe
    ) {
        this.frmCierres = new FormGroup({
            FechaCreacion: new FormControl(null),
            FechaInicial: new FormControl(null, Validators.required),
            FechaFinal: new FormControl(null, Validators.required),
            Base: new FormControl(null, Validators.required),
            SaldoEmpleado: new FormControl(null, Validators.required),
            Observacion: new FormControl(""),
            Empleado_Id: new FormControl(null, Validators.required),
        });
        this.routerActive.params.subscribe((l) => (this.id = l.id));
    }

    ngOnInit(): void {
        this.cargarListas();
        const formattedFecha = this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss', 'America/Bogota');
        this.frmCierres.controls.FechaCreacion.setValue(formattedFecha);
        if (this.id != undefined && this.id != null) {
            this.titulo = 'Editar Cierre';
            this.service.getById(this.id).subscribe((l) => {
                const formattedFechaCreacion = this.datePipe.transform(l.data.fechaCreacion, 'yyyy-MM-ddTHH:mm:ss', 'America/Bogota');
                const formattedFechaInicial = this.datePipe.transform(l.data.fechaInicial, 'yyyy-MM-ddTHH:mm:ss', 'America/Bogota');
                const formattedFechaFinal = this.datePipe.transform(l.data.fechaFinal, 'yyyy-MM-ddTHH:mm:ss', 'America/Bogota');

                this.frmCierres.controls.FechaCreacion.setValue(formattedFechaCreacion);
                this.frmCierres.controls.FechaInicial.setValue(formattedFechaInicial);
                this.frmCierres.controls.FechaFinal.setValue(formattedFechaFinal);
                this.frmCierres.controls.Base.setValue(l.data.base);
                this.frmCierres.controls.SaldoEmpleado.setValue(l.data.saldoEmpleado);
                this.frmCierres.controls.Observacion.setValue(l.data.observacion);
                this.frmCierres.controls.Empleado_Id.setValue(l.data.empleado_Id);
            });
        } else {
            this.titulo = 'Crear Cierre';
        }
    }

    save() {
        this.ProgressAlert();
        if (this.frmCierres.invalid) {
            this.statusForm = false
            this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
            return;
        }
        let data = {
            id: this.id ?? 0,
            ...this.frmCierres.value
        };
        this.service.save(this.id, data).subscribe(l => {
            if (!l.status) {
                this.helperService.showMessage(MessageType.ERROR, Messages.SAVEERROR)
            } else {
                this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS)
                this.ImprimirCierre(l.data.id);
            }
        })
    }

    ImprimirCierre(id: any) {
        this.service.GetArchivoCierre(id).subscribe(({ data }) => {
            this.openPdfInNewTab(data.archivo);
        })
    }

    ProgressAlert() {
        this.helperService.showMessage(MessageType.PROGRESS, Messages.PROGRESS)
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
            newWindow.document.title = 'Cierre';
            newWindow.print();
        }

        setTimeout(() => {
            this.helperService.redirectApp(`operativo/cierres`);
        }, 500);
    }

    cargarListas() {
        this.cargarEmpleado();
    };

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
            this.frmCierres.controls.Empleado_Id.setValue(res.data[0].id);
        });
    }

    cancel() {
        this.helperService.redirectApp('operativo/cierres');
    }
}
