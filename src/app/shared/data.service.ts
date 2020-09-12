import {Injectable} from '@angular/core'
import {HttpClient} from '@angular/common/http'
import {BehaviorSubject, Observable} from 'rxjs'
import {tap} from 'rxjs/operators'

export interface Data {
  categories?: object[]
  countriesRestrictions?: object
  games?: object[]
  merchants?: object
  merchantsCurrencies?: object[]
}

@Injectable({providedIn: 'root'})
export class DataService {
  loading = new BehaviorSubject(true)
  public data: any = []
  maxArraySize: number
  arraySize: number

  constructor(private http: HttpClient) {}

  fetchData(): Observable<Data[]> {
    return this.http.get<any>('http://localhost:5000/api')
      .pipe(tap(data => this.data = data))
  }
  getLoadingState(): Observable<boolean> {
    return this.loading
  }
  setLoadingState(state): void {
    console.log('setSpinnerState', state)
    this.loading.next(state)
  }
}
