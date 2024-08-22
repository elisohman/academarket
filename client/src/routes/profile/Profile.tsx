import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../contexts/UserContext';
import {useAuthContext} from '../../contexts/AuthContext';
import ArrowIcon from '../../style/icons/ArrowIcon';
import useAPI from '../../utils/network';
import PopupMessage from '../../components/popupMessage/PopupMessage';
import TextField from '../../components/textfield/TextField';
import Button from '../../components/button/Button';

const Profile: React.FC = () => {
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const {userInfo} = useUserContext();
    const {signOut} = useAuthContext();
    const sendRequest = useAPI();

    const [popupMessage, setPopupMessage] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessageColor, setPopupMessageColor] = useState('');

    const goBack = () => {
        navigate(-1)
    }

    const handleLogout = () => {
        signOut();
    }

    const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (currentPassword === '' || newPassword === '' || confirmPassword === '') {
            setPopupMessage('Please fill all fields');
            setPopupMessageColor('text-red-500');
            setShowPopup(true);
            return;
        }

        if (newPassword !== confirmPassword) {
            setPopupMessage('Passwords do not match');
            setPopupMessageColor('text-red-500');
            setShowPopup(true);
            return;
        }

        const data = {
            'old_password': currentPassword,
            'new_password': newPassword,
            'rpt_new_password': confirmPassword
        }
        
        const response = await sendRequest('/change_password/', 'PUT', data);
        if (response.status === 200) {
            console.log('Password changed successfully');
            setPopupMessage('Password changed successfully');
            setPopupMessageColor('text-green-500');
            setShowPopup(true);
        } else {
            console.log(response.data.error);
            setPopupMessage(response.data.error);
            setPopupMessageColor('text-red-500');
            setShowPopup(true);
        }
    };

    return (
        <div className="h-screen pt-10 bg-light-gray p-10 relative">
            <Button className="absolute top-4 left-4 p-2 rounded-full bg-light-gray hover:bg-gray-200 transition-all ease-in-out duration-300" onClick={goBack}>
                <ArrowIcon className={'h-6 w-6 transform rotate-90'} />
            </Button>

            <div className="text-center flex flex-col items-center">
                <h1 className="text-3xl font-semibold mb-2 text-secondary-color">{userInfo ? userInfo.username : "Loading..."}</h1>
                <p className="text-xl mb-2">Email:<span className="text-secondary-color"> {userInfo ? userInfo.email : "Loading..."}</span></p>
                <p className="text-xl mb-2">Balance:<span className="text-sky-400"> APE </span><span className="font-semibold text-sky-400">{userInfo ? userInfo.balance : "Loading..."}</span></p>
                <Button className="h-10 text-white bg-coral px-12 py-1 rounded-md font-medium mb-10 hover:bg-coral-darker transition-all ease-in-out duration 300" onClick={handleLogout}>Log out</Button>
            </div>


                <div 
                    className={"flex flex-col items-center text-center relative"}
                >
                    <h1 className="font-semibold text-xl mb-2">Change Password</h1>
                        <form
                            onSubmit={handlePasswordChange}
                            className="space-y-4"
                        >
                            <div>
                                <label className="block text-gray-700">Old Password</label>
                                <TextField inputClassName="h-10" id="old_password_input" type="password" placeholder="" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}/>
                            </div>
                            <div>
                                <label className="block text-gray-700">New Password</label>
                                <TextField inputClassName="h-10" id="new_password_input" type="password" placeholder="" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>
                            </div>
                            <div>
                                <label className="block text-gray-700">Repeat New Password</label>
                                <TextField inputClassName="h-10" id="rpt_new_password_input" type="password" placeholder="" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
                            </div>
                            <button
                                type="submit"
                                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200"
                            >
                                Update Password
                            </button>
                        </form>
                    <PopupMessage message={popupMessage} show={showPopup} onClose={() => setShowPopup(false)} classColor={popupMessageColor} className="bottom-0"/>
                </div>
            </div>
    );
};

export default Profile;