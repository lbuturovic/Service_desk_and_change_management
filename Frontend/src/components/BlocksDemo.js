import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Chip } from 'primereact/chip';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';
import BlockViewer from '../BlockViewer';

const BlocksDemo = () => {
    const [checked, setChecked] = useState(false);

    const styles = {
        
        marginLeft: '15%',
        marginRight: 'auto',
        marginTop: '10%'
      };

    const block8 = `
<div className="surface-card p-4 shadow-2 border-round w-full lg:w-6">
    <div className="text-center mb-5">
        <img src="images/blocks/logos/hyper.svg" alt="hyper" height="50" className="mb-3" />
        <div className="text-900 text-3xl font-medium mb-3">Welcome Back</div>
        <span className="text-600 font-medium line-height-3">Don't have an account?</span>
        <a className="font-medium no-underline ml-2 text-blue-500 cursor-pointer">Create today!</a>
    </div>

    <div>
        <label htmlFor="email1" className="block text-900 font-medium mb-2">Email</label>
        <InputText id="email1" type="text" className="w-full mb-3" />

        <label htmlFor="password1" className="block text-900 font-medium mb-2">Password</label>
        <InputText id="password1" type="password" className="w-full mb-3" />

        <div className="flex align-items-center justify-content-between mb-6">
            <div className="flex align-items-center">
                <Checkbox inputId="rememberme1" binary className="mr-2" onChange={e => setChecked(e.checked)} checked={checked} />
                <label htmlFor="rememberme1">Remember me</label>
            </div>
            <a className="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">Forgot password?</a>
        </div>

        <Button label="Sign In" icon="pi pi-user" className="w-full" />
    </div>
</div>
    `;

    return (
        <>

            
                <div className="surface-card p-4 shadow-2 border-round w-full lg:w-6"  style={styles}>
                    <div className="text-center mb-5">
                        <img src="images/blocks/logos/hyper.svg" alt="hyper" height="50" className="mb-3" />
                        <div className="text-900 text-3xl font-medium mb-3">Welcome Back</div>
                    </div>

                    <div>
                        <label htmlFor="email1" className="block text-900 font-medium mb-2">Username</label>
                        <InputText id="email1" type="text" className="w-full mb-3" />

                        <label htmlFor="password1" className="block text-900 font-medium mb-2">Password</label>
                        <InputText id="password1" type="password" className="w-full mb-3" />

                        <div className="flex align-items-center justify-content-between mb-6">
                            <div className="flex align-items-center">
                            </div>
                            
                        </div>

                        <Button label="Sign In" icon="pi pi-user" className="w-full" />
                    </div>
                </div>
            
        </>
    )
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(BlocksDemo, comparisonFn);