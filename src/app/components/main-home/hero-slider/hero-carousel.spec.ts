import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroCarousel } from './hero-slider';

describe('HeroCarousel', () => {
  let component: HeroCarousel;
  let fixture: ComponentFixture<HeroCarousel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroCarousel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroCarousel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
