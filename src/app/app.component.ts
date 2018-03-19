import {Component} from '@angular/core';
import {GanttTaskModel} from '../lib/gantt-chart/gantt-task.model';

const Tasks: GanttTaskModel[] = [
    {
        id: 1,
        createdOn: new Date('2014-03-08T12:00:00.000Z'),
        dueTo: new Date('2014-03-09T12:00:00.000Z'),
        name: 'Task 1 A long title here',
        progress: 100
    },
    {
        id: 2,
        createdOn: new Date('2014-03-09T12:00:00.000Z'),
        dueTo: new Date('2014-03-11T12:00:00.000Z'),
        name: 'Task 2',
        progress: 100
    },
    {
        id: 3,
        createdOn: new Date('2014-03-11T12:00:00.000Z'),
        dueTo: new Date('2014-03-12T15:00:00.000Z'),
        name: 'Task 3',
        progress: 100,
        dependencies: [
            1, 2
        ]
    },
    {
        id: 4,
        createdOn: new Date('2014-03-12T15:00:00.000Z'),
        dueTo: new Date('2014-03-18T12:00:00.000Z'),
        name: 'Task 4',
        progress: 56
    },
    {
        id: 5,
        createdOn: new Date('2014-03-12T15:00:00.000Z'),
        dueTo: new Date('2014-03-21T00:00:00.000Z'),
        name: 'Task 5',
        progress: 32
    },
    {
        id: 6,
        createdOn: new Date('2014-03-21T00:00:00.000Z'),
        dueTo: new Date('2014-04-21T00:00:00.000Z'),
        name: 'Task 6',
        progress: 0
    },
    {
        id: 7,
        createdOn: new Date('2014-03-21T00:00:00.000Z'),
        dueTo: new Date('2014-04-21T00:00:00.000Z'),
        name: 'Task 7',
        progress: 0
    },
    {
        id: 8,
        createdOn: new Date('2014-03-18T00:00:00.000Z'),
        dueTo: new Date('2014-03-25T00:00:00.000Z'),
        name: 'Task 8',
        progress: 5
    },
];

@Component({
    selector: 'ng-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    public tasks = Tasks;

    public test(task) {
        console.log(task);
    }
}
