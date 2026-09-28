import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  template: `<router-outlet />`,
  styles: `
    :host {
      display: block;
      min-height: 100dvh;
      background: #f8fafc;
      color: #0f172a;
      font-family:
        Inter,
        system-ui,
        -apple-system,
        Segoe UI,
        Roboto,
        sans-serif;
    }
  `,
})
export class App {}
