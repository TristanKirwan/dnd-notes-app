import { useState, useEffect } from 'react';
import dlv from 'dlv';
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
import getFormData from '../../../utils/getFormData';

import style from './campaignCreationForm.module.scss';
import SingleUserContainer from '../../SingleUserContainer/singleUserContainer';

export default function CampaignCreationForm({successCallBack, isEditForm = false, campaignData = null}){
  const { state } = useStore();
  const { accountDetails } = state

  const campaignTitle = dlv(campaignData, 'title', '');
  const campaignType = dlv(campaignData, 'type', 'oneshot');
  const campaignDescription = dlv(campaignData, 'description', '');
  const campaignDM = dlv(campaignData, 'dm', null)

  const [usersToInvite, setUsersToInvite] = useState([])
  const [userToInviteError, setUserToInviteError] = useState(null)
  const [currentDM, setCurrentDm] = useState(null)


  useEffect(() => {
    if(accountDetails && accountDetails.username && !isEditForm) {
      setUsersToInvite([accountDetails.username])
      setCurrentDm(accountDetails.username)
    }
  }, [state])

  useEffect(() => {
    //If this is the edit form, we need to manually set the state, the other values are handled by the input forms themselves.
    if(isEditForm) {
      if(Array.isArray(campaignData.users) && campaignData.users.length > 0) {
        setUsersToInvite(campaignData.users)
      }
      if(campaignData && campaignData.dm) {
        setCurrentDm(campaignData.dm)
      }
    }
  }, [])

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
    //For first render in edit form, we want to have the default options of all users connected to this campaign, so we generate a list of options from campaignData props.

    if(usersToInvite && Array.isArray(usersToInvite) && usersToInvite.length > 0) {
      const users = [...usersToInvite];
      const dropdownOptions = users.map(user => ({
          title: user,
          value: user
        })
      )
      return dropdownOptions

    } else if(campaignData && Array.isArray(campaignData.users) && campaignData.users.length > 0) {
      const users = campaignData.users;
      const dropdownOptions = users.map(user => ({
        title: user,
        value: user
      })
    )
    return dropdownOptions
    }

    return []

  }

  function createCampaign(e){
    e.preventDefault();
    const finalFormData = getFormData(e.target)
    
    //The players don't actually come from the form, we have them saved in the state. By not giving the input a name we don't get it in the formdata.
    finalFormData['users'] = usersToInvite

    if(isEditForm) {
      if(!campaignData && campaignData.id) {
        console.error('Something is wrong with the data of this form.')
        return
      }
      makeAuthorizedRequest(`campaign/${campaignData.id}`, finalFormData, null, 'PUT')
      .then(res => {
        successCallBack(res.data)
      })
      .catch(() => {
        console.error('Something went wrong trying to edit the campaign. Please try again later')
      })

    } else {
      makeAuthorizedRequest('addCampaign', finalFormData)
      .then(res => {
        successCallBack(res.data)
      })
      .catch(() => {
        console.error('Something went wrong trying to add the campaign. Please try again later')
      })
    }

  }

  return (
    <form className={style.campaignCreationForm} onSubmit={createCampaign}>
      <div>
        <Input type="text" required hasLabel labelText={"Campaign title"} id="campaign-creation-title" name="title" defaultValue={campaignTitle}></Input>
      </div>
      <div>
        <Dropdown options={campaignTypes} required label="Campaign type" id="campaign-creation-type" name="type" defaultValue={campaignType}/> 
      </div>
      <div>
        <Dropdown options={generateDMOptions()} required label="Dungeon master" id="campaign-creation-dm" name="dm" defaultValue={campaignDM} onChangeCallback={val => setCurrentDm(val)}/> 
      </div>
      <div>
        <Input type="text" hasLabel labelText={"Add a player"} id="campaign-creation-dm" onKeyPressFunction={addPlayerToCampaignInput} error={userToInviteError}></Input>
      </div>
      <div className={clsx([style.fullWidth])}>
        <TextArea rows="10" hasLabel labelText={"Campaign description"} id="campaign-creation-description" name="description" defaultValue={campaignDescription}></TextArea>      
      </div>
      <div className={style.fullWidth}>
        <span className={style.usersContainerHeader}><Icon type="users" className={style.icon}/>Adventurers & Participants</span>
        <div className={style.usersWrapper}>
          {usersToInvite.map(user => 
            <SingleUserContainer user={user} deleteOnClick={() => deleteUserFromCampaign(user)} disabled={user === accountDetails.username || user === currentDM} key={user}/>
          )}
        </div>
      </div>
      <div className={clsx([style.fullWidth, style.buttonContainer])}>
        <Button type="submit">
          {isEditForm ? "Resume adventuring!" : "Start adventuring!"}
        </Button>
      </div>
    </form>
  )
}