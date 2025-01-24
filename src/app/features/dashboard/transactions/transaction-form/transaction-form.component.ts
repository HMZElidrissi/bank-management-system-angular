import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { TransactionCartFacade } from '@core/services/transaction-cart.facade';
import { Account } from '@core/models/account.models';
import { AccountService } from '@core/services/account.service';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  template: `
    <form [formGroup]="transactionForm" (ngSubmit)="onSubmit()" class="space-y-4">
      <!-- Type de transaction -->
      <div>
        <label class="block text-sm font-medium text-gray-700">Type de transaction</label>
        <select
          formControlName="type"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Sélectionnez un type</option>
          <option value="DEPOSIT">Dépôt</option>
          <option value="WITHDRAWAL">Retrait</option>
          <option value="TRANSFER">Virement</option>
        </select>
      </div>

      <!-- Montant -->
      <div>
        <label class="block text-sm font-medium text-gray-700">Montant</label>
        <input
          type="number"
          formControlName="amount"
          min="0"
          step="0.01"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <!-- Compte source (pour retrait et virement) -->
      <div *ngIf="showSourceAccount">
        <label class="block text-sm font-medium text-gray-700">Compte source</label>
        <select
          formControlName="sourceAccountId"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Sélectionnez un compte</option>
          <option *ngFor="let account of accounts" [value]="account.id">
            Compte {{ account.id }} - Solde: {{ account.balance | currency }}
          </option>
        </select>
      </div>

      <!-- Compte destinataire (pour dépôt et virement) -->
      <div *ngIf="showDestinationAccount">
        <label class="block text-sm font-medium text-gray-700">Compte destinataire</label>
        <select
          formControlName="destinationAccountId"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Sélectionnez un compte</option>
          <option *ngFor="let account of accounts" [value]="account.id">
            Compte {{ account.id }} - Solde: {{ account.balance | currency }}
          </option>
        </select>
      </div>

      <!-- Description -->
      <div>
        <label class="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          formControlName="description"
          rows="3"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        ></textarea>
      </div>

      <!-- Submit Button -->
      <div class="flex justify-end">
        <button
          type="submit"
          [disabled]="!transactionForm.valid || (isCartFull$ | async)"
          class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          Ajouter au panier
        </button>
      </div>
    </form>
  `
})
export class TransactionFormComponent implements OnInit {
  transactionForm!: FormGroup;
  accounts: Account[] = [];
  isCartFull$ = this.cartFacade.isCartFull$;

  constructor(
    private fb: FormBuilder,
    private cartFacade: TransactionCartFacade,
    private accountService: AccountService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadAccounts();
    this.setupTypeListener();
  }

  private initForm(): void {
    this.transactionForm = this.fb.group({
      type: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      sourceAccountId: [''],
      destinationAccountId: [''],
      description: ['']
    });
  }

  private loadAccounts(): void {
    this.accountService.getMyAccounts().subscribe((accounts) => (this.accounts = accounts));
  }

  private setupTypeListener(): void {
    this.transactionForm.get('type')?.valueChanges.subscribe((type) => {
      this.updateAccountValidators(type);
    });
  }

  private updateAccountValidators(type: string): void {
    const sourceControl = this.transactionForm.get('sourceAccountId');
    const destControl = this.transactionForm.get('destinationAccountId');

    // Reset validators
    sourceControl?.clearValidators();
    destControl?.clearValidators();

    // Apply new validators based on type
    switch (type) {
      case 'DEPOSIT':
        destControl?.setValidators(Validators.required);
        break;
      case 'WITHDRAWAL':
        sourceControl?.setValidators(Validators.required);
        break;
      case 'TRANSFER':
        sourceControl?.setValidators(Validators.required);
        destControl?.setValidators(Validators.required);
        break;
    }

    // Update validity
    sourceControl?.updateValueAndValidity();
    destControl?.updateValueAndValidity();
  }

  get showSourceAccount(): boolean {
    const type = this.transactionForm.get('type')?.value;
    return type === 'WITHDRAWAL' || type === 'TRANSFER';
  }

  get showDestinationAccount(): boolean {
    const type = this.transactionForm.get('type')?.value;
    return type === 'DEPOSIT' || type === 'TRANSFER';
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      this.cartFacade.addTransaction(this.transactionForm.value);
      this.transactionForm.reset();
    }
  }
}
