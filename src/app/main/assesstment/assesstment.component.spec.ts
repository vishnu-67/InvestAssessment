import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssesstmentComponent } from './assesstment.component';

describe('AssesstmentComponent', () => {
  let component: AssesstmentComponent;
  let fixture: ComponentFixture<AssesstmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssesstmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssesstmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
