export default function detectOutsideClick(event, ref, callback) {
  if(ref && ref.current && !ref.current.contains(event.target)) {
    callback()
  }
}