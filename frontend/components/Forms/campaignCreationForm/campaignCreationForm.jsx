import { useState, useEffect } from 'react';
import clsx from 'clsx';
import axios from 'axios';

import Input from '../FormElements/Input/input';
import TextArea from '../FormElements/Textarea/textArea';
import Dropdown from '../FormElements/Dropdown/dropdown';
import Icon from '../../Icon/icon'
import DeleteCircle from '../../DeleteCircle/deleteCircle';
import Button from '../../Button/button';

import { useStore } from '../../../store/provider';
import campaignTypes from '../../../databaseTypes/campaignTypes'
import makeAuthorizedRequest from '../../../utils/makeAuthorizedRequest'

import style from './campaignCreationForm.module.scss';

export default function CampaignCreationForm({successCallBack}){
  const { state } = useStore();
  const { accountDetails } = state

  const [usersToInvite, setUsersToInvite] = useState([])
  const [userToInviteError, setUserToInviteError] = useState(null)
  const [formError, setFormError] = useState(null)

  useEffect(() => {
    if(accountDetails && accountDetails.username) {
      setUsersToInvite([accountDetails.username])
    }
  }, [state])

  function addPlayerToCampaignInput(e){
    if(!e || e.keyCode !== 13) return;
    e.preventDefault();
    const username = e.target.value

    if(usersToInvite.indexOf(username) >= 0) {
      setUserToInviteError({text: 'This user is already part of this campaign'})
      return;
    }

    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/${username}`)
    .then(() => {
      //If we get a status code of 200 we know the user exists, which is all we need.
      const newArray = [...usersToInvite]
      newArray.push(username)
      return newArray
    })
    .then(res => {
      setUsersToInvite(res)
      e.target.value = "";
    })
    .catch(err => {
      setUserToInviteError({
        text: 'This user does not exist'
      })
      console.log(err)
    })
  }

  function deleteUserFromCampaign(user) {
    const newUsersArray = [...usersToInvite];
    const indexOfUser = newUsersArray.indexOf(user);
    newUsersArray.splice(indexOfUser, 1)
    setUsersToInvite(newUsersArray)
  }

  function generateDMOptions(){
    const users = [...usersToInvite];
    const dropdownOptions = users.map(user => ({
        title: user,
        value: user
      })
    )
    return dropdownOptions
  }

  function createCampaign(e){
    e.preventDefault();
    const formData = new FormData(e.target);
    const finalFormData = {}

    for (var [key, value] of formData.entries()) { 
      finalFormData[key] = value
    }
    
    //The players don't actually come from the form, we have them saved in the state. By not giving the input a name we don't get it in the formdata.
    finalFormData['users'] = usersToInvite
    makeAuthorizedRequest('addCampaign', finalFormData)
    .then(res => {
      successCallBack(res.data)
    })
    .catch(err => {
      console.error('Something went wrong trying to add the campaign. Please try again later')
    })
  }

  return (
    <form className={style.campaignCreationForm} onSubmit={createCampaign}>
      <div>
        <Input type="text" required hasLabel labelText={"Campaign title"} id="campaign-creation-title" name="title"></Input>
      </div>
      <div>
        <Dropdown options={campaignTypes} required label="Campaign type" id="campaign-creation-type" name="type"/> 
      </div>
      <div>
        <Dropdown options={generateDMOptions()} required label="Dungeon master" id="campaign-creation-dm" name="dm"/> 
      </div>
      <div>
        <Input type="text" hasLabel labelText={"Add a player"} id="campaign-creation-dm" onKeyPressFunction={addPlayerToCampaignInput} error={userToInviteError}></Input>
      </div>
      <div className={clsx([, style.fullWidth])}>
        <TextArea rows="10" hasLabel labelText={"Campaign description"} id="campaign-creation-description" name="description"></TextArea>      
      </div>
      <div className={style.fullWidth}>
        <span className={style.usersContainerHeader}><Icon type="users" className={style.icon}/>Adventurers & Participants</span>
        <div className={style.usersWrapper}>
          {usersToInvite.map(user => 
            <span className={style.singleUserCotainer} key={user}>
              <span>{user}</span>
              <DeleteCircle onClick={() => deleteUserFromCampaign(user)} className={style.deleteIcon} disabled={user === accountDetails.username}/>
            </span>)
          }
        </div>
      </div>
      <div className={clsx([style.fullWidth, style.buttonContainer])}>
        <Button type="submit">
          Start adventuring!
        </Button>
      </div>
      {formError && <span className={style.errorText}>{formError}</span>}
    </form>
  )
}