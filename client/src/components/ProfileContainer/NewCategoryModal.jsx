import React from "react";
import { Modal, TextField, Button } from "emerald-ui/lib/";

const NewCategoryModal = (props) => {
	const [categoryLabel, setCategoryLabel] = React.useState("")
	const [categoryValue, setCategoryValue] = React.useState("")
	const skipWhiteSpaces = ({target})=>{
		setCategoryValue(target.value.replace(/ /ig, "").toLowerCase())
  }
  const onCreateCategory = (evt)=>{
    if(categoryLabel.trim() === "" || categoryValue.trim() === "") return alert("Hey, agrega datos!");
    props.save({
      label: categoryLabel,
      value: categoryValue
    })
    setCategoryLabel("")
    setCategoryValue("")
  }
  return (
      <Modal onHide={props.close} show={props.show}>
        <Modal.Header closeButton={true}>
          <Modal.Title>Nueva categoria</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <form action="">
                <TextField label="Nombre para mostrar: " 
                value={categoryLabel}
								onChange={(evt)=>setCategoryLabel(evt.target.value)}
                />
                <TextField 
								value={categoryValue}
								onChange={skipWhiteSpaces}
                label="Nombre de categoria: " />
            </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.close} shape="flat" color="info">
            Cancelar
          </Button>
          <Button loading={props.loading} color="info" onClick={onCreateCategory}>Crear categoria</Button>
        </Modal.Footer>
      </Modal>
  );
};

export default NewCategoryModal;
