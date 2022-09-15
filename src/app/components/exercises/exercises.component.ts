import { Component, OnInit } from '@angular/core';
import { ExerciseService } from '../../services/exercises.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-workout',
  templateUrl: './exercises.component.html',
  styleUrls: ['./exercises.component.css'],
})
export class ExercisesComponent implements OnInit {
  constructor(public data: ExerciseService, public auth: AuthService) {}

  ngOnInit(): void {}
}
