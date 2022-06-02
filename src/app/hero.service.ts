/****************      Observable HeroService      ****************
Observable is one of the key classes in the RxJS library.
In a later tutorial on HTTP, https://angular.io/tutorial/toh-pt6, you'll learn that Angular's HttpClient methods return RxJS Observables. In this tutorial, you'll simulate getting data from the server with the RxJS of() function. */

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Hero } from './hero';
import { MessageService } from './message.service';
import { HEROES } from './mock-heroes';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  /* Modify the constructor with a parameter that declares a private messageService property.
  Angular will inject the singleton MessageService into that property when it creates the HeroService.

  This is a typical "service-in-service" scenario:
  You inject the MessageService into the HeroService
  which is injected into the HeroesComponent.
  */
  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  /* Define the heroesUrl of the form :base/:collectionName
   with the address of the heroes resource on the server.
   Here base is the resource to which requests are made,
   and collectionName is the heroes data object in
   the in-memory-data-service.ts. */

  private heroesUrl = 'api/heroes';  // URL to web api

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }


  /* The previous HeroService.getHeroes(), commented out below,
  uses the RxJS of() function to return an array of mock heroes
  as an Observable<Hero[]>.

  Convert that method to use HttpClient as follows: */
  /** GET heroes from the server */
  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(_ => this.log('fetched heroes')),
        catchError(this.handleError<Hero[]>('getHeroes', []))
      );
  }

  /** GET hero by id. Will 404 if id not found */
  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  /**The heroes web API expects a special header in HTTP save requests.
  That header is in the httpOptions constant defined in the HeroService. */
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  /** PUT: update the hero on the server */
  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  // ADDING A NEW HERO - with POST call on the http client
  /** POST: add a new hero to the server */
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  /** DELETE: delete the hero from the server */
  deleteHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  /* GET heroes whose name contains search term */
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
        this.log(`found heroes matching "${term}"`) :
        this.log(`no heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }

  // using Observable
  /* getHeroes(): Observable<Hero[]> {
     const heroes = of(HEROES);
     this.messageService.add('HeroService: fetched heroes');
     return heroes; */
     // of(HEROES) returns an Observable<Hero[]> that emits a single value, the array of mock heroes.

     /* Subscribe in HeroesComponent.ts
     The HeroService.getHeroes method used to return a Hero[].
     Now it returns an Observable<Hero[]>.
     You'll have to adjust to that difference in HeroesComponent. */
    // }

    // get a single hero using routing (with the id added as a param here)
    // getHero(id: number): Observable<Hero> {
    //   // For now, assume that a hero with the specified `id` always exists.
    //   // Error handling will be added in the next step of the tutorial.
    //   const hero = HEROES.find(h => h.id === id)!;
    //   this.messageService.add(`HeroService: fetched hero id=${id}`);
    //   return of(hero);
    // }

  // w/o observable
  // getHeroes(): Hero[] {
  //   return HEROES;
  // }
}
