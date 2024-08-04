import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

function Container(props: Props) {
  return (
    <div className='p-3'>
      <div className='flex justify-center'>
        <div className='max-w-5/12'>{props.children}</div>
      </div>
    </div>
  );
}

export default Container;
