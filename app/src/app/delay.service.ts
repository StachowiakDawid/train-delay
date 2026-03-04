import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TrainStop } from './trainStop.model';
// import { PGliteService } from './pglite.service';
import replacements from './char_replacements';
import sql from './query';

@Injectable({
  providedIn: 'root',
})
export class DelayService {
  private http = inject(HttpClient);
  // private pgliteService = inject(PGliteService);
  private expression = /[ąćęłńóśźż]/gi;

  constructor() {}

  getForDepartmentDestinationFromAPI(
    department: string,
    destination: string,
  ): Observable<TrainStop[]> {
    return this.http.get<TrainStop[]>(`/api/${department}/${destination}`);
  }

  // async getForDepartmentDestinationFromPGlite(
  //   department: string,
  //   destination: string,
  // ): Promise<TrainStop[]> {
  //   department = this.convertStation(department);
  //   destination = this.convertStation(destination);
  //   const res = await this.pgliteService.query<TrainStop>(sql, [
  //     department,
  //     destination,
  //   ]);
  //   return res.rows;
  // }

  private convertStation(station: string): string {
    return (station ?? '')
      .trim()
      .toLowerCase()
      .replaceAll(' ', '-')
      .replace(this.expression, (letter) => replacements[letter]);
  }
}
