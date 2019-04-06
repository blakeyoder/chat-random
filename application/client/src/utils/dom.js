/**
 * Creates an event handler that calls the callback and
  prevents default behavior
 * @param  {function} cb callback
 * @param  {any} retval return value from event handler
 * @return {boolean} returns false
 */
export function preventDefault(cb, retval = false) {
  return (e) => {
    cb();
    e.preventDefault();
    return retval;
  };
}
