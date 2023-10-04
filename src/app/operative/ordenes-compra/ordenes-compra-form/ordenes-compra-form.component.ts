import { Component, OnInit } from '@angular/core';
import { FormBuilder,  FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { OrdenesCompraService } from '../ordenes-compra.service';

@Component({
  selector: 'app-empleadosMedidas-form',
  templateUrl: './ordenes-compra-form.component.html',
  styleUrls: ['./ordenes-compra-form.component.css']
})
export class OrdenesCompraFormComponent implements OnInit {

  public frmOrdenesCompra! : FormGroup;
  public statusForm : boolean = true
  public id! : number;
  public botones = ['btn-guardar', 'btn-cancelar'];
  public titulo = "";

  constructor(public routerActive: ActivatedRoute, 
    private service: OrdenesCompraService , 
    private helperService: HelperService, 
    private modalActive: NgbActiveModal , 
    private fb: FormBuilder
    
    ) 
  { }

  ngOnInit(): void {
    this.buildForm();
    if (this.id != undefined && this.id != null) {
      this.titulo = "Editar OrdenesCompra";
      this.service.getOrdenesCompraById(this.id).subscribe(({data}) => {
        this.frmOrdenesCompra.controls.Codigo.setValue(data.codigo);
        this.frmOrdenesCompra.controls.Estado.setValue(data.estado);
      })
    }else {
      this.titulo = "Crear Empleados Medidas";
    }
  }

  buildForm(): void {
    this.frmOrdenesCompra = this.fb.group({
      Codigo: [null, Validators.required],
      Estado: [null, Validators.required],
    });
  }


  save() {
    if (this.frmOrdenesCompra.invalid) {
      this.statusForm  = false
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }
    let data  = { 
      id: this.id ?? 0,
      ...this.frmOrdenesCompra.value,
    };
    this.service.save(this.id, data).subscribe(l => {
      if (l.status == "Error") {
        this.modalActive.close();
        this.helperService.showMessage(MessageType.ERROR, Messages.SAVEERROR)
      } else {
        this.modalActive.close(true);
        this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS)
      }
    })
  }

  cancel() {
    this.modalActive.close();
  }

}
