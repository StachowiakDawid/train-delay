import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DelayService } from './delay.service';
import { CommonModule } from '@angular/common';
import { DateFnsModule } from 'ngx-date-fns';

@Component({
  selector: 'app-root',
  imports: [NgbModule, ReactiveFormsModule, CommonModule, DateFnsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  title = 'train-delay';
  destination = new FormControl('');
  department = new FormControl('');
  delayService = inject(DelayService);
  response: any[] = [];

  submit() {
    this.delayService.getForDepartmentDestination(this.department.value ?? '', this.destination.value ?? '').subscribe(res => {
      const connections = [];
      for (let i = 0; i < res.length; i+=2) {
        connections.push({
          start: res[i],
          end: res[i+1],
          timestamp: Date.parse(res[i].arrival_timestamp)
        });
      }
      this.response = connections.sort((a, b) => b.timestamp - a.timestamp);
    });
  }
}
