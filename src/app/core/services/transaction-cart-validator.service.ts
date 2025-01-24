import { Injectable } from '@angular/core';
import { CartTransaction } from '@core/models/transaction-cart.models';

@Injectable({
  providedIn: 'root'
})
export class TransactionCartValidatorService {
  validateTransaction(transaction: Partial<CartTransaction>): string | null {
    // Validation du type de transaction
    if (!transaction.type) {
      return 'Le type de transaction est requis';
    }

    // Validation du montant
    if (!transaction.amount || transaction.amount <= 0) {
      return 'Le montant doit être supérieur à 0';
    }

    // Validation spécifique pour les transferts
    if (transaction.type === 'TRANSFER') {
      if (!transaction.sourceAccountId) {
        return 'Le compte source est requis pour un transfert';
      }
      if (!transaction.destinationAccountId) {
        return 'Le compte destinataire est requis pour un transfert';
      }
      if (transaction.sourceAccountId === transaction.destinationAccountId) {
        return 'Les comptes source et destinataire doivent être différents';
      }
    }

    // Validation pour les dépôts
    if (transaction.type === 'DEPOSIT' && !transaction.destinationAccountId) {
      return 'Le compte destinataire est requis pour un dépôt';
    }

    // Validation pour les retraits
    if (transaction.type === 'WITHDRAWAL' && !transaction.sourceAccountId) {
      return 'Le compte source est requis pour un retrait';
    }

    return null;
  }
}
