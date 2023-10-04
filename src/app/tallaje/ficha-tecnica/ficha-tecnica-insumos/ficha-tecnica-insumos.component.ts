import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperService, MessageType } from 'src/app/admin/helper.service';
import { ArchivosViewComponent } from 'src/app/parameters/archivo/archivo-view/archivo-view.component';
import { FichaTenicaService } from '../ficha-tecnica.service';

@Component({
  selector: 'app-ficha-tecnica-insumos',
  templateUrl: './ficha-tecnica-insumos.component.html',
  styleUrls: ['./ficha-tecnica-insumos.component.css']
})
export class FichaTecnicaInsumosComponent implements OnInit {

  @Input() PrendaId = null;
  public listInsumos: any = [];
  public img = "../../../../assets/imagen-usuario.png";

  constructor(private service: FichaTenicaService, private helperService: HelperService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.service.getConsumosPrendasByPrenda(this.PrendaId).subscribe(res => {
      this.listInsumos = res.data;
    })
  }

  openImage(id: any, extension: any, archivo: any, nombre: any) {
    if (!id) {
      this.helperService.showMessage(MessageType.WARNING, "No existe imágen");
      return;
    }

    let dataImage = {
      archivo: archivo,
      nombre: nombre
    }

    this.helperService.viewImage(extension, () => {
      let modal = this.modalService.open(ArchivosViewComponent, {size: 'xl'});
      modal.componentInstance.id = id;
      modal.result.then(res => {
        if (res) this.helperService.downloadFile(dataImage);
      })
    }, () => {
        this.helperService.downloadFile(dataImage)
    });
  }

}
