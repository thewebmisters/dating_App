import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientChat } from './client-chat';

describe('ClientChat', () => {
  let component: ClientChat;
  let fixture: ComponentFixture<ClientChat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientChat]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientChat);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
