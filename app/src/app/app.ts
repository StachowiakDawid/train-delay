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
      this.response = res;
    });
  }
}
