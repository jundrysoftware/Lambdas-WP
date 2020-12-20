import React from "react";
import { Label } from "emerald-ui/lib/";
import NewCategoryModal from "./NewCategoryModal";
import BanksComponent from "./BanksComponents";
import axios from 'axios'
import constants from '../../constants'
class ProfileContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      banks: []
    };
	}
	onCreateCategoryClick = (evt)=>{
		this.setState({
			showCategoryModal: true
		})
  }
  componentDidMount(){
    this.getUserInformation()
  }
  getUserInformation = () =>{
    axios.get(constants.basepath + constants.routes.user).then(({data})=>{
      this.setState({
        user: {
          ...data,
          banks: undefined
        },
        banks: data.banks
      })
    }).catch(err=>console.error(err))

  }
  onCloseCategoryModal =(evt)=>this.setState({showCategoryModal: false})
  
  render() {
    const { user, banks } = this.state
    return (
      <div className="profile-container">
				<NewCategoryModal show={this.state.showCategoryModal} 
				close={this.onCloseCategoryModal} />
        <div className="user-information-container">
          <div className="user-emails">
            <h2>Emails registrados: </h2>
            {user.emails && user.emails.map((item) => (
              <p key={item} className="text-muted">{item}</p>
            ))}
          </div>
          <div className="user-phones">
            <h2>Telefonos registrados: </h2>
            {user.phones && user.phones.map((item) => (
              <p key={item} className="text-muted">{item}</p>
            ))}
          </div>
          <div className="user-categories">
            <h2>Categorias: </h2>
            {user.categories && user.categories.map((category) => (
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
            {
              banks.map(bank=>(
                <BanksComponent {...bank} key={bank._id} />
              ))
            }
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileContainer;
