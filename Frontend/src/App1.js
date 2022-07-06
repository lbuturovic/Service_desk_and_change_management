import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Route, useLocation } from 'react-router-dom';
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

const App1 = (props) => {
    const [layoutMode, setLayoutMode] = useState('static');
    const [layoutColorMode, setLayoutColorMode] = useState('light')
    const [inputStyle, setInputStyle] = useState('outlined');
    const [ripple, setRipple] = useState(true);
    const [staticMenuInactive, setStaticMenuInactive] = useState(false);
    const [overlayMenuActive, setOverlayMenuActive] = useState(false);
    const [mobileMenuActive, setMobileMenuActive] = useState(false);
    const [mobileTopbarMenuActive, setMobileTopbarMenuActive] = useState(false);
    const copyTooltipRef = useRef();
    const location = useLocation();

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
            <Tooltip ref={copyTooltipRef} target=".block-action-copy" position="bottom" content="Copied to clipboard" event="focus" />

            <AppTopbar onToggleMenuClick={onToggleMenuClick} layoutColorMode={layoutColorMode}
                mobileTopbarMenuActive={mobileTopbarMenuActive} onMobileTopbarMenuClick={onMobileTopbarMenuClick} onMobileSubTopbarMenuClick={onMobileSubTopbarMenuClick} />
            <div className="layout-sidebar" onClick={onSidebarClick}>
                <AppMenu model={menuitems} onMenuItemClick={onMenuItemClick} layoutColorMode={layoutColorMode} />
            </div>
            

            <div className="layout-main-container">
                <div className="layout-main">
                    <Route path="/" />
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
                    <Route path="/change-report" component={ChangeReport} />
                    <Route path="/login" component={BlocksDemo} />
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

export default App1;