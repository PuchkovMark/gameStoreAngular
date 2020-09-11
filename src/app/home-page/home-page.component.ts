import { Component, OnInit } from '@angular/core'
import {DataService} from '../shared/data.service'

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.sass']
})
export class HomePageComponent implements OnInit {
  public loading = true
  public page: number
  public itemsPerPage: number
  public games: Array<any>
  public collectionSize: number
  public paginationArrayGeneral: any
  public paginationArray: any

  constructor(public dataService: DataService) {
  }

  ngOnInit(): void {
    this.dataService.fetchData().subscribe(() => {
      this.loading = false
      this.page = 1
      this.itemsPerPage = 8
      this.games = this.dataService.data.games
      this.collectionSize = this.dataService.data.games.length
      console.log(this.dataService.data)
      this.paginationArrayGeneral = this.pagination()
      console.log(this.paginationArrayGeneral)
      this.paginationArray = this.paginationArrayGeneral.get(this.page)
    })
  }

  onPageChange(event: number): any {
    return this.paginationArray = this.paginationArrayGeneral.get(event)
  }
  pagination(): any {
    const size = this.itemsPerPage
    const arrPagination = new Map()
    const subarray = []
    for (let i = 0; i < Math.ceil(this.collectionSize / size); i++){
      subarray[i] = this.games.slice((i * size), (i * size) + size)
    }
    // console.log(subarray)
    for (let i = 0; i < subarray.length; i++) {
      arrPagination.set(i + 1, subarray[i])
    }
    // console.log(arrPagination)
    return arrPagination
  }

}
