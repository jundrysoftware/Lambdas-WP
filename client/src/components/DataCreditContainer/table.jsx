import React from "react";
import { Table } from "emerald-ui/lib";

export default (props) => {
    const { content = [], title } = props;

    return (
        <div >
            <h2>{title}</h2>
            <Table>
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Valor</th>
                    </tr>
                </thead>
                <tbody>
                    {content.map(({ title, value }, index) => (
                        <tr key={`data-credit-info-key-${index}`}>
                            <td>{title}</td>
                            <td>{value}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )
}