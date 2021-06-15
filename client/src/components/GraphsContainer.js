import React, { Component } from "react";
import ApexCharts from "apexcharts";
import { API } from 'aws-amplify'
import SelectorTimming from './SelectorTiming'
import moment from 'moment'
import './GraphContainer.css'
import formatCash from '../utils/formatCash';

class GraphContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeAgo: 'year'
    };
  }
  isGraphRendered = false;
  ChartsRendered = {}

  renderGraph = ({ type = "bar", series, categories, xaxis = {}, dataLabels = {}, plotOptions = {}, chartOptions = {} }, id) => {
    const basics = {
      chart: {
        type,
        ...chartOptions
      },
    };
    if (!this.ChartsRendered[id]) {
      const chart = new ApexCharts(document.getElementById(id), {
        ...basics,
        series,
        xaxis: {
          categories,
          axisBorder: {
            show: false
          },
          ...xaxis
        },
        yaxis: {
          formatter: formatCash
        },
        dataLabels,
        plotOptions,
        stroke: {
          curve: "smooth",
          width: 3
        },
      });
      chart.render();
      this.ChartsRendered[id] = chart;
    } else {
      this.ChartsRendered[id].updateSeries(series)
    }
  };

  getMonthlyMetrics = () =>
    API.get("finances", '/boxflow/stats').then(response => {
      const { payments, incomes } = JSON.parse(response.body)


      // Payments
      const [paymentsAmount, paymentsMonths] = payments.reduce(
        (prev, current) => {
          prev[0].push(current.total.toFixed(2));
          prev[1].push(current.month);
          return prev;
        },
        [[], []]
      );

      this.renderGraph(
        {
          categories: paymentsMonths,
          series: [
            {
              name: "Gastos",
              data: paymentsAmount,
            },
          ],
          plotOptions: {
            bar: {
              borderRadius: 10,
              dataLabels: {
                position: 'top',
              },
            }
          },
          dataLabels: {
            enabled: true,
            formatter: function (val) {
              return formatCash(val).replace(',00', '')
            },
            offsetY: -20,
            style: {
              fontSize: '12px',
              colors: ["#054b80"]
            }
          },
        },
        "graph-montly"
      );

      // Incomes vs Payments
      const [incomesAmounts, incomesMonths] = incomes.reduce(
        (prev, current) => {
          prev[0].push(current.total.toFixed(2));
          prev[1].push(current.month);
          return prev;
        },
        [[], []]
      );

      

      this.renderGraph(
        {
          categories: incomesMonths,
          series: [
            {
              name: "Ingresos",
              data: incomesAmounts,
            },
            {
              name: "Gastos",
              data: paymentsAmount,
            },
          ],
          plotOptions: {
            bar: {
              borderRadius: 10,
              dataLabels: {
                position: 'top',
              },
            }
          },
          chartOptions: {
            stacked: true,
            stackType: '100%'
          },
          dataLabels: {
            enabled: true,
            offsetY: -20,
            style: {
              fontSize: '12px',
              colors: ["#054b80"]
            }
          },
        },
        "graph-montly-incomes-vs-payemnts"
      );
    });

  getMonthlyCategories = (date, period = 'month') =>
    API.get('finances', '/boxflow/stats', { queryStringParameters: { metricType: 'category', date, groupBy: period } })
      .then((res) => {
        const { payments, incomes } = JSON.parse(res.body);

        // Payments
        const monthsArray = [];
        const datasetsPayemnts = payments.map((item) => {
          return {
            name: item.category,
            data: item.monthly.map((i) => {
              const date = period != 'month'
                ? i.month.substring(5, 10)
                : i.month
              monthsArray.push(date);
              return {
                x: date,
                y: i.total.toFixed(2),
              };
            }),
          };
        });
        const uniqueMonthsPayments = [...new Set(monthsArray)].sort();
        const fillPayments = datasetsPayemnts.map((serie) => {
          const existentMonth = serie.data.map((i) => i.x);
          const filled = uniqueMonthsPayments
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
            categories: uniqueMonthsPayments,
            type: "line",
            series: fillPayments,
          },
          "graph-category-monthly"
        );

        // Incomes
        const monthsArrayIncomes = [];
        const datasetsIncomes = incomes.map((item) => {
          return {
            name: item.category,
            data: item.monthly.map((i) => {
              const date = period != 'month'
                ? i.month.substring(5, 10)
                : i.month
              monthsArrayIncomes.push(date);
              return {
                x: date,
                y: i.total.toFixed(2),
              };
            }),
          };
        });
        const uniqueMonthsIncomes = [...new Set(monthsArrayIncomes)].sort();
        const fillIncomes = datasetsIncomes.map((serie) => {
          const existentMonth = serie.data.map((i) => i.x);
          const filled = uniqueMonthsIncomes
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
            categories: uniqueMonthsIncomes,
            type: "line",
            series: fillIncomes,
          },
          "graph-category-monthly-incomes"
        );
      })
      .catch((err) => console.error(err));


  componentDidMount = () => {
    this.getMonthlyMetrics();
    this.getMonthlyCategories();
  };

  onChangeDate = (e, period) => {
    const date = moment().subtract(1, period).toISOString()
    const grpupBy = period === 'year'
      ? 'month'
      : 'day';
    this.getMonthlyCategories(date, grpupBy)
    this.setState({
      timeAgo: period
    })
  }

  render() {
    const { timeAgo } = this.state
    return (
      <div className="graph-container">
        <SelectorTimming
          onChangeDate={this.onChangeDate}
          timeAgo={timeAgo}
        />
        <div className="container-graphs-general">
          <div className="graph-monthly-container">
            <h2>Total monthly payemnts</h2>
            <div id="graph-montly"></div>
          </div>
          <div className="graph-category-monthly-container">
            <h2>Payments Categories by month</h2>
            <div id="graph-category-monthly"></div>
          </div>
        </div>

        <div className="container-graphs-general">
          <div className="graph-monthly-container">
            <h2>Total Incomes vs Payments monthly</h2>
            <div id="graph-montly-incomes-vs-payemnts"></div>
          </div>
          <div className="graph-category-monthly-container">
            <h2>Incomes Categories by month</h2>
            <div id="graph-category-monthly-incomes"></div>
          </div>
        </div>
      </div>
    );
  }
}
export default GraphContainer;
