import { TestBed } from '@angular/core/testing';

import { MessagesResolver } from './messages.resolver';

describe('MessagesResolver', () => {
  let resolver: MessagesResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(MessagesResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
