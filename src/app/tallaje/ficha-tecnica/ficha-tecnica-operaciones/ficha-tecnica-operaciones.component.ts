import { Component, Input, OnInit } from '@angular/core';
import { FichaTenicaService } from '../ficha-tecnica.service';

@Component({
  selector: 'app-ficha-tecnica-operaciones',
  templateUrl: './ficha-tecnica-operaciones.component.html',
  styleUrls: ['./ficha-tecnica-operaciones.component.css']
})
export class FichaTecnicaOperacionesComponent implements OnInit {

  @Input() PrendaId = null;
  public listOperaciones: any = [];

  constructor(private service: FichaTenicaService) { }

  ngOnInit(): void {
    this.service.getOperacionesByPrenda(this.PrendaId).subscribe(res => {
      this.listOperaciones = res.data;
    })
  }

}
