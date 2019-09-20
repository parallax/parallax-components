export default function button($button) {
  function onClick() {
    window.alert('hi')
  }

  $button.addEventListener('click', onClick)

  return () => {
    $button.removeEventListener('click', onClick)
  }
}
