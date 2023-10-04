import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperService, MessageType } from 'src/app/admin/helper.service';
import { ArchivosViewComponent } from 'src/app/parameters/archivo/archivo-view/archivo-view.component';
import { ArchivoService } from 'src/app/parameters/archivo/archivo.service';
import { FichaTenicaService } from '../ficha-tecnica.service';

@Component({
  selector: 'app-ficha-tenica-ver',
  templateUrl: './ficha-tenica-ver.component.html',
  styleUrls: ['./ficha-tenica-ver.component.css']
})
export class FichaTenicaVerComponent implements OnInit {

  public modeloId = null;
  public title = "Ficha técnica";
  public breadcrumb = [{name: `Inicio` , icon: `fa-solid fa-house`},  {name: "Tallaje" , icon: "fas fa-cogs"}, {name: "Ficha técnica"}];
  public modelo: any = null;

  public img = "../../../../assets/imagen-usuario.png";
  public dataImage: any;
  
  constructor(private service: FichaTenicaService, private activateRoute: ActivatedRoute, private ArchivoService: ArchivoService, private helperService: HelperService, private modalService: NgbModal) { 
    this.activateRoute.params.subscribe(l => this.modeloId = l.id)
  }

  ngOnInit(): void {
    this.cargarModelo();
  }

  private cargarModelo() {
    this.service.getModeloById(this.modeloId).subscribe(element => {
      this.modelo = element.data;

      if(this.modelo && this.modelo.imagenModeloId && this.modelo.imagenModeloId > 0) {
        this.ArchivoService.getArchivoById(this.modelo.imagenModeloId).subscribe((res) => {
          this.img = res.data.archivo;
          this.dataImage = res.data;
        })
      }
    })
  }

  openImage() {
    if (!this.dataImage) {
      this.helperService.showMessage(MessageType.WARNING, "No existe imágen");
      return;
    }

    this.helperService.viewImage(this.dataImage.extension, () => {
      let modal = this.modalService.open(ArchivosViewComponent, {size: 'xl'});
      modal.componentInstance.id = this.dataImage.id;
      modal.result.then(res => {
        if (res) this.helperService.downloadFile(this.dataImage);
      })
    }, () => {
        this.helperService.downloadFile(this.dataImage)
    });
  }

}
