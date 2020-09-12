import { Component, OnInit } from '@angular/core'
import {DataService} from '../../data.service'

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.sass']
})
export class MainLayoutComponent implements OnInit {
  public loading = this.dataService.loading

  constructor(public dataService: DataService) {}

  ngOnInit(): void {
  }

}
