import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GanttChartComponent } from './gantt-chart.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations:  [
        GanttChartComponent
    ],
    exports: [
        GanttChartComponent
    ]
})
export class GanttChartModule { }
