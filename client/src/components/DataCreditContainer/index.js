import React from "react";
import axios from "axios";
import constants from "../../constants";
import Gauge from './gauge'
import Table from './table'

class DataCreditComponent extends React.Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            timeAgo: "",
            score: 0,
            comportamiento: "",
            amountOfProducts: 0,
            arrears30daysLastYear: 0,
            arrears60daysLast2Year: 0,
            arrearsAmount: 0,
            lastUpdate: new Date()
        };
    }
    isRenderd = false;

    getDataCreditStatistics = async () => {
        const url =
            constants.basepath +
            constants.routes.datacredit;

        const result = await axios.get(url).catch((e) => console.error(e));
        if ((!result || !result.data || (Array.isArray(result.data))) && !result.data.length) return;

        const {
            score,
            comportamiento,
            amountOfProducts,
            arrears30daysLastYear,
            arrears60daysLast2Year,
            arrearsAmount,
            updatedAt

        } = result.data
        if (this._isMounted) {
            this.setState({
                score,
                comportamiento,
                amountOfProducts,
                arrears30daysLastYear,
                arrears60daysLast2Year,
                arrearsAmount,
                lastUpdate: new Date(updatedAt)
            });
        }

    };


    componentDidMount() {
        this._isMounted = true;
        this.getDataCreditStatistics()
    }

    transformNumber = (number) => Intl.NumberFormat('es-co', {style: 'currency', currency: 'COP'}).format(number)

    render() {
        const {
            score,
            comportamiento,
            amountOfProducts,
            arrears30daysLastYear,
            arrears60daysLast2Year,
            arrearsAmount,
            lastUpdate
        } = this.state;

        const TableContent = [
            { title: 'comportamiento', value: comportamiento },
            { title: 'Numero de productos', value: amountOfProducts },
            { title: 'Productos en mora los ultimos 30 días', value: arrears30daysLastYear ? arrears30daysLastYear : 0 },
            { title: 'Productos en mora los ultimos 60 días', value: arrears60daysLast2Year ? arrears60daysLast2Year : 0 },
            { title: 'Monto en Mora', value: this.transformNumber(arrearsAmount) },
        ]

        return (
            <div className="data-credit-container">
                <Gauge value={score} min={500} max={1000} label='Ultima Actualización' lastUpdate={lastUpdate} />
                <Table content={TableContent} />
            </div>
        );
    }
}
export default DataCreditComponent;
