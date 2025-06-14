import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TrainStop } from './trainStop.model';

@Injectable({
  providedIn: 'root'
})
export class DelayService {
  private http = inject(HttpClient);

  constructor() { }

  getForDepartmentDestination(department: string, destination: string): Observable<TrainStop[]> {
    return this.http.get<TrainStop[]>(`/api/${department}/${destination}`);
  }
}
