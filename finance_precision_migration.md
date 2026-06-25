# Financial Precision Migration Plan

## Problem Statement
During the Omega Master Audit, we discovered that financial data types across the ConstructOS ERP are using IEEE 754 `Float` types instead of arbitrary-precision `Decimal`. In enterprise financial systems, `Float` types inevitably lead to rounding errors when calculating taxes, compounding interest, or aggregating large ledgers.

## Affected Models (Prisma Schema)
The following core financial models currently use `Float`:

1. **`Invoice`**
   - `subtotal Float`
   - `taxAmount Float`
   - `discount Float`
   - `grandTotal Float`
   - `paidAmount Float`
   - `dueAmount Float`

2. **`LedgerAccount`**
   - `balance Float`

3. **`LedgerEntry`**
   - `debit Float`
   - `credit Float`
   - `balance Float`

4. **`Payment`**
   - `totalAmount Float`
   - `unusedAmount Float`

5. **`PaymentTransaction`**
   - `amountApplied Float`

## Proposed Fix (Requires Major Version Bump)
Migrating these fields from `Float` to `Decimal` requires the following steps:

1. **Schema Update:** Change `Float` to `Decimal` in `apps/api/prisma/schema.prisma` for the affected fields.
2. **TypeScript Refactor:** Prisma's `Decimal` type maps to `Prisma.Decimal` in TypeScript, which is an object, not a primitive `number`. This means we must refactor every DTO, Controller, and Service that currently expects a primitive `number` for these fields.
3. **Database Migration:** Run `prisma migrate deploy` to alter the underlying PostgreSQL columns from `DOUBLE PRECISION` to `DECIMAL(10, 2)`.

> [!WARNING]
> Because changing the TypeScript types for financial data affects hundreds of DTOs and arithmetic operators (`+`, `-` must become `.add()`, `.sub()`), this migration should be planned for the next major release (v2.0) and tested thoroughly in a staging environment.
