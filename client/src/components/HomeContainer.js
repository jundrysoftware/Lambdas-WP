import React from "react";
import Table from './TableComponent'
class PrepaymentComponent extends React.Component {
    constructor(props){
        super(props)
    }
    render(){
        return(
            <div className="home-container">
                <Table title="Ultimas compras" content={[{amount: 123, description: "abc", category: "abc"}]}/> 
                <Table title="Compras mas hptas..." content={[{amount: 123, description: "abc", category: "abc"}]}/> 
                <Table title="Pre pagos - no confirmados" content={[{amount: 123, description: "abc", category: "abc"}]}/> 
                <Table title="Total por categoría" content={[{amount: 123, description: "abc", category: "abc"}]}/> 
            </div>
        )
    }
}
export default PrepaymentComponent