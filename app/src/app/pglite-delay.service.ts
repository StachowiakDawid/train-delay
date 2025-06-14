import { inject, Injectable, Signal } from '@angular/core';
import { Observable, from } from 'rxjs';
import { TrainStop } from './train-stop.model';
import replacements from './char-replacements';
import { pgliteSql as sql } from './query';
import { DelayService } from './delay.service';
import { PGliteService } from './pglite.service';

@Injectable({
  providedIn: 'root',
})  
export class PgliteDelayService implements DelayService {
  private pgliteService = inject(PGliteService);
  private expression = /[ąćęłńóśźż]/gi;

  constructor() {
    this.pgliteService.init('/pgdata.tar.gz');
  }
  
  get isReady(): Signal<boolean> {
    return this.pgliteService.isReady;
  }

  getForDepartmentDestination(
    department: string,
    destination: string,
  ): Observable<TrainStop[]> {
    department = this.convertStation(department);
    destination = this.convertStation(destination);
    return from(
      this.pgliteService.query<TrainStop>(sql, [
        department,
        destination,
      ]).then(res => res.rows)
    );
  }

  private convertStation(station: string): string {
    return (station ?? '')
      .trim()
      .toLowerCase()
      .replaceAll(' ', '-')
      .replace(this.expression, (letter) => replacements[letter]);
  }
}
