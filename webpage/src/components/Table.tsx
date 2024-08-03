import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileText, faFont, faHashtag, faImage, faLocation, faTextWidth } from '@fortawesome/free-solid-svg-icons';
import { faCode } from '@fortawesome/free-solid-svg-icons/faCode';
import { ConvertedData } from '../global/types';
import Highlighter from './Highlighter';

type Props = {
    data: ConvertedData
    query: string
}

function Table(props: Props) {
    const TableItem = ({ texture }: { texture: keyof ConvertedData }) => (
        <>
            <h1 className='text-3xl w-full rounded-md bg-base-200 p-3 mt-3'>{props.data[texture].texture.name}</h1>
            <div className='grid grid-cols-1 gap-3 pt-3 md:grid-cols-2'>
                <table className="table table-pin-rows table-zebra">
                    <thead>
                        <tr>
                            <th> <div className='tooltip tooltip-bottom' data-tip="Index">  <FontAwesomeIcon icon={faHashtag} /> </div> </th>
                            <th> <div className='tooltip tooltip-bottom' data-tip="Glyph">  <FontAwesomeIcon icon={faImage} /> </div> </th>
                            <th> <div className='tooltip tooltip-bottom' data-tip="Character">  <FontAwesomeIcon icon={faFont} /> </div></th>
                            <th> <div className='tooltip tooltip-bottom' data-tip="Unicode">  <FontAwesomeIcon icon={faCode} /> </div></th>
                            <th>  <div className='tooltip tooltip-bottom' data-tip="Width"> <FontAwesomeIcon icon={faTextWidth} /></div> </th>
                            <th className='hidden md:table-cell'>  <div className='tooltip tooltip-bottom' data-tip="Location"> <FontAwesomeIcon icon={faLocation} /></div> </th>
                            <th className='hidden md:table-cell'>  <div className='tooltip tooltip-bottom' data-tip="File"> <FontAwesomeIcon icon={faFileText} /></div> </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            props.data[texture].glyphs.map((item, index) => {
                                if (props.query === item.character || !props.query.length) return (
                                    (
                                        <tr className='hover:!bg-green-900 cursor-pointer'>
                                            <td>
                                                {index}
                                            </td>
                                            <td>
                                                <img src={item.base64Image} className='w-12' />
                                            </td>
                                            <td>
                                                {item.character}
                                            </td>
                                            <td>
                                                {item.unicodeCode}
                                            </td>
                                            <td>
                                                {item.characterWidth}
                                            </td>
                                            <td className='hidden md:table-cell'>
                                                {item.gridLocation.join('-')}
                                            </td>
                                            <td className='hidden md:table-cell'>
                                                {item.fileName}
                                            </td>
                                        </tr>
                                    )
                                );
                            }
                            )
                        }
                    </tbody>
                </table>
                <Highlighter image={props.data[texture].texture.base64Image} />
            </div>
        </>

    );

    return (
        props.data && (
            <>
                <TableItem texture='ascii' />
                <TableItem texture='ascii_sga' />
                <TableItem texture='asciillager' />
                <TableItem texture='accented' />
                <TableItem texture='nonlatin_european' />
            </>
        )
    );
}

export default Table;