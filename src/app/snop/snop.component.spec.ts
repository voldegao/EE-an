/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SnopComponent } from './snop.component';

describe('Snopomponent', () => {
  let component: SnopComponent;
  let fixture: ComponentFixture<SnopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
