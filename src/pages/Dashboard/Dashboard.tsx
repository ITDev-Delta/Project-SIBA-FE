import React from "react";
import { useProfileContext } from "../../context/profile_context";

const Dashboard: React.FC = () => {
  const { profile } = useProfileContext();
  // const [dashboardData, setDashboardData] = useState({
  //   totalViews: "3.456K",
  //   totalSupply: "45.2K",
  //   totalProduct: "2.450",
  //   totalCustomer: "3.456",
  //   totalOrders: "1.234",
  //   totalRevenue: "125.6M",
  //   stockOpname: "89",
  //   pendingApproval: "12",
  // });

  // 1. Filter berdasarkan izin pengguna
  const accessibleActions = quickActionsList.filter((action) =>
    profile?.permissions?.some((permission) => permission === action.permission)
  );

  // 2. Urutkan berdasarkan prioritas (terkecil ke terbesar)
  accessibleActions.sort((a, b) => a.priority - b.priority);

  // 3. Ambil maksimal 3 item teratas
  // const top3Actions = accessibleActions.slice(0, 3);

  // Simulate data fetching
  // useEffect(() => {
  //   // TODO: Replace with actual API calls
  //   const fetchDashboardData = async () => {
  //     // Simulate API call
  //     setTimeout(() => {
  //       setDashboardData({
  //         totalViews: "5.234K",
  //         totalSupply: "67.8K",
  //         totalProduct: "3.789",
  //         totalCustomer: "4.567",
  //         totalOrders: "2.345",
  //         totalRevenue: "189.3M",
  //         stockOpname: "156",
  //         pendingApproval: "8",
  //       });
  //     }, 1000);
  //   };

  //   fetchDashboardData();
  // }, []);

  return (
    <>
      {/* Welcome Section */}
      <div className="mb-6 bg-gradient-to-r from-primary to-secondary rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {profile?.user?.nama_lengkap || "User"}!
        </h1>
        <p className="text-blue-100">
          Here's what's happening with your business today.
        </p>
      </div>

      {/* Main Stats Cards */}
      {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 mb-6">
        <CardDataStats
          title="Total Views"
          total={dashboardData.totalViews}
          rate="0.43%"
          levelUp
        >
          <EyeIcon className="h-6 w-6 stroke-primary dark:stroke-white" />
        </CardDataStats>

        <CardDataStats
          title="Total Supply"
          total={dashboardData.totalSupply}
          rate="4.35%"
          levelUp
        >
          <TruckIcon className="h-6 w-6 stroke-primary dark:stroke-white" />
        </CardDataStats>

        <CardDataStats
          title="Total Product"
          total={dashboardData.totalProduct}
          rate="2.59%"
          levelUp
        >
          <CubeIcon className="h-6 w-6 stroke-primary dark:stroke-white" />
        </CardDataStats>

        <CardDataStats
          title="Total Customer"
          total={dashboardData.totalCustomer}
          rate="0.95%"
          levelDown
        >
          <UsersIcon className="h-6 w-6 stroke-primary dark:stroke-white" />
        </CardDataStats>
      </div> */}

      {/* Additional Stats Cards */}
      {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 mb-6">
        <CardDataStats
          title="Total Orders"
          total={dashboardData.totalOrders}
          rate="1.25%"
          levelUp
        >
          <ShoppingCartIcon className="h-6 w-6 stroke-primary dark:stroke-white" />
        </CardDataStats>

        <CardDataStats
          title="Revenue"
          total={`Rp ${dashboardData.totalRevenue}`}
          rate="3.48%"
          levelUp
        >
          <BanknotesIcon className="h-6 w-6 stroke-primary dark:stroke-white" />
        </CardDataStats>

        <CardDataStats
          title="Stock Opname"
          total={dashboardData.stockOpname}
          rate="0.12%"
          levelUp
        >
          <DocumentTextIcon className="h-6 w-6 stroke-primary dark:stroke-white" />
        </CardDataStats>

        <CardDataStats
          title="Pending Approval"
          total={dashboardData.pendingApproval}
          rate="2.15%"
          levelDown
        >
          <ChartBarIcon className="h-6 w-6 stroke-primary dark:stroke-white" />
        </CardDataStats>
      </div> */}

      {/* Quick Actions */}
      {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-6"> */}
      {/* <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                Quick Actions
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Frequently used features
              </p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {top3Actions.length > 0 ? (
              top3Actions.map((action) => (
                <NavLink
                  key={action.path}
                  to={action.path}
                  className="block w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="text-sm font-medium text-black dark:text-white">
                    {action.nama}
                  </span>
                </NavLink>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                No quick actions available for your role.
              </p>
            )}
          </div>
        </div> */}

      {/* Recent Activities */}
      {/* <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h4 className="text-title-md font-bold text-black dark:text-white mb-4">
            Recent Activities
          </h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <div>
                <p className="text-sm text-black dark:text-white">
                  New order created
                </p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-secondary rounded-full"></div>
              <div>
                <p className="text-sm text-black dark:text-white">
                  Product updated
                </p>
                <p className="text-xs text-gray-500">5 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <div>
                <p className="text-sm text-black dark:text-white">
                  Customer registered
                </p>
                <p className="text-xs text-gray-500">10 minutes ago</p>
              </div>
            </div>
          </div>
        </div> */}

      {/* System Status */}
      {/* <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h4 className="text-title-md font-bold text-black dark:text-white mb-4">
            System Status
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-black dark:text-white">
                Database
              </span>
              <span className="inline-flex items-center gap-1 text-success">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                Online
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-black dark:text-white">
                API Status
              </span>
              <span className="inline-flex items-center gap-1 text-success">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                Active
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-black dark:text-white">Backup</span>
              <span className="inline-flex items-center gap-1 text-warning">
                <div className="w-2 h-2 bg-warning rounded-full"></div>
                Pending
              </span>
            </div>
          </div>
        </div> */}

      {/* User Profile Summary */}
      {/* <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h4 className="text-title-md font-bold text-black dark:text-white mb-4">
            Your Profile
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-black dark:text-white">Role</span>
              <span className="text-sm font-medium text-primary">
                {profile?.roles?.[0] || "User"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-black dark:text-white">
                Location
              </span>
              <span className="text-sm font-medium">
                {profile?.location?.length || "N/A"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-black dark:text-white">
                Permissions
              </span>
              <span className="text-sm font-medium text-success">
                {profile?.permissions?.length || 0} active
              </span>
            </div>
          </div>
        </div> */}
      {/* </div> */}

      {/* Charts Section - Uncomment when charts are ready */}
      {/* 
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-2 2xl:gap-7.5">
        <ChartOne />
        <ChartTwo />
      </div>
      <div className="mt-4 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartThree />
      </div>
      */}

      {/* Table Section - Uncomment when table is ready */}
      {/* 
      <div className="mt-4 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12 xl:col-span-6">
          <TableApp />
        </div>
      </div>
      */}
    </>
  );
};

export default Dashboard;

export const quickActionsList = [
  // === GRUP PRIORITAS TINGGI (BUAT, UBAH, TRANSAKSI) ===
  // --- Level 1: Transaksi Inti Harian ---
  {
    nama: "Create Purchase Order", // Dari "Purchase Order" -> "Create"
    path: "/purchasing/purchase-order/create-po",
    permission: "purchasing.purchase-order.create-po.create", //
    priority: 1,
  },
  {
    nama: "Create Sales Order", // Dari "Sales Order" -> "Create"
    path: "/sales/sales-order/create-so",
    permission: "sales.sales-order.create-so.create", //
    priority: 2,
  },

  {
    nama: "Open GRN", // Dari "GRN" -> "Open" (Create GRN)
    path: "/logistic/inventory/open-grn",
    permission: "logistic.inventory.open-grn.create", //
    priority: 3,
  },
  {
    nama: "Open Sales Shipment", // Dari "Sales Shipment" -> "Open" (Create Shipment)
    path: "/logistic/sales-shipment/open-shipment",
    permission: "logistic.sales-shipment.open-shipment.create", //
    priority: 4,
  },
  {
    nama: "Pay Purchase Payment Plan", // Dari "Purchase Payment Plan" -> "Unpaid" (Create Payment)
    path: "/purchasing/purchase-payment-plan/unpaid-payment-plan",
    permission: "purchasing.purchase-payment-plan.unpaid-payment-plan.create", //
    priority: 5,
  },
  {
    nama: "Pay Sales Payment Plan", // Dari "Sales Payment Plan" -> "Unpaid" (Create Payment)
    path: "/sales/sales-payment-plan/unpaid-payment-plan-sales",
    permission: "sales.sales-payment-plan.unpaid-payment-plan-sales.create", //
    priority: 6,
  },
  {
    nama: "Request Assembly", // Dari "Assembly" -> "Request"
    path: "/logistic/assembly/request-assembly",
    permission: "logistic.assembly.request-assembly.create", //
    priority: 33,
  },
  {
    nama: "Approval Purchase Order", // Dari "Purchase Order" -> "Approval"
    path: "/purchasing/purchase-order/approval-po",
    permission: "purchasing.purchase-order.approval-po.update", // Menggunakan .update untuk aksi persetujuan
    priority: 7,
  },
  {
    nama: "Approval Sales Order", // Dari "Sales Order" -> "Approval"
    path: "/sales/sales-order/approval-so",
    permission: "sales.sales-order.approval-so.update", // Menggunakan .update untuk aksi persetujuan
    priority: 8,
  },

  // --- Level 2: Transaksi Operasional & Keuangan ---
  {
    nama: "Create Direct Purchase", // Dari "Direct Purchase" -> "Create"
    path: "/purchasing/direct-purchase/create-direct-purchase",
    permission: "purchasing.direct-purchase.create-direct-purchase.create", //
    priority: 10,
  },
  {
    nama: "Request Stock Opname", // Dari "Adjustment (Avg)" -> "Request"
    path: "/logistic/inventory-adjustment-avg/stock-opname-request",
    permission: "logistic.inventory-adjustment-avg.stock-opname-request.create", //
    priority: 11,
  },
  {
    nama: "Create Invoice", // Dari "Invoice" -> "Create"
    path: "/sales/sales-order-invoice/create-sales-invoice",
    permission: "sales.sales-order-invoice.create-sales-invoice.create", //
    priority: 12,
  },
  {
    nama: "Create General Journal",
    path: "/accounting/journal-entry/general-journal",
    permission: "accounting.journal-entry.general-journal.create", //
    priority: 13,
  },
  {
    nama: "Create Cash & Bank Transaction",
    path: "/accounting/cash-transaction/cash-bank-transaction",
    permission: "accounting.cash-transaction.cash-bank-transaction.create", //
    priority: 14,
  },
  {
    nama: "Request & Send Transfer", // Dari "Inventory Transfer (Avg)" -> "Request & Send"
    path: "/logistic/inventory-transfer-avg/transfer-request",
    permission: "logistic.inventory-transfer-avg.transfer-request.create", //
    priority: 15,
  },
  {
    nama: "Request Purchase Return", // Dari "Purchase Return (Avg)" -> "Request"
    path: "/logistic/purchase-return-avg/purchase-return-request-avg",
    permission:
      "logistic.purchase-return-avg.purchase-return-request-avg.create", //
    priority: 16,
  },

  // --- Level 3: Pengelolaan Master Data & Aset ---
  {
    nama: "Create Items",
    path: "/master/items",
    permission: "master.items.create", //
    priority: 20,
  },
  {
    nama: "Create Customer",
    path: "/master/customer",
    permission: "master.customer.create", //
    priority: 21,
  },
  {
    nama: "Create Supplier",
    path: "/master/supplier",
    permission: "master.supplier.create", //
    priority: 22,
  },
  {
    nama: "Create Asset List",
    path: "/accounting/asset-management/asset",
    permission: "accounting.asset-management.asset.create", //
    priority: 23,
  },

  // --- Level 4: Tindakan Spesifik & Periodik ---
  {
    nama: "Realized Petty Cash", // Dari "Petty Cash" -> "Realized"
    path: "/accounting/petty-cash/petty-cash-realized",
    permission: "accounting.petty-cash.petty-cash-realized.create", //
    priority: 30,
  },
  {
    nama: "Opening Balance",
    path: "/accounting/period-balance/opening-balance",
    permission: "accounting.period-balance.opening-balance.create", //
    priority: 31,
  },
  {
    nama: "Period Closing",
    path: "/accounting/period-balance/period-closing",
    permission: "accounting.period-balance.period-closing.create", //
    priority: 32,
  },

  // === GRUP PRIORITAS RENDAH (LIHAT, LAPORAN, MANAJEMEN) ===
  {
    nama: "Stock Overview",
    path: "/logistic/inventory-report/stock-overview",
    permission: "logistic.inventory-report.stock-overview.view", //
    priority: 50,
  },
  {
    nama: "Batch/SN Tracking",
    path: "/logistic/inventory-report/batch-sn-tracking",
    permission: "logistic.inventory-report.batch-sn-tracking.view", //
    priority: 51,
  },
  {
    nama: "Profit / Loss",
    path: "/accounting/reports/profit-loss",
    permission: "accounting.reports.profit-loss.view", //
    priority: 52,
  },
  {
    nama: "Balance Sheet",
    path: "/accounting/reports/balance-sheet",
    permission: "accounting.reports.balance-sheet.view", //
    priority: 53,
  },
  {
    nama: "General Ledger",
    path: "/accounting/reports/general-ledger",
    permission: "accounting.reports.general-ledger.view", //
    priority: 54,
  },
];
