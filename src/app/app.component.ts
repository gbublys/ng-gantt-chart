import {Component, ViewEncapsulation} from '@angular/core';
import {GanttTaskModel} from './gantt-chart/gantt-task.model';

const Tasks: GanttTaskModel[] = [
  {
    createdOn: new Date('2014-03-08T12:00:00.000Z'),
    dueTo: new Date('2014-03-09T12:00:00.000Z'),
    name: 'Task 1 A long title here'
  },
  {
    createdOn: new Date('2014-03-09T12:00:00.000Z'),
    dueTo: new Date('2014-03-11T12:00:00.000Z'),
    name: 'Task 2'
  },
  {
    createdOn: new Date('2014-03-11T12:00:00.000Z'),
    dueTo: new Date('2014-03-12T15:00:00.000Z'),
    name: 'Task 3'
  },
  {
    createdOn: new Date('2014-03-12T15:00:00.000Z'),
    dueTo: new Date('2014-03-18T12:00:00.000Z'),
    name: 'Task 4'
  },
  {
    createdOn: new Date('2014-03-18T12:00:00.000Z'),
    dueTo: new Date('2014-03-21T00:00:00.000Z'),
    name: 'Task 5'
  },
  {
    createdOn: new Date('2014-03-21T00:00:00.000Z'),
    dueTo: new Date('2014-04-21T00:00:00.000Z'),
    name: 'Task 6 A long title here as well'
  },
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public tasks = Tasks;
}
