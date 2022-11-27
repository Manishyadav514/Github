// import fetchFollowers from './fetchFollowers.js'
const challange33URL = 'https://api.github.com/users/john-smilga/followers?per_page=100'
export const fetchFollowers = async () => {
  const challange33Response = await fetch(challange33URL)
  const data = await challange33Response.json()
  return data
}
// export default fetchFollowers

// import displayFollowers from './displayFollowers.js'
const challange33List = document.querySelector('.challange33List')
const displayFollowers = (followers) => {
  const newFollowers = followers
    .map((person) => {
      const { avatar_url, login, html_url } = person
      return `
       <article class='challange33Card'>
         <img src="${avatar_url}" alt='person' />
           <h4>${login}</h4>
         <a href="${html_url}" class="challange33ProfileButton">view profile</a>
       </article>
       `
    })
    .join('')
    challange33List.innerHTML = newFollowers
}
// export default display

// import paginate from './paginate.js'
const paginate = (followers) => {
  const itemsPerPage = 10
  const numberOfPages = Math.ceil(followers.length / itemsPerPage)

  const newFollowers = Array.from({ length: numberOfPages }, (_, index) => {
    const start = index * itemsPerPage
    return followers.slice(start, start + itemsPerPage)
  })
  return newFollowers
}
// export default paginate

// import displayButtons from './displayButtons.js'
const displayButtons = (container, pages, activeIndex) => {
  let btns = pages.map((_, pageIndex) => {
    return `<button class="challange33IndexButton ${
      activeIndex === pageIndex ? 'challange33IndexActive' : 'null '
    }" data-index="${pageIndex}">
${pageIndex + 1}
</button>`
  })
  // btns.push(`<div class="challange32ButtonsContainer"><div class="challange32Buttons">`)
  // btns.unshift(`</div></div>`)
  btns.push(`<button class="challange33IndexNext">next</button>`)
  btns.unshift(`<button class="challange33IndexPrevious">prev</button>`)
  container.innerHTML = btns.join('')
}
// export default displayButtons


const challange33Title = document.querySelector('.challange33Title h1')
const btnContainer = document.querySelector('.challange33Index')

let index = 0
let pages = []

const setupUI = () => {
  displayFollowers(pages[index])
  displayButtons(btnContainer, pages, index)
}

const init = async () => {
  const followers = await fetchFollowers()
  challange33Title.textContent = 'pagination'
  pages = paginate(followers)
  setupUI()
}

btnContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('challange33Index')) return
  if (e.target.classList.contains('challange33IndexButton')) {
    console.log(e.target.dataset.index);
    index = parseInt(e.target.dataset.index)
  }
  if (e.target.classList.contains('challange33IndexNext')) {
    index++
    if (index > pages.length - 1) {
      index = 0
    }
  }
  if (e.target.classList.contains('challange33IndexPrevious')) {
    index--
    if (index < 0) {
      index = pages.length - 1
    }
  }
  setupUI()
})

window.addEventListener('load', init)
