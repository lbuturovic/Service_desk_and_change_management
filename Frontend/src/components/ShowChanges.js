import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import axios from 'axios';
import authHeader from '../service/security/auth-header';
import { useHistory } from 'react-router-dom';
import authService from '../service/security/auth.service';

const ShowChanges = props => {
    const [changes, setChanges] = useState([]);
    const [reports, setReports] = useState(null);
    const [expandedRows, setExpandedRows] = useState(null);
    const [isApprover, setApprover] = useState(false);
    const currentUser = authService.getCurrentUser();


    let history = useHistory();


    const getAllReportsFun = (changes) => {
        for (let i = 0; i < changes.length; i++) {

            axios.get("http://localhost:8080/api/change/" + changes[i].id + "/reports", {
                headers: {
                    'Authorization': authHeader().Authorization
                }
            }).then((response) => {
                changes[i]["history"] = response.data;
            }).catch(error => console.error("${error}"));
            changes[i]["nameReporter"] = changes[i]["reporter"].firstName + " " + changes[i]["reporter"].lastName;
            if (changes[i]["approver"]!==null)
            changes[i]["nameApprover"] =  changes[i]["approver"].firstName + " " + changes[i]["approver"].lastName;
            else changes[i]["nameApprover"] = '/';
        }

        setChanges(changes);
    }

    const getChanges = () => {
        return axios.get("http://localhost:8080/api/changes", {
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
        //getAllReports();
        //initFilters1();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps


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
        else if (status === 'ACCEPTED') color = 'qualified';
        else if (status === 'REJECTED' || status === 'CLOSED') color = 'unqualified';
        else if (status === 'REVIEWING' || status === 'PLANNING') color = 'proposal';
        else if (status === 'IMPLEMENTING') color = 'renewal';
        else if (status === 'TESTING') color = 'negotiation';

        return <span className={`customer-badge status-${color}`}>{rowData.status}</span>;
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
                    <Column field="description" header="Description" sortable></Column>
                    <Column field="employee.firstName" header="Executer" sortable></Column>
                    <Column field="start" header="Start" sortable></Column>
                    <Column field="end" header="End" sortable></Column>
                    <Column field="status" header="Status" body={statusBodyTemplate} sortable></Column>
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
                    <h5>Changes</h5>
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

                    </DataTable>
                </div>
            </div>
        </div>
    );
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(ShowChanges, comparisonFn);
