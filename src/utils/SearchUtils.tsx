import { SearchOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import { useRef } from "react";

interface ColumnSearchPropsArgs {
  dataIndex: string;
  label: string;
  isTree?: boolean;
  isDate?: boolean;
  onSearch?: Function;
  onReset?: Function;
}

export const useColumnSearchProps = () => {
  const searchInput = useRef<any | null>(null);

  const handleSearch = (confirm: () => void) => {
    confirm();
  };

  const handleReset = (clearFilters: () => void, confirm: () => void) => {
    clearFilters();
    confirm();
  };

  const searchTree = (
    value: string,
    record: any,
    dataIndex: string
  ): boolean => {
    // Check if the current record matches the search value
    if (
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase())
    ) {
      return true;
    }

    // Recursively search in all children
    if (record.all_children && record.all_children.length > 0) {
      return record.all_children.some((child: any) =>
        searchTree(value, child, dataIndex)
      );
    }

    // No match found
    return false;
  };

  const searchDate = (
    value: string,
    record: any,
    dataIndex: string
  ): boolean => {
    const date = new Date(record[dataIndex]);
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear().toString();
    const day = date.getDate().toString();

    if (
      month.toLowerCase().includes(value.toLowerCase()) ||
      year.includes(value) ||
      day.includes(value)
    ) {
      return true;
    }
    return false;
  };

  const getColumnSearchProps = ({
    dataIndex,
    label,
    isTree = false,
    isDate = false,
    onSearch,
    onReset,
  }: ColumnSearchPropsArgs) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: any) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            searchInput.current = node;
          }}
          placeholder={`Cari ${label}`}
          value={selectedKeys[0]}
          onChange={
            (e) => setSelectedKeys(e.target.value ? [e.target.value] : [])
            // handle time out then search
          }
          onPressEnter={() => {
            handleSearch(confirm);
            onSearch?.();
          }}
          style={{ marginBottom: 8, display: "block" }}
        />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            type="primary"
            onClick={() => {
              handleSearch(confirm);
              onSearch?.();
            }}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => {
              handleReset(clearFilters!, confirm);
              onReset?.();
            }}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </div>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value: any, record: any) => {
      if (isTree) {
        return searchTree(value, record, dataIndex);
      }
      if (isDate) {
        return searchDate(value, record, dataIndex);
      }
      if (dataIndex.includes(".")) {
        const [first, second] = dataIndex.split(".");
        return record[first][second]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase());
      }
      return record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "";
    },
    onFilterDropdownOpenChange: (visible: boolean) => {
      if (visible) {
        setTimeout(() => searchInput.current?.focus(), 100);
      }
    },
  });

  return { getColumnSearchProps };
};
