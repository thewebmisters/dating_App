import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyCredit } from './buy-credit';

describe('BuyCredit', () => {
  let component: BuyCredit;
  let fixture: ComponentFixture<BuyCredit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuyCredit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyCredit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
