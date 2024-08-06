import { ConvertedData } from '../global/types';

import Table from './Table';

type Props = {
  data: ConvertedData;
  query: string;
};

function TablesList(props: Props) {
  return (
    props.data && (
      <>
        <Table textureKey='ascii' data={props.data} query={props.query} />
        <Table textureKey='ascii_sga' data={props.data} query={props.query} />
        <Table textureKey='asciillager' data={props.data} query={props.query} />
        <Table textureKey='accented' data={props.data} query={props.query} />
        <Table textureKey='nonlatin_european' data={props.data} query={props.query} />
      </>
    )
  );
}

export default TablesList;
