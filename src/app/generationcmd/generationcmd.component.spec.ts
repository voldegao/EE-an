/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GenerationcmdComponent } from './generationcmd.component';

describe('GenerationcmdComponent', () => {
  let component: GenerationcmdComponent;
  let fixture: ComponentFixture<GenerationcmdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerationcmdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerationcmdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
