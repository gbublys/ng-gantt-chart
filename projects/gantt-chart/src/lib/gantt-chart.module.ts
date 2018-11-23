import { NgModule } from '@angular/core';
import { GanttChartComponent } from './gantt-chart.component';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';

@NgModule({
    imports: [
        BrowserModule,
        CommonModule
    ],
    declarations: [GanttChartComponent],
    exports: [
        GanttChartComponent
    ]
})
export class GanttChartModule { }
