import conditioner from '@parallaxagency/conditioner'
import { document, console } from 'global'
import buttonHtml from './markup/button.html'
import accordionHTML from './markup/accordions.html'

export default {
  title: 'Demo'
}

function withConditioner(html) {
  let container = document.createElement('div')
  container.innerHTML = `<link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet">`
  container.innerHTML += html

  conditioner.addPlugin({
    moduleGetConstructor: module => module.default,
    moduleImport: name => import(`./ui/${name}.js`)
  })
  conditioner.hydrate(container)

  return container
}

export const button = () => withConditioner(buttonHtml)
export const accordion = () => withConditioner(accordionHTML)
