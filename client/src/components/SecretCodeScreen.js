import React from "react";
import { PasswordStrengthMeter, TextField, Icon, Button } from "emerald-ui/lib";

const SecretCodeScreen = (props) => {
    const {
        onLoginClick = ()=>null
    } = props
 const [secretPassword, setSecret] = React.useState('')
  return (
    <div className="full-screen-secret-container">
      <div className="login-container">
        <img src="" alt="" />
        <div className="secret-key-input-container">
          <PasswordStrengthMeter id="passwordmeter">
            <TextField
              value={secretPassword}
              onChange={(evt)=> console.log(evt.target)}
              label="Ingrese su Llave de acceso: "
              type="password"
              style={{ width: "250px" }}
            />
          </PasswordStrengthMeter>
          <Button 
          onClick={() => onLoginClick(secretPassword)}
          color="danger" 
          clearable="true"
          className="sign-in-button">
            <Icon name="thumb_up" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SecretCodeScreen;
