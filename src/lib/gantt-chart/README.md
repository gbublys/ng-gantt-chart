# Ng Gantt Chart

## Demo

[You can find a demo app by following this link](https://embed.plnkr.co/LhIZhSv94cQld4jviD6w/)

## Dependencies

* [Angular](https://angular.io/) (Tested with 5.0.2)
* [D3](https://d3js.org/) (Tested with 4.13.0)

## Installation

After installing the above dependencies, install `ng-gantt-chart` via:

```
npm install --save ng-gantt-chart
```

Once installed you need to import main module:

```
import {GanttChartModule} from 'ng-gantt-chart';
```

After import you can use your chart in the template as follows:
```
  <ng-gantt-chart [tasks]="tasks"></ng-gantt-chart>
```

## Component documentation

### Inputs

`tasks`: GanttTaskModel[] **Required** An array of GanttTaskModel objects.

`cellHeight`: number;

`cellWidth`: number;

`vGrid`: boolean;

`hGrid`: boolean;


### Output events

`taskClick` event is being fired when user click on task list item or task progress bar

### Types

#### GanttTaskModel

`id: number` - Used for dependency describing

`name: string` - Describes task name which will appear in task list

`createdOn: Date` - Describes when task is started

`dueTo: Date` - Describes when task should be finished

`progress` - Describes task progress that will be displayed on the bar.

GanttTaskModel example:
```
new GanttTaskModel({
    id: 1,
    createdOn: new Date('2014-03-08T12:00:00.000Z'),
    dueTo: new Date('2014-03-09T12:00:00.000Z'),
    name: 'Task 1 A long title here',
    progress: 100
})
```

A gantt task model example with dependency arrow:
```
[
    new GanttTaskModel({
        id: 1,
        createdOn: new Date('2014-03-08T12:00:00.000Z'),
        dueTo: new Date('2014-03-09T12:00:00.000Z'),
        name: 'Task 1 A long title here',
        progress: 100
    }),
    new GanttTaskModel({
        id: 2,
        createdOn: new Date('2014-03-08T12:00:00.000Z'),
        dueTo: new Date('2014-03-09T12:00:00.000Z'),
        name: 'Task 1 A long title here',
        progress: 100,
        dependencies: [
            1 // Will point to first gantt task in the array. The lookup field will be `id` field
        ]
    })
]
```

### Styling
If you need to apply width restriction to task list - you can override the gantt chart styles like this:
```
@Component({
    selector: 'ng-root',
    template: '<ng-gantt-chart [tasks]="tasks" (taskClick)="test($event)"></ng-gantt-chart>',
    styleUrls: ['./app.component.scss'],
    styles: [
        '::ng-deep .task-list { width: 100px; white-space: nowrap; overflow: hidden;}'
    ]
})
export class AppComponent {}
```
