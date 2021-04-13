import { TestBed } from '@angular/core/testing';

import { ChannelListResolver } from './channel-list.resolver';

describe('ChannelListResolver', () => {
  let resolver: ChannelListResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(ChannelListResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
