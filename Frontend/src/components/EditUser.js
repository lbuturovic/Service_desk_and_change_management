import React, { useEffect, useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import axios from "axios";
import { CountryService } from '../service/CountryService';
import { NodeService } from '../service/NodeService';
import AuthService from '../service/security/auth.service';
import authHeader from '../service/security/auth-header';
import { confirmPopup } from 'primereact/confirmpopup';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { useHistory } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import { Checkbox } from 'primereact/checkbox';
import { RadioButton } from 'primereact/radiobutton';

export const EditUser = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [roles, setRoles] = useState([]);
  const [email,setEmail] = useState('')
  const [errorMsg,setErrorMsg] = useState('')
  const [isUsernameOk, setIsUsernameOk] = useState(true);
  const [isPasswordOk, setIsPasswordOk] = useState(true);
  const [isEmailOk, setIsEmailOk] = useState(true);
  const [isFirstNameOk, setIsFirstNameOk] = useState(true);
  const [isLastNameOk, setIsLastNameOk] = useState(true);
  const [displayConfirmation, setDisplayConfirmation] = useState(false);
  const [displayConfirmation2, setDisplayConfirmation2] = useState(false);
  const [err, setErr] = useState(false); 
  const location = useLocation();  
  const [user, setUser] = useState('');
  const urlRequest = "http://localhost:8080/api/users/";
  const [checkboxValue, setCheckboxValue] = useState([]);
  const [radioValue, setRadioValue] = useState(null);
    const selectedValue = [...checkboxValue]
    
  const form = useRef(null);
  const history = useHistory();

  const getUser = (urlRequest, id) => {
    axios.get(urlRequest + id, {
        headers: {
            'Authorization': authHeader().Authorization
        }
    }).then((response) => {
        console.log(response)
        setUser(response.data);
        setEmail(response.data.email);
        setFirstname(response.data.firstName);
        setPassword('');
        setLastname(response.data.lastName);
        setUsername(response.data.username);
        for (let i = 0; i < response.data.roles.length; i++) {
            console.log(response.data.roles.length)
            console.log(response.data.roles[i].name)
            if (response.data.roles[i].name === 'ROLE_ADMIN') {
                setRadioValue('admin');
                roles.push('admin');
            }
            else if (response.data.roles[i].name === 'ROLE_CLIENT') {
              setRadioValue('cl');
                roles.push('cl');
            }
            else if (response.data.roles[i].name === 'ROLE_SERVICE'){
              setRadioValue('sd');
                roles.push('sd');
            }
            else if (response.data.roles[i].name === 'ROLE_APPROVER'){
              setRadioValue('app');
                roles.push('app');
            }
            else if (response.data.roles[i].name === 'ROLE_DEV'){
              setRadioValue('dev');
                roles.push('dev');
            }
        }
        setCheckboxValue(selectedValue);
        
        
    }).catch(error => console.error(`${error}`));
}

  useEffect(() => {
        const search = location.search;
        const id = new URLSearchParams(search).get('id');
        getUser(urlRequest, id);
}, []); 


  const onCheckboxChange = (e) => {
      if (e.checked) {
        selectedValue.push(e.value);
        console.log(e.value)
        roles.push(e.value)
    }
    else {
        selectedValue.splice(selectedValue.indexOf(e.value), 1);
        roles.splice(roles.indexOf(e.value), 1);
    }

    setCheckboxValue(selectedValue);
};

  
  const confirmationDialogFooter = (
    <>
      <Button type="button" label="No" icon="pi pi-times" onClick={() => setDisplayConfirmation(false)} className="p-button-text" />
      <Button type="button" label="Yes" icon="pi pi-check" onClick={handleCancelConfirmation} className="p-button-text" autoFocus />
    </>
  );

  function updateClicked() {

      history.push('users');
  }
  const confirmationDialogFooter2 = (
    <>
          <div className="grid formgrid">
            <Button type="button" label="OK" onClick={updateClicked} className="mr-2 mb-2" />
          </div>
        </>
  );
 


  const styles = {

    marginLeft: '33%',
    marginRight: 'auto',
  };

  


  function handleCancelConfirmation(event) {
    event.preventDefault();
    //form.current.reset(); //this will reset all the inputs in the form
    setDisplayConfirmation(false);

  }

  function handleCancelConfirmation2() {
    setIsUsernameOk(true);
    //form.current.reset(); //this will reset all the inputs in the form
    setDisplayConfirmation2(true);
  }

  const changeUsername = (e) => {
    e.preventDefault();
    setUsername(e.target.value);
    if (e.target.value.trim().length === 0) setIsUsernameOk(false);
    else setIsUsernameOk(true);
    setErr(false);
  }

  const changePassword = (e) => {
    e.preventDefault();
    setPassword(e.target.value);
    if (e.target.value.trim().length === 0) setIsPasswordOk(true);
    else setIsPasswordOk(true);
    setErr(false);
  }
  const changeEmail = (e) => {
    e.preventDefault();
    let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(e.target.value.match(mailformat)) setIsEmailOk(true);
    else setIsEmailOk(false);
    setEmail(e.target.value);
    setErr(false);
  }
  const changeFirstname = (e) => {
    e.preventDefault();
    if (e.target.value.trim().length === 0) setIsFirstNameOk(false);
    else setIsFirstNameOk(true);
    setFirstname(e.target.value);
    setErr(false);
    
  }
  const changeLastname = (e) => {
    e.preventDefault();
    if (e.target.value.trim().length === 0) setIsLastNameOk(false);
    else setIsLastNameOk(true);
    setLastname(e.target.value);
    setErr(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    var ok = true;
    if (username.trim().length === 0) {
      setIsUsernameOk(false);
      ok = false;
    }
    if (!ok) return;
    setErr(false);
    console.log(user)
    await axios.put('http://localhost:8080/api/user/' + user.id, {
        email: email,
        firstName: firstname,
        lastName: lastname,
        username: username,
        password: password,
        role: [radioValue]
    }, {
        headers: {
          'Content-Type': 'application/json',
            'Authorization': authHeader().Authorization
        }
    })
        .then(res => {
            handleCancelConfirmation2();
            //window.location = "/edit-change" //This line of code will redirect you once the submission is succeed
        }).catch(function (error) {
            if (error.response) {
                // Request made and server responded
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }

        });

}

function cancelClicked(event) {
    event.preventDefault();
    setDisplayConfirmation(true); 
    setDisplayConfirmation2(false);
    history.push('/users')
  };

  return (
    <div className="grid p-fluid" style={styles}>
      <div className="col-12 lg:col-6">
        <h2 style={{"textAlign": "center"}}>{firstname} {lastname}</h2>
        <div className="card">
          <h5>Username*</h5>
          <form id="change_form" ref={form} onSubmit={handleSubmit}>
          <InputText id="username" type="text" placeholder='Username' name="username" value={username} onChange={changeUsername} maxLength={57} className={isUsernameOk ? "" : "p-invalid"} aria-describedby="subject-help" />
            {isUsernameOk ? ("") : (<small id="subject-help" className="p-error">Username is mandatory!</small>)}
            <h5>Password</h5>
            <InputText id="password" type="password" placeholder='Password is not changed' value={password} name="password"  onChange={changePassword} maxLength={57} aria-describedby="subject-help" />
            <h5>First name*</h5>   
            <InputText id="firstname" type="text" placeholder='First name' name="firstname" value={firstname} onChange={changeFirstname} maxLength={57} className={isFirstNameOk ? "" : "p-invalid"} aria-describedby="subject-help" />
            {isFirstNameOk ? ("") : (<small id="subject-help" className="p-error">First name is mandatory!</small>)}
            <h5>Last name*</h5>
            <InputText id="lastname" type="text" placeholder='Last name' name="lastname" value={lastname} onChange={changeLastname} maxLength={57} className={isLastNameOk ? "" : "p-invalid"} aria-describedby="subject-help" />
            {isLastNameOk ? ("") : (<small id="subject-help" className="p-error">Last name is mandatory!</small>)}
            <h5>Email*</h5>
            <InputText id="email" type="text" placeholder='Email' name="email" value={email} onChange={changeEmail} maxLength={57} className={isEmailOk ? "" : "p-invalid"} aria-describedby="subject-help" />
            {isEmailOk ? ("") : (<small id="subject-help" className="p-error">Please insert a valid email address.</small>)}
            
            <h5>Roles</h5>
                    <div className="grid">
                        <div className="col-12 md:col-4">
                            <div className="field-radiobutton">
                                <RadioButton inputId="checkOption1" name="option" value="admin" checked={radioValue==='admin'} onChange={(e) => setRadioValue(e.value)} />
                                <label htmlFor="checkOption1">Admin</label>
                            </div>
                        </div>
                        <div className="col-12 md:col-4">
                            <div className="field-radiobutton">
                                <RadioButton inputId="checkOption2" name="option" value="dev" checked={radioValue==='dev'} onChange={(e) => setRadioValue(e.value)} />
                                <label htmlFor="checkOption2">Developer</label>
                            </div>
                        </div>
                        <div className="col-12 md:col-4">
                            <div className="field-radiobutton">
                                <RadioButton inputId="checkOption3" name="option" value="sd" checked={radioValue==='sd'} onChange={(e) => setRadioValue(e.value)} />
                                <label htmlFor="checkOption3">Service desk</label>
                            </div>
                        </div>
                        <div className="col-12 md:col-4">
                            <div className="field-radiobutton">
                                <RadioButton inputId="checkOption4" name="option" value="app" checked={radioValue==='app'} onChange={(e) => setRadioValue(e.value)} />
                                <label htmlFor="checkOption3">Approver</label>
                            </div>
                        </div>
                        <div className="col-12 md:col-4">
                            <div className="field-radiobutton">
                                <RadioButton inputId="checkOption5" name="option" value="cl" checked={radioValue==='cl'} onChange={(e) => setRadioValue(e.value)} />
                                <label htmlFor="checkOption3">Client</label>
                            </div>
                        </div>
                    </div>
                    {errorMsg ? (<h3 id="subject-help" style={{"color": "red", "textAlign": "center"}}>Invalid data!</h3>) : ("") }
            <h5></h5>
            <div style={{ display: "flex" }}>
              <Button label="Save" type='submit' className="mr-2 mb-2"></Button>

              <Dialog header="User is updated!" visible={displayConfirmation2} onHide={() => setDisplayConfirmation2(false)} style={{ width: '350px' }} modal footer={confirmationDialogFooter2}>
                <div className="flex align-items-center justify-content-center">
                  <i className="pi pi-check-circle mr-3" style={{ fontSize: '2rem' }} />
                </div>
              </Dialog>
              <Button label="Cancel" type='button' className="mr-2 mb-2" onClick={cancelClicked}></Button>
            </div>
            <Dialog header="Cancel without saving?" visible={displayConfirmation} onHide={() => setDisplayConfirmation(false)} style={{ width: '350px' }} modal footer={confirmationDialogFooter}>
              <div className="flex align-items-center justify-content-center">
                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                <span>All unsaved information will be lost.</span>
              </div>
            </Dialog>
          </form>
        </div>
      </div>
    </div>

  )
}

const comparisonFn = function (prevProps, nextProps) {
    return (prevProps.location.pathname === nextProps.location.pathname) && (prevProps.colorMode === nextProps.colorMode);
};

export default React.memo(EditUser, comparisonFn);
