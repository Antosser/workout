import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LICENSEComponent } from './license.component';

describe('LICENSEComponent', () => {
  let component: LICENSEComponent;
  let fixture: ComponentFixture<LICENSEComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LICENSEComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LICENSEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
