/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RalanceComponent } from './ralance.component';

describe('RalanceComponent', () => {
  let component: RalanceComponent;
  let fixture: ComponentFixture<RalanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RalanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
