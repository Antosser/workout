import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExercisesComponent } from './exercises/exercises.component';
import { LICENSEComponent } from './license/license.component';
import { WorkoutComponent } from './workout/workout.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: '',
    component: ExercisesComponent,
  },
  {
    path: 'license',
    component: LICENSEComponent,
  },
  {
    path: 'workout',
    component: WorkoutComponent,
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
