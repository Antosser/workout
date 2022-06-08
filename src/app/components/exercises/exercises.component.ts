import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/exercises.service';

@Component({
  selector: 'app-workout',
  templateUrl: './exercises.component.html',
  styleUrls: ['./exercises.component.css']
})
export class ExercisesComponent implements OnInit {

  constructor(public data: DataService) {
  }

  ngOnInit(): void {
  }
}
