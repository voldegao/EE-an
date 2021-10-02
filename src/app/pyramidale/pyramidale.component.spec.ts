/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PyramidaleComponent } from './pyramidale.component';

describe('PyramidaleComponent', () => {
  let component: PyramidaleComponent;
  let fixture: ComponentFixture<PyramidaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PyramidaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PyramidaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
