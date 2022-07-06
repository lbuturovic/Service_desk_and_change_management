import React, { useEffect, useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { CountryService } from '../service/CountryService';
import { NodeService } from '../service/NodeService';
import { Dialog } from 'primereact/dialog';
import AuthService from '../service/security/auth.service';
import authHeader from '../service/security/auth-header';
import axios from "axios";

export const CreateRequest = () => {
    const [floatValue, setFloatValue] = useState('');
    const [autoValue, setAutoValue] = useState(null);
    const [checkboxValue, setCheckboxValue] = useState([]);
    const [dropdownValue, setDropdownValue] = useState(null);
    const [displayConfirmation, setDisplayConfirmation] = useState(false);
    const [displayConfirmation2, setDisplayConfirmation2] = useState(false);
    const [subjectValue, setSubjectValue] = useState('');
    const [descriptionValue, setDescriptionValue] = useState('');
    const [categoryValue, setCategoryValue] = useState('');
    const [priorityValue, setPriorityValue] = useState('');
    const [isSubjectOk, setIsSubjectOk] = useState(true);
    const [isDescriptionOk, setIsDescriptionOk] = useState(true);
    const currentUser = AuthService.getCurrentUser();
    const form = useRef(null);

    const priorityValues = [
        { name: 'Low', code: 'LOW' },
        { name: 'Medium', code: 'MEDIUM' },
        { name: 'High', code: 'HIGH' },
        { name: 'Urgent', code: 'URGENT' }
    ];

    const categoryValues = [
        { name: 'Problem', code: 'PROBLEM' },
        { name: 'Question', code: 'QUESTION' },
        { name: 'Incident', code: 'INCIDENT' },
        { name: 'Feature request', code: 'FEATURE_REQUEST' }
    ];

    const confirmationDialogFooter = (
        <>
          <Button type="button" label="No" icon="pi pi-times" onClick={() => setDisplayConfirmation(false)} className="p-button-text" />
          <Button type="button" label="Yes" icon="pi pi-check" onClick={handleCancelConfirmation} className="p-button-text" autoFocus />
        </>
      );
    
      function handleCancelConfirmation(event) {
        event.preventDefault();
        setSubjectValue('');
        setDescriptionValue('');
        setCategoryValue('');
        setPriorityValue('');
        setIsSubjectOk(true);
        setIsDescriptionOk(true);
        //form.current.reset(); //this will reset all the inputs in the form
        setDisplayConfirmation(false);
    
      }

      function handleCancelConfirmation2() {
        setSubjectValue('');
        setDescriptionValue('');
        setCategoryValue('');
        setPriorityValue('');
        setIsSubjectOk(true);
        setIsDescriptionOk(true);
        //form.current.reset(); //this will reset all the inputs in the form
        setDisplayConfirmation2(true);
      }

      const changeSubject = (e) => {
        e.preventDefault();
        setSubjectValue(e.target.value);
        if (e.target.value.trim().length == 0) setIsSubjectOk(false);
        else setIsSubjectOk(true);
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
        if (subjectValue.trim().length === 0) {
          setIsSubjectOk(false);
          ok = false;
        }
        if (descriptionValue.trim().length === 0) {
          setIsDescriptionOk(false);
          ok = false;
        }
        if (!ok) return;
        var urlChange = 'http://localhost:8080/api/user/' + currentUser.id;
        await axios.post(urlChange + '/request', {
          subject: subjectValue,
          description: descriptionValue,
          priority: priorityValue,
          category: categoryValue
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

      const confirmationDialogFooter2 = (
        <>
          <div className="grid formgrid">
            <Button type="button" label="OK" onClick={() => setDisplayConfirmation2(false)} className="mr-2 mb-2" />
          </div>
        </>
      );
    useEffect(() => {
    }, []);

    const styles = {
        
        marginLeft: '33%',
        marginRight: 'auto',
        //marginTop: '10%'
      };



    return (
        <div className="grid p-fluid" style={styles}>
            <div className="col-12 lg:col-6">
                <h2>Add new request</h2>
            <div className="card">
            <form id="request_form" ref={form} onSubmit={handleSubmit}>

            <h5>Subject*</h5>
            <InputText id="subject" type="text" placeholder='Request subject' name="subject" value={subjectValue} onChange={changeSubject} maxLength={57} className={isSubjectOk ? "" : "p-invalid"} aria-describedby="subject-help" />
            {isSubjectOk ? ("") : (<small id="subject-help" className="p-error">Subject is mandatory!</small>)}
                    <h5>Type</h5>
                    <Dropdown value={categoryValue} onChange={(e) => setCategoryValue(e.value)} options={categoryValues} optionLabel="name" name='category' optionValue='code' placeholder="Select" />
                    <h5>Priority</h5>
                    <Dropdown value={priorityValue} onChange={(e) => setPriorityValue(e.value)} options={priorityValues} optionLabel="name" optionValue='code' name='priority' placeholder="Select" />

                    <h5>Description*</h5>
                    <InputTextarea placeholder="Your Description" id='description' name='description' value={descriptionValue} maxLength={275} className={isDescriptionOk ? "" : "p-invalid"}
              onChange={changeDescription} autoResize rows="5" cols="30" aria-describedby="description-help" />
            {isDescriptionOk ? ("") : (<small id="description-help" className="p-error">Description is mandatory!</small>)}
                    <h5> </h5>
                    <div style={{ display: "flex" }}>
                    <Button label="Create" type='submit' className="mr-2 mb-2"></Button>
                    <Dialog header="Request is saved!" visible={displayConfirmation2} onHide={() => setDisplayConfirmation2(false)} style={{ width: '350px' }} modal footer={confirmationDialogFooter2}>
                <div className="flex align-items-center justify-content-center">
                  <i className="pi pi-check-circle mr-3" style={{ fontSize: '2rem' }} />
                </div>
              </Dialog>
                    <Button label="Cancel" type="button" className="mr-2 mb-2" onClick={() => setDisplayConfirmation(true)}></Button>
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

export default React.memo(CreateRequest, comparisonFn);
