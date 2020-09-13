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
  public searchInput: any

  constructor(public dataService: DataService) {
  }

  ngOnInit(): void {
    localStorage.clear()
    this.page = 1
    this.itemsPerPage = 7
    this.dataService.fetchData().subscribe(() => {
      this.data = this.dataService.data
      this.categories = this.data.categories
      this.games = this.sortAlphabetically()
      this.collectionSize = this.games.length
      this.paginationArrayGeneral = this.pagination(this.games, this.collectionSize)
      this.dataService.maxArraySize = this.games.length
      this.dataService.arraySize = this.collectionSize
      this.paginationArray = this.paginationArrayGeneral.get(1)
      this.loading.next(false)
    })
  }
  // Sort alphabetically (numbers first)
  sortAlphabetically(): any {
    return this.data.games.sort((a, b): any => {
      const x = a.Name.en.toLowerCase()
      const y = b.Name.en.toLowerCase()
      if (x < y) {return -1}
      if (x > y) {return 1}
      return 0
    })
  }
  // on Click in ngb-pagination
  onPageChange(event: number): any {
    return this.paginationArray = this.paginationArrayGeneral.get(event)
  }
  // function realize pagination of page
  pagination(array: Array<any>, collectionSize: number): any {
    const size = this.itemsPerPage
    const arrPagination = new Map()
    const subarray = []
    for (let i = 0; i < Math.ceil(collectionSize / size); i++){
      subarray[i] = array.slice((i * size), (i * size) + Number(size))
    }
    for (let i = 0; i < subarray.length; i++) {
      arrPagination.set(i + 1, subarray[i])
    }
    return arrPagination
  }
  // on Change items per page
  onChange(event: any): any {
    this.itemsPerPage = event.target.value
    if (this.itemsPerPage <= 0) {
      this.itemsPerPage = 1
    }
    this.paginationArrayGeneral = this.pagination(this.games, this.collectionSize)
    return this.onPageChange(1)
  }
  // on select favorite game
  onFavorite(event: any): any {
    let flag = false
    const objFavorite: any = {
      ImageFullPath: '',
      Name: {
        en: ''
      }
    }
    objFavorite.ImageFullPath = event.path.find(el => el.className === 'game__wrapper').children[0].children[0].children[0].currentSrc
    objFavorite.Name.en = event.path.find(el => el.className === 'game__actions').children[0].innerHTML
    for (let i = 0; i < localStorage.length; i++) {
      if (localStorage.getItem(localStorage.key(i)) === JSON.stringify(objFavorite)) {
        flag = true
      }
    }
    if (!flag) {
      localStorage.setItem((this.indexFavoriteItem++).toString(), JSON.stringify(objFavorite))
    }
  }
  onSearchInput(event: any): any {
    this.searchInput = new RegExp('\w*' + event.target.value.trim() + '\w*')
  }
  onSearchClick(): any {
    const searchArray = this.games
    const regExp = this.searchInput
    if (regExp) {
      if (regExp.toString() !== '/w*w*/') {
        const dirtArray = searchArray.filter(game => regExp.test(game.Name.en) === true)
        this.paginationArrayGeneral = this.pagination(dirtArray, dirtArray.length)
        this.dataService.arraySize = dirtArray.length
        this.collectionSize = dirtArray.length
        return this.paginationArray = this.paginationArrayGeneral.get(1)
      }
      return 0
    } else {
      return 0
    }
  }
  // on select filter
  onFilterChange(event: any): any {
    const filterValueDirt = event.target.value.split(' ')
    filterValueDirt.splice(0, 1)
    const filterValue = filterValueDirt.join(' ').trim()
    if (filterValue === 'All Games') {
      this.dataService.arraySize = this.games.length
      this.paginationArrayGeneral = this.pagination(this.games, this.games.length)
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
      this.collectionSize = arrayFilter.length
      this.paginationArrayGeneral = this.pagination(arrayFilter, this.collectionSize)
      this.dataService.arraySize = this.collectionSize
      return this.paginationArray = this.paginationArrayGeneral.get(1)
    }
  }

}
