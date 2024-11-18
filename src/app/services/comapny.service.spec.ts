import { TestBed } from '@angular/core/testing';

import { ComapnyService } from './comapny.service';
import { provideHttpClient } from '@angular/common/http';

describe('ComapnyService', () => {
  let service: ComapnyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    });
    service = TestBed.inject(ComapnyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
