import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { Checkbox } from 'primereact/checkbox';
import { RequestService } from '../service/RequestService';
import axios from 'axios';
import authHeader from '../service/security/auth-header';
import { useHistory } from 'react-router-dom';
import AuthService from '../service/security/auth.service';


const ShowGroups = () => {
    const [requests, setRequests] = useState(null);
    const [filters1, setFilters1] = useState(null);
    const [loading1, setLoading1] = useState(true);
    const [selectedRequests, setSelectedRequests] = useState(null);
    const [overlayMenuActive, setOverlayMenuActive] = useState(false);
    const [mobileMenuActive, setMobileMenuActive] = useState(false);
    const [descriptionValue, setDescriptionValue] = useState('');
    const [isDescriptionOk, setIsDescriptionOk] = useState(true);
    const [showAssignErrorDialog, setShowAssignErrorDialog] = useState(false);
    const [displayConfirmation, setDisplayConfirmation] = useState(false);
    const [displayConfirmation2, setDisplayConfirmation2] = useState(false);
    const [groupValue, setGroupValue] = useState('-1');
    const [allGroups, setAllGroups] = useState('');
    const urlGroup = "http://localhost:8080/api/groups";
    const currentUser = AuthService.getCurrentUser();
    const form = useRef(null);

    const getAllGroups = () => {
        axios.get(urlGroup, {
            headers: {
                'Authorization': authHeader().Authorization
            }
        }).then((response) => {
            var groups = response.data;
            //groups.unshift({ description: 'Without group', id: '-1' })
            setAllGroups(groups);
            console.log(allGroups);
        }).catch(error => console.error("${error}"));
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

                var groups = allGroups;
                groups.unshift({ description: descriptionValue, id: res.data.id })
                setAllGroups(groups);
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

    async function handleAssign(event) {
        event.preventDefault();
        // console.log(authHeader()); 
        // console.log(allGroups);
        if (groupValue === '-1' || selectedRequests===null || selectedRequests.length === 0) {
            setShowAssignErrorDialog(true);
            return;
        }
        for (let i = 0; i < selectedRequests.length; i++) {
            await axios.put("http://localhost:8080/api/request/" + selectedRequests[i].id + "/assign-group/" + groupValue, {

            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authHeader().Authorization
                }
            })
                .then(res => {
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
        await getAllRequests();
        setSelectedRequests(null);
    }


    const statuses = [
        'unqualified', 'qualified', 'new', 'negotiation', 'renewal', 'proposal'
    ];

    const mapStatus = {

    }

    const categories = [
        'Problem', 'Error', 'Question'
    ];

    const priorities = [
        'low', 'heigh', 'medium'
    ];


    const getAllRequests = () => {
        return axios.get("http://localhost:8080/api/request/no-group", {
            headers: {
                'Authorization': authHeader().Authorization
            }
        }).then((response) => {
            setRequests(response.data);
            console.log(requests);
        }).catch(error => console.error("${error}"));
    }


    useEffect(() => {
        setLoading1(false);

        getAllGroups();

        getAllRequests();

        initFilters1();
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

    const initFilters1 = () => {
        setFilters1({
            'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
            'name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'reportedBy': { value: null, matchMode: FilterMatchMode.IN },
            'date': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            'status': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            'category': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            'approved': { value: null, matchMode: FilterMatchMode.EQUALS },
            'priority': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
        });
    }


    const dateFilterTemplate = (options) => {
        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />
    }

    const categoryBodyTemplate = (rowData) => {
        return <span>{rowData.category}</span>;
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

    const priorityBodyTemplate = (rowData) => {
        const priority = rowData.priority;
        let color = 'new';
        if (priority === 'PENDING') color = 'new';
        else if (priority === 'LOW') color = 'qualified';
        else if (priority === 'URGENT' || priority === 'CLOSED') color = 'unqualified';
        else if (priority === 'MEDIUM') color = 'negotiation';
        else if (priority === 'HIGH') color = 'proposal';
        return <span className={`customer-badge status-${color}`}>{rowData.priority}</span>;
    }

    const priorityFilterTemplate = (options) => {
        return <Dropdown value={options.value} options={priorities} onChange={(e) => options.filterCallback(e.value, options.index)} itemTemplate={priorityItemTemplate} placeholder="Select a Status" className="p-column-filter" showClear />;
    }

    const statusFilterTemplate = (options) => {
        return <Dropdown value={options.value} options={statuses} onChange={(e) => options.filterCallback(e.value, options.index)} itemTemplate={statusItemTemplate} placeholder="Select a Status" className="p-column-filter" showClear />;
    }

    const categoryFilterTemplate = (options) => {
        return <Dropdown value={options.value} options={categories} onChange={(e) => options.filterCallback(e.value, options.index)} itemTemplate={categoryItemTemplate} placeholder="Select a Category" className="p-column-filter" showClear />;
    }

    const statusItemTemplate = (option) => {
        return <span className={`customer-badge status-${option}`}>{option}</span>;
    }

    const priorityItemTemplate = (option) => {
        return <span className={`customer-badge priority-${option}`}>{option}</span>;
    }

    const categoryItemTemplate = (option) => {
        return <span>{option}</span>;
    }


    useEffect(() => {
    }, []);


    const dateBodyTemplateCreated = (rowData) => {
        return formatDate(rowData.created);
    }

    return (
        <div className="grid table-demo">
            <div className="col-12">
                <div className="card">

                    <h2 style={{ textAlign: "center" }}>Requests</h2>
                    <DataTable value={requests} paginator className="p-datatable-gridlines" showGridlines rows={10}
                        dataKey="id" filters={filters1} filterDisplay="menu" loading={loading1} responsiveLayout="scroll"
                        emptyMessage="No requests found." selection={selectedRequests} onSelectionChange={(e) => setSelectedRequests(e.value)} >
                        <Column field="subject" header="Subject" filter filterPlaceholder="Search by subject" style={{ minWidth: '12rem' }} />
                        <Column field="reported.username" header="Reported by" filter filterPlaceholder="Search by reported" style={{ minWidth: '12rem' }} />
                        <Column field="created" header="Created" filterField="created" dataType="date" style={{ minWidth: '10rem' }} body={dateBodyTemplateCreated}
                            filter filterElement={dateFilterTemplate} />
                        <Column field="status" header="Status" filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} body={statusBodyTemplate} filter filterElement={statusFilterTemplate} />
                        <Column field="category" header="Category" filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} body={categoryBodyTemplate} filter filterElement={categoryFilterTemplate} />
                        <Column field="priority" header="Priority" filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} body={priorityBodyTemplate} filter filterElement={priorityFilterTemplate} />
                        <Column selectionMode="multiple" />
                    </DataTable>
                </div>
            </div>
            <div className="card">
                <h5>Select group</h5>
                <div className='formgroup-inline'>

                    <span className="p-float-label">
                        <div className="field">
                            <InputText placeholder="Your title" id='description' name='description' value={descriptionValue} maxLength={275} className={isDescriptionOk ? "" : "p-invalid"}
                                onChange={changeDescription} autoResize rows="5" cols="30" aria-describedby="description-help" />
                        </div>
                    </span>

                    <h5> </h5>
                    <div style={{ display: "flex" }}>
                        <Button label="Create" onClick={handleSubmit} className="mr-2 mb-2"></Button>
                        <Dialog header="Group is saved!" visible={displayConfirmation2} onHide={() => setDisplayConfirmation2(false)} style={{ width: '350px' }} modal footer={confirmationDialogFooter2}>
                            <div className="flex align-items-center justify-content-center">
                                <i className="pi pi-check-circle mr-3" style={{ fontSize: '2rem' }} />
                            </div>
                        </Dialog>
                    </div>

                    <div className="field">
                        <Dropdown value={groupValue} onChange={(e) => setGroupValue(e.value)} options={allGroups} optionLabel="description" optionValue='id' name='group' placeholder='Select group' />
                    </div>
                    <Button label="Assign" onClick={handleAssign} className="mr-2 mb-2"></Button>
                </div>
            </div>
        </div>


    );
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(ShowGroups, comparisonFn);