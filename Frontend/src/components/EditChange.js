import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useHistory } from 'react-router-dom';
import { InputTextarea } from 'primereact/inputtextarea';
import authHeader from '../service/security/auth-header';
import AuthService from '../service/security/auth.service';
import axios from "axios";


export const EditRequest = () => {
    const [descriptionValue, setDescriptionValue] = useState('');
    const [statusValue, setStatusValue] = useState('IMPLEMENTING');
    const [isDescriptionOk, setIsDescriptionOk] = useState(true);
    const [calendarStartValue, setCalendarStartValue] = useState(null);
    const [calendarEndValue, setCalendarEndValue] = useState(null);
    const [change, setChange] = useState('');
    const [reporter, setReporter] = useState('');
    const [executor, setExecutor] = useState('');
    const [approver, setApprover] = useState('/');
    const urlChange = "http://localhost:8080/api/changes/";
    const location = useLocation();
    const history = useHistory();
    const [displayConfirmation, setDisplayConfirmation] = useState(false);
    const [displayConfirmation2, setDisplayConfirmation2] = useState(false);
    const currentUser = AuthService.getCurrentUser();

    const getChange = (urlChange, id) => {
        axios.get(urlChange + id, {
            headers: {
                'Authorization': authHeader().Authorization
            }
        }).then((response) => {
            console.log(response.data.reporter.firstName);
            setChange(response.data);
            setReporter(response.data.reporter.firstName + " " + response.data.reporter.lastName);
            setExecutor(response.data.executor.firstName + " " + response.data.executor.lastName);
            setApprover(response.data.approver.firstName + " " + response.data.approver.lastName);
        }).catch(error => console.error("${error}"));
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
    const confirmationDialogFooter2 = (
        <>
            <div className="grid formgrid">
                <Button type="button" label="All changes" icon="pi pi-list" onClick={handleShowChanges} className="p-button-text" />
                <Button type="button" label="New change" icon="pi pi-plus" onClick={() => setDisplayConfirmation2(false)} className="p-button-text" />
            </div>
        </>
    );

    function handleShowChanges(event) {
        event.preventDefault();
        history.push('/show-changes');
    };

    async function handleUpdate(event) {
        event.preventDefault();
        var ok = true;
        if (descriptionValue.trim().length === 0) {
            setIsDescriptionOk(false);
            ok = false;
        }
        if (!ok) return;
        var urlChange = 'http://localhost:8080/api/user/' + currentUser.id + "/change/" + change.id;
        await axios.put(urlChange, {
            description: descriptionValue.trim(),
            start: calendarStartValue,
            end: calendarEndValue,
            status: statusValue
        }, {
            headers: {
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

    useEffect(() => {
        const search = location.search;
        const id = new URLSearchParams(search).get('id');
        getChange(urlChange, id);

    }, [location]);

    const statusValues = [
        { name: 'Inspecting', code: 'REVIEWING', id: 1 },
        { name: 'Planning', code: 'PLANNING', id: 4 },
        { name: 'Implementing', code: 'IMPLEMENTING', id: 5 },
        { name: 'Testing', code: 'TESTING', id: 6 }
    ];

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
        setCalendarStartValue(null);
        setCalendarEndValue(null);
        setStatusValue('IMPLEMENTING');
        //form.current.reset(); //this will reset all the inputs in the form
        setDisplayConfirmation(false);

    }

    function handleStartDate(e){
       let date = new Date(e.value);
       date.setDate(date.getDate() + 1);
       setCalendarStartValue(date);
    }

    function handleEndDate(e){
        let date = new Date(e.value);
        date.setDate(date.getDate() + 1);
        setCalendarEndValue(date);
     }

    function handleCancelConfirmation2() {
        setDescriptionValue('');
        setIsDescriptionOk(true);
        setCalendarStartValue(null);
        setCalendarEndValue(null);
        setStatusValue('IMPLEMENTING');
        //form.current.reset(); //this will reset all the inputs in the form
        setDisplayConfirmation2(true);

    }

    const changeDescription = (e) => {
        e.preventDefault();
        setDescriptionValue(e.target.value);
        if (e.target.value.trim().length == 0) setIsDescriptionOk(false);
        else setIsDescriptionOk(true);
    }

    const statusBodyTemplate = (status) => {
        let color = '';
        if (status === 'PENDING') color = 'new';
        else if (status === 'ACCEPTED') color = 'qualified';
        else if (status === 'REJECTED' || status === 'CLOSED') color = 'unqualified';
        else if (status === 'REVIEWING' || status === 'PLANNING') color = 'proposal';
        else if (status === 'IMPLEMENTING') color = 'renewal';
        else if (status === 'TESTING') color = 'negotiation';
        return color;
    }

    // const reporter = change.reporter.firstName + " " + change.reporter.lastName;

    return (
        <div className="grid p-fluid">
            <div className="col-12 lg:col-6">
                <h2>Edit change</h2>
                <div className="card">
                    <h4>{change.subject} </h4>
                    <p>Status: <b><span className={`customer-badge status-${statusBodyTemplate(change.status)}`}>{change.status}</span></b></p>
                    <p>Reported by: <b>{reporter}</b></p>
                    <p>Time created: <b>{formatDate(change.created)}</b></p>
                    <p>Approved by: <b>{approver}</b></p>
                    <p>Current executor: <b>{executor}</b> </p>
                    <p>Time updated: <b>{formatDate(change.updated)}</b></p>
                    <p style={{ marginTop: "50px" }}>Description*</p>
                    <InputTextarea placeholder="Your Description" id='description' name='description' value={descriptionValue} maxLength={275} className={isDescriptionOk ? "" : "p-invalid"}
                        onChange={changeDescription} autoResize rows="5" cols="30" aria-describedby="description-help" />
                    {isDescriptionOk ? ("") : (<small id="description-help" className="p-error">Description is mandatory!</small>)}

                </div>


            </div>
            <div className="col-12 md:col-6">
                <div style={{ marginTop: "50px" }} className="card">
                    <h5>Accepted</h5>
                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <p><b>Start</b></p>
                            <Calendar dateFormat="dd/mm/yy" timeZone="CET" showIcon showButtonBar value={calendarStartValue} onChange={handleStartDate} maxDate={calendarEndValue}></Calendar>
                            <p><b>End</b></p>
                            <Calendar dateFormat="dd/mm/yy" timeZone="CET" showIcon showButtonBar value={calendarEndValue} onChange={handleEndDate} minDate={calendarStartValue}></Calendar>
                            <p style={{ marginTop: "20px" }}><b>Status*</b></p>
                            <Dropdown value={statusValue} onChange={(e) => setStatusValue(e.value)} options={statusValues} optionLabel="name" optionValue='code' name='status' />
                            <span className="p-buttonset">
                                <Button style={{ marginTop: "50px", marginBottom: "30px" }} label="Update" onClick={handleUpdate} />
                                <Dialog header="Change is saved!" visible={displayConfirmation2} onHide={() => setDisplayConfirmation2(false)} style={{ width: '350px' }} modal footer={confirmationDialogFooter2}>
                                <div className="flex align-items-center justify-content-center">
                                    <i className="pi pi-check-circle mr-3" style={{ fontSize: '2rem' }} />
                                    <span>Do you want to see all changes or create another one?</span>
                                </div>
                            </Dialog>
                                <Button type="button" onClick={() => setDisplayConfirmation(true)} style={{ marginLeft: "black", marginTop: "50px", marginBottom: "30px" }} label="Cancel" />
                            </span>
                            <Dialog header="Cancel without saving?" visible={displayConfirmation} onHide={() => setDisplayConfirmation(false)} style={{ width: '350px' }} modal footer={confirmationDialogFooter}>
                                <div className="flex align-items-center justify-content-center">
                                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                                    <span>All unsaved information will be lost.</span>
                                </div>
                            </Dialog>

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
