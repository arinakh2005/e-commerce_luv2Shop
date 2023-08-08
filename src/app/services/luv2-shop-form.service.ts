import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Country } from '../common/country';
import { State } from '../common/state';
import { environment } from '../../environments/environment';

@Injectable()
export class Luv2ShopFormService {

  private readonly countriesUrl = environment.luv2shopApiUrl + '/countries';
  private readonly statesUrl = environment.luv2shopApiUrl + '/states';

  constructor(private readonly httpClient: HttpClient) { }

  public getCountries(): Observable<Country[]> {
    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map((response) => response._embedded.countries),
    );
  }

  public getStates(theCountryCode: string): Observable<State[]> {
    const searchStatesUrl = `${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`;

    return this.httpClient.get<GetResponseStates>(searchStatesUrl).pipe(
      map((response) => response._embedded.states),
    );
  }

  public getCreditCardMonths(startMonth: number): Observable<number[]> {
    const data: number[] = [];

    for(let theMonth = startMonth; theMonth <= 12; theMonth++) data.push(theMonth);

    return of(data);
  }

  public getCreditCardYears(): Observable<number[]> {
    const data: number[] = [];
    const startYear = new Date().getFullYear();
    const endYear = startYear + 10;

    for(let theYear = startYear; theYear <= endYear; theYear++) data.push(theYear);

    return of(data);
  }
}

interface GetResponseCountries {
  _embedded: {
    countries: Country[],
  },
}

interface GetResponseStates {
  _embedded: {
    states: State[],
  },
}