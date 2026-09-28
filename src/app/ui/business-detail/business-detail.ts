import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { IBusinessSummaryListItem } from '../../domain/business';
import { shiftMonth } from '../../domain/month/month';
import { IMonthlySummary, statusLabel } from '../../domain/summary/summary';
import {
  ICreateTransactionRequest,
  ITransaction,
} from '../../domain/transaction/transaction';
import { Api } from '../../infrastructure/api';
import { FormatMoney } from '../shared/pipes/format-money/format-money';
import { MovementForm } from './components/movement-form/movement-form';
import { CategoryLabel } from './pipes/category-label/category-label';

@Component({
  selector: 'app-business-detail',
  imports: [RouterLink, FormatMoney, CategoryLabel, MovementForm],
  templateUrl: './business-detail.html',
})
export class BusinessDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(Api);
  private readonly destroyRef = inject(DestroyRef);
  private readonly movementForm = viewChild(MovementForm);

  readonly businessId = signal('');
  readonly business = signal<IBusinessSummaryListItem | null>(null);
  readonly transactions = signal<ITransaction[]>([]);
  readonly summary = signal<IMonthlySummary | null>(null);
  readonly year = signal(2026);
  readonly month = signal(3);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly statusText = computed(() => statusLabel(this.summary()?.status));

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('Negocio no encontrado');
      this.loading.set(false);
      return;
    }
    this.businessId.set(id);
    this.reload();
  }

  changeMonth(delta: number): void {
    const next = shiftMonth(this.year(), this.month(), delta);
    this.month.set(next.month);
    this.year.set(next.year);
    this.reload();
  }

  reload(): void {
    this.loading.set(true);
    this.error.set(null);
    const id = this.businessId();
    const year = this.year();
    const month = this.month();

    forkJoin({
      business: this.api.getBusiness(id),
      transactions: this.api.getTransactions(id, year, month),
      summary: this.api.getSummary(id, year, month),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ business, transactions, summary }) => {
          this.business.set(business);
          this.transactions.set(transactions);
          this.summary.set(summary);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('No se pudo cargar el negocio');
          this.loading.set(false);
        },
      });
  }

  onMovementSaved(request: ICreateTransactionRequest): void {
    const form = this.movementForm();
    form?.setSaving(true);
    form?.setFormError(null);

    this.api
      .createTransaction(this.businessId(), request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          form?.setSaving(false);
          form?.resetAmounts();
          this.reload();
        },
        error: () => {
          form?.setSaving(false);
          form?.setFormError('No se pudo guardar el movimiento');
        },
      });
  }
}
