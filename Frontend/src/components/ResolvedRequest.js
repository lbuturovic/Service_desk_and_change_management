import React, { useEffect, useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import authHeader from '../service/security/auth-header';
import AuthService from '../service/security/auth.service';
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useHistory } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';


export const ResolvedRequest = () => {
    const [floatValue, setFloatValue] = useState('');
    const [radioValue, setRadioValue] = useState('NN');
    const [responses, setResponses] = useState([]);
    const location = useLocation();
    const history = useHistory();
    const [request, setRequest] = useState('');
    const urlRequest = "http://localhost:8080/api/request/";
    const [displayConfirmation, setDisplayConfirmation] = useState(false);
    const [displayConfirmation2, setDisplayConfirmation2] = useState(false);
    const [textAreaValue, setTextAreaValue] = useState('');

    const currentUser = AuthService.getCurrentUser();

    const form = useRef(null);

    const getRequest = (urlRequest, id) => {
        axios.get(urlRequest + id, {
            headers: {
                'Authorization': authHeader().Authorization
            }
        }).then((response) => {
            setRequest(response.data);
        }).catch(error => console.error(`${error}`));
    }


    const getResponses = (id) => {
        return axios.get("http://localhost:8080/api/response/request/"+id, {
          headers: {
            'Authorization': authHeader().Authorization
          }
        }).then((response) => {
            setResponses(response.data);
          }).catch(error => console.error(`${error}`));
        }

        useEffect(() => {
            const search = location.search;
            const id = new URLSearchParams(search).get('id');
            getRequest(urlRequest, id);
            getResponses(id);
            if(currentUser.roles.includes("ROLE_CLIENT")) setRadioValue('ACCEPT');
          }, [location]);

          const formatDate = (value) => {
            const dateTime = new Date(value);
            const date = dateTime.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });
    
            const time = dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return date + " " + time;
        }

        const confirmationDialogFooter2 = (
            <>
              <div className="grid formgrid">
                <Button type="button" label="OK" onClick={() => setDisplayConfirmation2(false)} className="mr-2 mb-2" />
              </div>
            </>
          );

          const confirmationDialogFooter = (
            <>
              <Button type="button" label="No" icon="pi pi-times" onClick={() => setDisplayConfirmation(false)} className="p-button-text" />
              <Button type="button" label="Yes" icon="pi pi-check" onClick={handleCancelConfirmation} className="p-button-text" autoFocus />
            </>
          );

          function handleCancelConfirmation(event) {
            event.preventDefault();
            //form.current.reset(); //this will reset all the inputs in the form
            if(currentUser.roles.includes("ROLE_CLIENT")) setRadioValue('ACCEPT');
            else setRadioValue('NN')
            setTextAreaValue('');
            setDisplayConfirmation(false);
        
          }
          function handleCancelConfirmation2() {
            if(currentUser.roles.includes("ROLE_CLIENT")) setRadioValue('ACCEPT');
            else setRadioValue('NN')
            setTextAreaValue('');
            setDisplayConfirmation(false);
            setDisplayConfirmation2(true);
          }
    
        
          async function handleReplay(event) {
            event.preventDefault();
            var urlOldRequest = 'http://localhost:8080/api/response/request/'+request.id+'/user/'+currentUser.id+'/receiver/'+request.resolving.id;
            await axios.post(urlOldRequest, {
                description: textAreaValue,
                status: radioValue
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authHeader().Authorization
                }
            })
            .then(res => {
                console.log(res);
                console.log(res.data);
                getResponses(request.id);
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
          const changeDescription = (e) => {
            e.preventDefault();
            setTextAreaValue(e.target.value);
          }
        
    return (
        <div>
        <div className="grid p-fluid">
        <div className="col-12 lg:col-6">
            <h2>Request</h2>
        <div className="card">
            <div >
        <h4>Subject </h4>
        <span className="p-float-label">
                        <InputText id="subject" type="text" value={request.subject} readOnly={true}/>
                    </span>
        <h5>Description</h5>
            <InputTextarea placeholder={request.description} autoResize rows="7" cols="30" readOnly={true}/>
        </div>
            <div className="container">
    <div className="row mt-2 mb-2">

        {responses.map(response => (
            <div key={response.id} style={{'marginTop':'10%'}}>
                <h5 style={{"float":"left", "backgroundColor":"#def2a7"}}>Response</h5><p style={{"float":"right", "backgroundColor":"#c5f5fc"}}>{formatDate(response.created)}</p>
                <p style={{"clear":"right","float":"left", "backgroundColor":"#e6daf0", "backgroundSize":"auto"}}>{response.sender.username}</p>
                {response.status!="NN" && <p style={{"float":"right"}}>{response.status}ED</p>}
                <InputTextarea placeholder={response.description} autoResize rows="7" cols="30" readOnly={true} color='black' />

          </div>
        ))}
    </div>
  </div>
  <form id="replay_form" ref={form} onSubmit={handleReplay}>
  <h5 style={{'marginTop':'10%'}}>Replay</h5>
            <InputTextarea id='description' name='description' value={textAreaValue} maxLength={275}
              onChange={changeDescription} autoResize rows="5" cols="30" />
           {currentUser.roles.includes('ROLE_CLIENT') && <div> <div style={{  marginTop: "50px"}} className="field-radiobutton">
                                <RadioButton inputId="option1" name="option" value="ACCEPT" checked={radioValue === 'ACCEPT'} onChange={(e) => setRadioValue(e.value)} />
                                <label htmlFor="option1">Accept</label>
                            </div>
                            <div className="field-radiobutton">
                                <RadioButton inputId="option2" name="option" value="DENY" checked={radioValue === 'DENY'} onChange={(e) => setRadioValue(e.value)} />
                                <label htmlFor="option2">Deny</label>
                            </div>  </div>}

                            <div style={{ display: "flex" }}>
              <Button label="Send" type='submit' className="mr-2 mb-2"></Button>

              <Dialog header="Response is sent!" visible={displayConfirmation2} onHide={() => setDisplayConfirmation2(false)} style={{ width: '350px' }} modal footer={confirmationDialogFooter2}>
                <div className="flex align-items-center justify-content-center">
                  <i className="pi pi-check-circle mr-3" style={{ fontSize: '2rem' }} />
                </div>
              </Dialog>
              <Button type='button' label="Cancel" className="mr-2 mb-2" onClick={() => setDisplayConfirmation(true)}></Button>
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
       
  </div>

    )
}

const comparisonFn = function (prevProps, nextProps) {
    return (prevProps.location.pathname === nextProps.location.pathname) && (prevProps.colorMode === nextProps.colorMode);
};

export default React.memo(ResolvedRequest, comparisonFn);
