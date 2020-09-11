import {Injectable} from '@angular/core'
import {HttpClient} from '@angular/common/http'
import {Observable} from 'rxjs'
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
  public data: any = []

  constructor(private http: HttpClient) {}

  fetchData(): Observable<Data[]> {
    return this.http.get<any>('http://localhost:5000/api')
      .pipe(tap(data => this.data = data))
  }
}
