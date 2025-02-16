// Переменные
const inputField = document.querySelector('.search-input')
const searchMenuBlock = document.querySelector('.search-menu')
const paragraphBloc = document.querySelector('.paragraph-block')
// функции
async function getRepo(repoName) {
  const dataArr = await fetch(
    `https://api.github.com/search/repositories?q=${repoName}&per_page=5`
  )
  const data = await dataArr.json()

  return data
}

const debounce = (fn, debounceTime) => {
  let timeout

  return function (...args) {
    const context = this

    clearTimeout(timeout)

    timeout = setTimeout(() => {
      fn.apply(context, args)
    }, debounceTime)
  }
}

const createRepoBlock = function (repo) {
  console.log(repo)
  const repoBlockWrapper = document.querySelector('.response-block')
  const repoBlock = document.createElement('div')
  const X_Mark = document.createElement('div')
  const BlockForExmark = document.createElement('div')
  const flexWrapper = document.createElement('div')
  const repoName = document.createElement('p')
  const owner = document.createElement('p')
  const stars = document.createElement('p')

  repoBlock.classList.add('repo-block')
  X_Mark.classList.add('X-mark')

  repoName.textContent = 'Name: ' + repo.name
  owner.textContent = 'Owner: ' + repo.owner.login
  stars.textContent = 'Stars: ' + repo.stargazers_count

  flexWrapper.classList.add('flex-block')
  repoName.classList.add('repo-block__text')
  owner.classList.add('repo-block__text')
  stars.classList.add('repo-block__text')
  BlockForExmark.classList.add('Xmark-block')

  repoBlockWrapper.appendChild(repoBlock)

  repoBlock.appendChild(flexWrapper)
  repoBlock.appendChild(X_Mark)
  flexWrapper.appendChild(repoName)
  flexWrapper.appendChild(owner)
  flexWrapper.appendChild(stars)
  repoBlock.appendChild(BlockForExmark)

  // Делегирование события
  repoBlock.addEventListener('click', function (event) {
    let target = event.target
    if (target.classList.contains('Xmark-block') || target.classList.contains('X-mark')) {
      repoBlock.remove()
    }
  })
}

// Слушатели событий
// На строку поиска
inputField.addEventListener('keydown', (event) => {
  if (event.key === 'Backspace') {
    paragraphBloc.innerHTML = ''
  }
})

inputField.addEventListener(
  'input',
  debounce(() => {
    let searchText = inputField.value.trim()
    if (!searchText) {
      console.log('Пустая строка, запрос не выполняется')
      return
    }
    let counter = paragraphBloc.querySelectorAll('p')
    if (counter.length >= 4) {
      paragraphBloc.innerHTML = ''
    }
    getRepo(searchText)
      .then((data) => {
        if (data.items && Array.isArray(data.items)) {
          const newArr = data.items
          for (const element of newArr) {
            let element1 = element
            const textBlock = document.createElement('p')
            textBlock.textContent = element.name
            textBlock.classList.add('search-menu-points')
            paragraphBloc.appendChild(textBlock)
            // обработчик событий при нажатии на элемент подсказчика
            textBlock.addEventListener('click', () => {
              createRepoBlock(element1)
              paragraphBloc.innerHTML = ''
              inputField.value = ''
            })
          }
        }
      })
      .catch((error) => {
        console.error('Ошибка при запросе к GitHub API:', error)
      })
  }, 750)
)
// на очистку строки поиска

// 1 мы нажимаем
// запускается функция поиска репозитонриев
// выводится 5 примеров на страницу
