import React from "react";
import Table from "./TableComponent";
import moment from "moment";
import axios from "axios";
import constants from "../constants";

class HomeComponent extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      timeAgo: "",
      latestPayments: [],
      expensivePayments: [],
      totalByCategory: [],
      prepayments: [],
      categories: []
    };
  }
  isRenderd = false;

  getHomeStatistics = async (timeAgo) => {
    const url =
      constants.basepath +
      constants.routes.stats +
      "?metricType=home&date=" +
      timeAgo;
    const result = await axios.get(url).catch((e) => console.error(e));
    if ((!result || !result.data || (Array.isArray(result.data))) && !result.data.length) return;
    const categories = [];
    const { latestPayments, expensivePayments, prepayments, totalByCategory } = result.data;
    Object.keys(totalByCategory).forEach((key) => {
      const catName = key
      const total = totalByCategory[key].reduce((prev, curr) => prev + curr.amount, 0)
      categories.push({
        name: catName,
        total
      })
    });
    const totalTotales = categories.reduce((prev, curr) => prev + curr.total, 0)
    categories.push({
      name: 'Total',
      total: totalTotales
    })
    if (this._isMounted) {
      this.setState({
        latestPayments,
        expensivePayments,
        prepayments,
        categories
      });
    }
  };

  onChangeDate = (evt, date) => {
    if (evt) evt.preventDefault();
    const timeAgo = moment().subtract(1, date).toString();
    this.getHomeStatistics(timeAgo);
    if (this._isMounted) {
      this.setState({ timeAgo: date });
    }

  };

  componentDidMount() {
    this._isMounted = true;
    this.onChangeDate(null, "month");
  }

  componentWillUnmount() {
    this._isMounted = false;
  }
  
  transformNumber = (number) => Intl.NumberFormat('es-co', {style: 'currency', currency: 'COP'}).format(number)

  render() {
    const {
      timeAgo,
      latestPayments,
      expensivePayments,
      categories,
    } = this.state;
    return (
      <div className="home-container">
        <div className="container-timming-buton">
          <button
            onClick={(evt) => this.onChangeDate(evt, "week")}
            className={timeAgo === "week" ? "selected" : ""}
          >
            Last 1 Week
          </button>
          <button
            onClick={(evt) => this.onChangeDate(evt, "month")}
            className={timeAgo === "month" ? "selected" : ""}
          >
            Last 1 Month
          </button>
          <button
            onClick={(evt) => this.onChangeDate(evt, "year")}
            className={timeAgo === "year" ? "selected" : ""}
          >
            Last 1 Year
          </button>
        </div>
        <div className="categories-container">
          {
            categories.map((item, index) => (
              <div className="category-item" key={`item-${index}`}>
                <p>
                  {item.name}: <span>{this.transformNumber(item.total)}</span>
                </p>
              </div>
            ))
          }
        </div>
        <div className="stats-container">
          <Table title="Ultimas compras" content={latestPayments} />
          <Table title="Compras mas hptas..." content={expensivePayments} />
        </div>
      </div>
    );
  }
}
export default HomeComponent;
