import { useState } from 'react';

import PageTitle from '../../components/PageTitle/pageTitle'
import AccountItemsSection from '../../sections/accountItemsSection/accountItemsSection';

import makeAuthorizedRequest from "../../utils/makeAuthorizedRequest";

export default function Account() {
  return (
    <>
      <PageTitle>My Account</PageTitle>
      <AccountItemsSection />
    </>
  )
}