let all = document.querySelectorAll('.section-link');
[].slice.call(all).forEach((item, index) => {
  item.setAttribute('href', `./${index+1}-${item.querySelector('.title').innerText}.htm`)
})