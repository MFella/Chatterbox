import { TestBed } from '@angular/core/testing';

import { UserListResolver } from './user-list.resolver';

describe('UserListResolver', () => {
  let resolver: UserListResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(UserListResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
