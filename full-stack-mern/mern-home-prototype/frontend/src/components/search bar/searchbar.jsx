import s from './searchbar.module.css';


function Searchbar(props) {
  const handlechange = (e) => {
    props.handleSearchValue(e.target.value)
  }

  return (
      <input type="search" className={s.Searchbar}
      placeholder='Search...'
      onChange={handlechange}/>
  );
}

export default Searchbar; 
