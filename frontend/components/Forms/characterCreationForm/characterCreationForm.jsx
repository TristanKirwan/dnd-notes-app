import { useState } from 'react'
import { useRouter } from 'next/router';
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

export default function CharacterCreationForm({formCallback = null}){
  const [formError, setFormError] = useState(null);
  const router = useRouter();

  function addCharacterToCampaign(e){
    const campaignId = router.query.id || ''
    e.preventDefault();
    setFormError(null);
    const formData = getFormData(e.target);
    formData['campaignId'] = campaignId;
    makeAuthorizedRequest(`characters`, formData)
    .then(() => {
      if(formCallback) formCallback(formData);
    })
    .catch(err => {
      const message = err?.response?.data?.message || null;
      setFormError(message);
    })
  }


  return (
    <form className={style.characterCreationForm} onSubmit={addCharacterToCampaign}>
      <div>
        <Input type="text" required hasLabel labelText="Name" id="character-creation-name" name="name"></Input>
      </div>
      <div>
        <Input type="text" required hasLabel labelText="Race" id="character-creation-race" name="race"></Input>
      </div>
      <div>
        <Dropdown dropdownClass={style.dropdown} options={classTypes} required hasLabel label="Class" id="character-creation-class" name="class"></Dropdown>
      </div>
      <div>
        <Dropdown dropdownClass={style.dropdown} options={alignmentTypes} required hasLabel label="Alignment" id="character-creation-alignment" name="alignment"></Dropdown>
      </div>
      <div className={clsx([style.fullWidth])}>
        <TextArea rows="10" hasLabel labelText={"Bio"} id="character-creation-bio" name="bio"></TextArea>      
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