import { InjectionToken, Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { TrainStop } from './train-stop.model';

export interface DelayService {
  get isReady(): Signal<boolean>;

  getForDepartmentDestination(
    department: string,
    destination: string,
  ): Observable<TrainStop[]>;
}

export const DELAY_SERVICE = new InjectionToken<DelayService>('DelayService');
