import debounce from '../lib/debounce'

export default function(
  $el,
  { initialState, animated = true, addOpenClass, $refs }
) {
  // Exit early if header / body is missing
  if (!$refs.header.length || !$refs.body.length) {
    console.warn(
      'The accordion component expects two references, "header" and "body", declared using the "data-ref" attribute. Example: <div data-ref="header"></div>'
    )
    return
  }

  const $header = $refs.header[0]
  const $body = $refs.body[0]

  // If the ID of the element is in the URL hash, we want to open it by default
  const checkForURLHash = id => {
    if (!window.location.hash) return false
    if (!id) return false
    return window.location.hash.substring(1) === id
  }

  let open = initialState
    ? !!initialState
    : !!checkForURLHash($body.getAttribute('id'))

  let initialHeight = `${$body.offsetHeight}px`

  if (animated) $body.style.transition = 'height .2s ease-in-out'
  $body.style.overflow = 'hidden'

  const ariaAttr = {
    selected: val => $header.setAttribute('aria-selected', val),
    expanded: val => $header.setAttribute('aria-expanded', val),
    hidden: val => $body.setAttribute('aria-hidden', val)
  }

  const handleOpen = () => {
    ariaAttr.selected(true)
    ariaAttr.expanded(true)
    ariaAttr.hidden(false)

    if (addOpenClass) $el.classList.add('-open')
    $body.style.height = initialHeight
  }

  const handleClose = () => {
    ariaAttr.selected(false)
    ariaAttr.expanded(false)
    ariaAttr.hidden(true)

    if (addOpenClass) $el.classList.remove('-open')
    $body.style.height = 0
  }

  const handleToggle = e => {
    e.preventDefault()
    open ? handleClose() : handleOpen()
    open = !open
  }

  const calibrateHeight = () => {
    $body.style.height = ''
    initialHeight = `${$body.offsetHeight}px`
    $body.style.height = open ? initialHeight : 0
  }

  open ? handleOpen() : handleClose()

  const handleResize = debounce(calibrateHeight, 50)

  $header.addEventListener('click', handleToggle)
  window.addEventListener('resize', handleResize)

  return () => {
    $header.removeEventListener('click', handleToggle)
    window.removeEventListener('resize', handleResize)

    if (animated) $body.style.transition = ''
    $body.style.overflow = ''
    $body.style.height = ''
  }
}
