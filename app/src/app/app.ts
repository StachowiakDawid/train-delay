import { Component, inject } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DELAY_SERVICE } from './delay.service';
import { CommonModule } from '@angular/common';
import { TrainStop } from './train-stop.model';
import { PgliteDelayService } from './pglite-delay.service';
import { environment } from '../environments/environment';
import { HttpDelayService } from './http-delay.service';
import { DuckDbDelayService } from './duckdb-delay.service';

const delayService = {
  'pglite': PgliteDelayService,
  'http': HttpDelayService,
  'duckdb': DuckDbDelayService
}

@Component({
  selector: 'app-root',
  imports: [NgbModule, FormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  providers: [
    { provide: DELAY_SERVICE, useClass: delayService[environment.delayService as keyof typeof delayService] }
  ]
})
export class App {
  title = 'train-delay';
  destination: string = '';
  department: string = '';
  submitButton = new FormControl('');
  delayService = inject(DELAY_SERVICE);
  response: TrainStop[] = [];
  page: number = 1;
  pageSize: number = 100;
  pageCount: number = 0;
  connectionsToDisplay: TrainStop[] = [];
  isLoading: boolean = false;

  submit() {
    this.connectionsToDisplay = [];
    this.isLoading = true;
    setTimeout(() => {
    this.delayService
      .getForDepartmentDestination(this.department, this.destination)
      .subscribe({
        next: (res) => {
          this.response = res;
          this.page = 1;
          this.pageCount = Math.ceil(this.response.length / this.pageSize);
          this.updateConnectionsToDisplay();
          this.isLoading = false;
        },
        error: () => {
          this.pageCount = 0;
          this.isLoading = false;
        },
      });
    }, 50);
  }

  isReady() {
    return this.delayService.isReady();
  }

  updateConnectionsToDisplay(page: number = this.page) {
    this.page = page;
    const startIndex = (page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.connectionsToDisplay = this.response.slice(startIndex, endIndex);
  }

  swapStations() {
    const temp = this.department;
    this.department = this.destination;
    this.destination = temp;
    this.submit();
  }

  getPageNumbers(): number[] {
    const pageNumbers: number[] = [];
    const start = Math.max(1, this.page - 2);
    const end = Math.min(this.pageCount, this.page + 2);
    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  }

  getResultsDeclension() {
    const count = this.response.length % 10;
    if (count === 1 && this.response.length === 1) {
      return 'wynik';
    } else if (count >= 2 && count <= 4) {
      return 'wyniki';
    } else {
      return 'wyników';
    }
  }

  getMinuteDeclension(delay: number) {
    delay = +(delay / 60).toFixed(0);
    const count = delay % 10;
    if (count === 1 && delay === 1) {
      return `${delay} minuta`;
    } else if (count >= 2 && count <= 4) {
      return `${delay} minuty`;
    } else {
      return `${delay} minut`;
    }
  }
}
