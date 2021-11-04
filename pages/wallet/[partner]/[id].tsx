import Card from "@/components/Card";
import MainLayout from "@/layout/MainLayout";
import _ from 'lodash';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';

interface Props { }

export default function WalletTransactionDetail({ }: Props): ReactElement {
  const Router = useRouter()
  const id = _.get(Router, 'query.id') ? _.get(Router, 'query.id') : ""

  return (
    <MainLayout>
      <Card>
        Wallet Transaction Detail Page {id}
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </Card>
    </MainLayout>
  );
};
