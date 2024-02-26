// userUtils.js
let userCounter = 0;

function generateUserID() {
  userCounter++;

  return "user" + userCounter;
}

export { generateUserID };
