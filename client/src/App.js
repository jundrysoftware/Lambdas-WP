import React from "react";
import "./App.css";
import "emerald-ui/lib/styles.css";
import Navbar from "./components/navbar";
import PrepaymentContainer from "./components/prePaymentContainer";
import SecretContainer from "./components/SecretCodeScreen";
import GraphContainer from "./components/GraphsContainer";
import HomeContainer from "./components/HomeContainer";
import DataCreditContainer from "./components/DataCreditContainer";
import ProfileContainer from "./components/ProfileContainer/";
import axios from "axios";
import constants from "./constants";
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      secret: "null",
      user: {},
      banks: [],
      prepayments: [],
      navbarActive: "home",
    };
  }

  getPrePayments = () => {
    const self = this;
    axios
      .get(constants.basepath + constants.routes.prepayments)
      .then((res) => {
        self.setState({
          prepayments: res.data,
        });
      })
      .catch((e) => {
        console.error(e);
      });
  };

  componentDidMount = () => {
    this.getPrePayments();
    this.getUserInformation()
  };

  onLoginClick = (secret) => {
    console.log(secret);
  };

  getUserInformation = () => {
    axios
      .get(constants.basepath + constants.routes.user)
      .then(({ data }) => {
        this.setState({
          user: {
            ...data,
            banks: undefined,
          },
          banks: data.banks,
        });
      })
      .catch((err) => console.error(err));
  };

  onSavePrepayment = (data) => {
    const self = this;
    const url = constants.basepath + constants.routes.prepayments;
    axios({
      method: "put",
      data,
      url,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(() => {
        const { id } = data;
        self.setState({
          prepayments: self.state.prepayments.filter((item) => item._id !== id),
        });
      })
      .catch((err) => console.error(err));
  };
  addCategoryToState = (category) =>{
    const newCategories = this.state.user.categories || []
    newCategories.push(category) 
    this.setState({
      user:{
        ...this.state.user,
        categories: newCategories
      }
    })
  }
  render() {
    const { prepayments, secret, user } = this.state;

    if (!secret) return <SecretContainer onLoginClick={this.onLoginClick} />;
    return (
      <React.Fragment>
        <Navbar
          updateNav={(evt, nav) => {
            evt.preventDefault();
            this.setState({ navbarActive: nav });
          }}
        />
        <div className="full-container">
          {this.state.navbarActive === "prepayment" && (
            <PrepaymentContainer
              categories={user.categories || []}
              onSavePrepayment={this.onSavePrepayment}
              payments={prepayments}
            />
          )}
          {this.state.navbarActive === "graph" && <GraphContainer />}
          {this.state.navbarActive === "home" && <HomeContainer />}
          {this.state.navbarActive === "datacredit" && <DataCreditContainer />}
          {this.state.navbarActive === "profile" && (
            <ProfileContainer user={this.state.user} banks={this.state.banks} saveCategory={this.addCategoryToState} />
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default App;
