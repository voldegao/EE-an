import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MadpComponent } from './madp.component';

describe('MadpComponent', () => {
  let component: MadpComponent;
  let fixture: ComponentFixture<MadpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MadpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MadpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
