import React from "react";
import { Modal, TextField, Button, SingleSelect } from "emerald-ui/lib/";
import formatCash from "../../utils/formatCash";

const NewBudgetModal = (props) => {
  const { categories = [] } = props
	const [categoryBudget, setCategoryBudget] = React.useState(0)
	const [categorySelected, setCategorySelected] = React.useState("")
	const [typedByUserAmount, setTypedByUserAmount] = React.useState("")
	const skipWhiteSpaces = ({target})=>{
    const typedByUser = target.value.replace(/\D/g,'');
    const formatedString = formatCash(typedByUser)
		setCategoryBudget(formatedString.substring(0, formatedString.length - 3))
    setTypedByUserAmount(typedByUser)
  }
  const onCreateBudget = (evt)=>{
    if(categoryBudget == "" || categorySelected.trim() === "") return alert("You must type a monthly budget amount for the category. ");
    //send message

    //send alert
    categoryBudget("")
    categorySelected("")
  }

  return (
      <Modal onHide={props.close} show={props.show}>
        <Modal.Header closeButton={true}>
          <Modal.Title>New Budget</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <form action="">
            <SingleSelect label="Choose a category: " onChange={setCategorySelected}>
              {categories && categories.map((category) => (
                <option value={category.value}>{category.label}</option>
              ))}
            </SingleSelect>
              <TextField 
								value={categoryBudget}
								onChange={skipWhiteSpaces}
                label="Expected Value: " 
              />
            </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.close} shape="flat" color="info">
            Cancelar
          </Button>
          <Button loading={props.loading} color="info" onClick={onCreateBudget}>Create Budget!</Button>
        </Modal.Footer>
      </Modal>
  );
};

export default NewBudgetModal;
