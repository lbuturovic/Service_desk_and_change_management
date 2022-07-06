import React, { Component, useState, useEffect, useRef } from 'react';
import PrimeReact from 'primereact/api';
import classNames from 'classnames';

export const Wrapper=()=> {
const [layoutMode] = useState('static');
const [layoutColorMode] = useState('light')
const [inputStyle] = useState('outlined');
const [ripple] = useState(true);
const copyTooltipRef = useRef();
PrimeReact.ripple = true;
const wrapperClass = classNames('layout-wrapper', {
  'layout-overlay': layoutMode === 'overlay',
  'layout-static': layoutMode === 'static',
  'p-input-filled': inputStyle === 'filled',
  'p-ripple-disabled': ripple === false,
  'layout-theme-light': layoutColorMode === 'light'
});

function getWrapperClass(){
    return wrapperClass;
}
return wrapperClass;
}

const comparisonFn = function (prevProps, nextProps) {
    return (prevProps.location.pathname === nextProps.location.pathname) && (prevProps.colorMode === nextProps.colorMode);
};

export default React.memo(Wrapper, comparisonFn);