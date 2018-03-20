import {
    AfterContentInit, AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {GanttTaskModel} from './gantt-task.model';

import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import * as d3timeFormat from 'd3-time-format';
import {D3TaskUtilityService} from './utility/d3-task-utility.service';
import {D3SvgContainerUtilityService} from './utility/d3-svg-container-utility.service';
import {D3TaskDependencyUtility} from './utility/d3-task-dependency-utility';

@Component({
    selector: 'ng-gantt-chart',
    templateUrl: './gantt-chart.component.html',
    styleUrls: ['./gantt-chart.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        D3SvgContainerUtilityService,
        D3TaskUtilityService,
        D3TaskDependencyUtility,
    ]
})
export class GanttChartComponent implements OnInit {

    public margin = {top: 1, right: 1, bottom: 30, left: 0};

    private xScale: any;
    private yScale: any;

    private _tasks: GanttTaskModel[];

    @Input() public cellHeight = 50;
    @Input() public cellWidth = null;
    @Input() public tickCount = null;

    @Input() public dateFormat: string;
    @Input() public vGrid = true;
    @Input() public hGrid = true;

    @Output() public taskClick = new EventEmitter<GanttTaskModel>();

    @ViewChild('chartContainer', { read: ElementRef }) public chartContainer: ElementRef;

    constructor(private d3ContainerUtility: D3SvgContainerUtilityService,
                private d3TaskUtility: D3TaskUtilityService,
                private d3DependenciesUtility: D3TaskDependencyUtility) {}

    public ngOnInit(): void {
        setTimeout(() => {
            this.initContainer();
            this.initAxis();
            this.initDependencies();

            this.drawGrid();
            this.drawTasks();
            this.drawDependencies();
            this.drawAxis();
        });
    }

    @HostListener('window:resize', ['$event.target'])
    public onResize(): void {
        this.ngOnInit();
    }

    @Input() public set tasks(tasks: GanttTaskModel[]) {
        this._tasks = tasks.map(t => new GanttTaskModel(t as any));
    }
    public get tasks() { return this._tasks; }

    public getHeight(): number { return this.tasks.length * this.cellHeight; }

    public getWidth(): number {
        const width = this.getAvailableChartWidth();

        const suggestedWidth = this.getTickCount() * this.cellWidth;
        return suggestedWidth > width ? suggestedWidth : width;
    }

    /** Return the width of the chart that can span. */
    private getAvailableChartWidth(): number {
        const chartContainerClientRect = this.chartContainer.nativeElement.getBoundingClientRect();
        return Math.floor(chartContainerClientRect.width - this.margin.left - this.margin.right);
    }

    private initContainer() {
        this.d3ContainerUtility.init('svg');
        this.d3ContainerUtility.applyMargin(this.margin);
    }

    private initAxis() {
        this.xScale = d3Scale.scaleTime();
        this.yScale = d3Scale.scaleBand().range([0, this.getHeight()]);

        this.xScale.range([0, this.getWidth()]);
        this.xScale.domain([
            d3Array.min(this.tasks, (d) => d.startAt),
            d3Array.max(this.tasks, (d) => d.dueTo),
        ]);

        this.yScale.domain(this.tasks.map((t) => t.gUniqueId ));

        this.d3ContainerUtility.xScale = this.xScale;
        this.d3ContainerUtility.yScale = this.yScale;
    }

    private drawAxis() {
        this.d3ContainerUtility.svg.append('g')
            .attr('class', 'axis axis--x')
            .attr('transform', `translate(0, ${ this.getHeight() })`)
            .call(d3Axis.axisBottom(this.xScale).ticks(this.getTickCount()).tickFormat(this.getDateFormat()));
    }

    private initDependencies() {
        this.d3DependenciesUtility.init(this.tasks);
    }

    private drawDependencies() {
        this.d3DependenciesUtility.invalidate();
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
                .call(d3Axis.axisBottom(this.xScale).tickSize(this.getHeight()).ticks(this.getTickCount()).tickFormat('' as any))
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

    private getTickCount(): number {
        return this.tickCount || this.getAvailableChartWidth() / 70;
    }
}
