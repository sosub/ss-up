import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html,
  body {
    height: 100%;
    width: 100%;
  }

  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  body.fontLoaded {
    font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  #app {
    background-color: #fafafa;
    min-height: 100%;
    min-width: 100%;
  }

  p,
  label {
    font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    line-height: 1.5em;
  }

  .dynamic-delete-button {
    cursor: pointer;
    position: relative;
    top: 4px;
    font-size: 24px;
    color: #999;
    transition: all .3s;
  }
  .dynamic-delete-button:hover {
    color: #777;
  }
  .dynamic-delete-button[disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .text-right {
    text-align: right;
  }

  .margin-bottom-10 {
    margin-bottom: 30px;
  }

  .updating-input {
    .ant-radio-inner:after {
      background-color: red;
    }
    &:focus,
    &:hover,
    .ant-select-selection,
    .ant-select-selection:focus,
    .ant-radio-wrapper-checked .ant-radio-inner,
    .ant-radio-wrapper-checked:hover .ant-radio-inner,
    .ant-radio-checked .ant-radio-inner,
    .ant-checkbox-inner,
    .ant-checkbox-input:hover + .ant-checkbox-inner,
    .ant-checkbox-input:focus + .ant-checkbox-inner
    {
      border-color: red;
    }
    .ant-checkbox-checked .ant-checkbox-inner {
      background-color: red;
      border-color: red;
    }
    border-color: red;
  }

  #list-table {
    border: 1px solid #e2e2e2;
    border-radius: 3px;
    table {
      .ant-table-thead {
        background-color: #e2e2e2;
        tr {
          th {
            background-color: #e2e2e2;
            padding: 5px;
            font-size: 13px;
            &.ant-table-selection-column {
              min-width: 40px;
              width: 40px;
            }
          }
        }
      }
      .ant-table-tbody {
        tr {
          &:nth-child(even) {
            background-color: #f2f2f2;
          }
          &:nth-child(odd) {
            background-color: white;
          }
          td {
            padding: 4px 3px;
            font-size: 12px;
            &.ant-table-selection-column {
              min-width: 40px;
              width: 40px;
            }
            small {
              font-size: 10px;
            }
          }
        }
      }
    }
  }
`;

export default GlobalStyle;
