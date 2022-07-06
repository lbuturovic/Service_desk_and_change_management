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

export const CreateChange = () => {
  const [subjectValue, setSubjectValue] = useState('');
  const [descriptionValue, setDescriptionValue] = useState('');
  const [groupValue, setGroupValue] = useState('-1');
  const [allGroups, setAllGroups] = useState('');
  const [categoryValue, setCategoryValue] = useState('ADD');
  const [priorityValue, setPriorityValue] = useState('STANDARD');
  const [isSubjectOk, setIsSubjectOk] = useState(true);
  const [isDescriptionOk, setIsDescriptionOk] = useState(true);
  const [displayConfirmation, setDisplayConfirmation] = useState(false);
  const [displayConfirmation2, setDisplayConfirmation2] = useState(false);
  const currentUser = AuthService.getCurrentUser();
  const urlGroup = "http://localhost:8080/api/groups";
  const toast = useRef(null);
  const form = useRef(null);
  const history = useHistory();


  const getAllGroups = () => {
    axios.get(urlGroup, {
      headers: {
        'Authorization': authHeader().Authorization
      }
    }).then((response) => {
      var groups = response.data;
      groups.unshift({ description: 'Without group', id: '-1' })
      setAllGroups(groups);
      console.log(allGroups);
    }).catch(error => console.error("${error}"));
  }

  const priorityValues = [
    { name: 'Standard', code: 'STANDARD' },
    { name: 'Normal', code: 'NORMAL' },
    { name: 'Urgent', code: 'URGENT' }
  ];

  const categoryValues = [
    { name: 'Add', code: 'ADD' },
    { name: 'Change', code: 'CHANGE' },
    { name: 'Remove', code: 'REMOVE' }
  ];

  const confirmationDialogFooter = (
    <>
      <Button type="button" label="No" icon="pi pi-times" onClick={() => setDisplayConfirmation(false)} className="p-button-text" />
      <Button type="button" label="Yes" icon="pi pi-check" onClick={handleCancelConfirmation} className="p-button-text" autoFocus />
    </>
  );

  const confirmationDialogFooter2 = (
    <>
      <div className="grid formgrid">
        <Button type="button" label="Active changes" icon="pi pi-list" onClick={handleShowChanges} className="p-button-text" />
        <Button type="button" label="New change" icon="pi pi-plus" onClick={() => setDisplayConfirmation2(false)} className="p-button-text" />
      </div>
    </>
  );
  useEffect(() => {
    getAllGroups();
    // setGroupValue("-1");


  }, []);



  const styles = {

    marginLeft: '33%',
    marginRight: 'auto',
    //marginTop: '10%'
  };

  const accept = () => {
    toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
  };

  const reject = () => {
    toast.current.show({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
  };


  function handleShowChanges(event) {
    event.preventDefault();
    history.push('/active-changes');
  };

  function handleCancelConfirmation(event) {
    event.preventDefault();
    setSubjectValue('');
    setDescriptionValue('');
    setCategoryValue('ADD');
    setPriorityValue('STANDARD');
    setGroupValue('-1');
    setIsSubjectOk(true);
    setIsDescriptionOk(true);
    //form.current.reset(); //this will reset all the inputs in the form
    setDisplayConfirmation(false);

  }

  function handleCancelConfirmation2() {
    setSubjectValue('');
    setDescriptionValue('');
    setCategoryValue('ADD');
    setPriorityValue('STANDARD');
    setGroupValue('-1');
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
    if (groupValue != -1) urlChange = urlChange + '/group/' + groupValue;
    await axios.post(urlChange + '/changes', {
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


  return (
    <div className="grid p-fluid" style={styles}>
      <div className="col-12 lg:col-6">
        <h2>Create new change</h2>
        <div className="card">
          <h5>Subject*</h5>
          <form id="change_form" ref={form} onSubmit={handleSubmit}>

            <InputText id="subject" type="text" placeholder='Change subject' name="subject" value={subjectValue} onChange={changeSubject} maxLength={57} className={isSubjectOk ? "" : "p-invalid"} aria-describedby="subject-help" />
            {isSubjectOk ? ("") : (<small id="subject-help" className="p-error">Subject is mandatory!</small>)}
            <h5>Description*</h5>
            <InputTextarea placeholder="Description of required change" id='description' name='description' value={descriptionValue} maxLength={275} className={isDescriptionOk ? "" : "p-invalid"}
              onChange={changeDescription} autoResize rows="5" cols="30" aria-describedby="description-help" />
            {isDescriptionOk ? ("") : (<small id="description-help" className="p-error">Description is mandatory!</small>)}
            <h5>Group</h5>
            <Dropdown value={groupValue} onChange={(e) => setGroupValue(e.value)} options={allGroups} optionLabel="description" optionValue='id' name='group' placeholder="Without group" />
            <h5>Priority*</h5>
            <Dropdown value={priorityValue} onChange={(e) => setPriorityValue(e.value)} options={priorityValues} optionLabel="name" optionValue='code' name='priority' placeholder="Select" />
            <h5>Category*</h5>
            <Dropdown value={categoryValue} onChange={(e) => setCategoryValue(e.value)} options={categoryValues} optionLabel="name" name='category' optionValue='code' placeholder="Select" />
            <h5> </h5>
            <div style={{ display: "flex" }}>
              <Button label="Create" type='submit' className="mr-2 mb-2"></Button>

              <Dialog header="Change is saved!" visible={displayConfirmation2} onHide={() => setDisplayConfirmation2(false)} style={{ width: '350px' }} modal footer={confirmationDialogFooter2}>
                <div className="flex align-items-center justify-content-center">
                  <i className="pi pi-check-circle mr-3" style={{ fontSize: '2rem' }} />
                  <span>Do you want to see all changes or create another one?</span>
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

  )
}

const comparisonFn = function (prevProps, nextProps) {
  return (prevProps.location.pathname === nextProps.location.pathname) && (prevProps.colorMode === nextProps.colorMode);
};

export default React.memo(CreateChange, comparisonFn);
