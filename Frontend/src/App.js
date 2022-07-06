import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Route, useLocation, useHistory } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import { AppTopbar } from './AppTopbar';
import { AppFooter } from './AppFooter';
import { AppMenu } from './AppMenu';
import { AppConfig } from './AppConfig';
//import background from "../public/images/themes/background";

import Dashboard from './components/Dashboard';
import ButtonDemo from './components/ButtonDemo';
import ChartDemo from './components/ChartDemo';
import Documentation from './components/Documentation';
import FileDemo from './components/FileDemo';
import FloatLabelDemo from './components/FloatLabelDemo';
import FormLayoutDemo from './components/FormLayoutDemo';
import InputDemo from './components/InputDemo';
import ListDemo from './components/ListDemo';
import MenuDemo from './components/MenuDemo';
import MessagesDemo from './components/MessagesDemo';
import MiscDemo from './components/MiscDemo';
import OverlayDemo from './components/OverlayDemo';
import MediaDemo from './components/MediaDemo';
import PanelDemo from './components/PanelDemo';
import TableDemo from './components/TableDemo';
import TreeDemo from './components/TreeDemo';
import InvalidStateDemo from './components/InvalidStateDemo';
import BlocksDemo from './components/BlocksDemo';
import IconsDemo from './components/IconsDemo';

//dodatni importi, ako budete nesto dodavali odmah pushajte
import CreateRequest from './components/CreateRequest';
import ShowRequests from './components/ShowRequests';
import EditRequest from './components/EditRequest';
import KnowledgeBase from './components/KnowledgeBase';
import ResolvedRequest from './components/ResolvedRequest';
import ShowChanges from './components/ShowChanges';
import EditChange from './components/EditChange';
import CreateChange from './components/CreateChange';
import CreateArticle from './components/CreateArticle';
import ChangeReport from './components/ChangeReport';
import AddGroup from './components/AddGroup';
import PendingChanges from './components/PendingChanges';
import Users from './components/Users';
import Login from './Login';
import Registration from './components/Registration';
import AuthService from './service/security/auth.service';
import ClientRequests from './components/ClientRequests';
import DevRequests from './components/DevRequests';
import DevEdit from './components/DevEdit';
import Crud from './pages/Crud';
import EmptyPage from './pages/EmptyPage';
import TimelineDemo from './pages/TimelineDemo';

import PrimeReact from 'primereact/api';
import { Tooltip } from 'primereact/tooltip';

import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'prismjs/themes/prism-coy.css';
import './assets/demo/flags/flags.css';
import './assets/demo/Demos.scss';
import './assets/layout/layout.scss';
import './App.scss';
import EditUser from './components/EditUser';
import ClosedChanges from './components/ClosedChanges';
import ActiveChanges from './components/ActiveChanges';
import ShowGroups from './components/ShowGroups';
import authService from './service/security/auth.service';

const App = (props) => {
    const [layoutMode, setLayoutMode] = useState('static');
    const [layoutColorMode, setLayoutColorMode] = useState('light')
    const [inputStyle, setInputStyle] = useState('outlined');
    const [ripple, setRipple] = useState(true);
    const [staticMenuInactive, setStaticMenuInactive] = useState(false);
    const [overlayMenuActive, setOverlayMenuActive] = useState(false);
    const [mobileMenuActive, setMobileMenuActive] = useState(false);
    const [mobileTopbarMenuActive, setMobileTopbarMenuActive] = useState(false);
    const copyTooltipRef = useRef();
    const currentUser = AuthService.getCurrentUser();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isApprover, setIsApprover] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [isDev, setIsDev] = useState(false);
    const [isSd, setIsSd] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const location = useLocation();
    const history = useHistory();

    const [showMenu, setShowMenu] = useState(true);

    PrimeReact.ripple = true;

    let menuClick = false;
    let mobileTopbarMenuClick = false;

    useEffect(() => {
        if (mobileMenuActive) {
            addClass(document.body, "body-overflow-hidden");
        } else {
            removeClass(document.body, "body-overflow-hidden");
        }
    }, [mobileMenuActive]);

    useEffect(() => {
        copyTooltipRef && copyTooltipRef.current && copyTooltipRef.current.updateTargetEvents();
    }, [location]);

    useEffect(() => {
        if (currentUser && currentUser.roles) {
            setLoggedIn(true);
            let roles = currentUser.roles;
            if (roles.includes("ROLE_CLIENT")) setIsClient(true);
            else if (roles.includes("ROLE_SERVICE")) setIsSd(true);
            else if (roles.includes("ROLE_DEV")) setIsDev(true);
            else if (roles.includes("ROLE_APPROVER")) setIsApprover(true);
            else setIsAdmin(true);
        }
        else setLoggedIn(false);

    }, []);


    const onInputStyleChange = (inputStyle) => {
        setInputStyle(inputStyle);
    }

    const onRipple = (e) => {
        PrimeReact.ripple = e.value;
        setRipple(e.value)
    }

    const onLayoutModeChange = (mode) => {
        setLayoutMode(mode)
    }

    const onColorModeChange = (mode) => {
        setLayoutColorMode(mode)
    }

    const onWrapperClick = (event) => {
        if (!menuClick) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }

        if (!mobileTopbarMenuClick) {
            setMobileTopbarMenuActive(false);
        }

        mobileTopbarMenuClick = false;
        menuClick = false;
    }

    const onToggleMenuClick = (event) => {
        menuClick = true;

        if (isDesktop()) {
            if (layoutMode === 'overlay') {
                if (mobileMenuActive === true) {
                    setOverlayMenuActive(true);
                }

                setOverlayMenuActive((prevState) => !prevState);
                setMobileMenuActive(false);
            }
            else if (layoutMode === 'static') {
                setStaticMenuInactive((prevState) => !prevState);
            }
        }
        else {
            setMobileMenuActive((prevState) => !prevState);
        }

        event.preventDefault();
    }

    const onSidebarClick = () => {
        menuClick = true;
    }

    const onMobileTopbarMenuClick = (event) => {
        mobileTopbarMenuClick = true;

        setMobileTopbarMenuActive((prevState) => !prevState);
        event.preventDefault();
    }

    const onMobileSubTopbarMenuClick = (event) => {
        mobileTopbarMenuClick = true;

        event.preventDefault();
        authService.logout();
        history.push("/login");
    }

    const onMenuItemClick = (event) => {
        if (!event.item.items) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }
    }
    const isDesktop = () => {
        return window.innerWidth >= 992;
    }

    const clientMenuitems = [
        {
            label: 'Request',
            items: [
                {
                    label: 'New',
                    icon: 'pi pi-fw pi-plus',
                    to: '/add-request'
                },
                {
                    label: 'My requests',
                    icon: 'pi pi-fw pi-list',
                    to: '/client-requests'
                }

            ]
        },
        {
            label: 'Knowledge base',
            items: [
                {
                    label: 'Search',
                    icon: 'pi pi-fw pi-search',
                    to: '/knowledge-base'
                }
            ]
        }
    ];

    const sdMenuitems = [
        {
            label: 'Request',
            items: [
                {
                    label: 'New',
                    icon: 'pi pi-fw pi-plus',
                    to: '/add-request'
                },
                {
                    label: 'All requests',
                    icon: 'pi pi-fw pi-list',
                    to: '/show-requests'
                },
                {
                    label: 'Group requests',
                    icon: 'pi pi-fw pi-plus',
                    to: '/create-groups'
                }

            ]
        },
        {
            label: 'Knowledge base',
            items: [
                {
                    label: 'Create article',
                    icon: 'pi pi-fw pi-plus',
                    to: '/create-article'
                },
                {
                    label: 'Search',
                    icon: 'pi pi-fw pi-search',
                    to: '/knowledge-base'
                }
            ]
        }
    ];

    const appMenuitems = [
        {
            label: 'Change',
            items: [
                {
                    label: 'New',
                    icon: 'pi pi-fw pi-plus',
                    to: '/create-change'
                },
                {
                    label: 'All changes',
                    icon: 'pi pi-fw pi-list',
                    to: '/show-changes'
                },
                {
                    label: 'Pending changes',
                    icon: 'pi pi-fw pi-list',
                    to: '/pending-changes'
                },
                {
                    label: 'Active changes',
                    icon: 'pi pi-fw pi-list',
                    to: '/active-changes'
                },
                {
                    label: 'Closed changes',
                    icon: 'pi pi-fw pi-list',
                    to: '/closed-changes'
                }
            ]
        },
        {
            label: 'Knowledge base',
            items: [
                {
                    label: 'Create article',
                    icon: 'pi pi-fw pi-plus',
                    to: '/create-article'
                },
                {
                    label: 'Search',
                    icon: 'pi pi-fw pi-search',
                    to: '/knowledge-base'
                }
            ]
        }
    ];

    const devMenuitems = [
        {
            label: 'Request',
            items: [
                {
                    label: 'New',
                    icon: 'pi pi-fw pi-plus',
                    to: '/add-request'
                },
                {
                    label: 'My requests',
                    icon: 'pi pi-fw pi-list',
                    to: '/dev-requests'
                },
                {
                    label: 'Group requests',
                    icon: 'pi pi-fw pi-plus',
                    to: '/create-groups'
                }

            ]
        },
        {
            label: 'Change',
            items: [

                {
                    label: 'Active changes',
                    icon: 'pi pi-fw pi-list',
                    to: '/active-changes'
                },
                {
                    label: 'Closed changes',
                    icon: 'pi pi-fw pi-list',
                    to: '/closed-changes'
                }
            ]
        }
    ];

    const adminMenuitems = [
        {
            label: 'Users',
            items: [

                {
                    label: 'Create',
                    icon: 'pi pi-fw pi-plus',
                    to: '/create-user'
                },
                {
                    label: 'All users',
                    icon: 'pi pi-fw pi-list',
                    to: '/users'
                }
            ]
        }
    ];

    const menuitems = [
        {
            label: 'Request',
            items: [
                {
                    label: 'New',
                    icon: 'pi pi-fw pi-plus',
                    to: '/add-request'
                },
                {
                    label: 'New group',
                    icon: 'pi pi-fw pi-plus',
                    to: '/add-group'
                },
                {
                    label: 'View',
                    icon: 'pi pi-fw pi-list',
                    to: '/show-requests'
                }
            ]
        },
        {
            label: 'Change',
            items: [
                {
                    label: 'New',
                    icon: 'pi pi-fw pi-plus',
                    to: '/create-change'
                },
                {
                    label: 'View',
                    icon: 'pi pi-fw pi-list',
                    to: '/show-changes'
                }
            ]
        },
        {
            label: 'Knowledge base',
            items: [
                {
                    label: 'Create article',
                    icon: 'pi pi-fw pi-plus',
                    to: '/create-article'
                },
                {
                    label: 'Search',
                    icon: 'pi pi-fw pi-search',
                    to: '/knowledge-base'
                }
            ]
        }
    ];

    const addClass = (element, className) => {
        if (element.classList)
            element.classList.add(className);
        else
            element.className += ' ' + className;
    }

    const removeClass = (element, className) => {
        if (element.classList)
            element.classList.remove(className);
        else
            element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }

    const wrapperClass = classNames('layout-wrapper', {
        'layout-overlay': layoutMode === 'overlay',
        'layout-static': layoutMode === 'static',
        'layout-static-sidebar-inactive': staticMenuInactive && layoutMode === 'static',
        'layout-overlay-sidebar-active': overlayMenuActive && layoutMode === 'overlay',
        'layout-mobile-sidebar-active': mobileMenuActive,
        'p-input-filled': inputStyle === 'filled',
        'p-ripple-disabled': ripple === false,
        'layout-theme-light': layoutColorMode === 'light'
    });

    return (

        <div className={wrapperClass} onClick={onWrapperClick}>
            {location.pathname !== '/login' && <div>
                <Tooltip ref={copyTooltipRef} target=".block-action-copy" position="bottom" content="Copied to clipboard" event="focus" />

                <AppTopbar onToggleMenuClick={onToggleMenuClick} layoutColorMode={layoutColorMode}
                    mobileTopbarMenuActive={mobileTopbarMenuActive} onMobileTopbarMenuClick={onMobileTopbarMenuClick} onMobileSubTopbarMenuClick={onMobileSubTopbarMenuClick} />
{showMenu && <div className="layout-sidebar" onClick={onSidebarClick}>
                 {currentUser && currentUser.roles && currentUser.roles.includes('ROLE_CLIENT') && <AppMenu model={clientMenuitems} onMenuItemClick={onMenuItemClick} layoutColorMode={layoutColorMode} />}
                 {currentUser && currentUser.roles && currentUser.roles.includes('ROLE_SERVICE') && <AppMenu model={sdMenuitems} onMenuItemClick={onMenuItemClick} layoutColorMode={layoutColorMode} />}
                 {currentUser && currentUser.roles && currentUser.roles.includes('ROLE_APPROVER') && <AppMenu model={appMenuitems} onMenuItemClick={onMenuItemClick} layoutColorMode={layoutColorMode} />}
                 {currentUser && currentUser.roles && currentUser.roles.includes('ROLE_DEV') && <AppMenu model={devMenuitems} onMenuItemClick={onMenuItemClick} layoutColorMode={layoutColorMode} />}
                 {currentUser && currentUser.roles && currentUser.roles.includes('ROLE_ADMIN') && <AppMenu model={adminMenuitems} onMenuItemClick={onMenuItemClick} layoutColorMode={layoutColorMode} />}
                </div>}
            </div>}


            <div className="layout-main-container">
                <div className="layout-main">
                    <Route path="/"/>
                    <Route path="/add-request" component={CreateRequest} />
                    <Route path="/show-requests" component={ShowRequests} />
                    <Route path="/edit-request" component={EditRequest} />
                    <Route path="/resolved-request" component={ResolvedRequest} />
                    <Route path="/create-article" component={CreateArticle} />
                    <Route path="/knowledge-base" component={KnowledgeBase} />
                    <Route path="/add-group" component={AddGroup} />
                    <Route path="/create-change" component={CreateChange} />
                    <Route path="/edit-change" component={EditChange} />
                    <Route path="/show-changes" component={ShowChanges} />
                    <Route path="/pending-changes" component={PendingChanges} />
                    <Route path="/closed-changes" component={ClosedChanges} />
                    <Route path="/active-changes" component={ActiveChanges} />
                    <Route path="/create-groups" component={ShowGroups} />
                    <Route path="/change-report" component={ChangeReport} />
                    <Route path="/login" component={Login}/>
                    <Route path="/signup" component={Registration} />
                    <Route path="/users" component={Users} />
                    <Route path="/edit-user" component={EditUser} />
                    <Route path="/create-user" component={Registration} />
                    <Route path="/client-requests" component={ClientRequests} />
                    <Route path="/dev-requests" component={DevRequests} />
                    <Route path="/edit-request-dev" component={DevEdit} />
                </div>
                <AppFooter layoutColorMode={layoutColorMode} />
            </div>

            <AppConfig rippleEffect={ripple} onRippleEffect={onRipple} inputStyle={inputStyle} onInputStyleChange={onInputStyleChange}
                layoutMode={layoutMode} onLayoutModeChange={onLayoutModeChange} layoutColorMode={layoutColorMode} onColorModeChange={onColorModeChange} />

            <CSSTransition classNames="layout-mask" timeout={{ enter: 200, exit: 200 }} in={mobileMenuActive} unmountOnExit>
                <div className="layout-mask p-component-overlay"></div>
            </CSSTransition>

        </div>


    );

}

export default App;