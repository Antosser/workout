import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Router } from '@angular/router';

interface Exercise {
  name: string;
  duration: number;
}

const step = .5;

@Component({
  selector: 'app-workout',
  templateUrl: './workout.component.html',
  styleUrls: ['./workout.component.css']
})
export class WorkoutComponent implements OnInit {
  time: number = 20;
  maxTime: number = 20;
  workoutRunning = false;
  paused = false;
  currentExerciseIndex: number = 0;

  checkValidExercises() {
    // Return false if any exercises durarion is 0
    return this.data.exercises.every(exercise => exercise.duration > 0)
    && this.data.exercises.length > 0;
  }

  initTimer() {
    if (this.workoutRunning) return;
    if (!this.checkValidExercises()) return;

    this.currentExerciseIndex = 0;
    this.time = this.maxTime = this.data.exercises[0].duration;

    this.workoutRunning = true;
    setTimeout(() => {
      this.update();
    }, step * 1000);
  }

  update() {
    if (!this.paused) {
      this.time -= step;
      if (this.time <= 0) {
        if (this.currentExerciseIndex + 1 >= this.data.exercises.length) {
          this.endWorkout();
          return;
        }
        this.currentExerciseIndex++;
        this.time = this.maxTime = this.data.exercises[this.currentExerciseIndex].duration;
      }
    }
    setTimeout(() => {
      this.update();
    }, step * 1000);
  }

  endWorkout() {
    this.workoutRunning = false;
    this.data.addStreak();
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 500);
  }

  constructor(public data: DataService, private router: Router) {
    
  }

  ngOnInit(): void {
    this.initTimer();
  }

}
