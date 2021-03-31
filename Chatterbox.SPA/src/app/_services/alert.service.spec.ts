/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AlertService } from './alert.service';

describe('Service: Toastr', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AlertService]
    });
  });

  it('should ...', inject([AlertService], (service: AlertService) => {
    expect(service).toBeTruthy();
  }));
});
