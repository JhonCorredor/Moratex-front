import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ArchivoService } from '../archivo.service';

@Component({
  selector: 'app-archivo-view',
  templateUrl: './archivo-view.component.html',
  styleUrls: ['./archivo-view.component.css']
})
export class ArchivosViewComponent implements OnInit {

  public id! : number;
  public botones = ['btn-cancelar' , 'btn-descargar-archivo' ];
  public titulo = ""; 
  public extension! : boolean;
  public image! : any  ;

  constructor(
     private service: ArchivoService,
     private modalActive: NgbActiveModal,
     private sanitizer: DomSanitizer)  { 
  }

  ngOnInit(): void {
    this.service.getArchivoById(this.id).subscribe(l => {
      let name = (l.data.nombre).toUpperCase()
        if (l.data.extension == "png" || l.data.extension == "jpg" || l.data.extension == "jpeg" || l.data.extension == "gif") { 
        this.titulo = `Viendo : ${name} `;
        this.extension = true; 
      } else {
        this.titulo = `Viendo : ${name} `;
        this.extension = false;
      }
      this.image = this.sanitizer.bypassSecurityTrustResourceUrl( l.data.archivo) 
    })
  }

  cancel() {
    this.modalActive.close();
  }

  download(){
    this.modalActive.close(true);
  }


}
