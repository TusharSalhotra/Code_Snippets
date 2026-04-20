import { Table as AntTable } from "antd";
import styled from "styled-components";
import Colors from "styles/Colors";

const CommonTable = styled(AntTable)<{ width: string }>`
  width: ${(props) => props.width || "100%"};
  .ant-table {
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    table {
      border-collapse: collapse;
    }
    /* width: max-content; */
    .ant-table-thead {
      tr {
        th {
          background: ${Colors.Primary} !important;
          color: ${Colors.White};
          padding: 12px 15px !important;
          white-space: nowrap;
          &:hover {
            background: ${Colors.Primary} !important;
            color: ${Colors.White};
            .ant-table-column-sorter {
              color: ${Colors.White} !important;
            }
            &::before {
              height: 60% !important;
              background-color: ${Colors.White} !important;
            }
          }
          &::before {
            height: 60% !important;
            background-color: ${Colors.White} !important;
          }
        }
      }
    }
    .ant-table-tbody {
      /* overflow: auto;
      min-width: 700px; */
      tr {
        &:nth-child(odd) {
          background-color: #faf9f9;
          &:hover {
            background-color: ${Colors.LghtBlue} !important;
          }
        }
        td {
          padding: 5px 15px;
          border: 1px solid #faf9f9 !important;
          white-space: nowrap;
        }
        &:hover {
          background-color: ${Colors.LghtBlue};
          td {
            border-color: ${Colors.White} !important;
          }
        }
      }
    }
    tbody.ant-table-tbody tr:nth-child(even) td {
      background: initial;
    }

    .ant-table-column-sorter {
      color: ${Colors.White} !important;
    }

    /* :where(.css-dev-only-do-not-override-k83k30) { */
    &.ant-table-wrapper {
      .ant-table-thead {
        th {
          .ant-table-column-has-sorters {
            &:hover {
              &::before {
                background: #ffffff !important;
              }
            }
          }
        }
      }
    }
    /* } */

    tr {
      &:last-child {
        border-radius: 0 0 8px 8px;
      }
      &:hover {
        td {
          &:first-child {
            border-bottom-left-radius: 4px !important;
          }
          &:last-child {
            border-bottom-right-radius: 4px !important;
          }
        }
      }
    }
    /* ::-webkit-scrollbar {
      width: 8px;
      height: 5px;
      background-color: ${Colors.White};
      color: ${Colors.Grey3};
      border: 1px solid ${Colors.Grey3};
    }
    ::-webkit-scrollbar-thumb {
      background-color: ${Colors.Grey3};
      border-radius: 6px;
    } */
  }
  .ant-table-empty {
    .ant-table-content {
      overflow: hidden !important;
    }
  }
`;
export enum Pagination {
  PAGESIZE = 9,
}
const Table = ({ ...rest }: any) => {
  return (
    <div>
      <CommonTable
        {...rest}
        pagination={{
          defaultCurrent: 1,
          hideOnSinglePage: true,
          pageSize: Pagination.PAGESIZE,
          ...rest.pagination,
        }}
        scroll={{ x: true }}
      />
    </div>
  );
};

export default Table;
