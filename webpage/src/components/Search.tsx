type Props = {
  setQuery: React.Dispatch<React.SetStateAction<string>>;
};

/**
 * Search component.
 *
 * @param props - The properties object.
 * @param props.setQuery - Function to update the search query state.
 * @returns The rendered search component.
 */
function Search(props: Props) {
  return (
    <label className='input input-bordered flex items-center gap-2 mt-2 w-16'>
      <input
        type='text'
        className='grow text-center w-full placeholder:opacity-50'
        maxLength={1}
        placeholder='🔎'
        onChange={(e) => props.setQuery(e.target.value)}
      />
    </label>
  );
}

export default Search;
