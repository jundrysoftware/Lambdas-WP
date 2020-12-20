import React from "react";
import { Label } from "emerald-ui/lib/";
import NewCategoryModal from "./NewCategoryModal";
import BanksComponent from "./BanksComponents";
class ProfileContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
	}
	onCreateCategoryClick = (evt)=>{
		this.setState({
			showCategoryModal: true
		})
	}
	onCloseCategoryModal =(evt)=>this.setState({showCategoryModal: false})
  render() {
    const user = {
      emails: ["FlavioAandres24@gmail.com", "flv.prj@gmail.com"],
      phones: ["+573022939843", "+51897885515"],
      categories: [
        { value: "services", label: "Services" },
        { value: "food", label: "Food" },
        { value: "fastfood", label: "FastFood" },
        { value: "Health", label: "Health/Care" },
        { value: "apartment", label: "Rent House" },
      ],
    };
    const bank = {
      name: "Bancolombia",
      subject: "Servicios de Alertas y Notificaciones",
      filters: [
        {
          phrase: "Bancolombia te informa recepción transferencia",
          type: "INCOME",
          parser: "transferReception",
        },
        {
          phrase: "Bancolombia le informa Compra",
          type: "EXPENSE",
          parser: "shopping",
        },
        {
          phrase: "Bancolombia le informa Retiro",
          type: "EXPENSE",
          parser: "debitWithdrawal",
        },
      ],
		};
    return (
      <div className="profile-container">
				<NewCategoryModal show={this.state.showCategoryModal} 
				close={this.onCloseCategoryModal} />
        <div className="user-information-container">
          <div className="user-emails">
            <h2>Emails registrados: </h2>
            {user.emails.map((item) => (
              <p key={item} className="text-muted">{item}</p>
            ))}
          </div>
          <div className="user-phones">
            <h2>Telefonos registrados: </h2>
            {user.phones.map((item) => (
              <p key={item} className="text-muted">{item}</p>
            ))}
          </div>
          <div className="user-categories">
            <h2>Categorias: </h2>
            {user.categories.map((category) => (
              <Label>{category.label}</Label>
            ))}
            <Label onClick={this.onCreateCategoryClick}className="add-new-category" color="primary">
              {" "}
              ➕ Añadir{" "}
            </Label>
          </div>
        </div>
        <div className="banks-information">
          <div className="bank-lists-container">
            <h2>Bancos: </h2>
            <BanksComponent {...bank} />
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileContainer;
