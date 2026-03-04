import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DelayService } from './delay.service';
import { CommonModule } from '@angular/common';
import { TrainStop } from './trainStop.model';
import { PGliteService } from './pglite.service';

@Component({
  selector: 'app-root',
  imports: [NgbModule, FormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App implements OnInit {
  title = 'train-delay';
  destination: string = '';
  department: string = '';
  submitButton = new FormControl('');
  delayService = inject(DelayService);
  pgliteService = inject(PGliteService);
  response: TrainStop[] = [];
  page: number = 1;
  pageSize: number = 100;
  pageCount: number = 0;
  connectionsToDisplay: TrainStop[] = [];
  isLoading: boolean = false;

  ngOnInit() {
    this.pgliteService.init('/pgdata.tar.gz');
  }

  submit() {
    this.connectionsToDisplay = [];
    this.isLoading = true;
    setTimeout(() => {
    this.delayService
      .getForDepartmentDestinationFromPGlite(this.department, this.destination)
      .then(
        (res) => {
          this.response = res;
          this.page = 1;
          this.pageCount = Math.ceil(this.response.length / this.pageSize);
          this.updateConnectionsToDisplay();
          this.isLoading = false;
        },
        () => {
          this.pageCount = 0;
          this.isLoading = false;
        },
      );
    }, 50);
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
