import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapGrillaComponent } from './map-grilla.component';

describe('MapGrillaComponent', () => {
  let component: MapGrillaComponent;
  let fixture: ComponentFixture<MapGrillaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapGrillaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapGrillaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
