import React from "react";
import PrepaymentItem from "./prePaymentItemComponent";
import { ExpansionTableRowGroup, TableHeader } from "emerald-ui/lib/";
import axios from 'axios'
import constants from 'constants'

class PrepaymentComponent extends React.Component {
  constructor(props) {
    super(props);
  }
  onSubmitPrepayment = (data) =>{
    const {
        onSavePrepayment = ()=>null
    } = this.props
    onSavePrepayment(data)
  }
  render() {
    const { payments = [] } = this.props;
    return (
      <ExpansionTableRowGroup>
        <TableHeader checkboxAriaLabel="Name">
          <th>Total</th>
          <th>Concepto</th>
          <th>Fecha</th>
        </TableHeader>
        {payments.map((item, i) => (
          <PrepaymentItem
            onSubmitPrepayment = {this.onSubmitPrepayment}
            item={item}
            key={"prepayment-item-" + i + "-" + item.amount}
          />
        ))}
      </ExpansionTableRowGroup>
    );
  }
}

export default PrepaymentComponent;
