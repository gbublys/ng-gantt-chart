import {Component} from '@angular/core';
import {GanttTaskModel} from '../lib/gantt-chart/gantt-task.model';

const Tasks: GanttTaskModel[] = [
    new GanttTaskModel({
        id: 1,
        startAt: new Date('2014-03-08T12:00:00.000Z'),
        dueTo: new Date('2014-03-09T12:00:00.000Z'),
        name: 'Task 1 A long title here',
        progress: 100
    }),

    new GanttTaskModel({
        id: 2,
        startAt: new Date('2014-03-09T12:00:00.000Z'),
        dueTo: new Date('2014-03-11T12:00:00.000Z'),
        // duration: new Date(1000 * 60 * 60  * 24), // One day - 1 second * 60 seconds * 60 minutes * 24 hours
        name: 'Task 2',
        progress: 50,
        dependencies: [ 1 ]
    }),
    new GanttTaskModel({
        id: 3,
        startAt: new Date('2014-03-11T12:00:00.000Z'),
        dueTo: new Date('2014-03-12T15:00:00.000Z'),
        name: 'Task 3',
        progress: 100,
        dependencies: [
            1, 2
        ]
    }),
    /* new GanttTaskModel({
        id: 4,
        startAt: new Date('2014-03-12T15:00:00.000Z'),
        dueTo: new Date('2014-03-18T12:00:00.000Z'),
        name: 'Task 4',
        progress: 56
    }),
    new GanttTaskModel({
        id: 5,
        startAt: new Date('2014-03-12T15:00:00.000Z'),
        dueTo: new Date('2014-03-21T00:00:00.000Z'),
        name: 'Task 5',
        progress: 32
    }),
    new GanttTaskModel({
        id: 6,
        startAt: new Date('2014-03-21T00:00:00.000Z'),
        dueTo: new Date('2014-04-21T00:00:00.000Z'),
        name: 'Task 6',
        progress: 0
    }),
    new GanttTaskModel({
        id: 7,
        startAt: new Date('2014-03-21T00:00:00.000Z'),
        dueTo: new Date('2014-04-21T00:00:00.000Z'),
        name: 'Task 7',
        progress: 0
    }),
    new GanttTaskModel({
        id: 8,
        startAt: new Date('2014-03-18T00:00:00.000Z'),
        dueTo: new Date('2014-03-25T00:00:00.000Z'),
        name: 'Task 8',
        progress: 5
    }),*/
];

@Component({
    selector: 'ng-root',
    template: '<ng-gantt-chart [tasks]="tasks" (taskClick)="test($event)"></ng-gantt-chart>',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    public tasks = Tasks;

    public test(task) {
        console.log(task);
    }
}
