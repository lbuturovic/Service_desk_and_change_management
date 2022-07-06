import React, { useState, useEffect, useCallback } from 'react';
import { classNames } from 'primereact/utils';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
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
import { Dialog } from 'primereact/dialog';


const Users = () => {
    const [users, setUsers] = useState(null);
    const [filters1, setFilters1] = useState(null);
    const [loading1, setLoading1] = useState(true);
    const [loading2, setLoading2] = useState(true);
    const [overlayMenuActive, setOverlayMenuActive] = useState(false);
    const [mobileMenuActive, setMobileMenuActive] = useState(false);
    const [displayConfirmation2, setDisplayConfirmation2] = useState(false);

    const history = useHistory();

    const statuses = [
        'unqualified', 'qualified', 'new', 'negotiation', 'renewal', 'proposal'
    ];


    const categories = [
        'Problem', 'Error', 'Question'
    ];

    const priorities = [
        'low', 'heigh', 'medium'
    ];

    const requestService = new RequestService();

    const showAlert = () => {
        console.log("vildana")
        setDisplayConfirmation2(false);
         getAllUsers();
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

    const getAllUsers = () => {
        return axios.get("http://localhost:8080/api/users", {
          headers: {
            'Authorization': authHeader().Authorization
          }
        }).then((response) => {
            setUsers(response.data);
            console.log(users);
          }).catch(error => console.error("${error}"));
        }
    

    useEffect(() => {
        setLoading1(false);

        getAllUsers();

        initFilters1();
    }, []); 


    

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


    



    const statusItemTemplate = (option) => {
        return <span className={`customer-badge status-${option}`}>{option}</span>;
    }

    const priorityItemTemplate = (option) => {
        return <span className={`customer-badge priority-${option}`}>{option}</span>;
    }

    
    const openBodyTemplate = (rowData) => {
        function editButtonClicked (){
            let id = "?id=" + rowData.id;
            history.push({pathname:'/edit-user', search: id });
        }
        function deleteButtonClicked (){
            let id = rowData.id;
            return axios.delete("http://localhost:8080/api/users/" + id, {
                headers: {
                    'Authorization': authHeader().Authorization
                }
                }).then(() => {
                    setDisplayConfirmation2(true)

                }).catch(error => console.error("${error}"));
        }
        return <div><Button label="Edit" className="p-button-raised p-button-info mr-2 mb-2" onClick={editButtonClicked}/>
        <Button label="Delete" className="p-button-raised p-button-info mr-2 mb-2" icon = "pi pi-trash" onClick={deleteButtonClicked}/>
        <Dialog header="User is deleted!" visible={displayConfirmation2} onHide={() => {setDisplayConfirmation2(false)}} style={{ width: '350px' }} modal footer={confirmationDialogFooter2}>
            <div className="flex align-items-center justify-content-center">
                <i className="pi pi-check-circle mr-3" style={{ fontSize: '2rem' }} />
            </div>
        </Dialog>   
        </div>;
    }

    function openNewUsser(event) {
        history.push('/create-user');
      };
      
    return (
        <div className="grid table-demo">
            <Button label="New user" className="mr-2 mb-2" onClick={openNewUsser}></Button>
            <div className="col-12">
                <div className="card">
                    <h2 style={{textAlign: "center"}}>Users</h2>
                    <DataTable value={users} paginator className="p-datatable-gridlines" showGridlines rows={10}
                        dataKey="id" filters={filters1} filterDisplay="menu" loading={loading1} responsiveLayout="scroll"
                          emptyMessage="No users found.">
                        <Column field="username" header="Username" style={{ minWidth: '12rem' }} />
                        <Column field="firstName" header="First Name" style={{ minWidth: '12rem' }} />
                        <Column field="lastName" header="LastName" style={{ minWidth: '10rem' }}/>
                        <Column field="email" header="Email" style={{ minWidth: '12rem' }}/>
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

export default React.memo(Users, comparisonFn);