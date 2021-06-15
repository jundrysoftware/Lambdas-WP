import React, { useState, useEffect } from "react";
import { Modal, TextField, Button, SingleSelect } from "emerald-ui/lib/";

const NewCategoryModal = (props) => {
    const [source, setSource] = useState("")
    const [amount, setAmount] = useState("")
    const [category, setCategory] = useState("INCOME")
    const [description, setDescription] = useState("")
    const [categories, setCategories] = useState([])


    const onCreateIncome = (evt) => {
        if (source.trim() === "" || amount.trim() === "" || category.trim() === "") return alert("Hey, agrega datos!");
        props.save({
            source,
            amount,
            category,
            description
        })
        setSource("")
        setAmount("")
        setCategory("")
        setDescription("")
    }

    useEffect(() => {
        if (props.categories) {
            setCategories([...props.categories.filter(category => category.type === 'INCOME'), 'INCOME'])
        }
    }, [props])

    return (
        <Modal onHide={props.close} show={props.show}>
            <Modal.Header closeButton={true}>
                <Modal.Title>Nueva categoria</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form action="">
                    <TextField label="Origen"
                        value={source}
                        onChange={(evt) => setSource(evt.target.value)}
                    />
                    <TextField label="Monto"
                        value={amount}
                        onChange={(evt) => setAmount(evt.target.value)}
                    />
                    <TextField label="description"
                        value={description}
                        onChange={(evt) => setDescription(evt.target.value)}
                    />
                    <SingleSelect onSelect={(category) => setCategory(category)} value={'INCOME'}>
                        <option value='INCOME'>INCOME</option>
                        {
                            categories.map(category => <option value={category.value}> {category.label}</option>)
                        }
                    </SingleSelect>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.close} shape="flat" color="info">
                    Cancelar
                </Button>
                <Button loading={props.loading} color="info" onClick={onCreateIncome}>Crear Ingreso</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default NewCategoryModal;
