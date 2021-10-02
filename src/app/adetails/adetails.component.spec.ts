import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdetailsComponent } from './adetails.component';

describe('AdetailsComponent', () => {
  let component: AdetailsComponent;
  let fixture: ComponentFixture<AdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
