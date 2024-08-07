import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

/**
 * Container component.
 *
 * @param props - The properties object.
 * @param props.children - The child elements to be rendered inside the container.
 * @returns The rendered container component.
 */
function Container(props: Props) {
  return (
    <div className='sm:p-3'>
      <div className='flex justify-center'>
        <div className='max-w-5/12'>{props.children}</div>
      </div>
    </div>
  );
}

export default Container;
