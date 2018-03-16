# Ng Gantt Chart

## Demo

[You can find a demo app by following this link](https://embed.plnkr.co/NaXYhK5uWgpmPnhRYJdn/)

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
