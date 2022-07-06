import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import AuthService from '../service/security/auth.service';
import axios from 'axios';
import authHeader from '../service/security/auth-header';
import { useHistory } from 'react-router-dom';

const PendingChanges = props => {
    const [changes, setChanges] = useState([]);
    const [reports, setReports] = useState(null);
    const [descriptionValue, setDescriptionValue] = useState('');
    const [isDescriptionOk, setIsDescriptionOk] = useState(true);
    const [changeId, setChangeId] = useState(null);
    const [expandedRows, setExpandedRows] = useState(null);
    const [displayApproveDialog, setDisplayApproveDialog] = useState(false);
    const [displayRejectDialog, setDisplayRejectDialog] = useState(false);
    const currentUser = AuthService.getCurrentUser();

    let history = useHistory();


    const getAllRequestsFun = (changes) => {
        for (let i = 0; i < changes.length; i++) {
            if (changes[i].group !== null) {
                axios.get("http://localhost:8080/api/group/" + changes[i].group.id + "/requests", {
                    headers: {
                        'Authorization': authHeader().Authorization
                    }
                }).then((response) => {
                    changes[i]["history"] = response.data;
                }).catch(error => console.error("${error}"));
            }
            else  changes[i]["history"] = null;
        }

        setChanges(changes);
    }

    const getChanges = () => {
        return axios.get("http://localhost:8080/api/pending-changes", {
            headers: {
                'Authorization': authHeader().Authorization
            }
        }).then((response) => {
            getAllRequestsFun(response.data);
        }).catch(error => console.error("${error}"));
    }

    useEffect(() => {
        getChanges();
    }, []);


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
    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }

    const priorityBodyTemplate = (rowData) => {
        const priority = rowData.priority;
        let color = 'new';
        if (priority === 'PENDING') color = 'new';
        else if (priority === 'STANDARD' ||priority === 'LOW') color = 'qualified';
        else if (priority === 'URGENT' || priority === 'HIGH') color = 'unqualified';
        else if (priority === 'NORMAL' || priority === 'MEDIUM') color = 'negotiation';
        return <span className={`customer-badge status-${color}`}>{rowData.priority}</span>;
    }

    /*   const initFilters1 = () => {
           setFilters1({
               'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
               'name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
               'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
               'representative': { value: null, matchMode: FilterMatchMode.IN },
               'date': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
               'balance': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
               'status': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
               'activity': { value: null, matchMode: FilterMatchMode.BETWEEN },
               'verified': { value: null, matchMode: FilterMatchMode.EQUALS }
           });
       }*/


    const dateBodyTemplateCreated = (rowData) => {
        return formatDate(rowData.created);
    }

    const dateBodyTemplateUpdated = (rowData) => {
        return formatDate(rowData.updated);
    }

    const statusBodyTemplate = (rowData) => {
        const status = rowData.status;
        let color = 'new';
        if (status === 'PENDING') color = 'new';
        else if (status === 'RESOLVED') color = 'qualified';
        else if (status === 'CLOSED' || status === 'CLOSED') color = 'unqualified';
        else if (status === 'REVIEWING' || status === 'PLANNING') color = 'proposal';
        else if (status === 'OPEN') color = 'renewal';
        else if (status === 'IN PROGRESS') color = 'negotiation';

        return <span className={`customer-badge status-${color}`}>{rowData.status}</span>;
    }

    async function handleApprove(event) {
        event.preventDefault();
        var ok = true;
        if (descriptionValue.trim().length === 0) {
            setIsDescriptionOk(false);
            ok = false;
        }
        if (!ok) return;

        var urlChange = 'http://localhost:8080/api/user/' + currentUser.id + '/change/' + changeId + '/approve';
        await axios.put(urlChange, {
            description: descriptionValue.trim(),
        }, {
            headers: {
                'Authorization': authHeader().Authorization
            }
        })
            .then(res => {
                setChanges(changes.filter(item => item.id !== changeId));
                setDisplayApproveDialog(false);
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

    async function handleReject(event) {
        event.preventDefault();
        var ok = true;
        if (descriptionValue.trim().length === 0) {
            setIsDescriptionOk(false);
            ok = false;
        }
        if (!ok) return;

        var urlChange = 'http://localhost:8080/api/user/' + currentUser.id + '/change/' + changeId + '/reject';
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

    const approveDialogFooter = (
        <>
            <Button type="button" label="Confirm" icon="pi pi-check" onClick={handleApprove} className="p-button-text" autoFocus />
            <Button type="button" label="Cancel" icon="pi pi-times" onClick={() => setDisplayApproveDialog(false)} className="p-button-text" />
        </>
    );

    const rejectDialogFooter = (
        <>
            <Button type="button" label="Confirm" icon="pi pi-check" onClick={handleReject} className="p-button-text" />
            <Button type="button" label="Cancel" icon="pi pi-times" onClick={() => setDisplayRejectDialog(false)} className="p-button-text" autoFocus />
        </>
    );

    const changeDescription = (e) => {
        e.preventDefault();
        setDescriptionValue(e.target.value);
        if (e.target.value.trim().length == 0) setIsDescriptionOk(false);
        else setIsDescriptionOk(true);
    }

    const openBodyTemplate = (rowData) => {
        function showApproveDialog() {
            setChangeId(rowData.id);
            setDisplayApproveDialog(true);
        }

        function showRejectDialog() {
            setChangeId(rowData.id);
            setDisplayRejectDialog(true);
        }
        return <div><Button icon="pi pi-check" className="p-button-rounded p-button-success mr-2 mb-2" onClick={showApproveDialog} />
            <Button icon="pi pi-times" className="p-button-rounded p-button-danger mr-2 mb-2" onClick={showRejectDialog} />
            <Dialog header="Please enter reasons for approving change:" visible={displayApproveDialog} style={{ width: '30vw' }} modal footer={approveDialogFooter} onHide={() => setDisplayApproveDialog(false)}>
                <InputTextarea placeholder="Description" id='description' name='description' value={descriptionValue} maxLength={275} className={isDescriptionOk ? "" : "p-invalid"}
                    autoResize rows="6" cols="60" aria-describedby="description-help" onChange={changeDescription} />
                {isDescriptionOk ? ("") : (<small id="description-help" className="p-error">Description is mandatory!</small>)}
            </Dialog>
            <Dialog header="Please enter reasons for rejecting change:" visible={displayRejectDialog} style={{ width: '30vw' }} modal footer={rejectDialogFooter} onHide={() => setDisplayRejectDialog(false)}>
                <InputTextarea placeholder="Description" id='description' name='description' value={descriptionValue} maxLength={275} className={isDescriptionOk ? "" : "p-invalid"}
                    autoResize rows="6" cols="60" aria-describedby="description-help" onChange={changeDescription} />
                {isDescriptionOk ? ("") : (<small id="description-help" className="p-error">Description is mandatory!</small>)}
            </Dialog>
        </div>;
    }

    const expandAll = () => {
        let _expandedRows = {};
        if (changes.length !== 0) {
            changes.forEach(p => _expandedRows[`${p.id}`] = true);
            console.log(reports);
            setExpandedRows(_expandedRows);
        }
    }

    const collapseAll = () => {
        setExpandedRows(null);
    }


    const rowExpansionTemplate = (data) => {
        return (
            <div className="orders-subtable">
                <h5>Related requests</h5>
                <DataTable value={data.history} responsiveLayout="scroll" emptyMessage="No requests found.">
                    <Column field="description" header="Description" sortable></Column>
                    <Column field="reported.username" header="Reported by" sortable></Column>
                    <Column field="created" header="Time created" body={dateBodyTemplateCreated} sortable></Column>
                    <Column field="status" header="Status" body={statusBodyTemplate} sortable></Column>
                    <Column field="priority" body={priorityBodyTemplate} header="Priority" sortable></Column>
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
                    <h5>Pending changes</h5>
                    <DataTable value={changes} expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)} responsiveLayout="scroll"
                        rowExpansionTemplate={rowExpansionTemplate} dataKey="id" header={header}>
                        <Column expander style={{ width: '3em' }} />
                        <Column field="subject" header="Subject" sortable />
                        <Column field="description" header="Description" sortable />
                        <Column field="group.description" header="Group" sortable />
                        <Column field="priority" header="Priority" sortable body={priorityBodyTemplate} />
                        <Column field="category" header="Category" sortable />
                        <Column field="reporter.firstName" header="Reported by" sortable />
                        <Column field="created" header="Time created" sortable body={dateBodyTemplateCreated} />
                        <Column bodyClassName="text-center" header="Approve/Reject" style={{ minWidth: '8rem' }} body={openBodyTemplate} />
                    </DataTable>
                </div>
            </div>
        </div>
    );
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(PendingChanges, comparisonFn);
