import { ConvertedData } from '../global/types';

import Table from './Table';

type Props = {
  data: ConvertedData;
};

function TablesList(props: Props) {
  return (
    props.data && (
      <>
        <Table textureKey='ascii' data={props.data} />
        <Table textureKey='ascii_sga' data={props.data} />
        <Table textureKey='asciillager' data={props.data} />
        <Table textureKey='accented' data={props.data} />
        <Table textureKey='nonlatin_european' data={props.data} />
      </>
    )
  );
}

export default TablesList;
