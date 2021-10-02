import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShartComponent } from './shart.component';

describe('ShartComponent', () => {
  let component: ShartComponent;
  let fixture: ComponentFixture<ShartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
