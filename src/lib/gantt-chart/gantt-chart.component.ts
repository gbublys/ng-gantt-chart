import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {GanttTaskModel} from './gantt-task.model';

import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import * as d3Path from 'd3-path';
import * as d3timeFormat from 'd3-time-format';
import {D3TaskUtilityService} from './utility/d3-task-utility.service';
import {D3SvgContainerUtilityService} from './utility/d3-svg-container-utility.service';


@Component({
    selector: 'ng-gantt-chart',
    templateUrl: './gantt-chart.component.html',
    styleUrls: ['./gantt-chart.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        D3SvgContainerUtilityService,
        D3TaskUtilityService,
    ]
})
export class GanttChartComponent implements OnInit {

    public margin = {top: 1, right: 1, bottom: 30, left: 0};
    private width: number;
    private height: number;
    protected xScale: any;
    protected yScale: any;

    @Input() public tasks: GanttTaskModel[];
    @Input() public cellHeight = 50;
    @Input() public cellWidth = 50;
    @Input() public dateFormat: string  = null;
    @Input() public vGrid = true;
    @Input() public hGrid = true;

    @Output() public taskClick = new EventEmitter<GanttTaskModel>();

    constructor(private d3ContainerUtility: D3SvgContainerUtilityService,
                private d3TaskUtility: D3TaskUtilityService) {
        this.width = window.innerWidth - this.margin.left - this.margin.right;
        this.height = window.innerHeight - this.margin.top - this.margin.bottom;
    }

    ngOnInit(): void {
        this.initContainer();
        this.initAxis();

        this.drawGrid();
        this.drawTasks();
        this.drawAxis();

        // this.drawRequirement(this.tasks[0], this.tasks[2]);
        // this.drawRequirement(this.tasks[2], this.tasks[4]);
    }

    public test() {
        console.log(this.d3TaskUtility.tasks);
    }

    private initContainer() {
        this.d3ContainerUtility.init('svg');
        this.d3ContainerUtility.applyMargin(this.margin);
    }

    private initAxis() {
        this.xScale = d3Scale.scaleTime().range([0, this.getWidth()]);
        this.yScale = d3Scale.scaleBand().range([0, this.getHeight()]);

        this.xScale.domain([
            d3Array.min(this.tasks, (d) => d.createdOn),
            d3Array.max(this.tasks, (d) => d.dueTo),
        ]);

        this.yScale.domain(this.tasks.map((t) => t.name ));

        this.d3ContainerUtility.xScale = this.xScale;
        this.d3ContainerUtility.yScale = this.yScale;
    }

    private drawAxis() {
        this.d3ContainerUtility.svg.append('g')
            .attr('class', 'axis axis--x')
            .attr('transform', `translate(0, ${ this.getHeight() })`)
            .call(d3Axis.axisBottom(this.xScale).ticks(this.getDateDiffInDays()).tickFormat(this.getDateFormat()));
    }

    private drawRequirement(requiredTask: GanttTaskModel, requiredTaskBy: GanttTaskModel) {
        // Create path.
        const path = d3Path.path();

        const curveX0 = (this.xScale(requiredTask.dueTo) - this.xScale(requiredTask.createdOn)) / 2 + this.xScale(requiredTask.createdOn);
        const curveY0 = this.yScale(requiredTaskBy.name);

        const curveX1 = curveX0 + this.cellHeight / 2;
        const curveY1 = curveY0 + this.cellHeight / 2;

        // Draw vertical line to requiredTaskBy.
        path.moveTo(curveX0, this.yScale(requiredTask.name) + this.cellHeight);
        path.lineTo(curveX0, curveY0);

        // Bend the curve
        path.bezierCurveTo(curveX0, curveY0 + this.cellHeight / 2, curveX1, curveY1, curveX1, curveY1);

        // Finish line to task.
        path.lineTo(this.xScale(requiredTaskBy.createdOn), this.yScale(requiredTaskBy.name) + this.cellHeight / 2);

        // Append arrow head.
        path.lineTo(this.xScale(requiredTaskBy.createdOn) - this.cellHeight / 10, this.yScale(requiredTaskBy.name) + this.cellHeight / 2.5);
        path.lineTo(this.xScale(requiredTaskBy.createdOn), this.yScale(requiredTaskBy.name) + this.cellHeight / 2);
        path.lineTo(this.xScale(requiredTaskBy.createdOn) - this.cellHeight / 10 , this.yScale(requiredTaskBy.name) + (this.cellHeight - this.cellHeight / 2.5));

        // Append line to graph
        this.d3ContainerUtility.svg
            .append('g')
            .attr('class', 'dependency')
            .append('path')
            .attr('d', path);
    }

    /** Returns a user specified time format. If none was specified - a null will be returned. */
    private getDateFormat() {
        return this.dateFormat ? d3timeFormat.timeFormat(this.dateFormat) : null;
    }

    private drawGrid() {
        if (this.hGrid) {
            this.d3ContainerUtility.svg
                .append('g')
                .call( d3Axis.axisLeft(this.yScale).ticks(this.tasks.length).tickSize(-this.getWidth()).tickFormat('' as any) )
                .attr('transform', `translate(0, ${ -this.cellHeight / 2 })`)
                .attr('class', 'grid');
        }

        if (this.vGrid) {
            this.d3ContainerUtility.svg
                .append('g')
                .call(d3Axis.axisBottom(this.xScale).ticks(this.getDateDiffInDays()).tickSize(this.getHeight()).tickFormat('' as any))
                .attr('class', 'grid');
        }
    }

    private drawTasks() {
        this.d3TaskUtility.initTasks(this.d3ContainerUtility.svg, this.tasks);
        this.d3TaskUtility.invalidate();

        this.d3TaskUtility.tasks.on('click', (task) => this.onTaskClick(task));
    }

    /** Emit that task was clicked */
    private onTaskClick(task: GanttTaskModel) {
        this.taskClick.emit(task);
    }

    private getHeight(): number {
        return this.tasks.length * this.cellHeight;
    }

    private getWidth(): number {
        return this.getDateDiffInDays() * this.cellWidth;
    }

    private getDateDiffInDays(): number {
        const minDate: Date = d3Array.min(this.tasks, (t) => t.createdOn);
        const maxDate: Date = d3Array.max(this.tasks, (t) => t.dueTo);

        const oneDay = 1000 * 60 * 60 * 24; // One day in milliseconds

        return Math.ceil((maxDate.getTime() - minDate.getTime()) / oneDay);
    }
}
