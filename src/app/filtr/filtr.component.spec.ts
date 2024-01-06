import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrComponent } from './filtr.component';

describe('FiltrComponent', () => {
  let component: FiltrComponent;
  let fixture: ComponentFixture<FiltrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FiltrComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FiltrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
