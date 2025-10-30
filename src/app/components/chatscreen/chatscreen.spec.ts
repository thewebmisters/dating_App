import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Chatscreen } from './chatscreen';

describe('Chatscreen', () => {
  let component: Chatscreen;
  let fixture: ComponentFixture<Chatscreen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Chatscreen]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Chatscreen);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
