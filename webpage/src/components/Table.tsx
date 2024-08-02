import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileText, faFont, faHashtag, faImage, faLocation, faTextWidth } from '@fortawesome/free-solid-svg-icons';
import { faCode } from '@fortawesome/free-solid-svg-icons/faCode';
import { TextureGlyph } from '../global/types';

type Props = {
    textureGlyph: TextureGlyph
    query: string
}

function Table(props: Props) {
    return (
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
                    props.textureGlyph.glyphs.map((item, index) => {
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
    );
}

export default Table;