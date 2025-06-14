import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Signal, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { TrainStop } from './train-stop.model';
import { DelayService } from './delay.service';

@Injectable({
  providedIn: 'root',
})
export class HttpDelayService implements DelayService {
  private http = inject(HttpClient);
  private isReadySignal = signal<boolean>(true);

  constructor() {}

  get isReady(): Signal<boolean> {
    return this.isReadySignal;
  }

  getForDepartmentDestination(
    department: string,
    destination: string,
  ): Observable<TrainStop[]> {
    return this.http.get<TrainStop[]>(`/api/${department}/${destination}`);
  }
}
