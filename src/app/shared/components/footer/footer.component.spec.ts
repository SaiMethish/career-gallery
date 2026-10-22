import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    component = new FooterComponent();
  });

  it('should initialize with the current calendar year', () => {
    expect(component.currentYear).toBe(new Date().getFullYear());
  });
});
