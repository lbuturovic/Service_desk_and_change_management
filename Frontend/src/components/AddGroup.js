import React, { useEffect, useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import AuthService from '../service/security/auth.service';
import authHeader from '../service/security/auth-header';
import axios from "axios";


export const AddGroup = () => {
    const [descriptionValue, setDescriptionValue] = useState('');
    const [isDescriptionOk, setIsDescriptionOk] = useState(true);
    const [displayConfirmation, setDisplayConfirmation] = useState(false);
    const [displayConfirmation2, setDisplayConfirmation2] = useState(false);
    const currentUser = AuthService.getCurrentUser();
    const form = useRef(null);

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
        setDescriptionValue('');
        setIsDescriptionOk(true);
        //form.current.reset(); //this will reset all the inputs in the form
        setDisplayConfirmation(false);
    
      }

      function handleCancelConfirmation2() {
        setDescriptionValue('');
        setIsDescriptionOk(true);
        //form.current.reset(); //this will reset all the inputs in the form
        setDisplayConfirmation2(true);
      }

      const changeDescription = (e) => {
        e.preventDefault();
        setDescriptionValue(e.target.value);
        if (e.target.value.trim().length == 0) setIsDescriptionOk(false);
        else setIsDescriptionOk(true);
      }


      async function handleSubmit(event) {
        event.preventDefault();
        // console.log(authHeader());
        // console.log(allGroups);
        var ok = true;
        if (descriptionValue.trim().length === 0) {
          setIsDescriptionOk(false);
          ok = false;
        }
        if (!ok) return;
        var urlChange = 'http://localhost:8080/api/groups/';
        await axios.post(urlChange, {
          description: descriptionValue
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authHeader().Authorization
          }
        })
          .then(res => {
            console.log(res);
            console.log(res.data);
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

    return (
        <div className="grid p-fluid">
            <div className="col-12 lg:col-6">
                <h2>Add group</h2>
            <div className="card">
            <form id="change_form" ref={form} onSubmit={handleSubmit}>
            <h5>Title</h5>
                    <span className="p-float-label">
                    <InputText placeholder="Your title" id='description' name='description' value={descriptionValue} maxLength={275} className={isDescriptionOk ? "" : "p-invalid"}
              onChange={changeDescription} autoResize rows="5" cols="30" aria-describedby="description-help" />
            {isDescriptionOk ? ("") : (<small id="description-help" className="p-error">Title is mandatory!</small>)}
                    </span>
                    
                    <h5> </h5>
                    <div style={{ display: "flex" }}>
                    <Button label="Create" type='submit' className="mr-2 mb-2"></Button>
                    <Dialog header="Group is saved!" visible={displayConfirmation2} onHide={() => setDisplayConfirmation2(false)} style={{ width: '350px' }} modal footer={confirmationDialogFooter2}>
                <div className="flex align-items-center justify-content-center">
                  <i className="pi pi-check-circle mr-3" style={{ fontSize: '2rem' }} />
                </div>
              </Dialog>
                    <Button type='button' label="Cancel" className="mr-2 mb-2" onClick={() => setDisplayConfirmation(true)}></Button>
                    <Dialog header="Cancel without saving?" visible={displayConfirmation} onHide={() => setDisplayConfirmation(false)} style={{ width: '350px' }} modal footer={confirmationDialogFooter}>
              <div className="flex align-items-center justify-content-center">
                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                <span>All unsaved information will be lost.</span>
              </div>
            </Dialog>
            </div>
            </form>
                  </div>

            
                    </div>
                    </div>

    )
}

const comparisonFn = function (prevProps, nextProps) {
    return (prevProps.location.pathname === nextProps.location.pathname) && (prevProps.colorMode === nextProps.colorMode);
};

export default React.memo(AddGroup, comparisonFn);
