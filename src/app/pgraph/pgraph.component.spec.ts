import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PgraphComponent } from './pgraph.component';

describe('PgraphComponent', () => {
  let component: PgraphComponent;
  let fixture: ComponentFixture<PgraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PgraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PgraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
