import { TestBed } from '@angular/core/testing';

import { GanttChartService } from './gantt-chart.service';

describe('GanttChartService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GanttChartService = TestBed.get(GanttChartService);
    expect(service).toBeTruthy();
  });
});
