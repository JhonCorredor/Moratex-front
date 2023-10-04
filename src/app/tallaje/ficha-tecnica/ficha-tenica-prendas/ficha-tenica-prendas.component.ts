import { Component, Input, OnInit  } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperService, MessageType } from 'src/app/admin/helper.service';
import { ArchivosViewComponent } from 'src/app/parameters/archivo/archivo-view/archivo-view.component';
import { FichaTenicaService } from '../ficha-tecnica.service';

@Component({
  selector: 'app-ficha-tenica-prendas',
  templateUrl: './ficha-tenica-prendas.component.html',
  styleUrls: ['./ficha-tenica-prendas.component.css']
})
export class FichaTenicaPrendasComponent implements OnInit {

  @Input() modeloId: any = 0;
  public listPrendas: any = [];
  public img = "../../../../assets/imagen-usuario.png";

  constructor(private service: FichaTenicaService, private helperService: HelperService, private modalService: NgbModal) { 
  }

  ngOnInit(): void {
    this.cargarData();
  }

  public cargarData() {
    this.service.getPrendasByModelo(this.modeloId).subscribe(res => {
      this.listPrendas = res.data;
    })
  }

  pas(a : any){
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
