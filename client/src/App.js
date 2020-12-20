import React from "react";
import "./App.css";
import "emerald-ui/lib/styles.css";
import Navbar from "./components/navbar";
import PrepaymentContainer from "./components/prePaymentContainer";
import SecretContainer from "./components/SecretCodeScreen";
import GraphContainer from "./components/GraphsContainer";
import HomeContainer from "./components/HomeContainer";
import DataCreditContainer from './components/DataCreditContainer';
import axios from "axios";
import constants from "./constants";
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      secret: "null",
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
  };

  onLoginClick = (secret) => {
    console.log(secret);
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

  render() {
    const { prepayments, secret } = this.state;

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
              onSavePrepayment={this.onSavePrepayment}
              payments={prepayments}
            />
          )}
          {this.state.navbarActive === "graph" && <GraphContainer />}
          {this.state.navbarActive === "home" && <HomeContainer />}
          {this.state.navbarActive === "datacredit" && <DataCreditContainer />}
        </div>
      </React.Fragment>
    );
  }
}

export default App;
