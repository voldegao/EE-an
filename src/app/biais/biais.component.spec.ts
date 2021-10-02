import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiaisComponent } from './biais.component';

describe('BiaisComponent', () => {
  let component: BiaisComponent;
  let fixture: ComponentFixture<BiaisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiaisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BiaisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
