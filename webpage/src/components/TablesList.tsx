import { Fonts } from '../global/types';

import Table from './Table';

type Props = {
  fonts: Fonts;
  query: string;
};

/**
 * TablesList component.
 *
 * @param props - The properties object.
 * @param props.fonts - The collection of fonts to be displayed in the list of tables.
 * @param props.query - The search query or filter term to apply to the list of tables.
 * @returns The rendered list of tables component.
 */
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
