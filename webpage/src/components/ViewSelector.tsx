import { faFont, faImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dispatch, SetStateAction } from 'react';

type Props = {
  selectedView: 'glyphs' | 'texture';
  setSelectedView: Dispatch<SetStateAction<'glyphs' | 'texture'>>;
};

function ViewSelector(props: Props) {
  return (
    <div className='fixed bottom-5 w-1/2 m-auto inset-x-0'>
      <ul className='menu menu-lg menu-horizontal bg-base-300 rounded-box shadow-lg'>
        <li
          className={props.selectedView === 'glyphs' ? 'text-success' : ''}
          onClick={() => props.setSelectedView('glyphs')}
        >
          <FontAwesomeIcon icon={faFont} />
        </li>
        <li
          className={props.selectedView === 'texture' ? 'text-success' : ''}
          onClick={() => props.setSelectedView('texture')}
        >
          <FontAwesomeIcon icon={faImage} />
        </li>
      </ul>
    </div>
  );
}

export default ViewSelector;
