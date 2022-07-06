import React, { useEffect, useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import AuthService from '../service/security/auth.service';
import authHeader from '../service/security/auth-header';
import axios from "axios";

export const CreateArticle = () => {
    const [displayConfirmation, setDisplayConfirmation] = useState(false);
    const[displayConfirmation2, setDisplayConfirmation2] = useState(false);
    const [titleValue, setTitleValue] = useState('');
    const[descriptionValue, setDescriptionValue] = useState('');
    const[taggsValue, setTaggsValue] = useState('');
    const[isTitleOk, setIsTitleOk] = useState(true);
    const[isDescriptionOk, setIsDescriptionOk] = useState(true);
    const currentUser = AuthService.getCurrentUser();
    const form = useRef(null);

    const confirmationDialogFooter = (
        <>
          <Button type="button" label="No" icon="pi pi-times" onClick={() => setDisplayConfirmation(false)} className="p-button-text" />
          <Button type="button" label="Yes" icon="pi pi-check" onClick={handleCancelConfirmation} className="p-button-text" autoFocus />
        </>
      );

      function handleCancelConfirmation(event) {
        event.preventDefault();
        setTitleValue('');
        setDescriptionValue('');
        setTaggsValue('');
        setIsTitleOk(true);
        setIsDescriptionOk(true);
        //form.current.reset(); //this will reset all the inputs in the form
        setDisplayConfirmation(false);
    
      }

      function handleCancelConfirmation2() {
        setTitleValue('');
        setDescriptionValue('');
        setTaggsValue('');
        setIsTitleOk(true);
        setIsDescriptionOk(true);
        //form.current.reset(); //this will reset all the inputs in the form
        setDisplayConfirmation2(true);
      }

      const changeTitle = (e) => {
        e.preventDefault();
        setTitleValue(e.target.value);
        if (e.target.value.trim().length == 0) setIsTitleOk(false);
        else setIsTitleOk(true);
      }
    
      const changeDescription = (e) => {
        e.preventDefault();
        setDescriptionValue(e.target.value);
        if (e.target.value.trim().length == 0) setIsDescriptionOk(false);
        else setIsDescriptionOk(true);
      }

      const changeTaggs = (e) => {
        e.preventDefault();
        setTaggsValue(e.target.value);
        //if (e.target.value.trim().length == 0) setIsDescriptionOk(false);
        //else setIsDescriptionOk(true);
      }

      async function handleSubmit(event) {
        event.preventDefault();
        // console.log(authHeader());
        // console.log(allGroups);
        var ok = true;
        if (titleValue.trim().length === 0) {
          setIsTitleOk(false);
          ok = false;
        }
        if (descriptionValue.trim().length === 0) {
          setIsDescriptionOk(false);
          ok = false;
        }
        if (!ok) return;
        var urlChange = 'http://localhost:8080/api/user/' + currentUser.id;
        await axios.post(urlChange + '/article', {
          title: titleValue,
          description: descriptionValue,
          taggs: taggsValue
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
                <h2>Add new article</h2>
            <div className="card">
            <form id="request_form" ref={form} onSubmit={handleSubmit}>

            <h5>Title*</h5>
            <InputText id="subject" type="text" placeholder='Article title' name="subject" value={titleValue} onChange={changeTitle} maxLength={57} className={isTitleOk ? "" : "p-invalid"} aria-describedby="subject-help" />
            {isTitleOk ? ("") : (<small id="subject-help" className="p-error">Title is mandatory!</small>)}
                    <h5>Description*</h5>
                    <InputTextarea placeholder="Description" id='description' name='description' value={descriptionValue} maxLength={275} className={isDescriptionOk ? "" : "p-invalid"}
              onChange={changeDescription} autoResize rows="5" cols="30" aria-describedby="description-help" />
            {isDescriptionOk ? ("") : (<small id="description-help" className="p-error">Description is mandatory!</small>)}
            <h5>Tags</h5>
                    <span className="p-float-label">
                        <InputText id="tags" type="text" value={taggsValue} onChange={changeTaggs} />
                        <label htmlFor="username">Add tags</label>
                    </span>
                    <h5> </h5>
                    <div style={{ display: "flex" }}>
                    <Button label="Create" type='submit' className="mr-2 mb-2"></Button>
                    <Dialog header="Article is saved!" visible={displayConfirmation2} onHide={() => setDisplayConfirmation2(false)} style={{ width: '350px' }} modal footer={confirmationDialogFooter2}>
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

export default React.memo(CreateArticle, comparisonFn);
