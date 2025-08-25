import { ConfigProvider, Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import type { ExpandableConfig } from "antd/es/table/interface";
import type { TableProps as RcTableProps } from "rc-table";
import type { PanelRender } from "rc-table/lib/interface";
import { useState } from "react";

interface TableAppProps {
  dataSource: RcTableProps<any>["data"];
  onPaginationChange?: (page: number, size: number) => void;
  columns: ColumnsType<any>;
  expandable?: ExpandableConfig<any>;
  pagination?: false | TablePaginationConfig;
  childrenColumnName?: string;
  rowKey?: string;
  summary?: (data: readonly any[]) => React.ReactNode;
  footer?: PanelRender<any>;
  scroll?: { x: number | string; y?: number | string };
}

const TableApp = ({
  dataSource,
  columns,
  pagination = false,
  expandable,
  childrenColumnName = "children",
  rowKey = "key",
  summary,
  footer,
  scroll,
  onPaginationChange,
}: TableAppProps) => {
  const [current, setCurrent] = useState(
    pagination ? pagination.current : null
  );
  const [pageSize, setPageSize] = useState(
    pagination ? pagination.pageSize : null
  );

  const handlePaginationChange = (page: number, size: number) => {
    setCurrent(page);
    setPageSize(size);
    if (onPaginationChange) {
      onPaginationChange(page, size);
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default">
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#D0B88A",
            colorLink: "#D0B88A",
          },
        }}
      >
        <Table
          dataSource={dataSource}
          columns={columns}
          className="bg-white"
          expandable={{
            ...expandable,
            childrenColumnName,
          }}
          summary={summary}
          bordered
          rowClassName="text-black bg-white"
          pagination={
            pagination === false
              ? false
              : {
                  current: current ?? 1, // ✅ Gunakan state current
                  pageSize: pageSize ?? 10, // ✅ Gunakan state pageSize
                  total: pagination.total, // ✅ Hitung total data otomatis
                  position: ["bottomCenter"],
                  showSizeChanger: true,
                  showQuickJumper: true,
                  onChange: handlePaginationChange, // ✅ Handle perubahan state
                }
          }
          rowKey={rowKey}
          footer={footer}
          scroll={scroll || { x: 1000 }}
          style={{ tableLayout: "fixed" }}
        />
      </ConfigProvider>
    </div>
  );
};

export default TableApp;
