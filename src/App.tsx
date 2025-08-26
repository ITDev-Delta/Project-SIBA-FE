import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import PageTitle from "./components/PageTitle";
import { AuthProvider, useAuthContext } from "./context/auth_context";
import { ProfileProvider, useProfileContext } from "./context/profile_context";
import Loader from "./components/Loader";
import { permissionKey } from "./utils/permission_key";
import { useScreensaver } from "./pages/ScreenSaver/ScreenSaverHooks";
import Screensaver from "./pages/ScreenSaver/ScreenSaver";
import { useEffect, useState } from "react";
import { setNavigator } from "./navigate";
import Login from "./pages/Login/Login";
import Forbidden from "./pages/Error/Forbidden";
import NotFound from "./pages/Error/NotFound";
import DefaultLayout from "./components/Layout/DefaultLayout";
import CashAndBank from "./pages/Master/CashAndBank/CashAndBank";
import CashAndBankForm from "./pages/Master/CashAndBank/CashAndBankForm";
import Menu from "./pages/Master/Menu/MasterMenu";
import MenuForm from "./pages/Master/Menu/MasterMenuForm";
import Dashboard from "./pages/Dashboard/Dashboard";
import Profile from "./pages/Profile/Profile";
import AccountClass from "./pages/Accounting/CoA/AccountClass/AccountClass";
import AccountClassForm from "./pages/Accounting/CoA/AccountClass/AccountClassForm";
import AccountType from "./pages/Accounting/CoA/AccountType/AccountType";
import AccountTypeForm from "./pages/Accounting/CoA/AccountType/AccountTypeForm";
import AccountGroup from "./pages/Accounting/CoA/AccountGroup/AccountGroup";
import AccountGroupForm from "./pages/Accounting/CoA/AccountGroup/AccountGroupForm";
import ChartAccounts from "./pages/Accounting/CoA/ChartAccounts/ChartAccounts";
import ChartAccountsForm from "./pages/Accounting/CoA/ChartAccounts/ChartAccountsForm";
import CoASettings from "./pages/Accounting/CoA/Settings/CoASettings";
import ExchangeRate from "./pages/Accounting/Currency/ExchangeRate/ExchangeRate";
import ExchangeRateKMK from "./pages/Accounting/Currency/ExchangeRateKMK/ExchangeRateKMK";
import FiscalPeriod from "./pages/Accounting/PeriodBalance/FiscalPeriod/FiscalPeriod";
import FiscalPeriodForm from "./pages/Accounting/PeriodBalance/FiscalPeriod/FiscalPeriodForm";
import OpeningBalance from "./pages/Accounting/PeriodBalance/OpeningBalance/OpeningBalance";
import PeriodClosing from "./pages/Accounting/PeriodBalance/PeriodClosing/PeriodClosing";
import ClosingAdjustmentJournal from "./pages/Accounting/PeriodBalance/ClosingAdjustment/ClosingAdjustment";
import ClosingAdjustmentJournalForm from "./pages/Accounting/PeriodBalance/ClosingAdjustment/ClosingAdjustmentForm";
import ClosingJournal from "./pages/Accounting/PeriodBalance/ClosingJournal/ClosingJournal";
import GeneralJournal from "./pages/Accounting/Journal/General/GeneralJournal";
import GeneralJournalForm from "./pages/Accounting/Journal/General/GeneralJournalForm";
import AdjustmentJournal from "./pages/Accounting/Journal/Adjustment/AdjustmentJournal";
import AdjustmentJournalForm from "./pages/Accounting/Journal/Adjustment/AdjustmentJournalForm";
import ValutaAsingAdjustmentJournal from "./pages/Accounting/ValutaAsing/ValutaAsingAdjustmentJournal";
import ValutaAsingAdjustment from "./pages/Accounting/ValutaAsing/ValutaAsingAdjustment";
import ValutaAsingTracker from "./pages/Accounting/ValutaAsing/ValutaAsingTracker";
import ForeignExchangeJournal from "./pages/Accounting/CashTransaction/ForeignExchangeJournal";
import ForeignExchangeTransactionForm from "./pages/Accounting/CashTransaction/ForeignExchangeTransaction/ForeignExchangeTransactionForm";
import ForeignExchangeTransaction from "./pages/Accounting/CashTransaction/ForeignExchangeTransaction/ForeignExchangeTransaction";
import CashAndBankJournal from "./pages/Accounting/CashTransaction/CashandBankJournal";
import CashandBankTransaction from "./pages/Accounting/CashTransaction/CashandBankTransaction";
import BalanceSheet from "./pages/Accounting/Reports/BalanceSheet/BalanceSheet";
import ProfitLoss from "./pages/Accounting/Reports/ProfitLoss/ProfitLoss";
import TrialBalance from "./pages/Accounting/Reports/TrialBalance/TrialBalance";
import GeneralLedger from "./pages/Accounting/Reports/GeneralLedger/GeneralLedger";
import SettingPettyCashForm from "./pages/Accounting/PettyCash/SettingPettyCash/SettingPettyCashForm";
import ApprovalSaldo from "./pages/Accounting/PettyCash/Saldo/Approval/ApprovalSaldo";
import RequestSaldo from "./pages/Accounting/PettyCash/Saldo/Request/RequestSaldo";
import SettingPettyCash from "./pages/Accounting/PettyCash/SettingPettyCash/SettingPettyCash";
import PettyCashPosting from "./pages/Accounting/PettyCash/PettyCashPosting/PettyCashPosting";
import PettyCashRealize from "./pages/Accounting/PettyCash/PettyCashRealize/PettyCashRealize";
import PettyCashOpen from "./pages/Accounting/PettyCash/PettyCashOpen/PettyCashOpen";
import UserAccounts from "./pages/UserManagement/UserAccounts/UserAccounts";
import RoleAndPermissions from "./pages/UserManagement/RoleAndPermissions/RoleAndPermission";
import RoleAndPermissionsForm from "./pages/UserManagement/RoleAndPermissions/RoleAndPermissionForm";
import CurrencySetup from "./pages/Master/Currency/Currency";
import CurrencySetupForm from "./pages/Master/Currency/CurrencyForm";

interface PrivateRouteProps {
  requiredKey?: string;
  element: React.ReactNode;
}

const PrivateRoute = ({ requiredKey, element }: PrivateRouteProps) => {
  const { isLoggedIn } = useAuthContext();
  const { profile, isLoading } = useProfileContext();
  const location = useLocation();

  // Jika sedang loading profile, tampilkan loader
  if (isLoading) return <Loader />;

  // Jika tidak login, redirect ke login
  if (!isLoggedIn) return <Navigate to="/login" />;

  // Jika login tapi profile belum ada, tampilkan loader (tunggu profile load)
  if (isLoggedIn && !profile) return <Loader />;

  // Dashboard dan profile selalu boleh diakses jika sudah login
  if (!requiredKey || requiredKey === "dashboard") return <>{element}</>;

  // Cek permission untuk route yang memerlukan permission khusus
  const requiredPermission = permissionKey[requiredKey];
  if (
    requiredPermission &&
    profile?.permissions?.includes(requiredPermission)
  ) {
    return <>{element}</>;
  }

  // Tidak punya permission, redirect ke 403
  return <Navigate to="/403" state={{ from: location }} replace />;
};

const AppWithScreensaver = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useAuthContext();

  // Hanya aktifkan screensaver jika user sudah login
  const { isIdle, resetTimer } = useScreensaver({
    timeout: 5 * 60 * 1000, // 10 menit timeout
    onIdle: () => {
      console.log("User is idle, showing screensaver");
    },
    onActive: () => {
      console.log("User is active, hiding screensaver");
    },
  });

  // Jangan tampilkan screensaver jika belum login
  const shouldShowScreensaver = isLoggedIn && isIdle;

  return (
    <>
      {children}
      {shouldShowScreensaver && (
        <Screensaver isActive={true} onDismiss={resetTimer} />
      )}
    </>
  );
};

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  useEffect(() => {
    setNavigator(navigate);
  }, [navigate]);

  return loading ? (
    <Loader />
  ) : (
    <AuthProvider>
      <ProfileProvider>
        <AppWithScreensaver>
          <Routes>
            <Route
              path="/login"
              element={
                <>
                  <PageTitle title="Siba ERP" />
                  <Login />
                </>
              }
            />
            <Route
              path="/403"
              element={
                <>
                  <PageTitle title="Access Forbidden" />
                  <Forbidden />
                </>
              }
            />

            <Route element={<DefaultLayout />}>
              <Route
                index
                element={
                  <PrivateRoute
                    element={
                      <>
                        <PageTitle title="Siba ERP" />
                        <Dashboard />
                      </>
                    }
                  />
                }
              />
              <Route
                path="/profile"
                element={
                  <>
                    <PrivateRoute
                      element={
                        <>
                          <PageTitle title="Profile" />
                          <Profile />
                        </>
                      }
                    />
                  </>
                }
              />
              {/* Start Master Route */}
              <Route
                path="/master/master-cash-bank"
                element={
                  <PrivateRoute
                    requiredKey="master-cash-bank"
                    element={
                      <>
                        <PageTitle title="Master Cash & Bank" />
                        <CashAndBank />
                      </>
                    }
                  ></PrivateRoute>
                }
              />
              <Route
                path="/master/master-cash-bank/add"
                element={
                  <PrivateRoute
                    requiredKey="master-cash-bank-create"
                    element={
                      <>
                        <PageTitle title="Master Cash & Bank" />
                        <CashAndBankForm />
                      </>
                    }
                  ></PrivateRoute>
                }
              />
              <Route
                path="/master/master-currency"
                element={
                  <PrivateRoute
                    requiredKey="master-currency"
                    element={
                      <>
                        <PageTitle title="Master Currency" />
                        <CurrencySetup />
                      </>
                    }
                  ></PrivateRoute>
                }
              />
              <Route
                path="/master/master-currency/add"
                element={
                  <PrivateRoute
                    requiredKey="master-currency-create"
                    element={
                      <>
                        <PageTitle title="Master Currency" />
                        <CurrencySetupForm />
                      </>
                    }
                  ></PrivateRoute>
                }
              />
              <Route
                path="/master/master-menu"
                element={
                  <PrivateRoute
                    requiredKey="user-accounts"
                    element={
                      <>
                        <PageTitle title="Master Menu" />
                        <Menu />
                      </>
                    }
                  />
                }
              />
              <Route
                path="/master/master-menu/add"
                element={
                  <PrivateRoute
                    requiredKey="user-accounts"
                    element={
                      <>
                        <PageTitle title="Add Menu" />
                        <MenuForm />
                      </>
                    }
                  />
                }
              />
              {/* End Master Route */}

              {/* Start Accounting Route */}
              <Route
                path="/accounting/coa/account-class"
                element={
                  <PrivateRoute
                    requiredKey="account-class"
                    element={
                      <>
                        <PageTitle title="Account Class" />
                        <AccountClass />
                      </>
                    }
                  ></PrivateRoute>
                }
              />
              <Route
                path="/accounting/coa/account-class/add"
                element={
                  <PrivateRoute
                    requiredKey="account-class"
                    element={
                      <>
                        <PageTitle title="Account Class" />
                        <AccountClassForm />
                      </>
                    }
                  ></PrivateRoute>
                }
              />
              <Route
                path="/accounting/coa/account-type"
                element={
                  <PrivateRoute
                    requiredKey="account-type"
                    element={
                      <>
                        <PageTitle title="Account Type" />
                        <AccountType />
                      </>
                    }
                  ></PrivateRoute>
                }
              />
              <Route
                path="/accounting/coa/account-type/add"
                element={
                  <PrivateRoute
                    requiredKey="account-type"
                    element={
                      <>
                        <PageTitle title="Account Type" />
                        <AccountTypeForm />
                      </>
                    }
                  ></PrivateRoute>
                }
              />
              <Route
                path="/accounting/coa/account-group"
                element={
                  <PrivateRoute
                    requiredKey="account-group"
                    element={
                      <>
                        <PageTitle title="Account Group" />
                        <AccountGroup />
                      </>
                    }
                  ></PrivateRoute>
                }
              />
              <Route
                path="/accounting/coa/account-group/add"
                element={
                  <PrivateRoute
                    requiredKey="account-group"
                    element={
                      <>
                        <PageTitle title="Account Group" />
                        <AccountGroupForm />
                      </>
                    }
                  ></PrivateRoute>
                }
              />
              <Route
                path="/accounting/coa/account-list"
                element={
                  <PrivateRoute
                    requiredKey="account-list"
                    element={
                      <>
                        <PageTitle title="Account List" />
                        <ChartAccounts />
                      </>
                    }
                  ></PrivateRoute>
                }
              />
              <Route
                path="/accounting/coa/account-list/add"
                element={
                  <PrivateRoute
                    requiredKey="account-list-create"
                    element={
                      <>
                        <PageTitle title="Account List" />
                        <ChartAccountsForm />
                      </>
                    }
                  ></PrivateRoute>
                }
              />
              <Route
                path="/accounting/coa/default-account"
                element={
                  <PrivateRoute
                    requiredKey="default-account"
                    element={
                      <>
                        <PageTitle title="Default Account" />
                        <CoASettings />
                      </>
                    }
                  ></PrivateRoute>
                }
              />
              <Route
                path="/accounting/currency/exchange-rate"
                element={
                  <PrivateRoute
                    requiredKey="exchange-rate"
                    element={
                      <>
                        <PageTitle title="Exchange Rate" />
                        <ExchangeRate />
                      </>
                    }
                  ></PrivateRoute>
                }
              />
              <Route
                path="/accounting/currency/exchange-rate-kmk"
                element={
                  <PrivateRoute
                    requiredKey="exchange-rate-period"
                    element={
                      <>
                        <PageTitle title="Exchange Rate Period" />
                        <ExchangeRateKMK />
                      </>
                    }
                  ></PrivateRoute>
                }
              />
              <Route
                path="/accounting/period-balance/fiscal-period"
                element={
                  <PrivateRoute
                    requiredKey="fiscal-period"
                    element={
                      <>
                        <PageTitle title="Fiscal Period" />
                        <FiscalPeriod />
                      </>
                    }
                  ></PrivateRoute>
                }
              />
              <Route
                path="/accounting/period-balance/fiscal-period/add"
                element={
                  <PrivateRoute
                    requiredKey="fiscal-period"
                    element={
                      <>
                        <PageTitle title="Fiscal Period" />
                        <FiscalPeriodForm />
                      </>
                    }
                  ></PrivateRoute>
                }
              />
              <Route
                path="/accounting/period-balance/opening-balance"
                element={
                  <PrivateRoute
                    requiredKey="opening-balance"
                    element={
                      <>
                        <PageTitle title="Opening Balance" />
                        <OpeningBalance />
                      </>
                    }
                  ></PrivateRoute>
                }
              />
              <Route
                path="/accounting/period-balance/period-closing"
                element={
                  <PrivateRoute
                    requiredKey="period-closing"
                    element={
                      <>
                        <PageTitle title="Period Closing" />
                        <PeriodClosing />
                      </>
                    }
                  ></PrivateRoute>
                }
              />
              <Route
                path="/accounting/period-balance/closing-adjustment"
                element={
                  <PrivateRoute
                    requiredKey="closing-adjustment"
                    element={
                      <>
                        <PageTitle title="Closing Adjustment Journal" />
                        <ClosingAdjustmentJournal />
                      </>
                    }
                  ></PrivateRoute>
                }
              />
              <Route
                path="/accounting/period-balance/closing-adjustment/add"
                element={
                  <PrivateRoute
                    requiredKey="closing-adjustment"
                    element={
                      <>
                        <PageTitle title="Closing Adjustment Journal" />
                        <ClosingAdjustmentJournalForm />
                      </>
                    }
                  ></PrivateRoute>
                }
              />
              <Route
                path="/accounting/period-balance/closing-journal"
                element={
                  <PrivateRoute
                    requiredKey="closing-journal"
                    element={
                      <>
                        <PageTitle title="Closing Journal" />
                        <ClosingJournal />
                      </>
                    }
                  ></PrivateRoute>
                }
              />
              <Route
                path="/accounting/journal-entry/general-journal"
                element={
                  <PrivateRoute
                    requiredKey="general-journal"
                    element={
                      <>
                        <PageTitle title="General Journal" />
                        <GeneralJournal />
                      </>
                    }
                  ></PrivateRoute>
                }
              />
              <Route
                path="/accounting/journal-entry/general-journal/add"
                element={
                  <PrivateRoute
                    requiredKey="general-journal"
                    element={
                      <>
                        <PageTitle title="General Journal" />
                        <GeneralJournalForm />
                      </>
                    }
                  ></PrivateRoute>
                }
              />
              <Route
                path="/accounting/journal-entry/adjustment-journal"
                element={
                  <PrivateRoute
                    requiredKey="adjustment-journal"
                    element={
                      <>
                        <PageTitle title="Adjustment Journal" />
                        <AdjustmentJournal />
                      </>
                    }
                  ></PrivateRoute>
                }
              />
              <Route
                path="/accounting/journal-entry/adjustment-journal/add"
                element={
                  <PrivateRoute
                    requiredKey="adjustment-journal"
                    element={
                      <>
                        <PageTitle title="Adjustment Journal" />
                        <AdjustmentJournalForm />
                      </>
                    }
                  ></PrivateRoute>
                }
              />
              <Route
                path="/accounting/petty-cash/petty-cash-open"
                element={
                  <PrivateRoute
                    requiredKey="petty-cash-open"
                    element={
                      <>
                        <PageTitle title="Open Petty Cash" />
                        <PettyCashOpen />
                      </>
                    }
                  ></PrivateRoute>
                }
              />
              <Route
                path="/accounting/petty-cash/petty-cash-realized"
                element={
                  <PrivateRoute
                    requiredKey="petty-cash-realized"
                    element={
                      <>
                        <PageTitle title="Realized Petty Cash" />
                        <PettyCashRealize />
                      </>
                    }
                  ></PrivateRoute>
                }
              />
              <Route
                path="/accounting/petty-cash/petty-cash-posting"
                element={
                  <PrivateRoute
                    requiredKey="petty-cash-posting"
                    element={
                      <>
                        <PageTitle title="Posting Petty Cash" />
                        <PettyCashPosting />
                      </>
                    }
                  ></PrivateRoute>
                }
              />
              <Route
                path="/accounting/petty-cash/setting-petty-cash"
                element={
                  <PrivateRoute
                    requiredKey="setting-petty-cash"
                    element={
                      <>
                        <PageTitle title="Setting Petty Cash" />
                        <SettingPettyCash />
                      </>
                    }
                  ></PrivateRoute>
                }
              />
              <Route
                path="/accounting/petty-cash/saldo/request-saldo"
                element={
                  <PrivateRoute
                    requiredKey="request-saldo"
                    element={
                      <>
                        <PageTitle title="Request Saldo Petty Cash" />
                        <RequestSaldo />
                      </>
                    }
                  ></PrivateRoute>
                }
              />
              <Route
                path="/accounting/petty-cash/saldo/approval-saldo"
                element={
                  <PrivateRoute
                    requiredKey="approval-saldo"
                    element={
                      <>
                        <PageTitle title="Approval Saldo Petty Cash" />
                        <ApprovalSaldo />
                      </>
                    }
                  ></PrivateRoute>
                }
              />
              <Route
                path="/accounting/petty-cash/setting-petty-cash/add"
                element={
                  <PrivateRoute
                    requiredKey="setting-petty-cash-create"
                    element={
                      <>
                        <PageTitle title="Setting Petty Cash" />
                        <SettingPettyCashForm />
                      </>
                    }
                  ></PrivateRoute>
                }
              />
              <Route
                path="/accounting/reports/general-ledger"
                element={
                  <PrivateRoute
                    requiredKey="general-ledger"
                    element={
                      <>
                        <PageTitle title="General Ledger" />
                        <GeneralLedger />
                      </>
                    }
                  ></PrivateRoute>
                }
              />
              <Route
                path="/accounting/reports/trial-balance"
                element={
                  <PrivateRoute
                    requiredKey="trial-balance"
                    element={
                      <>
                        <PageTitle title="Trial Balance" />
                        <TrialBalance />
                      </>
                    }
                  ></PrivateRoute>
                }
              />
              <Route
                path="/accounting/reports/profit-loss"
                element={
                  <PrivateRoute
                    requiredKey="profit-loss"
                    element={
                      <>
                        <PageTitle title="Profit Loss" />
                        <ProfitLoss />
                      </>
                    }
                  ></PrivateRoute>
                }
              />
              <Route
                path="/accounting/reports/balance-sheet"
                element={
                  <PrivateRoute
                    requiredKey="balance-sheet"
                    element={
                      <>
                        <PageTitle title="Balance Sheet" />
                        <BalanceSheet />
                      </>
                    }
                  ></PrivateRoute>
                }
              />
              <Route
                path="/accounting/cash-transaction/cash-bank-transaction"
                element={
                  <PrivateRoute
                    requiredKey="cash-bank-transaction"
                    element={
                      <>
                        <PageTitle title="Cash and Bank Transaction" />
                        <CashandBankTransaction />
                      </>
                    }
                  ></PrivateRoute>
                }
              />
              <Route
                path="/accounting/cash-transaction/cash-bank-journal"
                element={
                  <PrivateRoute
                    requiredKey="cash-bank-journal"
                    element={
                      <>
                        <PageTitle title="Cash and Bank Journal" />
                        <CashAndBankJournal />
                      </>
                    }
                  ></PrivateRoute>
                }
              />
              <Route
                path="/accounting/cash-transaction/foreign-exchange-transaction"
                element={
                  <PrivateRoute
                    requiredKey="foreign-exchange-transaction"
                    element={
                      <>
                        <PageTitle title="Foreign Exchange Transaction" />
                        <ForeignExchangeTransaction />
                      </>
                    }
                  ></PrivateRoute>
                }
              />
              <Route
                path="/accounting/cash-transaction/foreign-exchange-transaction/add"
                element={
                  <PrivateRoute
                    requiredKey="foreign-exchange-transaction-create"
                    element={
                      <>
                        <PageTitle title="Add Foreign Exchange Transaction" />
                        <ForeignExchangeTransactionForm />
                      </>
                    }
                  ></PrivateRoute>
                }
              />
              <Route
                path="/accounting/cash-transaction/foreign-exchange-journal"
                element={
                  <PrivateRoute
                    requiredKey="foreign-exchange-journal"
                    element={
                      <>
                        <PageTitle title="Foreign Exchange Journal" />
                        <ForeignExchangeJournal />
                      </>
                    }
                  ></PrivateRoute>
                }
              />
              <Route
                path="/accounting/foreign-currency-ledger/ledger"
                element={
                  <PrivateRoute
                    requiredKey="ledger"
                    element={
                      <>
                        <PageTitle title="Ledger" />
                        <ValutaAsingTracker />
                      </>
                    }
                  ></PrivateRoute>
                }
              />
              <Route
                path="/accounting/foreign-currency-ledger/exchange-rate-adjustment"
                element={
                  <PrivateRoute
                    requiredKey="exchange-rate-adjustment"
                    element={
                      <>
                        <PageTitle title="Exchange Rate Adjustment" />
                        <ValutaAsingAdjustment />
                      </>
                    }
                  ></PrivateRoute>
                }
              />
              <Route
                path="/accounting/foreign-currency-ledger/exchange-rate-adjustment-journal"
                element={
                  <PrivateRoute
                    requiredKey="exchange-rate-adjustment-journal"
                    element={
                      <>
                        <PageTitle title="Exchange Rate Adjustment Journal" />
                        <ValutaAsingAdjustmentJournal />
                      </>
                    }
                  ></PrivateRoute>
                }
              />
              {/* End Accounting Route */}

              <Route
                path="/user-managements/user-accounts"
                element={
                  <PrivateRoute
                    requiredKey="user-accounts"
                    element={
                      <>
                        <PageTitle title="User Accounts" />
                        <UserAccounts />
                      </>
                    }
                  ></PrivateRoute>
                }
              />
              <Route
                path="/user-managements/role-permissions"
                element={
                  <PrivateRoute
                    requiredKey="role-permissions"
                    element={
                      <>
                        <PageTitle title="Role And Permissions" />
                        <RoleAndPermissions />
                      </>
                    }
                  ></PrivateRoute>
                }
              />
              <Route
                path="/user-managements/role-permissions/add"
                element={
                  <PrivateRoute
                    requiredKey="role-permissions"
                    element={
                      <>
                        <PageTitle title="Add Role And Permissions" />
                        <RoleAndPermissionsForm />
                      </>
                    }
                  ></PrivateRoute>
                }
              />
            </Route>

            <Route
              path="*"
              element={
                <>
                  <PageTitle title="Page Not Found" />
                  <NotFound />
                </>
              }
            />
          </Routes>
        </AppWithScreensaver>
      </ProfileProvider>
    </AuthProvider>
  );
}

export default App;
