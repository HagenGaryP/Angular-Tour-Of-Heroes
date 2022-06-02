/****************      Observable HeroService      ****************
Observable is one of the key classes in the RxJS library.
In a later tutorial on HTTP, https://angular.io/tutorial/toh-pt6, you'll learn that Angular's HttpClient methods return RxJS Observables. In this tutorial, you'll simulate getting data from the server with the RxJS of() function. */

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

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
  constructor(private messageService: MessageService) {

  }

  // code after using routing (with the id added as a param here)
  getHero(id: number): Observable<Hero> {
    // For now, assume that a hero with the specified `id` always exists.
    // Error handling will be added in the next step of the tutorial.
    const hero = HEROES.find(h => h.id === id)!;
    this.messageService.add(`HeroService: fetched hero id=${id}`);
    return of(hero);
  }

  // using Observable
  getHeroes(): Observable<Hero[]> {
    const heroes = of(HEROES);
    this.messageService.add('HeroService: fetched heroes');
    return heroes;
    // of(HEROES) returns an Observable<Hero[]> that emits a single value, the array of mock heroes.

    /* Subscribe in HeroesComponent.ts
    The HeroService.getHeroes method used to return a Hero[].
    Now it returns an Observable<Hero[]>.
    You'll have to adjust to that difference in HeroesComponent. */
  }

  // w/o observable
  // getHeroes(): Hero[] {
  //   return HEROES;
  // }
}
