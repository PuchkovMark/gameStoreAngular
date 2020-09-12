import { Component, OnInit } from '@angular/core'
import {DataService} from '../shared/data.service'

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.sass']
})
export class HomePageComponent implements OnInit {
  public loading = this.dataService.loading
  public page: number
  public itemsPerPage: number
  public games: Array<any>
  public collectionSize: number
  public paginationArrayGeneral: any
  public paginationArray: any
  public data: any
  public categories: any
  public indexFavoriteItem = 0

  constructor(public dataService: DataService) {
  }

  ngOnInit(): void {
    this.dataService.fetchData().subscribe(() => {
      localStorage.clear()
      this.page = 1
      this.itemsPerPage = 7
      this.data = this.dataService.data
      this.categories = this.data.categories
      // Sort alphabetically (numbers first)
      this.games = this.sortAlphabetically()
      this.collectionSize = this.games.length
      this.paginationArrayGeneral = this.pagination(this.games, this.collectionSize)
      console.log(this.data)
      this.dataService.maxArraySize = this.games.length
      this.dataService.arraySize = this.collectionSize
      this.paginationArray = this.paginationArrayGeneral.get(this.page)
      this.loading.next(false)
    })
  }
  sortAlphabetically(): any {
    return this.data.games.sort((a, b): any => {
      const x = a.Name.en.toLowerCase()
      const y = b.Name.en.toLowerCase()
      if (x < y) {return -1}
      if (x > y) {return 1}
      return 0
    })
  }

  onPageChange(event: number): any {
    console.log(event)
    console.log(this.paginationArrayGeneral.get(event))
    return this.paginationArray = this.paginationArrayGeneral.get(event)
  }
  pagination(array: Array<any>, collectionSize: number): any {
    const size = this.itemsPerPage
    const arrPagination = new Map()
    const subarray = []
    for (let i = 0; i < Math.ceil(collectionSize / size); i++){
      subarray[i] = array.slice((i * size), (i * size) + Number(size))
    }
    console.log('subarray', subarray)
    for (let i = 0; i < subarray.length; i++) {
      arrPagination.set(i + 1, subarray[i])
    }
    console.log('arrPagination', arrPagination)
    return arrPagination
  }
  onChange(event: any): any {
    this.itemsPerPage = event.target.value
    if (this.itemsPerPage <= 0) {
      this.itemsPerPage = 1
    }
    this.paginationArrayGeneral = this.pagination(this.games, this.collectionSize)
    return this.onPageChange(1)
  }
  onFavorite(event: any): any {
    let flag = false
    const objFavorite: any = {
      ImageFullPath: '',
      Name: {
        en: ''
      }
    }
    console.log(event)
    objFavorite.ImageFullPath = event.path.find(el => el.className === 'game__wrapper').children[0].children[0].children[0].currentSrc
    objFavorite.Name.en = event.path.find(el => el.className === 'game__actions').children[0].innerHTML
    for (let i = 0; i < localStorage.length; i++) {
      if (localStorage.getItem(localStorage.key(i)) === JSON.stringify(objFavorite)) {
        flag = true
      }
    }
    if (!flag) {
      console.log(objFavorite)
      localStorage.setItem((this.indexFavoriteItem++).toString(), JSON.stringify(objFavorite))
    }
  }
  onFilterChange(event: any): any {
    const filterValueDirt = event.target.value.split(' ')
    filterValueDirt.splice(0, 1)
    const filterValue = filterValueDirt.join(' ').trim()
    console.log(filterValue)
    if (filterValue === 'All Games') {
      this.dataService.arraySize = this.games.length
      return this.paginationArray = this.paginationArrayGeneral.get(1)
    }
    if (filterValue === 'Favorites') {
      if (!this.indexFavoriteItem) {
        this.dataService.arraySize = 0
        return this.paginationArray = 0
      }
      this.paginationArray = 0
      const temp = []
      for (let i = 0; i < this.indexFavoriteItem; i++) {
        temp.push(JSON.parse(localStorage.getItem(`${i}`)))
      }
      this.dataService.arraySize = temp.length
      return this.paginationArray = temp
    }
    const catInfo = this.categories.find(e => e.Name.en === filterValue)
    if (catInfo) {
      const arrayFilter = this.games.filter(game => game.CategoryID.find(e => e === catInfo.ID))
      console.log(arrayFilter)
      this.collectionSize = arrayFilter.length
      this.paginationArrayGeneral = this.pagination(arrayFilter, this.collectionSize)
      this.dataService.arraySize = this.collectionSize
      return this.paginationArray = this.paginationArrayGeneral.get(1)
    }
  }

}
