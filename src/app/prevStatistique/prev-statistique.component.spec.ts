import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrevStatistiqueComponent } from './prev-statistique.component';

describe('PrevStatistiqueComponent', () => {
  let component: PrevStatistiqueComponent;
  let fixture: ComponentFixture<PrevStatistiqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrevStatistiqueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrevStatistiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
