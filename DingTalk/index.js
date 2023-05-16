const items = document.querySelectorAll('.list-item')
const playGround = document.querySelector('.playground')
const list = document.querySelector('.list')

function createAnimation(scrollStart, scrollEnd, valueStart, valueEnd) {
  return function(scroll) {
    if (scroll <= scrollStart) {
      return valueStart
    }
    if (scroll >= scrollEnd) {
      return valueEnd
    }
    return valueStart + (valueEnd - valueStart) * (scroll - scrollStart) / (scrollEnd - scrollStart)
  }
}

const animationMap = new Map()

function getDomAnimation(scrollStart, scrollEnd, dom) {
  scrollStart += dom.dataset.order * 150 

  const opacityAnimation = createAnimation(scrollStart, scrollEnd, 0, 1) 

  const opacity = function(scroll) {
    return opacityAnimation(scroll)
  }

  const xAnimation = createAnimation(scrollStart, scrollEnd, list.clientWidth / 2 - dom.offsetLeft - dom.clientWidth / 2, 0)
  const yAnimation = createAnimation(scrollStart, scrollEnd, list.clientHeight / 2 - dom.offsetTop - dom.clientHeight / 2, 0)
  const scaleAnimation = createAnimation(scrollStart, scrollEnd, 0, 1);

  const transform = function(scroll) {
    return `translate(${xAnimation(scroll)}px, ${yAnimation(scroll)}px) scale(${scaleAnimation(scroll)})`
  }

  return {
    opacity,
    transform
  }
}

function updateMap() {
  animationMap.clear()
  const playGroundRect = playGround.getBoundingClientRect()
  const scrollStart = playGroundRect.top + window.scrollY
  const scrollEnd = playGroundRect.bottom + window.scrollY - window.innerHeight;
  for (const item of items) {
    animationMap.set(item, getDomAnimation(scrollStart, scrollEnd, item))
  }
}

updateMap()

function updateStyles() {
  const scroll = window.scrollY;
  for (let [dom, value] of animationMap) {
    for (const prop in value) {
      dom.style[prop] = value[prop](scroll)
    }
  }
}

updateStyles()

window.addEventListener('scroll', updateStyles)

