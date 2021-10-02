import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CofficientTwoComponent } from './cofficient-two.component';

describe('CofficientTwoComponent', () => {
  let component: CofficientTwoComponent;
  let fixture: ComponentFixture<CofficientTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CofficientTwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CofficientTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
