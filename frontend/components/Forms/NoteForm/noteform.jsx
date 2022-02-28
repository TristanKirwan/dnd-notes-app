import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import dlv from 'dlv';
import clsx from 'clsx';
import axios from 'axios';

import Container from '../../Container/container';
import RichTextEditor from '../../RichTextEditor/richTextEditor';
import Input from '../../Forms/FormElements/Input/input';
import SingleUserContainer from '../../SingleUserContainer/singleUserContainer';
import Tag from '../../Tag/tag';
import Button from '../../Button/button';

import makeAuthorizedRequest from '../../../utils/makeAuthorizedRequest';
import getFormData from '../../../utils/getFormData';
import { useStore } from '../../../store/provider';

import style from './noteForm.module.scss';

export default function NoteForm({noteData = null, isEditModal = false, recommendedTags = [], campaignTitle = '', isEditForm = false}){
  const { state } = useStore();
  const { accountDetails } = state
  const router = useRouter();
  const editorValue = useRef(null)

  const noteTitle = dlv(noteData, 'title', '');
  const [readersToInvite, setReadersToInvite] = useState([])
  const [readerError, setReaderError] = useState(null);

  const [tags, setTags] = useState([]);
  const [tagError, setTagError] = useState(null);

  const [currentRecommendedTags, setCurrentRecommendedTags] = useState(recommendedTags)

  const [addNoteFormError, setAddNoteFormError] = useState(null)

  useEffect(() => {
    if(accountDetails && accountDetails.username && !isEditModal) {
      setReadersToInvite([accountDetails.username])
    }
  }, [state])

  function addReaderToNoteInput(e){
    if(!e || e.keyCode !== 13) return;
    e.preventDefault();
    const username = e.target.value

    if(readersToInvite.indexOf(username) >= 0) {
      setReaderError({text: 'This user is already part of this campaign'})
      return;
    }

    makeAuthorizedRequest(`campaign/${router.query.campaignId}/users/${username}`, null, null, 'GET')
    .then(() => {
      //If we get a status code of 200, we know that the user is part of this campaign and the requester is allowed to request.
      const newArray = [...readersToInvite]
      newArray.push(username)
      return newArray
    })
    .then(res => {
      setReadersToInvite(res)
      e.target.value = "";
    })
    .catch(err => {
      if(err && err.response && err.response.status === 403) {
        // Could be improved with a you are not allowed to check page.
        return router.push('/404');
      }
      let errorMessage =  'Something went wrong looking for this user.'
      if(err && err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      }
      setReaderError({
        text: errorMessage
      })
    })
  }

  function deleteReaderFromNote(user) {
    const newReadersArray = [...readersToInvite];
    const indexOfUser = newReadersArray.indexOf(user);
    newReadersArray.splice(indexOfUser, 1);
    setReadersToInvite(newReadersArray);
  }

  function addTagToNoteInput(e) {
    if(!e || e.keyCode !== 13) return;
    e.preventDefault();
    const tagValue = e.target.value;

    if(tagValue.trim() === '') {
      setTagError({text: 'Please enter a valid tag.'});
      return;
    }

    const capitalizedTag = tagValue.toUpperCase();
    const newTags = [...tags];
    if(newTags.indexOf(capitalizedTag) >= 0) {
      setTagError({text: 'This tag is already part of this note.'});
      return;
    }


    const indexInRecommended = currentRecommendedTags.indexOf(capitalizedTag);
    if(indexInRecommended >= 0) {
      const newRecommendedTagArray = [...currentRecommendedTags];
      newRecommendedTagArray.splice(indexInRecommended, 1);
      setCurrentRecommendedTags(newRecommendedTagArray);
    }

    newTags.push(capitalizedTag);
    e.target.value = "";
    setTags(newTags)
  }

  function deleteTagFromNote(tag) {
    const newTagArray = [...tags];
    const indexOfTag = newTagArray.indexOf(tag);
    newTagArray.splice(indexOfTag, 1);
    setTags(newTagArray);
  }

  function addRecommendedTagToNote(tag) {
    const newTagArray = [...tags];
    const capitalizedTag = tag.toUpperCase();
    newTagArray.push(capitalizedTag);

    const newRecommendedTagArray = [...currentRecommendedTags];
    const indexOfRecommendedTag = newRecommendedTagArray.indexOf(tag);
    newRecommendedTagArray.splice(indexOfRecommendedTag, 1);

    setTags(newTagArray)
    setCurrentRecommendedTags(newRecommendedTagArray)
  }
  
  function saveNoteToDb(e){
    e.preventDefault();
    const formData = getFormData(e.target); 
    const dataIsFaulty = false;

    if(!editorValue || !editorValue.current || !Array.isArray(tags) || !Array.isArray(readersToInvite) || readersToInvite.indexOf(accountDetails.username) < 0) {
      dataIsFaulty = true;
    }

    if(dataIsFaulty) {
      setAddNoteFormError({
        text: "Something went wrong while adding your note. Please reload the page and try again."
      })
      return;
    }


    formData['content'] = editorValue.current;
    formData['tags'] = tags;
    formData['readers'] = readersToInvite;

    if(isEditForm) {
      //This still has to be made.
      alert('Unfortunately, it is not yet possible to edit a note!')
    } else {
      makeAuthorizedRequest(`note`, formData)
      .then(res => console.log(res))
      .catch(err => console.error('Something went wrong trying to add a note to the campaign.', err))
    }

    console.log(editorValue.current, formData)
  }

  function getEditorData(val) {
    console.log(val)
    if(Array.isArray(val)) {
      editorValue.current = val;
      return;
    }
  }

  return (
    <Container>
      <form className={style.noteForm} onSubmit={saveNoteToDb}>
        <div>
          <Input type="text" required hasLabel labelText="Note title" id="note-creation-title" name="title" defaultValue={noteTitle} />
        </div>
        <div className={style.infoContainer}>
          <span className={style.infoLabel}>Campaign identifier</span>
          <span className={style.campaignId}>
            {campaignTitle}
          </span>
        </div>
        <div className={style.fullWidthInput}>
          <RichTextEditor getEditorData={getEditorData} />
        </div>
        <div>
          <Input type="text" hasLabel labelText={"Add a reader"} id="note-creation-reader" onKeyPressFunction={addReaderToNoteInput} error={readerError}></Input>
        </div>
        <div>
          <Input type="text" hasLabel labelText={"Add a Tag"} id="note-creation-tag" onKeyPressFunction={addTagToNoteInput} error={tagError}></Input>
        </div>
        <div className={style.infoContainer}>
          <span className={style.infoLabel}>Current readers:</span>
          <div className={style.labelContainer}>
            {readersToInvite.map(reader =>
              <SingleUserContainer user={reader} deleteOnClick={() => deleteReaderFromNote(reader)} disabled={reader === accountDetails.username} key={reader}/>
            )}
          </div>
        </div>
        <div className={style.infoContainer}>
          <span className={style.infoLabel}>Current Tags:</span>
          <div className={style.labelContainer}>
            {tags.map(tag => 
              <Tag tag={tag} showDelete deleteFunction={() => deleteTagFromNote(tag)}></Tag>
            )}
            {(!Array.isArray(tags) || tags.length === 0)  && 
            <span className={style.noInputText}>No tags selected yet. Enter one above or choose a recommended tag!</span>
          }
          </div>
          <span className={style.infoLabel}>Recommended Tags:</span>
          <div className={style.labelContainer}>
            {currentRecommendedTags.slice(0,3).map(tag => 
              <Tag tag={tag} showAdd addFunction={() => addRecommendedTagToNote(tag)} key={tag}/>  
            )}
          </div>
        </div>
        <div className={clsx([style.fullWidthInput, style.buttonContainer])}>
        <Button type="submit">
          Save note
        </Button>
      </div>
      {addNoteFormError && <span className={style.errorText}>{addNoteFormError.text}</span>}
      </form>
    </Container>
  )
}