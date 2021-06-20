import { TestBed } from '@angular/core/testing';

import { ChatWithUserResolver } from './chat-with-user.resolver';

describe('ChatWithUserResolver', () => {
  let resolver: ChatWithUserResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(ChatWithUserResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
