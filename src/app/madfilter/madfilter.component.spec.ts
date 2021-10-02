import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MadfilterComponent } from './madfilter.component';

describe('MadfilterComponent', () => {
  let component: MadfilterComponent;
  let fixture: ComponentFixture<MadfilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MadfilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MadfilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
