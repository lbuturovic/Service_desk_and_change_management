import React, { useEffect, useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import authHeader from '../service/security/auth-header';
import AuthService from '../service/security/auth.service';
import axios from "axios";
import { useHistory } from 'react-router-dom';
import { useLocation } from "react-router-dom";

export const EditRequest = () => {
    const [dropdownValue, setDropdownValue] = useState('');
    const [subjectValue, setSubjectValue] = useState('');
  const [groupValue, setGroupValue] = useState('');
  const [allGroups, setAllGroups] = useState('');
  const [categoryValue, setCategoryValue] = useState('');
  const [priorityValue, setPriorityValue] = useState('');
  const [statusValue, setStatusValue] = useState('');
  const [isSubjectOk, setIsSubjectOk] = useState(true);
  const [displayConfirmation, setDisplayConfirmation] = useState(false);
  const [displayConfirmation2, setDisplayConfirmation2] = useState(false);
  const [displayConfirmation3, setDisplayConfirmation3] = useState(false);
  const [request, setRequest] = useState('');
  const [reporter, setReporter] = useState('');
  const [resolver, setResolver] = useState(null);
  const currentUser = AuthService.getCurrentUser();
  const [calendarEndValue, setCalendarEndValue] = useState('');
    const urlGroup = "http://localhost:8080/api/groups";
    const urlRequest = "http://localhost:8080/api/request/";
    const urlEmployees = "http://localhost:8080/api/employees";
    const [employees, setEmployees] = useState('');
    const location = useLocation();
    const history = useHistory();
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

    const statusValues = [
        { name: 'Open', code: 'OPEN' },
        { name: 'Pending', code: 'PENDING' },
        { name: 'Resolved', code: 'RESOLVED' },
        { name: 'Closed', code: 'CLOSED' },
        { name: 'In progress', code:'IN_PROGRESS'}
    ];

    const confirmationDialogFooter2 = (
        <>
          <div className="grid formgrid">
            <Button type="button" label="OK" onClick={() => setDisplayConfirmation2(false)} className="mr-2 mb-2" />
          </div>
        </>
      );

      const confirmationDialogFooter3 = (
        <>
          <div className="grid formgrid">
            <Button type="button" label="OK" onClick={() => {setDisplayConfirmation3(false); history.push({pathname:'/show-requests'});}} className="mr-2 mb-2" />
          </div>
        </>
      );

    const getAllGroups = () => {
        axios.get(urlGroup, {
          headers: {
            'Authorization': authHeader().Authorization
          }
        }).then((response) => {
          var groups = response.data;
          groups.unshift({ description: 'Without group', id: '-1' })
          setAllGroups(groups);
          setGroupValue(groups[0].id);
        }).catch(error => console.error(`${error}`));
      }

      const getEmployees = () => {
        axios.get(urlEmployees, {
          headers: {
            'Authorization': authHeader().Authorization
          }
        }).then((response) => {
          setEmployees(response.data);
          if(request.resolving!=null) setDropdownValue(request.resolving.id);
        }).catch(error => console.error(`${error}`));
      }

      const getRequest = (urlRequest, id) => {
        axios.get(urlRequest + id, {
            headers: {
                'Authorization': authHeader().Authorization
            }
        }).then((response) => {
            setRequest(response.data);
            setReporter(response.data.reported.firstName + " " + response.data.reported.lastName);
            setSubjectValue(response.data.subject);
            setCategoryValue(response.data.category);
            setPriorityValue(response.data.priority);
            setStatusValue(response.data.status);
            if(response.data.due!=null)
                setCalendarEndValue(new Date(response.data.due));
            if(response.data.group!=null){
              setGroupValue(response.data.group.id);
            }
                
            if(response.data.resolving!=null)
                setDropdownValue(response.data.resolving.id);
        }).catch(error => console.error(`${error}`));
    }

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

      const confirmationDialogFooter = (
        <>
          <Button type="button" label="No" icon="pi pi-times" onClick={() => setDisplayConfirmation(false)} className="p-button-text" />
          <Button type="button" label="Yes" icon="pi pi-check" onClick={handleCancelConfirmation} className="p-button-text" autoFocus />
        </>
      );
    
      useEffect(() => {
        getAllGroups();
        // setGroupValue("-1");
    
        const search = location.search;
        const id = new URLSearchParams(search).get('id');
        getRequest(urlRequest, id);
        getEmployees();
    
      }, []);
    
      
  function handleCancelConfirmation(event) {
    event.preventDefault();
    setSubjectValue(request.subject);
    setCategoryValue(request.category);
    setPriorityValue(request.priority);
    if(request.group!=null)
      setGroupValue(request.group.id);
    else setGroupValue(-1);
    setCalendarEndValue(request.due);
    setStatusValue(request.status);
    setResolver(request.resolving.id);
    setIsSubjectOk(true);
    //form.current.reset(); //this will reset all the inputs in the form
    setDisplayConfirmation(false);

  }

  function handleCancelConfirmation2() {
    getRequest(urlRequest, request.id);
    setIsSubjectOk(true);
    //form.current.reset(); //this will reset all the inputs in the form
    setDisplayConfirmation2(true);
  }

  const changeSubject = (e) => {
    e.preventDefault();
    setSubjectValue(e.target.value);
    if (e.target.value.trim().length == 0) setIsSubjectOk(false);
    else setIsSubjectOk(true);
  }

  function handleStartDate(e){
    let date = new Date(e.value);
    date.setDate(date.getDate() + 1);
    console.log(e.value)
    setCalendarEndValue(date);
    console.log(date)
 }

  async function handleUpdate(event) {
    event.preventDefault();
    var urlOldRequest = 'http://localhost:8080/api/request/'+request.id
    if(groupValue!=-1)
      urlOldRequest+= '/group/' + groupValue;
    if(dropdownValue!='') {
      urlOldRequest+='/resolving/'+dropdownValue;
    }
    await axios.put(urlOldRequest, {
        subject: request.subject,
        due: calendarEndValue,
        status: statusValue,
        category: categoryValue,
        priority: priorityValue,
        reported: request.reported,
        description: request.description,
        created: request.created,
        firstResponseDue: request.firstResponseDue,
        responses: request.responses
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
                handleCancelConfirmation2();
                console.log('Error', error.message);
            }

        });

}

function handleReplayClick () {
  let id = "?id=" + request.id;
  history.push({pathname:'/resolved-request', search: id });
}

function handleDelete () {
  let id = request.id;
  return axios.delete("http://localhost:8080/api/request/" + id, {
headers: {
  'Authorization': authHeader().Authorization
}
}).then((response) => {
  setDisplayConfirmation3(true)

}).catch(error => console.error(`${error}`));
}


    return (
        <div className="grid p-fluid">
            <div className="col-12 lg:col-6">
                <h2>Edit request</h2>
            <div className="card">
            <h4>{request.subject} </h4>
            <p>Reported by: <b>{reporter}</b></p>
            <p><b>{formatDate(request.created)}</b></p>

            <p style={{  marginTop: "50px", marginBottom: "50px" }}>{request.description}</p>
                    <span className="p-buttonset">
                        <Button label="Replay" icon="pi pi-reply" onClick={handleReplayClick}/>
                        <Button label="Merge" icon="pi pi-share-alt" onClick={() => history.push({pathname:'/create-groups'})}/>
                        <Button label="Delete" icon="pi pi-trash" onClick={handleDelete}/>
                        <Dialog header="Request is deleted!" visible={displayConfirmation3} onHide={() => {setDisplayConfirmation3(false)}} style={{ width: '350px' }} modal footer={confirmationDialogFooter3}>
            <div className="flex align-items-center justify-content-center">
                <i className="pi pi-check-circle mr-3" style={{ fontSize: '2rem' }} />
            </div>
        </Dialog>
                    </span>
            </div>

 
                    </div>
                    <div className="col-12 md:col-6">
                <div style={{  marginTop: "50px"}} className="card">
                    <h5> <span className={request.status}>{request.status}</span></h5>
                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <p><b>FIRST RESPONSE DUE</b></p>
                            <p>{formatDate(request.firstResponseDue)}</p>
                 <form id="edit_form" ref={form} onSubmit={handleUpdate}>             
                            <p><b>RESOLUTION DUE*</b></p>
                            <Calendar locale='en' dateFormat="dd/mm/yy" showIcon showButtonBar value={calendarEndValue} onChange={(e) => handleStartDate(e)} >{request.due}</Calendar>
                            <h5>Subject</h5>

            <InputText id="subject" type="text" placeholder='Requst subject' name="subject" value={subjectValue} onChange={changeSubject} maxLength={57} className={isSubjectOk ? "" : "p-invalid"} aria-describedby="subject-help" />
            {isSubjectOk ? ("") : (<small id="subject-help" className="p-error">Subject is mandatory!</small>)}
            
                    <h5>Type</h5>
            <Dropdown value={categoryValue} onChange={(e) => setCategoryValue(e.value)} options={categoryValues} optionLabel="name" name='category' optionValue='code' placeholder="Select" />
            <h5>Priority*</h5>
            <Dropdown value={priorityValue} onChange={(e) => setPriorityValue(e.value)} options={priorityValues} optionLabel="name" optionValue='code' name='priority' placeholder="Select" />
            <h5>Status*</h5>
            <Dropdown value={statusValue} onChange={(e) => setStatusValue(e.value)} options={statusValues} optionLabel="name" optionValue='code' name='status' placeholder="Select" />

                    <h5>Group</h5>
            <Dropdown value={groupValue} onChange={(e) => setGroupValue(e.value)} options={allGroups} optionLabel="description" optionValue='id' name='group' placeholder="Without group" ></Dropdown>            
                   <h5>Assign to</h5>
                    <Dropdown value={dropdownValue} onChange={(e) => setDropdownValue(e.value)} options={employees} optionLabel="username" optionValue='id' name='resolving' placeholder="Select" />
                   <h5> </h5>
            <div style={{ display: "flex" }}>
              <Button label="Update" type='submit' className="mr-2 mb-2"></Button>

              <Dialog header="Request is saved!" visible={displayConfirmation2} onHide={() => setDisplayConfirmation2(false)} style={{ width: '350px' }} modal footer={confirmationDialogFooter2}>
                <div className="flex align-items-center justify-content-center">
                  <i className="pi pi-check-circle mr-3" style={{ fontSize: '2rem' }} />
                </div>
              </Dialog>
              <Button type="button" label="Cancel" className="mr-2 mb-2" onClick={() => setDisplayConfirmation(true)}></Button>
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
                    </div>

    )
}

const comparisonFn = function (prevProps, nextProps) {
    return (prevProps.location.pathname === nextProps.location.pathname) && (prevProps.colorMode === nextProps.colorMode);
};

export default React.memo(EditRequest, comparisonFn);