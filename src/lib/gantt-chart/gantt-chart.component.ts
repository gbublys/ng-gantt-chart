import {Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {GanttTaskModel} from './gantt-task.model';

import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import * as d3timeFormat from 'd3-time-format';
import * as d3Zoom from 'd3-zoom';
import * as d3 from 'd3';

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

    private xAxis: any;
    private drawnXAxis: any;

    private gridVContainer;
    private gridHContainer;

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
            this.initGrid();
            this.initTasks();
            this.initDependencies();

            this.drawGrid();
            this.drawTasks();
            this.drawDependencies();
            this.drawAxis();

            this.d3ContainerUtility.svgContainer.call(
                d3Zoom.zoom()
                    .scaleExtent([1, 4])
                    .translateExtent(
                        [
                            [0, 0],
                            [this.getWidth(), 0]
                        ]
                    )
                    .on('zoom', () => this.onZoom())
            );
        });
    }

    @HostListener('window:resize', ['$event.target'])
    public onResize(): void {
        this.ngOnInit();
    }

    @Input() public set tasks(tasks: GanttTaskModel[]) {
        this.d3TaskUtility.tasks = tasks.map(t => new GanttTaskModel(t as any));
    }
    public get tasks() { return this.d3TaskUtility.tasks; }

    public getHeight(): number { return this.tasks.length * this.cellHeight; }

    public getWidth(): number {
        const width = this.getAvailableChartWidth();

        const suggestedWidth = this.getTickCount() * this.cellWidth;
        return suggestedWidth > width ? suggestedWidth : width;
    }

    private onZoom() {
        const updateXScale = d3.event.transform.rescaleX(this.xScale);

        // re-scale y axis during zoom; ref [2]
        this.drawnXAxis.transition()
            .duration(50)
            .call(this.xAxis.scale(updateXScale));

        this.d3ContainerUtility.xScale = updateXScale;

        this.d3TaskUtility.invalidate();
        this.drawGrid();
        this.d3DependenciesUtility.invalidate();
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

        this.xAxis = d3Axis.axisBottom(this.xScale).ticks(10).tickFormat(this.getDateFormat());
    }

    private drawAxis() {
        this.drawnXAxis = this.d3ContainerUtility.svg.append('g')
            .attr('class', 'axis axis--x')
            .attr('transform', `translate(0, ${ this.getHeight() })`)
            .call(this.xAxis);
    }

    private initGrid() {
        this.gridVContainer = this.d3ContainerUtility.svg.append('g').attr('class', 'v-grid');
        this.gridHContainer = this.d3ContainerUtility.svg.append('g').attr('class', 'h-grid');
    }

    private initTasks() {
        this.d3TaskUtility.init();
    }

    private initDependencies() {
        this.d3DependenciesUtility.init();
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
            this.gridHContainer
                .transition().duration(50)
                .call( d3Axis.axisLeft(this.yScale).ticks(this.tasks.length).tickSize(-this.getWidth()).tickFormat('' as any) )
                .attr('transform', `translate(0, ${ -this.cellHeight / 2 })`)
                .attr('class', 'grid');
        }

        if (this.vGrid) {
            this.gridVContainer
                .transition().duration(50)
                .call(
                    d3Axis
                        .axisBottom(this.d3ContainerUtility.xScale)
                        .tickSize(this.getHeight())
                        .tickFormat('' as any))
                .attr('class', 'grid');
        }
    }

    private drawTasks() {
        this.d3TaskUtility.invalidate();
        // this.d3TaskUtility.d3Tasks.on('click', (task) => this.onTaskClick(task));
    }

    /** Emit that task was clicked */
    private onTaskClick(task: GanttTaskModel) {
        this.taskClick.emit(task);
    }

    private getTickCount(): number {
        return this.tickCount || this.getAvailableChartWidth() / 70;
    }
}
