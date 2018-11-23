import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {GanttChartComponent} from './gantt-chart.component';

@NgModule({
    imports: [
        BrowserModule,
        CommonModule
    ],
    declarations: [
        GanttChartComponent
    ],
    exports: [
        GanttChartComponent
    ]
})
export class GanttChartModule { }
