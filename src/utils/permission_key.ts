export const permissionKey: Record<string, string> = {
  // =============================================================================
  // PERMISSION MAPPING - BASED ON HIERARCHICAL MENU STRUCTURE
  // =============================================================================

  // =============================================================================
  // VIEW PERMISSIONS
  // =============================================================================
  // Master
  customer: "master.customer.view",
  supplier: "master.supplier.view",
  "item-category": "master.item-category.view",
  items: "master.items.view",
  "tax-list": "master.tax-list.view",
  departemen: "master.departemen.view",
  "unit-of-measurement": "master.unit-of-measurement.view",
  "payment-method": "master.payment-method.view",
  "master-cash-bank": "master.master-cash-bank.view",
  warehouse: "master.inventory-setup.warehouse.view",
  location: "master.inventory-setup.location.view",
  "wip-account": "master.wip-account.view",

  // Accounting - CoA
  "account-class": "accounting.coa.account-class.view",
  "account-type": "accounting.coa.account-type.view",
  "account-group": "accounting.coa.account-group.view",
  "account-list": "accounting.coa.account-list.view",
  "default-account": "accounting.coa.default-account.view",

  // Accounting - Currency
  "master-currency": "accounting.currency.master-currency.view",
  "exchange-rate": "accounting.currency.exchange-rate.view",
  "exchange-rate-period": "accounting.currency.exchange-rate-period.view",

  // Accounting - Period & Balance
  "fiscal-period": "accounting.period-balance.fiscal-period.view",
  "opening-balance": "accounting.period-balance.opening-balance.view",
  "period-closing": "accounting.period-balance.period-closing.view",
  "closing-adjustment": "accounting.period-balance.closing-adjustment.view",
  "closing-journal": "accounting.period-balance.closing-journal.view",

  // Accounting - Journal Entry
  "general-journal": "accounting.journal-entry.general-journal.view",
  "adjustment-journal": "accounting.journal-entry.adjustment-journal.view",

  // Accounting - Petty Cash
  "petty-cash-open": "accounting.petty-cash.petty-cash-open.view",
  "petty-cash-realized": "accounting.petty-cash.petty-cash-realized.view",
  "petty-cash-posting": "accounting.petty-cash.petty-cash-posting.view",
  "setting-petty-cash": "accounting.petty-cash.setting-petty-cash.view",
  "request-saldo": "accounting.petty-cash.saldo.request-saldo.view",
  "approval-saldo": "accounting.petty-cash.saldo.approval-saldo.view",

  // Accounting - Reports
  "general-ledger": "accounting.reports.general-ledger.view",
  "trial-balance": "accounting.reports.trial-balance.view",
  "profit-loss": "accounting.reports.profit-loss.view",
  "balance-sheet": "accounting.reports.balance-sheet.view",

  // Accounting - Asset Management
  asset: "accounting.asset-management.asset.view",
  "asset-journal": "accounting.asset-management.asset-journal.view",

  // Accounting - Cash & Bank
  "cash-bank-transaction":
    "accounting.cash-transaction.cash-bank-transaction.view",
  "cash-bank-journal": "accounting.cash-transaction.cash-bank-journal.view",
  "foreign-exchange-transaction":
    "accounting.cash-transaction.foreign-exchange-transaction.view",
  "foreign-exchange-journal":
    "accounting.cash-transaction.foreign-exchange-journal.view",

  // Accounting - Foreign Currency Ledger
  ledger: "accounting.foreign-currency-ledger.ledger.view",
  "exchange-rate-adjustment":
    "accounting.foreign-currency-ledger.exchange-rate-adjustment.view",
  "exchange-rate-adjustment-journal":
    "accounting.foreign-currency-ledger.exchange-rate-adjustment-journal.view",

  // Purchasing - Purchase Order
  "create-po": "purchasing.purchase-order.create-po.view",
  "approval-po": "purchasing.purchase-order.approval-po.view",
  "open-po": "purchasing.purchase-order.open-po.view",
  "close-po": "purchasing.purchase-order.close-po.view",

  // Purchasing - Direct Purchase
  "create-direct-purchase":
    "purchasing.direct-purchase.create-direct-purchase.view",
  "approval-direct-purchase":
    "purchasing.direct-purchase.approval-direct-purchase.view",
  "unpaid-direct-purchase":
    "purchasing.direct-purchase.unpaid-direct-purchase.view",
  "paid-direct-purchase":
    "purchasing.direct-purchase.paid-direct-purchase.view",
  "direct-purchase-journal":
    "purchasing.direct-purchase.direct-purchase-journal.view",

  // Purchasing - Advance Payment
  "unpaid-advance-payment":
    "purchasing.advance-payment.unpaid-advance-payment.view",
  "paid-advance-payment":
    "purchasing.advance-payment.paid-advance-payment.view",
  "advance-payment-journal":
    "purchasing.advance-payment.advance-payment-journal.view",

  // Purchasing - Invoicing
  "create-invoicing": "purchasing.invoicing.create-invoicing.view",

  // Purchasing - Purchase Payment Plan
  "unpaid-payment-plan":
    "purchasing.purchase-payment-plan.unpaid-payment-plan.view",
  "paid-payment-plan":
    "purchasing.purchase-payment-plan.paid-payment-plan.view",
  "payment-journal": "purchasing.purchase-payment-plan.payment-journal.view",

  // Logistic - Inventory
  "open-grn": "logistic.inventory.open-grn.view",
  "close-grn": "logistic.inventory.close-grn.view",
  "grn-journal": "logistic.inventory.grn-journal.view",

  // Logistic - Sales Shipment
  "open-shipment": "logistic.sales-shipment.open-shipment.view",
  "close-shipment": "logistic.sales-shipment.close-shipment.view",
  "shipment-sales-journal":
    "logistic.sales-shipment.shipment-sales-journal.view",

  // Logistic - Inventory Transfer (Avg)
  "transfer-request": "logistic.inventory-transfer-avg.transfer-request.view",
  "transfer-approval": "logistic.inventory-transfer-avg.transfer-approval.view",
  "transfer-receive": "logistic.inventory-transfer-avg.transfer-receive.view",

  // Logistic - Inventory Transfer (Fifo)
  "transfer-request-fifo":
    "logistic.inventory-transfer-fifo.transfer-request-fifo.view",
  "transfer-approval-fifo":
    "logistic.inventory-transfer-fifo.transfer-approval-fifo.view",
  "transfer-receive-fifo":
    "logistic.inventory-transfer-fifo.transfer-receive-fifo.view",

  // Logistic - Disposal (Avg)
  "disposal-request": "logistic.disposal-avg.disposal-request.view",
  "disposal-check": "logistic.disposal-avg.disposal-check.view",
  "disposal-approval": "logistic.disposal-avg.disposal-approval.view",
  "disposal-journal": "logistic.disposal-avg.disposal-journal.view",

  // Logistic - Disposal (Fifo)
  "disposal-request-fifo": "logistic.disposal-fifo.disposal-request-fifo.view",
  "disposal-check-fifo": "logistic.disposal-fifo.disposal-check-fifo.view",
  "disposal-approval-fifo":
    "logistic.disposal-fifo.disposal-approval-fifo.view",
  "disposal-journal-fifo": "logistic.disposal-fifo.disposal-journal-fifo.view",

  // Logistic - Inventory Adjustment (Avg)
  "stock-opname-request":
    "logistic.inventory-adjustment-avg.stock-opname-request.view",
  "stock-opname-approval":
    "logistic.inventory-adjustment-avg.stock-opname-approval.view",
  "stock-opname-journal":
    "logistic.inventory-adjustment-avg.stock-opname-journal.view",

  // Logistic - Inventory Adjustment (Fifo)
  "stock-opname-request-fifo":
    "logistic.inventory-adjustment-fifo.stock-opname-request-fifo.view",
  "stock-opname-approval-fifo":
    "logistic.inventory-adjustment-fifo.stock-opname-approval-fifo.view",
  "stock-opname-journal-fifo":
    "logistic.inventory-adjustment-fifo.stock-opname-journal-fifo.view",

  // Logistic - Issued (Avg)
  "issued-request-avg": "logistic.issued-avg.issued-request-avg.view",
  "issued-approval-avg": "logistic.issued-avg.issued-approval-avg.view",
  "issued-open-avg": "logistic.issued-avg.issued-open-avg.view",
  "issued-closed-avg": "logistic.issued-avg.issued-closed-avg.view",
  "issued-journal-avg": "logistic.issued-avg.issued-journal-avg.view",

  // Logistic - Issued (Fifo)
  "issued-request-fifo": "logistic.issued-fifo.issued-request-fifo.view",
  "issued-approval-fifo": "logistic.issued-fifo.issued-approval-fifo.view",
  "issued-open-fifo": "logistic.issued-fifo.issued-open-fifo.view",
  "issued-closed-fifo": "logistic.issued-fifo.issued-closed-fifo.view",
  "issued-journal-fifo": "logistic.issued-fifo.issued-journal-fifo.view",

  // Logistic - Purchase Return (Avg)
  "purchase-return-request-avg":
    "logistic.purchase-return-avg.purchase-return-request-avg.view",
  "purchase-return-approval-avg":
    "logistic.purchase-return-avg.purchase-return-approval-avg.view",
  "purchase-return-shipment-avg":
    "logistic.purchase-return-avg.purchase-return-shipment-avg.view",
  "purchase-return-journal-avg":
    "logistic.purchase-return-avg.purchase-return-journal-avg.view",

  // Logistic - Purchase Return (Fifo)
  "purchase-return-request-fifo":
    "logistic.purchase-return-fifo.purchase-return-request-fifo.view",
  "purchase-return-approval-fifo":
    "logistic.purchase-return-fifo.purchase-return-approval-fifo.view",
  "purchase-return-shipment-fifo":
    "logistic.purchase-return-fifo.purchase-return-shipment-fifo.view",
  "purchase-return-journal-fifo":
    "logistic.purchase-return-fifo.purchase-return-journal-fifo.view",

  // Logistic - Non Stock
  consume: "logistic.non-stock.consume.view",
  overview: "logistic.non-stock.overview.view",

  // Logistic - Production & WIP
  "production-result-request":
    "logistic.production-result.production-result-request.view",
  "production-result-approval":
    "logistic.production-result.production-result-approval.view",
  "production-result-journal":
    "logistic.production-result.production-result-journal.view",

  // Logistic - Assembly
  "request-assembly": "logistic.assembly.request-assembly.view",
  "approval-assembly": "logistic.assembly.approval-assembly.view",
  "order-assembly": "logistic.assembly.order-assembly.view",
  "journal-assembly": "logistic.assembly.journal-assembly.view",

  // Logistic - Disassembly
  "request-disassembly": "logistic.disassembly.request-disassembly.view",
  "approval-disassembly": "logistic.disassembly.approval-disassembly.view",
  "order-disassembly": "logistic.disassembly.order-disassembly.view",
  "journal-disassembly": "logistic.disassembly.journal-disassembly.view",

  // Logistic - Inventory Report
  "import-inventory": "logistic.inventory-report.import-inventory.view",
  "movement-history": "logistic.inventory-report.movement-history.view",
  "stock-overview": "logistic.inventory-report.stock-overview.view",
  "batch-sn-tracking": "logistic.inventory-report.batch-sn-tracking.view",
  "item-list": "logistic.inventory-report.item-list.view",
  "inventory-valuation-fifo":
    "logistic.inventory-report.inventory-valuation-fifo.view",
  "inventory-valuation-avg":
    "logistic.inventory-report.inventory-valuation-avg.view",

  // Sales - Sales Order
  "create-so": "sales.sales-order.create-so.view",
  "approval-so": "sales.sales-order.approval-so.view",
  "open-so": "sales.sales-order.open-so.view",
  "close-so": "sales.sales-order.close-so.view",

  // Sales - Sales Advance Payment
  "unpaid-advance-payment-sales":
    "sales.sales-advance-payment.unpaid-advance-payment-sales.view",
  "paid-advance-payment-sales":
    "sales.sales-advance-payment.paid-advance-payment-sales.view",
  "advance-payment-sales-journal":
    "sales.sales-advance-payment.advance-payment-sales-journal.view",

  // Sales - Invoice
  "create-sales-invoice": "sales.sales-order-invoice.create-sales-invoice.view",
  "approval-sales-invoice":
    "sales.sales-order-invoice.approval-sales-invoice.view",

  // Sales - Sales Payment Plan
  "unpaid-payment-plan-sales":
    "sales.sales-payment-plan.unpaid-payment-plan-sales.view",
  "paid-payment-plan-sales":
    "sales.sales-payment-plan.paid-payment-plan-sales.view",
  "payment-plan-sales-journal":
    "sales.sales-payment-plan.payment-plan-sales-journal.view",

  // User Managements
  "user-accounts": "user-managements.user-accounts.view",
  "role-permissions": "user-managements.role-permissions.view",

  // =============================================================================
  // CREATE PERMISSIONS
  // =============================================================================

  // Master
  "customer-create": "master.customer.create",
  "supplier-create": "master.supplier.create",
  "item-category-create": "master.item-category.create",
  "items-create": "master.items.create",
  "tax-list-create": "master.tax-list.create",
  "departemen-create": "master.departemen.create",
  "unit-of-measurement-create": "master.unit-of-measurement.create",
  "payment-method-create": "master.payment-method.create",
  "master-cash-bank-create": "master.master-cash-bank.create",
  "warehouse-create": "master.inventory-setup.warehouse.create",
  "location-create": "master.inventory-setup.location.create",
  "wip-account-create": "master.wip-account.create",

  // Accounting - CoA
  "account-class-create": "accounting.coa.account-class.create",
  "account-type-create": "accounting.coa.account-type.create",
  "account-group-create": "accounting.coa.account-group.create",
  "account-list-create": "accounting.coa.account-list.create",
  "default-account-create": "accounting.coa.default-account.create",

  // Accounting - Currency
  "master-currency-create": "accounting.currency.master-currency.create",
  "exchange-rate-create": "accounting.currency.exchange-rate.create",

  // Accounting - Period & Balance
  "fiscal-period-create": "accounting.period-balance.fiscal-period.create",
  "opening-balance-create": "accounting.period-balance.opening-balance.create",
  "period-closing-create": "accounting.period-balance.period-closing.create",
  "closing-adjustment-create":
    "accounting.period-balance.closing-adjustment.create",
  "closing-journal-create": "accounting.period-balance.closing-journal.create",

  // Accounting - Journal Entry
  "general-journal-create": "accounting.journal-entry.general-journal.create",
  "adjustment-journal-create":
    "accounting.journal-entry.adjustment-journal.create",

  // Accounting - Petty Cash
  "petty-cash-open-create": "accounting.petty-cash.petty-cash-open.create",
  "petty-cash-realized-create":
    "accounting.petty-cash.petty-cash-realized.create",
  "petty-cash-posting-create":
    "accounting.petty-cash.petty-cash-posting.create",
  "setting-petty-cash-create":
    "accounting.petty-cash.setting-petty-cash.create",
  "request-saldo-create": "accounting.petty-cash.saldo.request-saldo.create",
  "approval-saldo-create": "accounting.petty-cash.saldo.approval-saldo.create",

  // Accounting - Reports
  "general-ledger-create": "accounting.reports.general-ledger.create",
  "trial-balance-create": "accounting.reports.trial-balance.create",
  "profit-loss-create": "accounting.reports.profit-loss.create",
  "balance-sheet-create": "accounting.reports.balance-sheet.create",

  // Accounting - Asset Management
  "asset-create": "accounting.asset-management.asset.create",
  "asset-journal-create": "accounting.asset-management.asset-journal.create",

  // Accounting - Cash & Bank
  "cash-bank-transaction-create":
    "accounting.cash-transaction.cash-bank-transaction.create",
  "cash-bank-journal-create":
    "accounting.cash-transaction.cash-bank-journal.create",
  "foreign-exchange-transaction-create":
    "accounting.cash-transaction.foreign-exchange-transaction.create",
  "foreign-exchange-journal-create":
    "accounting.cash-transaction.foreign-exchange-journal.create",

  // Accounting - Foreign Currency Ledger
  "ledger-create":
    "accounting.foreign-currency-ledger.foreign-currency-ledger.create",
  "exchange-rate-adjustment-create":
    "accounting.foreign-currency-ledger.exchange-rate-adjustment.create",
  "exchange-rate-adjustment-journal-create":
    "accounting.foreign-currency-ledger.exchange-rate-adjustment-journal.create",

  // Purchasing - Purchase Order
  "create-po-create": "purchasing.purchase-order.create-po.create",
  "approval-po-create": "purchasing.purchase-order.approval-po.create",
  "open-po-create": "purchasing.purchase-order.open-po.create",
  "close-po-create": "purchasing.purchase-order.close-po.create",

  // Purchasing - Direct Purchase
  "create-direct-purchase-create":
    "purchasing.direct-purchase.create-direct-purchase.create",
  "approval-direct-purchase-create":
    "purchasing.direct-purchase.approval-direct-purchase.create",
  "unpaid-direct-purchase-create":
    "purchasing.direct-purchase.unpaid-direct-purchase.create",
  "paid-direct-purchase-create":
    "purchasing.direct-purchase.paid-direct-purchase.create",
  "direct-purchase-journal-create":
    "purchasing.direct-purchase.direct-purchase-journal.create",

  // Purchasing - Advance Payment
  "unpaid-advance-payment-create":
    "purchasing.advance-payment.unpaid-advance-payment.create",
  "paid-advance-payment-create":
    "purchasing.advance-payment.paid-advance-payment.create",
  "advance-payment-journal-create":
    "purchasing.advance-payment.advance-payment-journal.create",

  // Purchasing - Invoicing
  "create-invoicing-create": "purchasing.invoicing.create-invoicing.create",

  // Purchasing - Purchase Payment Plan
  "unpaid-payment-plan-create":
    "purchasing.purchase-payment-plan.unpaid-payment-plan.create",
  "paid-payment-plan-create":
    "purchasing.purchase-payment-plan.paid-payment-plan.create",
  "payment-journal-create":
    "purchasing.purchase-payment-plan.payment-journal.create",

  // Logistic - Inventory
  "open-grn-create": "logistic.inventory.open-grn.create",
  "close-grn-create": "logistic.inventory.close-grn.create",
  "grn-journal-create": "logistic.inventory.grn-journal.create",

  // Logistic - Sales Shipment
  "open-shipment-create": "logistic.sales-shipment.open-shipment.create",
  "close-shipment-create": "logistic.sales-shipment.close-shipment.create",
  "shipment-sales-journal-create":
    "logistic.sales-shipment.shipment-sales-journal.create",

  // Logistic - Inventory Transfer (Avg)
  "transfer-request-create":
    "logistic.inventory-transfer-avg.transfer-request.create",
  "transfer-approval-create":
    "logistic.inventory-transfer-avg.transfer-approval.create",
  "transfer-receive-create":
    "logistic.inventory-transfer-avg.transfer-receive.create",

  // Logistic - Inventory Transfer (Fifo)
  "transfer-request-fifo-create":
    "logistic.inventory-transfer-fifo.transfer-request-fifo.create",
  "transfer-approval-fifo-create":
    "logistic.inventory-transfer-fifo.transfer-approval-fifo.create",
  "transfer-receive-fifo-create":
    "logistic.inventory-transfer-fifo.transfer-receive-fifo.create",

  // Logistic - Disposal (Avg)
  "disposal-request-create": "logistic.disposal-avg.disposal-request.create",
  "disposal-check-create": "logistic.disposal-avg.disposal-check.create",
  "disposal-approval-create": "logistic.disposal-avg.disposal-approval.create",
  "disposal-journal-create": "logistic.disposal-avg.disposal-journal.create",

  // Logistic - Disposal (Fifo)
  "disposal-request-fifo-create":
    "logistic.disposal-fifo.disposal-request-fifo.create",
  "disposal-check-fifo-create":
    "logistic.disposal-fifo.disposal-check-fifo.create",
  "disposal-approval-fifo-create":
    "logistic.disposal-fifo.disposal-approval-fifo.create",
  "disposal-journal-fifo-create":
    "logistic.disposal-fifo.disposal-journal-fifo.create",

  // Logistic - Inventory Adjustment (Avg)
  "stock-opname-request-create":
    "logistic.inventory-adjustment-avg.stock-opname-request.create",
  "stock-opname-approval-create":
    "logistic.inventory-adjustment-avg.stock-opname-approval.create",
  "stock-opname-journal-create":
    "logistic.inventory-adjustment-avg.stock-opname-journal.create",

  // Logistic - Inventory Adjustment (Fifo)
  "stock-opname-request-fifo-create":
    "logistic.inventory-adjustment-fifo.stock-opname-request-fifo.create",
  "stock-opname-approval-fifo-create":
    "logistic.inventory-adjustment-fifo.stock-opname-approval-fifo.create",
  "stock-opname-journal-fifo-create":
    "logistic.inventory-adjustment-fifo.stock-opname-journal-fifo.create",

  // Logistic - Issued (Avg)
  "issued-request-avg-create": "logistic.issued-avg.issued-request-avg.create",
  "issued-approval-avg-create":
    "logistic.issued-avg.issued-approval-avg.create",
  "issued-open-avg-create": "logistic.issued-avg.issued-open-avg.create",
  "issued-closed-avg-create": "logistic.issued-avg.issued-closed-avg.create",
  "issued-journal-avg-create": "logistic.issued-avg.issued-journal-avg.create",

  // Logistic - Issued (Fifo)
  "issued-request-fifo-create":
    "logistic.issued-fifo.issued-request-fifo.create",
  "issued-approval-fifo-create":
    "logistic.issued-fifo.issued-approval-fifo.create",
  "issued-open-fifo-create": "logistic.issued-fifo.issued-open-fifo.create",
  "issued-closed-fifo-create": "logistic.issued-fifo.issued-closed-fifo.create",
  "issued-journal-fifo-create":
    "logistic.issued-fifo.issued-journal-fifo.create",

  // Logistic - Purchase Return (Avg)
  "purchase-return-request-avg-create":
    "logistic.purchase-return-avg.purchase-return-request-avg.create",
  "purchase-return-approval-avg-create":
    "logistic.purchase-return-avg.purchase-return-approval-avg.create",
  "purchase-return-shipment-avg-create":
    "logistic.purchase-return-avg.purchase-return-shipment-avg.create",
  "purchase-return-journal-avg-create":
    "logistic.purchase-return-avg.purchase-return-journal-avg.create",

  // Logistic - Purchase Return (Fifo)
  "purchase-return-request-fifo-create":
    "logistic.purchase-return-fifo.purchase-return-request-fifo.create",
  "purchase-return-approval-fifo-create":
    "logistic.purchase-return-fifo.purchase-return-approval-fifo.create",
  "purchase-return-shipment-fifo-create":
    "logistic.purchase-return-fifo.purchase-return-shipment-fifo.create",
  "purchase-return-journal-fifo-create":
    "logistic.purchase-return-fifo.purchase-return-journal-fifo.create",

  // Logistic - Non Stock
  "consume-create": "logistic.non-stock.consume.create",
  "overview-create": "logistic.non-stock.overview.create",

  // Logistic - Production & WIP
  "production-result-request-create":
    "logistic.production-result.production-result-request.create",
  "production-result-approval-create":
    "logistic.production-result.production-result-approval.create",
  "production-result-journal-create":
    "logistic.production-result.production-result-journal.create",

  // Logistic - Assembly
  "request-assembly-create": "logistic.assembly.request-assembly.create",
  "approval-assembly-create": "logistic.assembly.approval-assembly.create",
  "order-assembly-create": "logistic.assembly.order-assembly.create",
  "journal-assembly-create": "logistic.assembly.journal-assembly.create",

  // Logistic - Disassembly
  "request-disassembly-create":
    "logistic.disassembly.request-disassembly.create",
  "approval-disassembly-create":
    "logistic.disassembly.approval-disassembly.create",
  "order-disassembly-create": "logistic.disassembly.order-disassembly.create",
  "journal-disassembly-create":
    "logistic.disassembly.journal-disassembly.create",

  // Logistic - Inventory Report
  "import-inventory-create":
    "logistic.inventory-report.import-inventory.create",
  "movement-history-create":
    "logistic.inventory-report.movement-history.create",
  "stock-overview-create": "logistic.inventory-report.stock-overview.create",
  "batch-sn-tracking-create":
    "logistic.inventory-report.batch-sn-tracking.create",
  "item-list-create": "logistic.inventory-report.item-list.create",
  "inventory-valuation-fifo-create":
    "logistic.inventory-report.inventory-valuation-fifo.create",
  "inventory-valuation-avg-create":
    "logistic.inventory-report.inventory-valuation-avg.create",

  // Sales - Sales Order
  "create-so-create": "sales.sales-order.create-so.create",
  "approval-so-create": "sales.sales-order.approval-so.create",
  "open-so-create": "sales.sales-order.open-so.create",
  "close-so-create": "sales.sales-order.close-so.create",

  // Sales - Sales Advance Payment
  "unpaid-advance-payment-sales-create":
    "sales.sales-advance-payment.unpaid-advance-payment-sales.create",
  "paid-advance-payment-sales-create":
    "sales.sales-advance-payment.paid-advance-payment-sales.create",
  "advance-payment-sales-journal-create":
    "sales.sales-advance-payment.advance-payment-sales-journal.create",

  // Sales - Invoice
  "create-sales-invoice-create":
    "sales.sales-order-invoice.create-sales-invoice.create",
  "approval-sales-invoice-create":
    "sales.sales-order-invoice.approval-sales-invoice.create",

  // Sales - Sales Payment Plan
  "unpaid-payment-plan-sales-create":
    "sales.sales-payment-plan.unpaid-payment-plan-sales.create",
  "paid-payment-plan-sales-create":
    "sales.sales-payment-plan.paid-payment-plan-sales.create",
  "payment-plan-sales-journal-create":
    "sales.sales-payment-plan.payment-plan-sales-journal.create",

  // User Managements
  "user-accounts-create": "user-managements.user-accounts.create",
  "role-permissions-create": "user-managements.role-permissions.create",

  // =============================================================================
  // UPDATE PERMISSIONS
  // =============================================================================

  // Master
  "customer-update": "master.customer.update",
  "supplier-update": "master.supplier.update",
  "item-category-update": "master.item-category.update",
  "items-update": "master.items.update",
  "tax-list-update": "master.tax-list.update",
  "departemen-update": "master.departemen.update",
  "unit-of-measurement-update": "master.unit-of-measurement.update",
  "payment-method-update": "master.payment-method.update",
  "master-cash-bank-update": "master.master-cash-bank.update",
  "warehouse-update": "master.inventory-setup.warehouse.update",
  "location-update": "master.inventory-setup.location.update",
  "wip-account-update": "master.wip-account.update",

  // Accounting - CoA
  "account-class-update": "accounting.coa.account-class.update",
  "account-type-update": "accounting.coa.account-type.update",
  "account-group-update": "accounting.coa.account-group.update",
  "account-list-update": "accounting.coa.account-list.update",
  "default-account-update": "accounting.coa.default-account.update",

  // Accounting - Currency
  "master-currency-update": "accounting.currency.master-currency.update",
  "exchange-rate-update": "accounting.currency.exchange-rate.update",

  // Accounting - Period & Balance
  "fiscal-period-update": "accounting.period-balance.fiscal-period.update",
  "opening-balance-update": "accounting.period-balance.opening-balance.update",
  "period-closing-update": "accounting.period-balance.period-closing.update",
  "closing-adjustment-update":
    "accounting.period-balance.closing-adjustment.update",
  "closing-journal-update": "accounting.period-balance.closing-journal.update",
  "general-journal-update": "accounting.journal-entry.general-journal.update",
  "adjustment-journal-update":
    "accounting.journal-entry.adjustment-journal.update",

  // Accounting - Petty Cash
  "petty-cash-open-update": "accounting.petty-cash.petty-cash-open.update",
  "petty-cash-realized-update":
    "accounting.petty-cash.petty-cash-realized.update",
  "petty-cash-posting-update":
    "accounting.petty-cash.petty-cash-posting.update",
  "setting-petty-cash-update":
    "accounting.petty-cash.setting-petty-cash.update",
  "request-saldo-update": "accounting.petty-cash.saldo.request-saldo.update",
  "approval-saldo-update": "accounting.petty-cash.saldo.approval-saldo.update",

  // Accounting - Reports
  "general-ledger-update": "accounting.reports.general-ledger.update",
  "trial-balance-update": "accounting.reports.trial-balance.update",
  "profit-loss-update": "accounting.reports.profit-loss.update",
  "balance-sheet-update": "accounting.reports.balance-sheet.update",

  // Accounting - Asset Management
  "asset-update": "accounting.asset-management.asset.update",
  "asset-journal-update": "accounting.asset-management.asset-journal.update",

  // Accounting - Cash & Bank
  "cash-bank-transaction-update":
    "accounting.cash-transaction.cash-bank-transaction.update",
  "cash-bank-journal-update":
    "accounting.cash-transaction.cash-bank-journal.update",
  "foreign-exchange-transaction-update":
    "accounting.cash-transaction.foreign-exchange-transaction.update",
  "foreign-exchange-journal-update":
    "accounting.cash-transaction.foreign-exchange-journal.update",

  // Accounting - Foreign Currency Ledger
  "ledger-update":
    "accounting.foreign-currency-ledger.foreign-currency-ledger.update",
  "exchange-rate-adjustment-update":
    "accounting.foreign-currency-ledger.exchange-rate-adjustment.update",
  "exchange-rate-adjustment-journal-update":
    "accounting.foreign-currency-ledger.exchange-rate-adjustment-journal.update",

  // Purchasing - Purchase Order
  "create-po-update": "purchasing.purchase-order.create-po.update",
  "approval-po-update": "purchasing.purchase-order.approval-po.update",
  "open-po-update": "purchasing.purchase-order.open-po.update",
  "close-po-update": "purchasing.purchase-order.close-po.update",

  // Purchasing - Direct Purchase
  "create-direct-purchase-update":
    "purchasing.direct-purchase.create-direct-purchase.update",
  "approval-direct-purchase-update":
    "purchasing.direct-purchase.approval-direct-purchase.update",
  "unpaid-direct-purchase-update":
    "purchasing.direct-purchase.unpaid-direct-purchase.update",
  "paid-direct-purchase-update":
    "purchasing.direct-purchase.paid-direct-purchase.update",
  "direct-purchase-journal-update":
    "purchasing.direct-purchase.direct-purchase-journal.update",

  // Purchasing - Advance Payment
  "unpaid-advance-payment-update":
    "purchasing.advance-payment.unpaid-advance-payment.update",
  "paid-advance-payment-update":
    "purchasing.advance-payment.paid-advance-payment.update",
  "advance-payment-journal-update":
    "purchasing.advance-payment.advance-payment-journal.update",

  // Purchasing - Invoicing
  "create-invoicing-update": "purchasing.invoicing.create-invoicing.update",

  // Purchasing - Purchase Payment Plan
  "unpaid-payment-plan-update":
    "purchasing.purchase-payment-plan.unpaid-payment-plan.update",
  "paid-payment-plan-update":
    "purchasing.purchase-payment-plan.paid-payment-plan.update",
  "payment-journal-update":
    "purchasing.purchase-payment-plan.payment-journal.update",

  // Logistic - Inventory
  "open-grn-update": "logistic.inventory.open-grn.update",
  "close-grn-update": "logistic.inventory.close-grn.update",
  "grn-journal-update": "logistic.inventory.grn-journal.update",

  // Logistic - Sales Shipment
  "open-shipment-update": "logistic.sales-shipment.open-shipment.update",
  "close-shipment-update": "logistic.sales-shipment.close-shipment.update",
  "shipment-sales-journal-update":
    "logistic.sales-shipment.shipment-sales-journal.update",

  // Logistic - Inventory Transfer (Avg)
  "transfer-request-update":
    "logistic.inventory-transfer-avg.transfer-request.update",
  "transfer-approval-update":
    "logistic.inventory-transfer-avg.transfer-approval.update",
  "transfer-receive-update":
    "logistic.inventory-transfer-avg.transfer-receive.update",

  // Logistic - Inventory Transfer (Fifo)
  "transfer-request-fifo-update":
    "logistic.inventory-transfer-fifo.transfer-request-fifo.update",
  "transfer-approval-fifo-update":
    "logistic.inventory-transfer-fifo.transfer-approval-fifo.update",
  "transfer-receive-fifo-update":
    "logistic.inventory-transfer-fifo.transfer-receive-fifo.update",

  // Logistic - Disposal (Avg)
  "disposal-request-update": "logistic.disposal-avg.disposal-request.update",
  "disposal-check-update": "logistic.disposal-avg.disposal-check.update",
  "disposal-approval-update": "logistic.disposal-avg.disposal-approval.update",
  "disposal-journal-update": "logistic.disposal-avg.disposal-journal.update",
  // Logistic - Disposal (Fifo)
  "disposal-request-fifo-update":
    "logistic.disposal-fifo.disposal-request-fifo.update",
  "disposal-check-fifo-update":
    "logistic.disposal-fifo.disposal-check-fifo.update",
  "disposal-approval-fifo-update":
    "logistic.disposal-fifo.disposal-approval-fifo.update",
  "disposal-journal-fifo-update":
    "logistic.disposal-fifo.disposal-journal-fifo.update",

  // Logistic - Inventory Adjustment (Avg)
  "stock-opname-request-update":
    "logistic.inventory-adjustment-avg.stock-opname-request.update",
  "stock-opname-approval-update":
    "logistic.inventory-adjustment-avg.stock-opname-approval.update",
  "stock-opname-journal-update":
    "logistic.inventory-adjustment-avg.stock-opname-journal.update",
  // Logistic - Inventory Adjustment (Fifo)
  "stock-opname-request-fifo-update":
    "logistic.inventory-adjustment-fifo.stock-opname-request-fifo.update",
  "stock-opname-approval-fifo-update":
    "logistic.inventory-adjustment-fifo.stock-opname-approval-fifo.update",
  "stock-opname-journal-fifo-update":
    "logistic.inventory-adjustment-fifo.stock-opname-journal-fifo.update",

  // Logistic - Issued (Avg)
  "issued-request-avg-update": "logistic.issued-avg.issued-request-avg.update",
  "issued-approval-avg-update":
    "logistic.issued-avg.issued-approval-avg.update",
  "issued-open-avg-update": "logistic.issued-avg.issued-open-avg.update",
  "issued-closed-avg-update": "logistic.issued-avg.issued-closed-avg.update",
  "issued-journal-avg-update": "logistic.issued-avg.issued-journal-avg.update",
  // Logistic - Issued (Fifo)
  "issued-request-fifo-update":
    "logistic.issued-fifo.issued-request-fifo.update",
  "issued-approval-fifo-update":
    "logistic.issued-fifo.issued-approval-fifo.update",
  "issued-open-fifo-update": "logistic.issued-fifo.issued-open-fifo.update",
  "issued-closed-fifo-update": "logistic.issued-fifo.issued-closed-fifo.update",
  "issued-journal-fifo-update":
    "logistic.issued-fifo.issued-journal-fifo.update",

  // Logistic - Purchase Return (Avg)
  "purchase-return-request-avg-update":
    "logistic.purchase-return-avg.purchase-return-request-avg.update",
  "purchase-return-approval-avg-update":
    "logistic.purchase-return-avg.purchase-return-approval-avg.update",
  "purchase-return-shipment-avg-update":
    "logistic.purchase-return-avg.purchase-return-shipment-avg.update",
  "purchase-return-journal-avg-update":
    "logistic.purchase-return-avg.purchase-return-journal-avg.update",
  // Logistic - Purchase Return (Fifo)
  "purchase-return-request-fifo-update":
    "logistic.purchase-return-fifo.purchase-return-request-fifo.update",
  "purchase-return-approval-fifo-update":
    "logistic.purchase-return-fifo.purchase-return-approval-fifo.update",
  "purchase-return-shipment-fifo-update":
    "logistic.purchase-return-fifo.purchase-return-shipment-fifo.update",
  "purchase-return-journal-fifo-update":
    "logistic.purchase-return-fifo.purchase-return-journal-fifo.update",

  // Logistic - Non Stock
  "consume-update": "logistic.non-stock.consume.update",
  "overview-update": "logistic.non-stock.overview.update",

  // Logistic - Production & WIP
  // Logistic - Production & WIP
  "production-result-request-update":
    "logistic.production-result.production-result-request.update",
  "production-result-approval-update":
    "logistic.production-result.production-result-approval.update",
  "production-result-journal-update":
    "logistic.production-result.production-result-journal.update",

  // Logistic - Assembly
  "request-assembly-update": "logistic.assembly.request-assembly.update",
  "approval-assembly-update": "logistic.assembly.approval-assembly.update",
  "order-assembly-update": "logistic.assembly.order-assembly.update",
  "journal-assembly-update": "logistic.assembly.journal-assembly.update",

  // Logistic - Disassembly
  "request-disassembly-update":
    "logistic.disassembly.request-disassembly.update",
  "approval-disassembly-update":
    "logistic.disassembly.approval-disassembly.update",
  "order-disassembly-update": "logistic.disassembly.order-disassembly.update",
  "journal-disassembly-update":
    "logistic.disassembly.journal-disassembly.update",

  // Logistic - Inventory Report
  "import-inventory-update":
    "logistic.inventory-report.import-inventory.update",
  "movement-history-update":
    "logistic.inventory-report.movement-history.update",
  "stock-overview-update": "logistic.inventory-report.stock-overview.update",
  "batch-sn-tracking-update":
    "logistic.inventory-report.batch-sn-tracking.update",
  "item-list-update": "logistic.inventory-report.item-list.update",
  "inventory-valuation-fifo-update":
    "logistic.inventory-report.inventory-valuation-fifo.update",
  "inventory-valuation-avg-update":
    "logistic.inventory-report.inventory-valuation-avg.update",

  // Sales - Sales Order
  "create-so-update": "sales.sales-order.create-so.update",
  "approval-so-update": "sales.sales-order.approval-so.update",
  "open-so-update": "sales.sales-order.open-so.update",
  "close-so-update": "sales.sales-order.close-so.update",

  // Sales - Sales Advance Payment
  "unpaid-advance-payment-sales-update":
    "sales.sales-advance-payment.unpaid-advance-payment-sales.update",
  "paid-advance-payment-sales-update":
    "sales.sales-advance-payment.paid-advance-payment-sales.update",
  "advance-payment-sales-journal-update":
    "sales.sales-advance-payment.advance-payment-sales-journal.update",

  // Sales - Invoice
  "create-sales-invoice-update":
    "sales.sales-order-invoice.create-sales-invoice.update",
  "approval-sales-invoice-update":
    "sales.sales-order-invoice.approval-sales-invoice.update",

  // Sales - Sales Payment Plan
  "unpaid-payment-plan-sales-update":
    "sales.sales-payment-plan.unpaid-payment-plan-sales.update",
  "paid-payment-plan-sales-update":
    "sales.sales-payment-plan.paid-payment-plan-sales.update",
  "payment-plan-sales-journal-update":
    "sales.sales-payment-plan.payment-plan-sales-journal.update",

  // User Managements
  "user-accounts-update": "user-managements.user-accounts.update",
  "role-permissions-update": "user-managements.role-permissions.update",
};
