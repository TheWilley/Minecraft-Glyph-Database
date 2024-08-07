import { Fonts } from '../global/types';

import Table from './Table';

type Props = {
  fonts: Fonts;
  query: string;
};

function TablesList(props: Props) {
  return (
    props.fonts && (
      <>
        <Table fontKey='ascii' fonts={props.fonts} query={props.query} />
        <Table fontKey='ascii_sga' fonts={props.fonts} query={props.query} />
        <Table fontKey='asciillager' fonts={props.fonts} query={props.query} />
        <Table fontKey='accented' fonts={props.fonts} query={props.query} />
        <Table fontKey='nonlatin_european' fonts={props.fonts} query={props.query} />
      </>
    )
  );
}

export default TablesList;
