import {
  Square3Stack3DIcon,
  Squares2X2Icon,
  UserIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";
import type { MenuProps } from "antd";
import { NavLink } from "react-router-dom";

export const itemSidebar: MenuProps["items"] = [
  {
    key: "dashboard",
    icon: <Squares2X2Icon className="w-5 h-5" />,
    label: <NavLink to="/">Dashboard</NavLink>,
  },
  {
    key: "master",
    icon: <Square3Stack3DIcon className="w-5 h-5" />,
    label: "Master",
    children: [
      {
        key: "master-cash-bank",
        label: <NavLink to="/master/master-cash-bank">Cash & Bank</NavLink>,
      },
      {
        key: "master-currency",
        label: <NavLink to="/master/master-currency">Master Currency</NavLink>,
      },
      {
        key: "user-accounts",
        label: <NavLink to="/master/master-menu">Master Menu</NavLink>,
      },
    ],
  },
  {
    key: "accounting",
    icon: <WalletIcon className="w-5 h-5" />,
    label: "Accounting",
    children: [
      {
        key: "coa",
        label: "CoA",
        children: [
          {
            key: "account-class",
            label: (
              <NavLink to="/accounting/coa/account-class">
                Account Class
              </NavLink>
            ),
          },
          {
            key: "account-type",
            label: (
              <NavLink to="/accounting/coa/account-type">Account Type</NavLink>
            ),
          },
          {
            key: "account-group",
            label: (
              <NavLink to="/accounting/coa/account-group">
                Account Group
              </NavLink>
            ),
          },
          {
            key: "account-list",
            label: (
              <NavLink to="/accounting/coa/account-list">Account List</NavLink>
            ),
          },
          {
            key: "default-account",
            label: (
              <NavLink to="/accounting/coa/default-account">
                Default Account
              </NavLink>
            ),
          },
        ],
      },
      {
        key: "currency",
        label: "Exchange Rate",
        children: [
          {
            key: "exchange-rate",
            label: (
              <NavLink to="/accounting/currency/exchange-rate">
                Exchange Rate
              </NavLink>
            ),
          },
          {
            key: "exchange-rate-period",
            label: (
              <NavLink to="/accounting/currency/exchange-rate-kmk">
                Exchange Rate KMK
              </NavLink>
            ),
          },
        ],
      },
      {
        key: "period-balance",
        label: "Period & Balance",
        children: [
          {
            key: "fiscal-period",
            label: (
              <NavLink to="/accounting/period-balance/fiscal-period">
                Fiscal Period
              </NavLink>
            ),
          },
          {
            key: "opening-balance",
            label: (
              <NavLink to="/accounting/period-balance/opening-balance">
                Opening Balance
              </NavLink>
            ),
          },
          {
            key: "period-closing",
            label: (
              <NavLink to="/accounting/period-balance/period-closing">
                Period Closing
              </NavLink>
            ),
          },
          {
            key: "closing-adjustment",
            label: (
              <NavLink to="/accounting/period-balance/closing-adjustment">
                Closing Adjustment Journal
              </NavLink>
            ),
          },
          {
            key: "closing-journal",
            label: (
              <NavLink to="/accounting/period-balance/closing-journal">
                Closing Journal
              </NavLink>
            ),
          },
        ],
      },
      {
        key: "journal-entry",
        label: "Journal Entry",
        children: [
          {
            key: "general-journal",
            label: (
              <NavLink to="/accounting/journal-entry/general-journal">
                General Journal
              </NavLink>
            ),
          },
          {
            key: "adjustment-journal",
            label: (
              <NavLink to="/accounting/journal-entry/adjustment-journal">
                Adjustment Journal
              </NavLink>
            ),
          },
        ],
      },
      {
        key: "petty-cash",
        label: "Petty Cash",
        children: [
          {
            key: "petty-cash-open",
            label: (
              <NavLink to="/accounting/petty-cash/petty-cash-open">
                Open
              </NavLink>
            ),
          },
          {
            key: "petty-cash-realized",
            label: (
              <NavLink to="/accounting/petty-cash/petty-cash-realized">
                Realized
              </NavLink>
            ),
          },
          {
            key: "petty-cash-posting",
            label: (
              <NavLink to="/accounting/petty-cash/petty-cash-posting">
                Posting
              </NavLink>
            ),
          },
          {
            key: "setting-petty-cash",
            label: (
              <NavLink to="/accounting/petty-cash/setting-petty-cash">
                Setting
              </NavLink>
            ),
          },
          {
            key: "saldo",
            label: "Saldo",
            children: [
              {
                key: "request-saldo",
                label: (
                  <NavLink to="/accounting/petty-cash/saldo/request-saldo">
                    Request
                  </NavLink>
                ),
              },
              {
                key: "approval-saldo",
                label: (
                  <NavLink to="/accounting/petty-cash/saldo/approval-saldo">
                    Approval
                  </NavLink>
                ),
              },
            ],
          },
        ],
      },
      {
        key: "reports",
        label: "Reports",
        children: [
          {
            key: "general-ledger",
            label: (
              <NavLink to="/accounting/reports/general-ledger">
                General Ledger
              </NavLink>
            ),
          },
          {
            key: "trial-balance",
            label: (
              <NavLink to="/accounting/reports/trial-balance">
                Trial Balance
              </NavLink>
            ),
          },
          {
            key: "profit-loss",
            label: (
              <NavLink to="/accounting/reports/profit-loss">
                Profit / Loss
              </NavLink>
            ),
          },
          {
            key: "balance-sheet",
            label: (
              <NavLink to="/accounting/reports/balance-sheet">
                Balance Sheet
              </NavLink>
            ),
          },
        ],
      },
      {
        key: "cash-transaction",
        label: "Cash Transaction",
        children: [
          {
            key: "cash-bank-transaction",
            label: (
              <NavLink to="/accounting/cash-transaction/cash-bank-transaction">
                Cash & Bank Transaction
              </NavLink>
            ),
          },
          {
            key: "foreign-exchange-transaction",
            label: (
              <NavLink to="/accounting/cash-transaction/foreign-exchange-transaction">
                Foreign Exchange Transaction
              </NavLink>
            ),
          },
          {
            key: "cash-bank-journal",
            label: (
              <NavLink to="/accounting/cash-transaction/cash-bank-journal">
                Cash & Bank Journal
              </NavLink>
            ),
          },
          {
            key: "foreign-exchange-journal",
            label: (
              <NavLink to="/accounting/cash-transaction/foreign-exchange-journal">
                Foreign Exchange Journal
              </NavLink>
            ),
          },
        ],
      },
      {
        key: "foreign-currency-ledger",
        label: "Foreign Currency Ledger",
        children: [
          {
            key: "ledger",
            label: (
              <NavLink to="/accounting/foreign-currency-ledger/ledger">
                Ledger
              </NavLink>
            ),
          },
          {
            key: "exchange-rate-adjustment",
            label: (
              <NavLink to="/accounting/foreign-currency-ledger/exchange-rate-adjustment">
                Exchage Rate Adjustment
              </NavLink>
            ),
          },
          {
            key: "exchange-rate-adjustment-journal",
            label: (
              <NavLink to="/accounting/foreign-currency-ledger/exchange-rate-adjustment-journal">
                Exchage Rate Adjustment Journal
              </NavLink>
            ),
          },
        ],
      },
    ],
  },
  {
    key: "user-managements",
    icon: <UserIcon className="w-5 h-5" />,
    label: "User Managements",
    children: [
      {
        key: "user-accounts",
        label: (
          <NavLink to="/user-managements/user-accounts">User Accounts</NavLink>
        ),
      },
      {
        key: "role-permissions",
        label: (
          <NavLink to="/user-managements/role-permissions">
            Role & Permissions
          </NavLink>
        ),
      },
    ],
  },
];
