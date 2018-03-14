import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import {TaskModel} from './gantt-chart/task.model';

const Tasks: TaskModel[] = [
  {
    createdOn: new Date('2014-03-08T12:00:00.000Z'),
    dueTo: new Date('2014-03-09T12:00:00.000Z'),
    name: 'Task 1'
  },
  {
    createdOn: new Date('2014-03-09T12:00:00.000Z'),
    dueTo: new Date('2014-03-11T12:00:00.000Z'),
    name: 'Task 2'
  },
  {
    createdOn: new Date('2014-03-11T12:00:00.000Z'),
    dueTo: new Date('2014-03-12T15:00:00.000Z'),
    name: 'Task 3'
  },
  {
    createdOn: new Date('2014-03-12T15:00:00.000Z'),
    dueTo: new Date('2014-03-18T12:00:00.000Z'),
    name: 'Task 4'
  },
  {
    createdOn: new Date('2014-03-18T12:00:00.000Z'),
    dueTo: new Date('2014-03-21T00:00:00.000Z'),
    name: 'Task 5'
  },
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {

  private margin = {top: 50, right: 100, bottom: 100, left: 100};
  private width: number;
  private height: number;
  private x: any;
  private y: any;
  private svg: any;
  private line: d3Shape.Line<[number, number]>;

  public window: Window;

  constructor() {
    this.window = window;
    this.width = window.innerWidth - this.margin.left - this.margin.right;
    this.height = window.innerHeight - this.margin.top - this.margin.bottom;
  }

  ngOnInit(): void {
    this.initSvg();
    this.initAxis();
    this.drawAxis();
    this.drawGrid();
    this.drawTasks();
    // this.drawLine();
  }

  private initSvg() {
    this.svg = d3.select('svg')
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
  }

  private initAxis() {
    this.x = d3Scale.scaleTime().range([0, this.width]);
    this.y = d3Scale.scaleBand().range([0, this.height]);

    this.x.domain([
      d3Array.min(Tasks, (d) => d.createdOn),
      d3Array.max(Tasks, (d) => d.dueTo),
    ]);

    this.y.domain(Tasks.map((t) => t.name ));
  }

  private drawAxis() {
    this.drawYAxis();
    this.drawXAxis();
  }

  private drawYAxis() {
    this.svg.append('g')
      .attr('class', 'axis axis--y')
      .call(d3Axis.axisLeft(this.y))
      .append('text')
      .attr('class', 'axis-title')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('Task name');
  }

  private drawXAxis() {
    this.svg.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0, ${this.height})`)
      .call(d3Axis.axisBottom(this.x));

  }

  private drawGrid() {
    const yScale = d3Scale.scaleLinear()
      .range([this.height, 0]);

    this.svg
      .append('g')
      .call( d3Axis.axisLeft(yScale).ticks(Tasks.length).tickSize(-this.width).tickFormat('' as any) )
      .attr('class', 'grid');

    const xScale = d3Scale.scaleTime()
      .range([this.width, 0])
      .domain([
        d3Array.min(Tasks, (d) => d.createdOn),
        d3Array.max(Tasks, (d) => d.dueTo),
      ]);



    this.svg
      .append('g')
      .call(d3Axis.axisBottom(this.x).tickSize(this.height).tickFormat('' as any))
      .attr('class', 'grid');
  }

  private drawTasks() {
    this.svg
      .append('g')
      .selectAll('rect')
      .data(Tasks)
      .enter()
      .append('rect')
      .attr('class', 'task-rect')
      .attr('x', (d) => this.x(d.createdOn))
      .attr('y', (d) => this.y(d.name))
      .attr('rx', 3)
      .attr('ry', 3)
      .attr('height', (d) => this.y.bandwidth())
      .attr('width', (d) => this.x(d.dueTo) - this.x(d.createdOn));
  }

  private drawLine() {
    this.svg
      .select('line')
      .attr('x1', () => this.x(Tasks[0].createdOn))
      .attr('y1', () => this.y(Tasks[0].name))
      .attr('x2', () => this.x(Tasks[1].createdOn))
      .attr('y2', () => this.y(Tasks[1].name));
  }

}
