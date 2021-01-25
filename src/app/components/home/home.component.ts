import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Pokemon, PokemonResult } from 'src/app/models/pokemon.interface';
import { pluck, tap } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public urlIdLookup: any;
  public pokemons: PokemonResult[];
  public text: string;
  public filteredPokemon: PokemonResult[];
  public results: PokemonResult[];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.initPokemonData();
  }

  private initPokemonData(): void {
    this.http
      .get<Pokemon>('https://pokeapi.co/api/v2/pokemon?offset=0')
      .pipe(
        pluck('results'),
        tap((results: PokemonResult[]) => {
          this.urlIdLookup = results.reduce(
            (acc, cur, idx) => (acc = { ...acc, [cur.name]: idx + 1 }),
            {}
          );
        })
      )
      .subscribe((data: PokemonResult[]) => {
        this.pokemons = this.filteredPokemon = data;
      });
  }

  public onChange(updatedValue: string): void {
    console.log(this.filteredPokemon);

    this.filteredPokemon = this.pokemons.filter((pokemon) =>
      pokemon.name.includes(updatedValue)
    );
  }
}
