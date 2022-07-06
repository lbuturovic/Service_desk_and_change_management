import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import classNames from 'classnames';
import PrimeReact from 'primereact/api';
import { Tooltip } from 'primereact/tooltip';
import AuthService from "./service/security/auth.service";


import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'prismjs/themes/prism-coy.css';
import './assets/demo/flags/flags.css';
import './assets/demo/Demos.scss';
import './assets/layout/layout.scss';
import './App.scss';
import './assets/layout/layout.scss';
import './App.scss';
import { useHistory } from 'react-router-dom';




const Login = ({
  setShowMenu
}) => {

    const [layoutMode] = useState('static');
    const [layoutColorMode] = useState('light')
    const [inputStyle] = useState('outlined');
    const [ripple] = useState(true);
    const copyTooltipRef = useRef();

    const [errorMessages, setErrorMessages] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    const history = useHistory();

    const renderErrorMessage = (name) =>
    name === errorMessages.name && (
    <div className="error" style={{"color": "red", "font-size": "12px"}}>{errorMessages.message}</div>
  );

    PrimeReact.ripple = true;
    const wrapperClass = classNames('layout-wrapper', {
        'layout-overlay': layoutMode === 'overlay',
        'layout-static': layoutMode === 'static',
        'p-input-filled': inputStyle === 'filled',
        'p-ripple-disabled': ripple === false,
        'layout-theme-light': layoutColorMode === 'light'
    });

      
      const errors = {
        error: "Invalid username or password!",
      };
      
      const handleSubmit = (event) => {
        event.preventDefault();
        localStorage.removeItem("user");
        var uname = document.getElementsByName("uname")[0]
        var pass = document.getElementsByName("pass")[0]
        AuthService.login(uname.value, pass.value).then(
          () => {
            if(AuthService.getCurrentUser()!==null){
            setIsSubmitted(true);
            let roles = AuthService.getCurrentUser().roles;
            if(roles.includes("ROLE_SERVICE")) history.push('/show-requests');
            else if(roles.includes("ROLE_APPROVER")) history.push('/pending-changes');
            else if(roles.includes("ROLE_DEV")) history.push('/active-changes');
            else if(roles.includes("ROLE_ADMIN")) history.push('/users');
            else  history.push('/add-request');

            }
          },
          error => {
            const resMessage =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString();
              console.log(JSON.stringify(error));
              setErrorMessages({ name: "error", message: errors.error });
          }
        );
      };
      

    const styles = {
        
        marginLeft: '15%',
        marginRight: 'auto',
        marginTop: '10%'
      };

      const styles2 = {
        
        marginLeft: '10%',
        marginRight: '10%'
      };

      const styles3 = {
        marginLeft:'40%',
        marginRight:'auto'
      };

      const renderForm = (<div className="layout-main-container">
      <div className="layout-main">
      <div className="surface-card p-4 shadow-2 border-round w-50 lg:w-4"  style={styles}>
          <div className="text-center mb-5">
              <h1 >Login</h1>
          </div>

          <div style={styles2}>
              <label htmlFor="username" className="block text-xl font-medium mb-2">Username</label>
              <InputText id="username1" type="text" name="uname" className="w-full mb-4" required/>
      

              <label htmlFor="password1" className="block text-xl font-medium mb-2">Password</label>
              <InputText id="password1" type="password" name = "pass" className="w-full mb-3" required/>
              {renderErrorMessage("error")}

              <div className="flex align-items-center justify-content-between mb-6">
                  <div className="flex align-items-center">
                  </div>
                  
              </div>

              <Button label="Sign In" icon="pi pi-user" style={styles3} onClick={handleSubmit}/>
          </div>
      </div>
      </div>
      </div>)

    return (
        <>

<div className={wrapperClass}>
            <Tooltip ref={copyTooltipRef} target=".block-action-copy" position="bottom" content="Copied to clipboard" event="focus" />
             {renderForm}

</div>
        </>
    )
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Login, comparisonFn);