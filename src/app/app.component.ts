import { Component, OnInit } from '@angular/core';
import * as data from './data.json';
import {GanttTaskModel} from '../../projects/gantt-chart/src/lib/gantt-task.model';

@Component({
    selector: 'ng-root',
    templateUrl: 'app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    public tasks: GanttTaskModel[];

    ngOnInit(): void {
        this.tasks = data.default;
    }

    public viewTask(task: GanttTaskModel) {
        console.log(task);
    }
}
