import { TestBed } from '@angular/core/testing';
import { AppComponentB2C } from '../../../app.component';

describe('AppComponentB2C', () => {
  beforeEach(() => TestBed.configureTestingModule({
    declarations: [AppComponentB2C]
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponentB2C);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'PurseStrings-FrontEnd-Angular'`, () => {
    const fixture = TestBed.createComponent(AppComponentB2C);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('PurseStrings-FrontEnd-Angular');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponentB2C);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain('PurseStrings-FrontEnd-Angular app is running!');
  });
});
