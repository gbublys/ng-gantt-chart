import { TestBed, inject } from '@angular/core/testing';

import { D3TaskUtilityService } from './d3-task-utility.service';

describe('D3TaskUtilityService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [D3TaskUtilityService]
    });
  });

  it('should be created', inject([D3TaskUtilityService], (service: D3TaskUtilityService) => {
    expect(service).toBeTruthy();
  }));
});
