import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WycieczkiViewComponent } from './wycieczki-view.component';

describe('WycieczkiViewComponent', () => {
  let component: WycieczkiViewComponent;
  let fixture: ComponentFixture<WycieczkiViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WycieczkiViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WycieczkiViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
