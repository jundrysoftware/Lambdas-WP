import React from "react";
import { Table } from "emerald-ui/lib";

export default (props) => {
  const transformNumber = (number)=> new Intl.NumberFormat().format(number)
  const { content = [], title = 'Table title' } = props;
  return (
    <div className="table-container-emerald">
        <h2>{title}</h2>
      <Table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Categoría</th>
            <th>Cantidad</th>
          </tr>
        </thead>
        <tbody>
          {content.map(({ description, amount, category, createdAt }) => (
            <tr>
              <td>{description}</td>
              <td>{category}</td>
              <td>${transformNumber(amount)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};
