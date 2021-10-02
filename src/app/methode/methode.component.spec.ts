/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MethodeComponent } from './methode.component';

describe('MethodeComponent', () => {
  let component: MethodeComponent;
  let fixture: ComponentFixture<MethodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MethodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MethodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
