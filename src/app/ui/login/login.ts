import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import {
  email,
  form,
  FormField,
  FormRoot,
  minLength,
  required,
} from '@angular/forms/signals';
import { Auth } from '../../infrastructure/auth';
import { ILoginForm } from './interfaces/login-form';

@Component({
  selector: 'app-login',
  imports: [FormField, FormRoot],
  template: `
    <section class="mx-auto flex min-h-dvh max-w-md items-center px-4">
      <form
        class="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        [formRoot]="loginForm"
      >
        <h1 class="text-2xl font-semibold text-slate-900">Iniciar sesión</h1>
        <p class="mt-2 text-sm text-slate-600">
          Accede como inversionista o socia para ver el libro del negocio.
        </p>

        <label class="mt-6 block text-sm font-medium text-slate-700" for="email">
          Correo
        </label>
        <input
          id="email"
          type="email"
          [formField]="loginForm.email"
          class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-violet-500"
          autocomplete="username"
        />

        <label class="mt-4 block text-sm font-medium text-slate-700" for="password">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          [formField]="loginForm.password"
          class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-violet-500"
          autocomplete="current-password"
        />

        @if (error()) {
          <p class="mt-3 text-sm text-red-600" role="alert">{{ error() }}</p>
        }

        <button
          type="submit"
          class="mt-6 w-full rounded-lg bg-violet-600 px-4 py-2.5 font-medium text-white hover:bg-violet-700 disabled:opacity-60"
          [disabled]="loading()"
        >
          {{ loading() ? 'Entrando…' : 'Entrar' }}
        </button>

        <p class="mt-4 text-xs text-slate-500">
          Demo: investor@example.com / partner@example.com — password123
        </p>
      </form>
    </section>
  `,
})
export class Login {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly error = signal<string | null>(null);
  readonly loading = signal(false);

  readonly loginModel = signal<ILoginForm>({
    email: 'investor@example.com',
    password: 'password123',
  });

  readonly loginForm = form(
    this.loginModel,
    (path) => {
      required(path.email);
      email(path.email);
      required(path.password);
      minLength(path.password, 6);
    },
    {
      submission: {
        action: async (): Promise<void> => this.authenticate(),
      },
    },
  );

  private authenticate(): void {
    this.loading.set(true);
    this.error.set(null);

    this.auth
      .login(this.loginModel())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.auth
            .loadMe()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: () => {
                this.loading.set(false);
                void this.router.navigateByUrl('/businesses');
              },
              error: () => {
                this.loading.set(false);
                void this.router.navigateByUrl('/businesses');
              },
            });
        },
        error: () => {
          this.loading.set(false);
          this.error.set('Credenciales inválidas');
        },
      });
  }
}
