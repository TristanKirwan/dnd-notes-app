import { useState } from 'react'
import { useRouter } from 'next/router';
import dlv from 'dlv';
import clsx from 'clsx';

import Button from '../../Button/button'
import Input from '../FormElements/Input/input'
import Dropdown from '../FormElements/Dropdown/dropdown';
import TextArea from '../FormElements/Textarea/textArea';

import alignmentTypes from '../../../databaseTypes/alignmentTypes';
import classTypes from '../../../databaseTypes/classTypes';
import getFormData from '../../../utils/getFormData';
import makeAuthorizedRequest from '../../../utils/makeAuthorizedRequest';

import style from './characterCreationForm.module.scss';

export default function CharacterCreationForm({formCallback = null, isEditForm = false, characterData = null}){
  const [formError, setFormError] = useState(null);
  const router = useRouter();
  
  const characterName = dlv(characterData, 'name', '');
  const characterRace = dlv(characterData, 'race', '');
  const characterClass = dlv(characterData, 'class', 'homebrew');
  const characterAlignment = dlv(characterData, 'alignment', 'unaligned');
  const characterBio = dlv(characterData, 'bio', '');
  const characterId = dlv(characterData, 'id', '');

  function addCharacterToCampaign(e){
    const campaignId = router.query.id || ''
    e.preventDefault();
    setFormError(null);
    const formData = getFormData(e.target);
    formData['campaignId'] = campaignId;

    if(isEditForm) {
      makeAuthorizedRequest(`characters/${characterId}`, formData, null, 'PUT')
      .then(res => {
        if(formCallback) formCallback(res.data);
      })
      .catch(err => {
        const message = err?.response?.data?.message || null;
        setFormError(message);
      })
    } else {
      makeAuthorizedRequest(`characters`, formData)
      .then((res) => {
        if(formCallback) formCallback(res.data);
      })
      .catch(err => {
        const message = err?.response?.data?.message || null;
        setFormError(message);
      })
    }
  }


  return (
    <form className={style.characterCreationForm} onSubmit={addCharacterToCampaign}>
      <div>
        <Input type="text" required hasLabel labelText="Name" id="character-creation-name" name="name" defaultValue={characterName}></Input>
      </div>
      <div>
        <Input type="text" required hasLabel labelText="Race" id="character-creation-race" name="race" defaultValue={characterRace}></Input>
      </div>
      <div>
        <Dropdown dropdownClass={style.dropdown} options={classTypes} required hasLabel label="Class" id="character-creation-class" name="class" defaultValue={characterClass}></Dropdown>
      </div>
      <div>
        <Dropdown dropdownClass={style.dropdown} options={alignmentTypes} required hasLabel label="Alignment" id="character-creation-alignment" name="alignment" defaultValue={characterAlignment}></Dropdown>
      </div>
      <div className={clsx([style.fullWidth])}>
        <TextArea rows="10" hasLabel labelText={"Bio"} id="character-creation-bio" name="bio" defaultValue={characterBio}></TextArea>      
      </div>
      {formError && <span className={style.errorText}>{formError}</span>}
      <div className={clsx([style.fullWidth, style.buttonContainer])}>
        <Button type="submit">
          Add character
        </Button>
      </div>
    </form>
  )
}