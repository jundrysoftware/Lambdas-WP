import React, { Component } from "react";
import ApexCharts from "apexcharts";
import axios from "axios";
import constants from "../constants";
class GraphContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  isGraphRendered = false;
  renderGraph = ({ type = "bar", series, categories }, id) => {
    const basics = {
      chart: {
        type,
      },
    };
    const chart = new ApexCharts(document.getElementById(id), {
      ...basics,
      series,
      xaxis: {
        categories,
      },
      stroke: {
        curve: "smooth",
      },
    });
    chart.render();
  };

  getMonthlyMetrics = () =>
    axios({
      url: constants.basepath + constants.routes.stats,
      method: "get",
    })
      .then((res) => {
        const data = res.data;
        const [amounts, months] = data.reduce(
          (prev, current) => {
            prev[0].push(current.total);
            prev[1].push(current.month);
            return prev;
          },
          [[], []]
        );
        this.renderGraph(
          {
            categories: months,
            series: [
              {
                name: "Gastos",
                data: amounts,
              },
            ],
          },
          "graph-montly"
        );
      })
      .catch((err) => console.error(err));
  getMonthlyCategories = () =>
    axios({
      url: constants.basepath + constants.routes.stats + "?metricType=category",
      method: "get",
    })
      .then((res) => {
        const data = res.data;
        const monthsArray = [];
        const datasets = data.map((item) => {
          return {
            name: item.category,
            data: item.monthly.map((i) => {
              monthsArray.push(i.month);
              return {
                x: i.month,
                y: i.total,
              };
            }),
          };
        });
        const uniqueMonths = [...new Set(monthsArray)].sort();
        const fill = datasets.map((serie) => {
          const existentMonth = serie.data.map((i) => i.x);
          const filled = uniqueMonths
            .map((month) => {
              if (!existentMonth.includes(month)) {
                return {
                  x: month,
                  y: 0,
                };
              }
            })
            .filter((i) => i);
          const joined = [...filled, ...serie.data].sort((a, b) => {
            if (a.x > b.x) return 1;
            if (a.x < b.x) return -1;
            return 0;
          });
          return {
            ...serie,
            data: joined,
          };
        });
        this.renderGraph(
          {
            categories: uniqueMonths,
            type: "line",
            series: fill,
          },
          "graph-category-monthly"
        );
      })
      .catch((err) => console.error(err));

  componentDidMount = () => {
    this.getMonthlyMetrics();
    this.getMonthlyCategories();
  };

  render() {
    return (
      <div className="graph-container">
        <h2>Total monthly</h2>
        <div id="graph-montly"></div>
        <h2>Categories by month</h2>
        <div id="graph-category-monthly"></div>
      </div>
    );
  }
}
export default GraphContainer;
