import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { MessageService } from '../message.service';
// import { HEROES } from '../mock-heroes';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
// HeroesComponent CLASS AFTER USING ROUTING
export class HeroesComponent implements OnInit {
  heroes: Hero[] = [];

  constructor(private heroService: HeroService) { }

  ngOnInit(): void {
    this.getHeroes();
  }

  getHeroes(): void {
    this.heroService.getHeroes()
    .subscribe(heroes => this.heroes = heroes);
  }
}

// HEROESCOMPONENT CLASS BEFORE USING ROUTING
// export class HeroesComponent implements OnInit {
//   // hero: Hero = {
//   //   id: 1,
//   //   name: 'Windstorm'
//   // }

//   // heroes = HEROES; // without using service

//   // replacing the heroes definition prop by using hero service, which is done inside the constructor
//   heroes: Hero[] = [];
//   selectedHero?: Hero;

//   /***************     INSIDE THE CONSTRUCTOR     ********************
//   The parameter simultaneously defines a private heroService property and identifies it as a HeroService injection site.

//   When Angular creates a HeroesComponent, the Dependency Injection system sets the heroService parameter to the singleton instance of HeroService.
//   **********************************************************************/
//   constructor(private heroService: HeroService, private messageService: MessageService) { }

//   ngOnInit(): void {
//     // call getHeroes() inside this ngOnInit lifecycle hook
//     this.getHeroes();
//   }

//   onSelect(hero: Hero): void {
//     this.selectedHero = hero;
//     this.messageService.add(`HeroesComponent: Selected hero id=${hero.id}`);
//   }

//   getHeroes(): void {
//     // using observable - subscribe.
//     // Because heroService.getHeroes() returns an Observable<Hero[]>
//     this.heroService.getHeroes()
//         .subscribe(heroes => this.heroes = heroes);
//     /* See note at bottom of this file for explanation */


//     /******** without subscribing to observable ************/
//     // this.heroes = this.heroService.getHeroes();

//     /**************    Observable data    ************************
//     The HeroService.getHeroes() method has a synchronous signature,
//     which implies that the HeroService can fetch heroes synchronously.
//     The HeroesComponent consumes the getHeroes() result as if heroes
//     could be fetched synchronously.

//     IMPORTANT NOTE: This will not work in a real application.
//       You're getting away with it now because the service currently returns mock heroes. But soon the application will fetch heroes from a remote server, which is an inherently asynchronous operation.
//     */
//   }

// }
/***********    Explanation - using/not using observable   *************

The previous version assigns an array of heroes to the component's heroes property. The assignment occurs synchronously, as if the server could return heroes instantly or the browser could freeze the UI while it waited for the server's response.

That won't work when the HeroService is actually making requests of a remote server.

The new version waits for the Observable to emit the array of heroes —which could happen now or several minutes from now. The subscribe() method passes the emitted array to the callback, which sets the component's heroes property.

This asynchronous approach will work when the HeroService requests heroes from the server.
 */
