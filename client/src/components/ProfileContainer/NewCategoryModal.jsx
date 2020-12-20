import React from "react";
import { Modal, TextField, Button } from "emerald-ui/lib/";

const NewCategoryModal = (props) => {
	const [categoryLabel, setCategoryLabel] = React.useState("")
	const skipWhiteSpaces = ({target})=>{
		setCategoryLabel(target.value.replace(/ /ig, ""))
	}
  return (
      <Modal onHide={props.close} show={props.show}>
        <Modal.Header closeButton={true}>
          <Modal.Title>Nueva categoria</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <form action="">
                <TextField label="Valor para mostrar: " />
                <TextField 
								value={categoryLabel}
								onChange={skipWhiteSpaces}
                label="Nombre de categoria: " />
            </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.close} shape="flat" color="info">
            Cancelar
          </Button>
          <Button color="info">Crear categoria</Button>
        </Modal.Footer>
      </Modal>
  );
};

export default NewCategoryModal;
