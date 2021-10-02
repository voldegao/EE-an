import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MadfComponent } from './madf.component';

describe('MadfComponent', () => {
  let component: MadfComponent;
  let fixture: ComponentFixture<MadfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MadfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MadfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
