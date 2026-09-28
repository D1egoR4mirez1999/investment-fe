import { Component, computed, output, signal } from '@angular/core';
import {
  form,
  FormField,
  FormRoot,
  min,
  required,
  validate,
} from '@angular/forms/signals';
import {
  buildCreateTransactionRequest,
  categoriesForType,
  ICreateTransactionRequest,
  isCategoryAllowedForType,
  TRANSACTION_CATEGORY,
  TRANSACTION_TYPE,
} from '../../../../domain/transaction/transaction';
import { CategoryLabel } from '../../pipes/category-label/category-label';
import { IMovementForm } from '../../interfaces/movement-form';

@Component({
  selector: 'app-movement-form',
  imports: [FormField, FormRoot, CategoryLabel],
  template: `
    <section class="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 class="text-lg font-medium text-slate-900">Registrar movimiento</h2>
      <form class="mt-4 grid gap-3 sm:grid-cols-2" [formRoot]="movementForm">
        <label class="block text-sm">
          <span class="font-medium text-slate-700">Tipo</span>
          <select
            [formField]="movementForm.type"
            class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            (change)="onTypeChange()"
          >
            <option [value]="incomeType">Ingreso</option>
            <option [value]="expenseType">Gasto</option>
          </select>
        </label>

        <label class="block text-sm">
          <span class="font-medium text-slate-700">Categoría</span>
          <select
            [formField]="movementForm.category"
            class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            @for (category of categories(); track category) {
              <option [value]="category">{{ category | categoryLabel }}</option>
            }
          </select>
        </label>

        <label class="block text-sm">
          <span class="font-medium text-slate-700">Monto (MXN)</span>
          <input
            type="number"
            step="0.01"
            [formField]="movementForm.amountPesos"
            class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>

        <label class="block text-sm">
          <span class="font-medium text-slate-700">Fecha</span>
          <input
            type="date"
            [formField]="movementForm.occurredOn"
            class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>

        <label class="block text-sm sm:col-span-2">
          <span class="font-medium text-slate-700">Nota</span>
          <input
            type="text"
            [formField]="movementForm.note"
            class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>

        @if (formError()) {
          <p class="sm:col-span-2 text-sm text-red-600" role="alert">{{ formError() }}</p>
        }

        <button
          type="submit"
          class="sm:col-span-2 rounded-lg bg-violet-600 px-4 py-2.5 font-medium text-white hover:bg-violet-700 disabled:opacity-60"
          [disabled]="saving()"
        >
          {{ saving() ? 'Guardando…' : 'Guardar movimiento' }}
        </button>
      </form>
    </section>
  `,
})
export class MovementForm {
  readonly saved = output<ICreateTransactionRequest>();

  readonly saving = signal(false);
  readonly formError = signal<string | null>(null);

  readonly incomeType = TRANSACTION_TYPE.income;
  readonly expenseType = TRANSACTION_TYPE.expense;

  readonly movementModel = signal<IMovementForm>({
    type: TRANSACTION_TYPE.income,
    category: TRANSACTION_CATEGORY.haircut,
    amountPesos: 0,
    occurredOn: '2026-03-15',
    note: '',
  });

  readonly categories = computed(() => categoriesForType(this.movementModel().type));

  readonly movementForm = form(
    this.movementModel,
    (path) => {
      required(path.type);
      required(path.category);
      required(path.amountPesos);
      min(path.amountPesos, 0.01);
      required(path.occurredOn);
      validate(path.category, ({ valueOf }) => {
        const type = valueOf(path.type);
        const category = valueOf(path.category);
        if (!isCategoryAllowedForType(type, category)) {
          return { kind: 'category', message: 'Categoría no válida para el tipo' };
        }
        return undefined;
      });
    },
    {
      submission: {
        action: async (): Promise<void> => this.emitSaved(),
      },
    },
  );

  onTypeChange(): void {
    const categories = categoriesForType(this.movementModel().type);
    this.movementForm.category().value.set(categories[0]);
  }

  setSaving(saving: boolean): void {
    this.saving.set(saving);
  }

  setFormError(message: string | null): void {
    this.formError.set(message);
  }

  resetAmounts(): void {
    this.movementForm.amountPesos().value.set(0);
    this.movementForm.note().value.set('');
  }

  private emitSaved(): void {
    const request = buildCreateTransactionRequest(this.movementModel());
    if (!request) {
      this.formError.set('No se pudo armar el movimiento');
      return;
    }
    this.formError.set(null);
    this.saved.emit(request);
  }
}
