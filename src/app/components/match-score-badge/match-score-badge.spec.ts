import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchScoreBadge } from './match-score-badge';

describe('MatchScoreBadge', () => {
  let component: MatchScoreBadge;
  let fixture: ComponentFixture<MatchScoreBadge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchScoreBadge]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchScoreBadge);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
