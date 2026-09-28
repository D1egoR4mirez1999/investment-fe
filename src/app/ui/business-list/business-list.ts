import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { IBusinessSummaryListItem } from '../../domain/business';
import { Api } from '../../infrastructure/api';
import { Auth } from '../../infrastructure/auth';
import { FormatMoney } from '../shared/pipes/format-money/format-money';

@Component({
  selector: 'app-business-list',
  imports: [RouterLink, FormatMoney],
  template: `
    <section class="mx-auto max-w-3xl px-4 py-8">
      <header class="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-semibold text-slate-900">Negocios</h1>
          @if (user(); as currentUser) {
            <p class="text-sm text-slate-600">Hola, {{ currentUser.name }}</p>
          }
        </div>
        <button
          type="button"
          class="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50"
          (click)="logout()"
        >
          Salir
        </button>
      </header>

      @if (loading()) {
        <p class="text-slate-600">Cargando…</p>
      } @else if (error()) {
        <p class="text-red-600" role="alert">{{ error() }}</p>
      } @else if (businesses().length === 0) {
        <p class="text-slate-600">No tienes negocios asignados.</p>
      } @else {
        <ul class="space-y-3">
          @for (business of businesses(); track business.id) {
            <li>
              <a
                [routerLink]="['/businesses', business.id]"
                class="block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-violet-300"
              >
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <h2 class="text-lg font-medium text-slate-900">{{ business.name }}</h2>
                    <p class="mt-1 text-sm text-slate-600">
                      Rol: {{ business.role === 'INVESTOR' ? 'Inversionista' : 'Socia' }}
                      · {{ business.sharePercent }}%
                    </p>
                  </div>
                  <p class="text-sm font-medium text-slate-800">
                    {{ business.totalInvestmentCents | formatMoney }}
                  </p>
                </div>
              </a>
            </li>
          }
        </ul>
      }
    </section>
  `,
})
export class BusinessList implements OnInit {
  private readonly api = inject(Api);
  private readonly auth = inject(Auth);
  private readonly destroyRef = inject(DestroyRef);

  readonly user = this.auth.user;
  readonly businesses = signal<IBusinessSummaryListItem[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    if (!this.auth.user()) {
      this.auth.loadMe().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
    }

    this.api
      .getBusinesses()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (items) => {
          this.businesses.set(items);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('No se pudieron cargar los negocios');
          this.loading.set(false);
        },
      });
  }

  logout(): void {
    this.auth.logout();
  }
}
