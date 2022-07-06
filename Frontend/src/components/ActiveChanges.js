import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import axios from 'axios';
import authHeader from '../service/security/auth-header';
import { useHistory } from 'react-router-dom';
import AuthService from '../service/security/auth.service';

const ActiveChanges = props => {
    const [changes, setChanges] = useState([]);
    const [reports, setReports] = useState(null);
    const [expandedRows, setExpandedRows] = useState(null);
    const [isApprover, setApprover] = useState(false);
    const currentUser = AuthService.getCurrentUser();
    const [displayRejectDialog, setDisplayRejectDialog] = useState(false);
    const [descriptionValue, setDescriptionValue] = useState('');
    const [isDescriptionOk, setIsDescriptionOk] = useState(true);
    const [changeId, setChangeId] = useState(null);


    let history = useHistory();


    const getAllReportsFun = (changes) => {
        for (let i = 0; i < changes.length; i++) {
            changes[i]["nameReporter"] =  changes[i]["reporter"].firstName + " " + changes[i]["reporter"].lastName;
            changes[i]["nameApprover"] =  changes[i]["approver"].firstName + " " + changes[i]["approver"].lastName;
            axios.get("http://localhost:8080/api/change/" + changes[i].id + "/reports", {
                headers: {
                    'Authorization': authHeader().Authorization
                }
            }).then((response) => {
                changes[i]["history"] = response.data;
            }).catch(error => console.error("${error}"));
        }

        setChanges(changes);
    }

    const getChanges = () => {
        return axios.get("http://localhost:8080/api/active-changes", {
            headers: {
                'Authorization': authHeader().Authorization
            }
        }).then((response) => {
            getAllReportsFun(response.data);
            //console.log(changes);
        }).catch(error => console.error("${error}"));
    }

    useEffect(() => {
        //setLoading2(true);
        getChanges();
        setApprover(currentUser.roles.includes('ROLE_APPROVER'));
        //getAllReports();
        //initFilters1();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps


    const formatDate = (value) => {
        if(value===null) return;
        const dateTime = new Date(value);
        const date = dateTime.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });

        const time = dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return date + " " + time;
    }

    const formatDateWithoutTime = (value) => {
        if(value===null) return;
        const dateTime = new Date(value);
        const date = dateTime.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });

        return date;
    }





    const dateBodyTemplateCreated = (rowData) => {
        return formatDate(rowData.created);
    }

    const dateBodyTemplateStart = (rowData) => {
        return formatDateWithoutTime(rowData.start);
    }

    const dateBodyTemplateEnd = (rowData) => {
        return formatDateWithoutTime(rowData.end);
    }
 
    const dateBodyTemplateUpdated = (rowData) => {
        return formatDate(rowData.updated);
    }


    const statusBodyTemplate = (rowData) => {
        const status = rowData.status;
        let color = 'new';
        if (status === 'PENDING') color = 'new';
        else if (status === 'ACCEPTED') color = 'qualified';
        else if (status === 'REJECTED' || status === 'CLOSED') color = 'unqualified';
        else if (status === 'REVIEWING' || status === 'PLANNING') color = 'proposal';
        else if (status === 'IMPLEMENTING') color = 'renewal';
        else if (status === 'TESTING') color = 'negotiation';

        return <span className={`customer-badge status-${color}`}>{rowData.status}</span>;
    }

    const changeDescription = (e) => {
        e.preventDefault();
        setDescriptionValue(e.target.value);
        if (e.target.value.trim().length == 0) setIsDescriptionOk(false);
        else setIsDescriptionOk(true);
    }

    async function handleReject(event) {
        event.preventDefault();
        var ok = true;
        if (descriptionValue.trim().length === 0) {
            setIsDescriptionOk(false);
            ok = false;
        }
        if (!ok) return;

        var urlChange = 'http://localhost:8080/api/user/' + currentUser.id + '/change/' + changeId + '/close';
        await axios.put(urlChange, {
            description: descriptionValue.trim(),
        }, {
            headers: {
                'Authorization': authHeader().Authorization
            }
        })
            .then(res => {
                setChanges(changes.filter(item => item.id !== changeId));
                setDisplayRejectDialog(false);
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

    const rejectDialogFooter = (
        <>
            <Button type="button" label="Confirm" icon="pi pi-check" onClick={handleReject} className="p-button-text" />
            <Button type="button" label="Cancel" icon="pi pi-times" onClick={() => setDisplayRejectDialog(false)} className="p-button-text" autoFocus />
        </>
    );


    const openBodyTemplate = (rowData) => {
        function handleEditClick() {
            let id = "?id=" + rowData.id;
            history.push({ pathname: '/edit-change', search: id, change: rowData });
        }
        function showRejectDialog() {
            setChangeId(rowData.id);
            setDisplayRejectDialog(true);
        }
        return <div><Button label="Edit" className="p-button-raised p-button-info mr-2 mb-2" onClick={handleEditClick} />
        { isApprover ? <Button label="Close" className="p-button-danger mr-2 mb-2"  onClick={showRejectDialog}/> : null }
        <Dialog header="Please enter reasons for closing change:" visible={displayRejectDialog} style={{ width: '30vw' }} modal footer={rejectDialogFooter} onHide={() => setDisplayRejectDialog(false)}>
                <InputTextarea placeholder="Description" id='description' name='description' value={descriptionValue} maxLength={275} className={isDescriptionOk ? "" : "p-invalid"}
                    autoResize rows="6" cols="60" aria-describedby="description-help" onChange={changeDescription} />
                {isDescriptionOk ? ("") : (<small id="description-help" className="p-error">Description is mandatory!</small>)}
            </Dialog>
        </div>;
    }

    const expandAll = () => {
        let _expandedRows = {};
        changes.forEach(p => _expandedRows[`${p.id}`] = true);
        console.log(reports);
        setExpandedRows(_expandedRows);
    }

    const collapseAll = () => {
        setExpandedRows(null);
    }


    const priorityBodyTemplate = (rowData) => {
        const priority = rowData.priority;
        let color = 'new';
        if (priority === 'PENDING') color = 'new';
        else if (priority === 'STANDARD') color = 'qualified';
        else if (priority === 'URGENT') color = 'unqualified';
        else if (priority === 'NORMAL') color = 'negotiation';
        return <span className={`customer-badge status-${color}`}>{rowData.priority}</span>;
    }

    const rowExpansionTemplate = (data) => {
        return (
            <div className="orders-subtable">
                <h5>History for {data.subject}</h5>
                <DataTable value={data.history} responsiveLayout="scroll">
                    <Column field="description" header="Description"></Column>
                    <Column field="employee.firstName" header="Name" ></Column>
                    <Column field="employee.lastName" header="Last name"></Column>
                    <Column field="start" header="Start" body={dateBodyTemplateStart}></Column>
                    <Column field="end" header="End" body={dateBodyTemplateEnd}></Column>
                    <Column field="status" header="Status" body={statusBodyTemplate} ></Column>
                </DataTable>
            </div>
        );
    }

    const header = (
        <div className="table-header-container">
            <Button icon="pi pi-plus" label="Expand All" onClick={expandAll} className="mr-2 mb-2" />
            <Button icon="pi pi-minus" label="Collapse All" onClick={collapseAll} className="mb-2" />
        </div>
    );


    return (
        <div className="grid table-demo">
            <div className="col-12">
                <div className="card">
                    <h5>Active changes</h5>
                    <DataTable value={changes} expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)} responsiveLayout="scroll"
                        rowExpansionTemplate={rowExpansionTemplate} dataKey="id" header={header}>
                        <Column expander style={{ width: '3em' }} />
                        <Column field="subject" header="Subject" sortable />
                        <Column field="group.description" header="Group" sortable /> 
                        <Column field="priority" header="Priority" sortable body={priorityBodyTemplate} />
                        <Column field="category" header="Category" sortable />
                        <Column field="nameReporter" header="Reported by" sortable />
                        <Column field="nameApprover" header="Approved by" sortable />
                        <Column field="status" header="Status" sortable body={statusBodyTemplate} />
                        <Column field="created" header="Time created" sortable body={dateBodyTemplateCreated} />
                        <Column field="updated" header="Time updated" sortable body={dateBodyTemplateUpdated} />
                        <Column bodyClassName="text-center" style={{ minWidth: '8rem' }} body={openBodyTemplate} />
                    </DataTable>
                </div>
            </div>
        </div>
    );
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(ActiveChanges, comparisonFn);
