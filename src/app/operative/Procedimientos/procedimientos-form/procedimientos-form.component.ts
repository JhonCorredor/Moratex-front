import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  HelperService,
  Messages,
  MessageType,
} from 'src/app/admin/helper.service';
import { ProcedimientosService } from '../procedimientos.service';

@Component({
  selector: 'app-procedimientos-form',
  templateUrl: './procedimientos-form.component.html',
  styleUrls: ['./procedimientos-form.component.css'],
})
export class ProcedimientosFormComponent implements OnInit {
  public frmProcedimientos: FormGroup;
  public statusForm: boolean = true;
  public id!: number;
  public botones = ['btn-guardar', 'btn-cancelar'];
  public titulo = '';
  public breadcrumb = [
    { name: `Inicio`, icon: `fa-solid fa-house` },
    { name: `Inicio`, icon: `fa-solid fa-house` },
    { name: 'Procedimientos' },
    { name: 'Crear' },
  ];

  constructor(
    public routerActive: ActivatedRoute,
    private service: ProcedimientosService,
    private helperService: HelperService
  ) {
    this.routerActive.params.subscribe((e) => (this.id = e.id));

    this.frmProcedimientos = new FormGroup({
      Codigo: new FormControl(null, [
        Validators.required,
        Validators.maxLength(20),
      ]),
      Nombre: new FormControl(null, [
        Validators.required,
        Validators.maxLength(100),
      ]),
      AlimentaInventario: new FormControl(true, Validators.required),
      Estado: new FormControl(true, Validators.required),
    });
  }

  ngOnInit(): void {
    if (this.id != undefined && this.id != null) {
      this.titulo = `Editar Procedimientos`;
      this.service.getById(this.id).subscribe((l) => {
        this.frmProcedimientos.controls.Codigo.setValue(l.data.codigo);
        this.frmProcedimientos.controls.Nombre.setValue(l.data.nombre);
        this.frmProcedimientos.controls.AlimentaInventario.setValue(
          l.data.alimentaInventario
        );
        this.frmProcedimientos.controls.Estado.setValue(l.data.estado);
      });
    } else {
      this.titulo = `Crear Procedimientos`;
    }
  }

  save() {
    if (this.frmProcedimientos.invalid) {
      this.statusForm = false;
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }
    let data = {
      id: this.id ?? 0,
      ...this.frmProcedimientos.value,
    };
    this.service.save(this.id, data).subscribe((l) => {
      if (!l.status) {
        // this.modalActive.close();
        this.helperService.showMessage(MessageType.ERROR, Messages.SAVEERROR);
      } else {
        // this.modalActive.close(true);
        this.helperService.showMessage(
          MessageType.SUCCESS,
          Messages.SAVESUCCESS
        );
        this.helperService.redirectApp(`operativo/procedimientos`);
      }
    });
  }

  cancel() {
    this.helperService.redirectApp(`operativo/procedimientos`);
  }
}
