import { Component, Input, OnInit } from '@angular/core';
import { FichaTenicaService } from '../ficha-tecnica.service';

@Component({
  selector: 'app-ficha-tecnica-insumos-tallas',
  templateUrl: './ficha-tecnica-insumos-tallas.component.html',
  styleUrls: ['./ficha-tecnica-insumos-tallas.component.css']
})
export class FichaTecnicaInsumosTallasComponent implements OnInit {

  @Input() PrendaId = null;
  public listInsumosTallas: any = [];

  constructor(private service: FichaTenicaService) { }

  ngOnInit(): void {
    this.service.getConsumosPrendasTallasByPrenda(this.PrendaId).subscribe(res => {
      this.listInsumosTallas = res.data;
    })
  }

}
