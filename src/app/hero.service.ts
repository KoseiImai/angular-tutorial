import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Hero } from './hero';
import { MessageService } from './message.service';
import { HEROES } from './mock-heroes';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  constructor(
    private messageService: MessageService,
    private http: HttpClient,
  ) { }

  private heroesUrl = 'api/heroes';  // Web APIのURL


  private log(message: string) {
    this.messageService.add(`HeroService: $(message)`);
  }
    

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // リモート上のロギング基盤にエラーを送信する
      console.error(error);

      // ユーザーへの開示のためエラーの変数処理を改善する
      this.log(`${operation} failed: ${error.message}`);

      // からの結果を返して、アプリを持続可能にする
      return of(result as T);
    };
  }

  /** サーバーからデータを取得する */
  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl).pipe(
      tap(heroes => this.log('fetched heroes')),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
  }

  /** IDよりデータを取得する。見つからなかった場合は404を返却する */
  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }
}
