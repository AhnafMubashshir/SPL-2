import { Button, Empty } from 'antd';
import { useState } from 'react';
import LogOut from './LogOut';

const Error = () => {
    const [logOut, setLogOut] = useState(false);

    function handleLogin () {
        setLogOut(true);
    }

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}
        >
            <Empty
                description={
                    <span>
                        Access Denied
                    </span>
                }
            >
                <Button type="primary" onClick={handleLogin}>back to login</Button>
            </Empty>

            {
                logOut && 
                <LogOut />
            }
        </div>
    )
}

export default Error;
