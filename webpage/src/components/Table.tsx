import { useState } from 'react';
import Highlighter from './Highlighter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileText, faFont, faHashtag, faImage, faLocation, faTextWidth } from '@fortawesome/free-solid-svg-icons';
import { faCode } from '@fortawesome/free-solid-svg-icons/faCode';
import { ConvertedData } from '../global/types';

type Props = {
    data: ConvertedData;
    textureKey: keyof ConvertedData;
}

function Table(props: Props) {
    const [highlightedArea, setHighlightedArea] = useState<[number, number]>([0, 0]);

    const handleHoverChange = (x: number, y: number) => {
        const array = [x, y];
        const arrayCopy = [...array] as [number, number];
        setHighlightedArea(arrayCopy);
    };

    const resetHighlitedArea = () => {
        const array = [-1, -1];
        const arrayCopy = [...array] as [number, number];
        setHighlightedArea(arrayCopy);
    };

    return (
        <>
            <h1 className='text-3xl w-full rounded-md bg-base-200 p-3 mt-3'>{props.data[props.textureKey].texture.name}</h1>
            <div className='grid grid-cols-1 gap-3 pt-3 md:grid-cols-2'>
                <table className="table table-pin-rows table-zebra" onMouseOut={resetHighlitedArea}>
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
                            props.data[props.textureKey].glyphs.map((item, index) =>
                            (
                                <tr className='hover:!bg-green-900 cursor-pointer' onMouseOver={() => handleHoverChange(item.gridLocation[1], item.gridLocation[0])}>
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
                            ))
                        }
                    </tbody>
                </table>
                <Highlighter texture={props.data[props.textureKey].texture} highlightedArea={highlightedArea} />
            </div>
        </>
    );
}

export default Table;