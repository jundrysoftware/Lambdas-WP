import React from "react";
import Table from "./TableComponent";
import moment from "moment";
import formatCash from '../utils/formatCash';
import ModalShowCategories from './ModalShowCategories/ModalShowCategories'
import SelectorTimming from './SelectorTiming'
import { API } from 'aws-amplify'

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
    API.get('finances', '/boxflow/stats', { queryStringParameters: { metricType: 'home', date: timeAgo } })
      .then(response => {
        const data = JSON.parse(response.body)
        const categories = [];
        const { latestPayments, expensivePayments, prepayments, totalByCategory } = data;
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
            categories,
            totalByCategory
          });
        }
      })
  };

  onChangeDate = (evt, date) => {
    if (evt) evt.preventDefault();
    const timeAgo = moment().subtract(1, date).toISOString();
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

  showCategoriesContainer(evt, category) {
    if (evt) evt.preventDefault();
    this.setState({ showCategoriesModal: true, choosedCategoryModal: category }); 
    
  }


  render() {
    const {
      timeAgo,
      latestPayments,
      expensivePayments,
      categories,
      choosedCategoryModal,
      totalByCategory,
    } = this.state;
    return (
      <div className="home-container">
        <ModalShowCategories 
          show={ this.state.showCategoriesModal }
          category={ this.state.choosedCategoryModal }
          data={ choosedCategoryModal ? totalByCategory[choosedCategoryModal]: [] }
          close={()=>this.setState({ showCategoriesModal: null, choosedCategoryModal: null })}
        />
        <SelectorTimming 
          onChangeDate={this.onChangeDate}
          timeAgo={timeAgo}
        />
        <div className="categories-container">
          {
            categories.map((item, index) => (
              <button onClick={(evt)=>this.showCategoriesContainer(evt, item.name)} className="category-item" key={`item-${index}`}>
                <p>
                  {item.name}: <span>{formatCash(item.total)}</span>
                </p>
              </button>
            ))
          }
        </div>
        <div className="stats-container">
          <Table title="Last payments: " content={latestPayments} />
          <Table title="Expensive payments:" content={expensivePayments} />
        </div>
      </div>
    );
  }
}
export default HomeComponent;
