import { inject, Injectable, Signal } from '@angular/core';
import replacements from './char-replacements';
import { DelayService } from './delay.service';
import { DuckDbService } from './duckdb.service';
import { from, Observable } from 'rxjs';
import { TrainStop } from './train-stop.model';
import { duckDbSql as sql } from './query';

@Injectable({
  providedIn: 'root',
})
export class DuckDbDelayService implements DelayService {
  private expression = /[ąćęłńóśźż]/gi;
  private duckDbService = inject(DuckDbService);
  constructor() {}
  getForDepartmentDestination(
    department: string,
    destination: string,
  ): Observable<TrainStop[]> {
    department = this.convertStation(department);
    destination = this.convertStation(destination);
    return from(
      this.duckDbService.queryWithParams(sql, [
        department,
        destination,
        department,
        destination,
        department,
        destination,
        department,
        destination,
        department,
        destination,
        department,
        destination,
      ]),
    );
  }

  get isReady(): Signal<boolean> {
    return this.duckDbService.isReady;
  }

  private convertStation(station: string): string {
    return (station ?? '')
      .trim()
      .toLowerCase()
      .replaceAll(' ', '-')
      .replace(this.expression, (letter) => replacements[letter]);
  }
}
