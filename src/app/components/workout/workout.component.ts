import { Component, OnInit } from '@angular/core';
import { ExerciseService } from '../../services/exercises.service';
import { Router } from '@angular/router';

interface Exercise {
  name: string;
  duration: number;
}

const STEP = .5;

@Component({
  selector: 'app-workout',
  templateUrl: './workout.component.html'
})
export class WorkoutComponent implements OnInit {
  time: number = 20;
  maxTime: number = 20;
  workoutRunning = false;
  paused = false;
  currentExerciseIndex: number = 0;

  constructor(public ExerciseService: ExerciseService, private router: Router) {

  }

  ngOnInit(): void {
    this.initTimer();
  }

  checkValidExercises() {
    // Return false if any exercises durarion is 0
    return this.ExerciseService.exercises.every(exercise => exercise.duration > 0)
    && this.ExerciseService.exercises.length > 0;
  }

  initTimer() {
    if (this.workoutRunning) return;
    if (!this.checkValidExercises()) return;

    this.currentExerciseIndex = 0;
    this.time = this.maxTime = this.ExerciseService.exercises[0].duration;

    this.workoutRunning = true;
    setTimeout(() => {
      this.update();
    }, STEP * 1000);
  }

  update() {
    if (!this.paused) {
      this.time -= STEP;
      if (this.time <= 0) {
        if (this.currentExerciseIndex + 1 >= this.ExerciseService.exercises.length) {
          this.endWorkout();
          return;
        }
        this.currentExerciseIndex++;
        this.time = this.maxTime = this.ExerciseService.exercises[this.currentExerciseIndex].duration;
      }
    }
    setTimeout(() => {
      this.update();
    }, STEP * 1000);
  }

  skip() {
    this.time = STEP;
  }

  addToTime(seconds: number) {
    this.time += seconds;
    if (this.time > this.maxTime) {
      this.time = this.maxTime;
    }
    if (this.time < STEP) {
      this.time = STEP;
    }
  }

  endWorkout() {
    this.workoutRunning = false;
    this.ExerciseService.addStreak();
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 500);
  }


}
