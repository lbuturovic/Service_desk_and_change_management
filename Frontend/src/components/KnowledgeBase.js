import React, {useState, useEffect} from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import axios from 'axios';
import authHeader from '../service/security/auth-header';
import { useHistory } from 'react-router-dom';
import { FilterMatchMode, FilterOperator } from 'primereact/api';

const KnowledgeBase = () => {
    const [articles, setArticles] = useState(null);
    const [filters1, setFilters1] = useState(null);
    const [loading1, setLoading1] = useState(true);
    const [globalFilterValue1, setGlobalFilterValue1] = useState('');
    
    const onGlobalFilterChange1 = (e) => {
        const value = e.target.value;
        let _filters1 = { ...filters1 };
        _filters1['global'].value = value;

        setFilters1(_filters1);
        setGlobalFilterValue1(value);
    }
   

    const getAllArticles = () => {
        return axios.get("http://localhost:8080/api/article/", {
          headers: {
            'Authorization': authHeader().Authorization
          }
        }).then((response) => {
            setArticles(response.data);
            console.log(articles);
          }).catch(error => console.error("${error}"));
        }
    

    useEffect(() => {
        setLoading1(false);

        getAllArticles();

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
        setGlobalFilterValue1('');
    }

    return (
        <div className="grid table-demo">
            <div className="col-12">
                <div className="card">
                <h4>Search Knowledge Base</h4>
                <div className="col-12 mb-2 lg:col-4 lg:mb-0">
                            <span className="p-input-icon-right">
                                <InputText type="text" value={globalFilterValue1} placeholder="Search" onChange={onGlobalFilterChange1} />
                                <i className="pi pi-search" />
                            </span>
                </div>
                    <h2 style={{textAlign: "center"}}>Articles</h2>
                    <DataTable value={articles} paginator className="p-datatable-gridlines" showGridlines rows={10}
                        dataKey="id" filters={filters1} filterDisplay="menu" loading={loading1} responsiveLayout="scroll"
                          emptyMessage="No articles found.">
                        <Column field="title" header="Title" filter filterPlaceholder="Search by title" style={{ minWidth: '12rem' }} />
                        <Column field="created.username" header="Author" filter filterPlaceholder="Search by reported" style={{ minWidth: '12rem' }} />
                        <Column field="description" header="Description" filter filterPlaceholder="Search by tags" style={{ minWidth: '12rem' }} />
                        <Column field="taggs" header="Tags" filter filterPlaceholder="Search by tags" style={{ minWidth: '12rem' }} />
                    </DataTable>
                </div>
            </div>
        </div>
    );
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(KnowledgeBase, comparisonFn);

