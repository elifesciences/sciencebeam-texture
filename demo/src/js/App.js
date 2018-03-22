'use strict';

document.querySelector('body').classList.add('js');


/*
 We need:

 Interactions:
  - a file upload control

  Once file upload started, and before upload finished, show busy indicator (use load more spinner pattern?)

  once file upload finished, send the file to the endpoint

  when response:
      stop showing the busy indicator

    if no error:
      store the response in local storage
      indicate success to the user: what does this look like?

    if error:
      indicate failure to the user

 */

