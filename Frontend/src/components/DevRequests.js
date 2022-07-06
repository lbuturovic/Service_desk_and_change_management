import React, { useState, useEffect, useCallback } from 'react';
import { classNames } from 'primereact/utils';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import { Slider } from 'primereact/slider';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { ToggleButton } from 'primereact/togglebutton';
import { Rating } from 'primereact/rating';
import { RequestService } from '../service/RequestService';
import App from '../App';
import EditRequest from './EditRequest';
import axios from 'axios';
import AuthService from '../service/security/auth.service';
import authHeader from '../service/security/auth-header';
import { useHistory } from 'react-router-dom';


const ShowRequests = () => {
    const [requests, setRequests] = useState(null);
    const [filters1, setFilters1] = useState(null);
    const [loading1, setLoading1] = useState(true);
    const [loading2, setLoading2] = useState(true);
    const [displayConfirmation2, setDisplayConfirmation2] = useState(false);
    const [overlayMenuActive, setOverlayMenuActive] = useState(false);
    const [mobileMenuActive, setMobileMenuActive] = useState(false);
    let history = useHistory();
    const currentUser = AuthService.getCurrentUser();

    const statuses = [
        'CLOSED', 'RESOLVED', 'PENDING', 'IN PROGRESS', 'OPEN'
    ];

    const mapStatus = {
        
    }

    const categories = [
        'INCIDENT', 'QUESTION', 'FEATURE_REQUEST', 'PROBLEM'
    ];

    const priorities = [
        'low', 'medium', 'high', 'urgent'
    ];

    const requestService = new RequestService();

    const getAllRequests = (id) => {
        return axios.get("http://localhost:8080/api/request/developer/"+id, {
          headers: {
            'Authorization': authHeader().Authorization
          }
        }).then((response) => {
            setRequests(response.data);
            console.log(requests);
          }).catch(error => console.error(`${error}`));
        }
    

    useEffect(() => {
        setLoading1(false);
        console.log(currentUser.id);
        getAllRequests(currentUser.id);

        initFilters1();
    }, []); 


    const getRequests = (data) => {
        return [...data || []].map(d => {
            d.date = new Date(d.date);
            return d;
        });
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

    
    const filterClearTemplate = (options) => {
        return <Button type="button" icon="pi pi-times" onClick={options.filterClearCallback} className="p-button-secondary"></Button>;
    }

    const filterApplyTemplate = (options) => {
        return <Button type="button" icon="pi pi-check" onClick={options.filterApplyCallback} className="p-button-success"></Button>
    }


    const dateBodyTemplate = (rowData) => {
        if(rowData)
        return rowData.created;
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

    const approvedBodyTemplate = (rowData) => {
        return <i className={classNames('pi', { 'text-green-500 pi-check-circle': rowData.approved, 'text-pink-500 pi-times-circle': !rowData.approved })}></i>;
    }

    const approvedFilterTemplate = (options) => {
        return <TriStateCheckbox value={options.value} onChange={(e) => options.filterCallback(e.value)} />
    }

    const showAlert = () => {
        setDisplayConfirmation2(false);
         getAllRequests()
    }
    const confirmationDialogFooter2 = (
        <>
          <div className="grid formgrid">
            <Button type="button" label="OK" onClick={showAlert} className="mr-2 mb-2" />
          </div>
        </>
      );
    useEffect(() => {
    }, []);



    const openBodyTemplate = (rowData) => {
        function editButtonClicked (){
            let id = "?id=" + rowData.id;
            history.push({pathname:'/edit-request-dev', search: id });
        }
        return <div><Button label="Edit" className="p-button-raised p-button-info mr-2 mb-2" onClick={editButtonClicked}/>       
        </div>;
    }

    const dateBodyTemplateCreated = (rowData) => {
        return formatDate(rowData.created);
    }

    return (
        <div className="grid table-demo">
            <div className="col-12">
                <div className="card">
                    <h2 style={{textAlign: "center"}}>Requests</h2>
                    <DataTable value={requests} paginator className="p-datatable-gridlines" showGridlines rows={10}
                        dataKey="id" filters={filters1} filterDisplay="menu" loading={loading1} responsiveLayout="scroll"
                          emptyMessage="No requests found.">
                        <Column field="subject" header="Subject" style={{ minWidth: '12rem' }} />
                        <Column field="reported.username" header="Reported by" style={{ minWidth: '12rem' }} />
                        <Column field="created" header="Created" dataType="date" style={{ minWidth: '10rem' }} body={dateBodyTemplateCreated} />
                        <Column field="status" header="Status" filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} body={statusBodyTemplate} filter filterElement={statusFilterTemplate} />
                        <Column field="category" header="Category" filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} body={categoryBodyTemplate} filter filterElement={categoryFilterTemplate} />
                        <Column field="priority" header="Priority" filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} body={priorityBodyTemplate} filter filterElement={priorityFilterTemplate} />
                        <Column bodyClassName="text-center" style={{ minWidth: '8rem' }} body={openBodyTemplate}/>
                    </DataTable>
                </div>
            </div>
        </div>
    );
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(ShowRequests, comparisonFn);